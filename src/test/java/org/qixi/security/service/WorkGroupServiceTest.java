package org.qixi.security.service;

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
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.ComboElem;
import org.qixi.security.beans.WorkGroup;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class WorkGroupServiceTest
{
	@Resource
	WorkGroupService service;
	
	
	@Ignore
	public void testSave()
	{
		WorkGroup workGroup = new WorkGroup();
		
		workGroup.setName("GROUP_AUDITOR_ACCOUNT");
		workGroup.setId(3);
		
		List<EmpGenInfo> empList = new ArrayList<>();
		
		EmpGenInfo empGenInfo = new EmpGenInfo();
		empGenInfo.setId(6);
		
		empList.add(empGenInfo);
		
		empGenInfo = new EmpGenInfo();
		empGenInfo.setId(1);
		
		empList.add(empGenInfo);
		
//		workGroup.setEmpList(empList);
		
		service.save(workGroup);
		
	}
	
	@Test
	public void testGetEmpComboById()
	{
		List<ComboElem> list = service.getEmpComboByGroupId(1);
		
//		assertEquals(list.size(), 2);
	}
	
}
