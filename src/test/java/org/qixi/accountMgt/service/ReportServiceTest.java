package org.qixi.accountMgt.service;

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

public class ReportServiceTest
{
	@Resource(name="accountMgtReportService")
	ReportService service;
	
	
	
	@Ignore
	public void testLoadMenu()
	{
		List<Map<String, Object>> mapList = service.getMenuList();
		
		assertEquals(3, mapList.size());
	}
	
	@Ignore
	public void testGetSalesReportByMarketArea()
	{
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2016-08-26");
			 eDate = sdf.parse("2017-12-30");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());		
		List<Map<String, Object>> mapList = service.getSalesReportByMarketArea(1, startDate, endDate);
		
//		assertEquals(3, mapList.size());
		System.out.print(mapList);
	}

	@Ignore
	public void testGetOverdueReport()
	{
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date eDate = new java.util.Date();
		
		try
		{
			 eDate = sdf.parse("2016-11-10");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date dueDate = new Date(eDate.getTime());		
		List<Map<String, Object>> mapList = service.getOverdueReport(dueDate);
		
		assertEquals(2, mapList.size());
		System.out.print(mapList);
	}	
	
	@Test
	public void testGetSalesReportForProd()
	{
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2017-01-26");
			 eDate = sdf.parse("2017-05-26");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());		
		List<Map<String, Object>> mapList = service.getSalesReportForProd(startDate, endDate);
		
//		assertEquals(3, mapList.size());
		System.out.print(mapList);
	}	
}
