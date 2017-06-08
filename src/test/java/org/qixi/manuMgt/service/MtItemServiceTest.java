package org.qixi.manuMgt.service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.ProductUnit;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class MtItemServiceTest
{
	@Resource(name="prodMtItemService")
	ProdMtItemService service;
	
	@Test
	public void testSave()
	{
		ProdMtItem item = new ProdMtItem();
		
		item.setMaterialNum("cp009");
		item.setName("tricycle_micky");
		
		ProductUnit unit = new ProductUnit();
		unit.setId(2);
		item.setUnit(unit);			
		
//		service.save(item);
		
	}
	
	@Ignore
	public void testLoad()
	{
		List<Map<String, Object>> mapList = service.getAll();
		
		assertEquals(6, mapList.size());
	}
	
	
	
}
