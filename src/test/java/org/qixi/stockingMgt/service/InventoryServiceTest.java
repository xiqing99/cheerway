package org.qixi.stockingMgt.service;

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
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class InventoryServiceTest
{
	@Resource(name="inventoryService")
	InventoryService service;	
	
	@Ignore
	public void testLoad()
	{
		List<Map<String, Object>> mapList = service.getAll();
		
		assertEquals(3, mapList.size());
	}
	
	@Ignore
	public void testGetProdListByStore()
	{
		List<Map<String, Object>> mapList = service.getProdListByStore(4);
		
		assertEquals(2, mapList.size()); 
	}
	
	
	@Test
	public void testReport()
	{
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2016-06-14");
			 eDate = sdf.parse("2017-10-30");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());		
		List<Map<String, Object>> mapList = service.getMonthRptByProduct(startDate, endDate);
		
//		assertEquals(1, mapList.size());
	}
	
	
}
