package org.qixi.accountMgt.service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.accountMgt.beans.DepositVch;
import org.qixi.accountMgt.beans.DepositVchItem;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.beans.Result;
import org.qixi.salesMgt.beans.SaleVch;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class DepositVoucherServiceTest
{
	@Resource
	DepositVchService service;
	
	
	@Ignore
	public void testSave()
	{
		DepositVch depositVoucher = new DepositVch();
		
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(1);
		depositVoucher.setAuditEmp(emp);
		depositVoucher.setRspEmp(emp);
		
		depositVoucher.setCreatedDate(new Date(System.currentTimeMillis()));
		Department dept = new Department();
		dept.setId(2);
		depositVoucher.setDept(dept);
		
		Customer customer = new Customer();
		customer.setId(1);
		
		depositVoucher.setCustomer(customer);
		
		DepositVchItem item = new DepositVchItem();
		
		
		SaleVch order = new SaleVch();
		order.setId(1);
		item.setSaleVch(order);
		item.setAmount(200.0);
		item.setOwnerVoucher(depositVoucher);

		DepositVchItem item2 = new DepositVchItem();
		
		SaleVch stockSale = new SaleVch();
		stockSale.setId(5);
		item2.setSaleVch(stockSale);
		item2.setAmount(1000.0);
		item2.setOwnerVoucher(depositVoucher);		
		
		List<DepositVchItem> list = new  ArrayList<>();
		list.add(item);
		list.add(item2);
		
		depositVoucher.setItems(list);
		
		depositVoucher.setPayWay(DepositVch.PayWay.ACCOUNT);
		depositVoucher.setState(State.PROPOSED);
		
		service.save(depositVoucher, 1);
		
	}
	
	@Test
	public void testLoad()
	{
		Map<String, Object> resultMap = service.getById(1);
		
//		assertEquals(1, resultMap.get("entity.id"));
	}
	
	@Ignore
	public void testGetListByCreatedTimeRange()  
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2016-05-01");
			 eDate = sdf.parse("2016-09-23");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getListByCreatedDateRange(startDate, endDate,1);
		
		assertEquals(2, list.size());
	}
	
	@Ignore
	public void testUpdateState()
	{
		Result result = service.updateState(State.AUDITED, 1, 1);
		
		assertEquals(true, result.success);
	}
	
	@Ignore
	public void testGetDepositAmountList()
	{
		Double amount = service.getDepositeForSaleVch(2);
		
		amount = amount +1;
	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(11,1);
		
		assertEquals("delete.failure.order.wrongState", result.cause);
	}
	
}
