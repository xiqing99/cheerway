package org.qixi.salesMgt.service;

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
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.PaymentMode;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.beans.StockSaleVch;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class StockSaleVchServiceTest
{
	@Resource
	StockSaleVchService service;
	
	
	@Ignore
	public void testSave()
	{
		StockSaleVch voucher = new StockSaleVch();
		
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(4);
		
		PaymentMode paymentMode = new PaymentMode();
		paymentMode.setId(2);
		voucher.setPaymentMode(paymentMode);
		

		Department dept = new Department();
		dept.setId(2);
		
		Customer customer = new Customer();
		customer.setId(1);
		
		voucher.setExchangeRate(1.0);
		voucher.setCreatedDate(new Date(System.currentTimeMillis()));
		voucher.setCustomer(customer);
		Date date = new Date(System.currentTimeMillis());
		voucher.setRspEmp(emp);
		voucher.setDept(dept);
		voucher.setAuditEmp(emp);
		voucher.setPaymentDeadLine(date);
		voucher.setState(VoucherState.State.PROPOSED);
		
		SaleVchItem item = new SaleVchItem();
		
		item.setOwnerVoucher(voucher);
		item.setQuantity(20.0);
		item.setUnitPrice(100.9);
		item.setStdUnitPrice(100.9);
		
		ProdMtItem mtItem = new ProdMtItem();
		mtItem.setId(1);
		
		item.setMtItem(mtItem);
		
		voucher.getItems().add(item);
		
		Result result = service.save(voucher,1);
		assertEquals(true, result.success);
	}
	
	@Ignore
	public void testLoad()
	{
		Map<String, Object> resultMap = service.getById(1);
		
//		assertEquals(1, resultMap.get("entity.id"));
//		assertEquals(2700.0, resultMap.get("entity.freightCharge"));
	}
	
	@Test
	public void testGetListByCreatedTimeRange()  
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date sdate= new java.util.Date(), eDate = new java.util.Date();
		
		try
		{
			 sdate = sdf.parse("2016-01-01");
			 eDate = sdf.parse("2017-11-30");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getDetailListByCreatedDateRange(startDate, endDate, 2);
		
//		assertEquals(1, list.size());
//		assertEquals(0.0, list.get(0).get("outStockQty"));
	}
	
	@Ignore
	public void testUpdateState()
	{
		service.updateState(State.AUDITED, 1, 4);
	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(9,12);
		
		assertEquals("delete.failure.order.wrongState", result.cause);
	}
	
	@Ignore
	public void testGetComboListByState()
	{
		VoucherState.State state = VoucherState.State.AUDITED;
		
		List<ComboElem> list = service.getComboListByState(state);
		
	
//		List<ComboElem> list = service.getComboListByCustAndState(2, state);
		assertEquals(1, list.size());
		assertEquals((Integer)2, list.get(0).getId());
		assertEquals("201605240026", list.get(0).getName());
	}
	
}
