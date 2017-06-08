package org.qixi.basicElem.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.security.Provider.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.Department;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class DeptServiceTest
{
	@Resource(name = "deptService")
	DeptService service;
	
	
	@Ignore
	public void testInserNewDept()
	{

			Department dept = new Department();
			
			dept.setName("生产部");
			service.save(dept);
	}
	
	@Ignore
	public void testSave()
	{
		Department supDept = new Department();
		supDept.setId(1);
		
		Department dept = new Department();
		
		dept.setName("测试");
		dept.setSupNode(supDept);
		
		service.save(dept);
	}
	
	@Test
	public void testGetListForCombo()
	{
		List<ComboElem> list = service.getListForCombo(3);
//		assertEquals(4, list.size());
	}
	
	@Ignore
	public void testDelelt()
	{
		Result result = service.delById(2);
		
		assertEquals(false, result.success);
	}
}
