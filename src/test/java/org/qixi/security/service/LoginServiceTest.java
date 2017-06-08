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

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.security.beans.Role;
import org.qixi.security.beans.User;
import org.qixi.security.dao.RoleDao;
import org.qixi.security.dao.UserDao;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class LoginServiceTest
{
	@Resource
	LoginService myLoginService;
	
	@Resource
	RoleDao roleDao;
	
	@Resource
	UserDao userDao;
	
	@Ignore
	public void testLoadChildMenuNodeFirstLevel()
	{
		Set<Role> roles = new HashSet<>();
		
		Role role = roleDao.get(1);
		
		roles.add(role);
		
		List<Map<String, Object>> menu = myLoginService.loadChildMenuNodeList(roles, "allModulesRoot");
		
		assertEquals(5, menu.size());
/*		Iterator nodeIterator = menu.iterator();
		Map<String, Object> node = (Map<String, Object>)nodeIterator.next();
		
		assertEquals("基础资料", node.get("text"));
		assertEquals("/基础资料", node.get("id"));
		assertEquals("/基础资料", node.get("href"));
		assertEquals(false, node.get("leaf"));*/
	}
	
	@Test
	public void testLoadChildMenuNodeSeconLevel()
	{
//		User user = userDao.get(1);
		
//		List<Map<String, Object>> menu = myLoginService.loadChildMenuNodeList(user.getRoles(), "/销售管理");
		
//		assertEquals(5, menu.size());
/*		Iterator nodeIterator = menu.iterator();
		nodeIterator.next();
		Map<String, Object> node = (Map<String, Object>)nodeIterator.next();
		
		assertEquals("仓库管理", node.get("text"));
		assertEquals("/仓库管理", node.get("id"));
		assertEquals("/BasicElem/WareHouse.action", node.get("href"));
		assertEquals(true, node.get("leaf"));*/
	}
}