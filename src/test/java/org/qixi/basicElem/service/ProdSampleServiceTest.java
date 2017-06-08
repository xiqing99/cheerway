package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import javax.annotation.Resource;

import org.apache.commons.io.filefilter.MagicNumberFileFilter;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.ProdComposition;
import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.beans.ProductType;
import org.qixi.basicElem.beans.ProductUnit;
import org.qixi.basicElem.service.impl.ProductServiceImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class ProdSampleServiceTest
{
	@Resource
	ProdSampleService service;
	
	@Ignore
	public void testGet()
	{
		Map<String, Object> map = service.getById(2);
		
//		assertEquals(2, map.get("entity.id"));
	
	}
	
	@Ignore
	public void getAllTest()
	{
		List<Map<String, Object>> lists = service.getAll();
		
//		assertEquals(5, lists.size());
	}
	
	@Test
	public void lendTest()
	{
		service.updateLendEmp(3, 2);
	}
	

}
