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
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.OrderSaleVch;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.stockingMgt.beans.ProdStockInVch;
import org.qixi.stockingMgt.beans.ProdStockInVchItem;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class ProdStockInServiceTest
{
	@Resource
	ProdStockInVchService service;
	
	
	@Ignore
	public void testSave()
	{
		
			Store store = new Store();
			store.setId(3);
			
			OrderSaleVch saleVch = new OrderSaleVch();
			saleVch.setId(1);
			
			
			EmpGenInfo emp = new EmpGenInfo();
			emp.setId(11);
	
			Department dept = new Department();
			dept.setId(23);		
			
			ProdStockInVch voucher = new ProdStockInVch();
			
			voucher.setStore(store);
			voucher.setOrderSaleVch(saleVch);
			voucher.setAuditEmp(emp);
			voucher.setCreatedDate(new Date(System.currentTimeMillis()));
			voucher.setRspEmp(emp);
			voucher.setState(VoucherState.State.PROPOSED);
			voucher.setDept(dept);
			
			Department menuDept = new Department();
			menuDept.setId(11);	
			voucher.setManuLine(menuDept);
			
			EmpGenInfo manuEmp = new EmpGenInfo();
			manuEmp.setId(37);
			voucher.setManuLineRspEmp(manuEmp);
			
			ProdStockInVchItem item = new ProdStockInVchItem();
			
			item.setOwnerVoucher(voucher);
			item.setQuantity(100.0);
			item.setUnitPrice(98.80);
			
			ProdMtItem mtItem = new ProdMtItem();
			mtItem.setId(1);
			
			item.setMtItem(mtItem);
			
			voucher.getItems().add(item);
			
			service.save(voucher,1);
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
			 eDate = sdf.parse("2017-11-30");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getListByCreatedDateRange(startDate, endDate, 3);
		
		assertEquals(2, list.size());
	}
	
	@Ignore
	public void testUpdateState()
	{

		service.updateState(State.AUDITED, 2, 11);
		
	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(5, 1);
		
	}
	
}
