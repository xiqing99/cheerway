package org.qixi.salesMgt.service;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.qixi.common.beans.VoucherState.State;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Product;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.FreightCmp;
import org.qixi.salesMgt.beans.OrderDscpItem;
import org.qixi.salesMgt.beans.OrderSaleVch;
import org.qixi.salesMgt.beans.PaymentMode;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.beans.ShippingCmp;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class OrderSaleVchServiceTest
{
	@Resource
	OrderSaleVchService service;

	@Ignore
	public void testSaveBatch()
	{
		for(int i=0; i< 100; i++)
		{
			testSave();
		}
	}
	
	@Test
	public void testSave()
	{
		
		OrderSaleVch order = new OrderSaleVch();
		
		order.setId(1);
		order.setSequenceNum("WD20170001");
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(15);
		
		PaymentMode paymentMode = new PaymentMode();
		paymentMode.setId(2);
		order.setPaymentMode(paymentMode);
		
		FreightCmp freightCmp = new FreightCmp();
		freightCmp.setId(1);
		order.setFreightCmp(freightCmp);
		
		ShippingCmp shippingCmp = new ShippingCmp();
		shippingCmp.setId(2);
		order.setShippingCmp(shippingCmp);
		

		Department dept = new Department();
		dept.setId(22);
		
		Customer customer = new Customer();
		customer.setId(4);
		
		order.setExchangeRate(6.8);
		order.setCreatedDate(new Date(System.currentTimeMillis()));
		order.setCustomer(customer);
		Date date = new Date(System.currentTimeMillis());
		order.setDeliverDeadLine( date);
		order.setRspEmp(emp);
		order.setDept(dept);
		
		EmpGenInfo auditEmp = new EmpGenInfo();
		auditEmp.setId(1);
		order.setAuditEmp(auditEmp);
		order.setFirstLevelAuditEmp(auditEmp);
		
		order.setPaymentDeadLine(date);
		order.setState(VoucherState.State.PROPOSED);
		
/*		OrderDscpItem item = new OrderDscpItem();
		Product product = new Product();
		product.setId(1);
		
		item.setOwnerVoucher(order);
		item.setProduct(product);
		item.setQuantity(20.0);
		item.setUnitPrice(100.0);
		item.setPackageModel("package1");
		item.setStdUnitPrice(99.0);
		
		order.getDscpItems().add(item);*/
		
		SaleVchItem item = new SaleVchItem();
		
		ProdMtItem mtItem = new ProdMtItem();
		mtItem.setId(1);
		item.setMtItem(mtItem);
		item.setOwnerVoucher(order);
		item.setQuantity(100.0);
		item.setStdUnitPrice(99.4);
		item.setUnitPrice(100.0);
		
		order.getItems().add(item);

//		Result result = service.save(order,1);
//		assertEquals(true, result.success);
	}
	
	@Ignore
	public void testLoad()
	{
		Map<String, Object> resultMap = service.getById(1);
		
		assertEquals(1, resultMap.get("entity.id"));
	}
	
	@Ignore
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
		
		List<Map<String, Object>> list = service.getListByCreatedDateRange(startDate, endDate, 2);
		
		assertEquals(4, list.size());
	}
	
	@Ignore
	public void testUpdateState()
	{

		service.updateState(State.AUDITED, 1, 1);
		service.updateState(State.AUDITED, 2, 1);

	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(4,1);
		
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
