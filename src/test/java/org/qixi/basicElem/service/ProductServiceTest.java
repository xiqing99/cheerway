package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import javax.annotation.Resource;

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

public class ProductServiceTest
{
	@Resource
	ProductService service;
	
	@Test
	public void testGet()
	{
		List<Map<String, Object>> list = service.getDisabledList();
		
		assertEquals(0, list.size());
	
	}
	
	@Ignore
	public void testSave()
	{
		Product product = new Product();
		
		product.setName("米奇三轮车");
		
		ProductCategory category = new ProductCategory();
		category.setId(1);
		
		product.setCategory(category);
		product.setModelNum("TRICYCLE_001");

		ProductType type = new ProductType();
		type.setId(3);
		
		ProductUnit unit = new ProductUnit();
		unit.setId(1);
		
		product.setUnit(unit);
		
		
		service.save(product);
	}
	
	@Ignore 
	public void getAllTest()
	{
		List<Map<String, Object>> lists = service.getAll();
		
		assertEquals(5, lists.size());
	}
	

}
