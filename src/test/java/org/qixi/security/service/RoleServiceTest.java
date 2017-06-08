package org.qixi.security.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;



import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.jws.soap.SOAPBinding;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.security.beans.Authority;
import org.qixi.security.beans.Role;
import org.qixi.security.beans.User;
import org.qixi.security.dao.RoleDao;
import org.qixi.security.dao.UserDao;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class RoleServiceTest
{
	@Resource(name="roleService")
	RoleService service;
	
	
	@Test
	public void testSave()
	{
		Role role = new Role();
		
		role.setId(7);
		role.setName("ROLE_TEST1");
		
		Set<Authority> list = new HashSet<>();
		
		Authority authority  = new Authority();
		authority.setId(2);
		
		list.add(authority);
		
		role.setAuthorities(list);
//		service.save(role);
	}
	
}