package org.qixi.accountMgt.service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;
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

public class RsvbPerProdSOVchServiceTest
{
	@Resource
	RefundPerStockRtService service;
	
	
	@Ignore
	public void testGetListBySaleVchId()
	{
		Map<String, Object> map = service.getById(7);
		
//		assertEquals(2, list.size());
	}
	
	@Test
	public void testGetListByCreatedTimeRange()  
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2017-01-01");
			 eDate = sdf.parse("2017-04-28");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getListByCreatedDateAndEmpId(startDate, endDate, 10);
		
//		assertEquals(1, list.size());
		
	}
	
	
}
