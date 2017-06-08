/*package org.qixi.basicElem.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.Store;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class StoreServiceTest
{
	@Resource
	StoreService service ;
	
	@Ignore
	public void testSave()
	{
		Store store = new Store();
		
		store.setName("总仓库");
		
		service.save(store);
		
	}
	
	@Test
	public void testGetAll()
	{
//		List<Map<String, Object>> list = service.getAll();
		
//		assertEquals(4, list.size());
	}
	
	@Ignore
	public void testLoadTreeNode()
	{		
		List<Map<String, Object>> list = service.getTree();
		
		assertEquals(1, list.size());
		
		List<Map<String, Object>> list2 = (List<Map<String, Object>>) list.get(0).get("Children");
		assertEquals(2, list2.size());

	}
}*/
