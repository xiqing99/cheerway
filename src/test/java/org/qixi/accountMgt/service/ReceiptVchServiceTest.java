package org.qixi.accountMgt.service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.accountMgt.beans.ReceiptVchItem;
import org.qixi.accountMgt.beans.ReceiptVch;
import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.salesMgt.beans.SaleVch;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class ReceiptVchServiceTest
{
	@Resource
	ReceiptVchService service;
	
	
	@Ignore
	public void testSave()
	{
		ReceiptVch receipt = new ReceiptVch();
		
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(1);
		
		receipt.setAuditEmp(emp);
		receipt.setRspEmp(emp);
		receipt.setCreatedDate(new Date(System.currentTimeMillis()));
		Department dept = new Department();
		dept.setId(2);
		receipt.setDept(dept);
		
		SaleVch order = new SaleVch();
		order.setId(1);
		receipt.setSaleVch(order);
		
		receipt.setReceivedAmount(800.0);
		receipt.setCustDpstRdmAmount(200.0);
		receipt.setState(State.PROPOSED);
		
		ReceiptVchItem item = new ReceiptVchItem();
		
		item.setAmount(1000.0);
		item.setOwnerVoucher(receipt);
		
		RsvbPerProdSOVch receivable = new RsvbPerProdSOVch();
		receivable.setId(1);
		
		item.setReceiable(receivable);
		
		List<ReceiptVchItem> list = new ArrayList<>();
		list.add(item);
		
		receipt.setItems(list);
		
		service.save(receipt,1);
		
	}
	
	@Ignore
	public void testLoad()
	{
		Map<String, Object> resultMap = service.getById(1);
		
		assertEquals(1, resultMap.get("class"));
	}
	
	@Ignore
	public void testGetListByCreatedTimeRange()  
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2016-05-01");
			 eDate = sdf.parse("2017-08-31");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getDetailListByCreatedDateRange(startDate, endDate,1);
		
		assertEquals(3, list.size());
	}
	
	@Test
	public void testUpdateState()
	{
		Result result = service.updateState(State.AUDITED, 1, 1);
		
		System.out.println(result.cause);
		
//		assertEquals(true, result.success);
	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(1,1);
		
		assertEquals("delete.failure.order.wrongState", result.cause);
	}
	
}
