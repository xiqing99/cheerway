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
import org.qixi.common.beans.VoucherState.State;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.stockingMgt.beans.ProdStockOutVch;
import org.qixi.stockingMgt.beans.ProdStockOutVchItem;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class ProdStockOutServiceTest
{
	@Resource(name="prodStockOutVchService")
	ProdStockOutVchService service;
	
	
	@Ignore
	public void testSave()
	{
		Store store = new Store();
		store.setId(3);		
		
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(1);
		
		Department dept = new Department();
		dept.setId(3);
		
		SaleVch saleVch = new SaleVch();
		saleVch.setId(1);
		
		
		ProdStockOutVch voucher = new ProdStockOutVch();
		
		voucher.setSaleVch(saleVch);
		voucher.setStore(store);
		voucher.setAuditEmp(emp);
		voucher.setCreatedDate(new Date(System.currentTimeMillis()));
		voucher.setRspEmp(emp);
		voucher.setAccountRspEmp(emp);
		voucher.setDept(dept);
		voucher.setState(State.PROPOSED);
		
		ProdStockOutVchItem item = new ProdStockOutVchItem();
		
		item.setOwnerVoucher(voucher);
		item.setQuantity(20.0);
		
		ProdMtItem mtItem = new ProdMtItem();
		mtItem.setId(1);
		
		item.setMtItem(mtItem);
		
		item.setUnitPrice(100.0);
		
		voucher.getItems().add(item);
		
		service.save(voucher,1);
	}
	
	@Ignore
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
			 eDate = sdf.parse("2016-11-30");
		}
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Date startDate = new Date(sdate.getTime());
		Date endDate = new Date(eDate.getTime());
		
		List<Map<String, Object>> list = service.getDetailListByCreatedDateRange(startDate, endDate, 1);
		
		assertEquals(4, list.size());
	}
	
	@Test
	public void testUpdateState()
	{
/*		for(int i = 1; i < 109; i++)
		{
			Result	result = service.updateState(State.AUDITED, i, 52);
			
			System.out.println(i + "  " +result.cause);
			assertEquals(true, result.success);			
		}*/
	}
	
	@Ignore
	public void testDelete()
	{
		Result result = service.delById(3,1);
		
	}
	
}
