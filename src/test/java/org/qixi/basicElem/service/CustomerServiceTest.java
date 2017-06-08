package org.qixi.basicElem.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.Contacts;
import org.qixi.basicElem.beans.CustPriority;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.beans.Position;
import org.qixi.basicElem.service.impl.CustomerServiceImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class CustomerServiceTest
{
	@Resource
	CustomerService service;
	
	
	@Ignore
	public void testSave()
	{
		Customer customer = new Customer();		
		
		Department dept = new Department();
		dept.setId(1);
		
		EmpGenInfo emp = new EmpGenInfo();
		emp.setId(4);
		
		MarketArea area = new MarketArea();
		area.setId(1);
		
		CustPriority priority = new CustPriority();
		priority.setId(1);
		
		customer.setId(1);
		customer.setRespDept(dept);
		customer.setRespEmp(emp);
		customer.setArea(area);
		customer.setPriority(priority);
		
		Contacts contact = new Contacts();
		contact.setName("测试二");
		
		List<Contacts> list = new ArrayList<>();
		list.add(contact);
		
		customer.setContactsList(list);
		
		service.save(customer);
		
	}
	
	@Ignore
	public void testDelete()
	{
//		service.delById(25);
	}
	
	@Ignore
	public void testGetListByAreaId()
	{
		List  list = service.getListByAreaId(4);
		
		assertEquals(1, list.size());
	}
	
	@Test
	public void testLoadCurrency()
	{
		Map<String, Object> map = service.getCurrency(2);
		
//		assertEquals("美元", map.get("curName"));
	}

}
