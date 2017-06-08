package org.qixi.security.service;

import org.apache.log4j.Logger;
import org.qixi.security.dao.UserDao;
import org.qixi.security.beans.UserSecure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class MyUserDetailsService implements UserDetailsService
{
	final static Logger logger= Logger.getLogger(UserDetailsService.class);
	
	@Autowired
	private UserDao userDao;	

	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException 
	
	{
		
		logger.debug(username);
		org.qixi.security.beans.User user = userDao.getUserByName(username);
		
		logger.debug(user);
		
		if(user ==null)
			throw new UsernameNotFoundException("No user found");		
	
		return buildUserForAuthentication(user);
	}
	
	private UserSecure buildUserForAuthentication(org.qixi.security.beans.User user)
	{
		
		return new UserSecure(user.getName(), user.getPassword(), user.isEnabled(), 
						true, true,true, user.buildAuthority(), user.getId(),user.getEmpGenInfo().getId(), user.getRoles());
	}
	
}