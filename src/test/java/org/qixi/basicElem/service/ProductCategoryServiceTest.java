/*package org.qixi.basicElem.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.ProductCategory;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class ProductCategoryServiceTest
{
	@Resource
	ProductCategoryService service;
	
	@Ignore
	public void testSave()
	{
		
		ProductCategory category = new ProductCategory();
		
		category.setName("推车");
		category.setDescription("");
		
		service.save(category);
	}	
	
	@Test
	public void getAllTest()
	{
//		List<Map<String, Object>> list = service.getAll();
		
//		assertEquals(2, list.size());
	}
	
}*/
