package org.qixi.basicElem.service;

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
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.common.service.IGenericService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class MarketAreaServiceTest
{
	@Resource(name = "marketAreaService")
	IGenericService<MarketArea> service;
	
	@Ignore
	public void testSave()
	{
		MarketArea area = new MarketArea();
		
		area.setName("中国区");
		
		service.save(area);
		
	}
	
	@Test
	public void testGetAll()
	{
		List<Map<String, Object>> list = service.getAll();
		
//		assertEquals(4, list.size());
	}
	
	@Ignore
	public void testGetTree()
	{
		List<Map<String, Object>> list = ((MarketAreaService)service).getTree(1);
		
		assertEquals(1, list.size());
	}
	

}
