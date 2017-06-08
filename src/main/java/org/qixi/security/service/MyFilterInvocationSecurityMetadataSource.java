package org.qixi.security.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.qixi.security.dao.AuthorityDao;
import org.qixi.security.beans.Authority;
import org.qixi.security.beans.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

public class MyFilterInvocationSecurityMetadataSource implements FilterInvocationSecurityMetadataSource
{

	final static Logger  logger = Logger.getLogger(MyFilterInvocationSecurityMetadataSource.class);  
	
	@Autowired
	private AuthorityDao authDao;
	
	private static Map<RequestMatcher, Collection<ConfigAttribute>> requestMap = null;
	
	public MyFilterInvocationSecurityMetadataSource() throws Exception
	{
		logger.debug("Myfilter is created.");
	}
	
	public void initRequestMapFromDB() throws Exception
	{
		requestMap = new HashMap<RequestMatcher, Collection<ConfigAttribute>>();		
		
		for(Authority resource : authDao.getAllUrlResList())
		{
			Collection<ConfigAttribute> atts = new ArrayList<ConfigAttribute>();
			
			for(Role role : resource.getRoles())
			{
				ConfigAttribute cAttribute = new SecurityConfig(role.getName());
				atts.add(cAttribute);
			}
			
			requestMap.put(new AntPathRequestMatcher(resource.getValue()), atts);
			
			logger.debug("Url pattern " + resource.getValue() + "authorized to " + atts.toString());
		}
		
		return;
	}
	
	@Override
	public Collection<ConfigAttribute> getAttributes(
					Object object)
					throws IllegalArgumentException
	{
        final HttpServletRequest request = ((FilterInvocation) object).getRequest();
        
        for (Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry : requestMap.entrySet()) {
            if (entry.getKey().matches(request)) {
            	
            	logger.debug("get attributes for " + entry.getKey().toString() + " is " + entry.getValue().toString());
                return entry.getValue();
            }
        }
        return null;
	}

	@Override
	public Collection<ConfigAttribute> getAllConfigAttributes()
	{
        Set<ConfigAttribute> allAttributes = new HashSet<ConfigAttribute>();

        for (Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry : requestMap.entrySet()) {
            allAttributes.addAll(entry.getValue());
        }

        return allAttributes;
	}

	@Override
	public boolean supports(
					Class<?> clazz)
	{
		 return FilterInvocation.class.isAssignableFrom(clazz);
	}
	
}