package org.qixi.security.service;

import static org.junit.Assert.assertEquals;

import java.util.Collection;

import javax.annotation.Resource;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class MyFilterInvocationSecurityMetadataSourceTest
{
	@Resource
	MyFilterInvocationSecurityMetadataSource  metadataSource;
	
	@Test
	public void testGetAllConfigAttributes()
	{
		Collection<ConfigAttribute> attributes = metadataSource.getAllConfigAttributes();
		
		//assertEquals(2, attributes.size());
	}
	
	@Ignore
	public void testGetAttributes()
	{
		FilterInvocation invocation = new FilterInvocation("/pages/user.jsp", null);
		
		Collection<ConfigAttribute> attributes = metadataSource.getAttributes(invocation);
		
		assertEquals(2, attributes.size());
		Assert.assertTrue(attributes.contains(new SecurityConfig("ROLE_ADMIN")));
		Assert.assertTrue(attributes.contains(new SecurityConfig("ROLE_USER")));
	}
}