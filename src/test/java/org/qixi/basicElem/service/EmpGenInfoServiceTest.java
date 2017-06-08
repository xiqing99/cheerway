package org.qixi.basicElem.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.service.impl.EmpGenInfoServiceImpl;
import org.qixi.common.beans.ComboElem;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class EmpGenInfoServiceTest
{
	@Resource(name = "empGenInfoService")
	IEmpGenInfoService service;
	
	@Ignore
	public void testLoadAll()
	{
		List<Map<String, Object>> lists = service.getListByDept(1);
		
//		assertEquals(2, lists.size());
	}
	
	@Ignore
	public void testSave()
	{
		EmpGenInfo info = new EmpGenInfo();
		
		info.setName("赵小斌");
		service.save(info);
	}
	
	@Test
	public void testGetListByDeptForCombo()
	{
		List<ComboElem> list = service.getListByDeptForCombo(2);
		
//		assertEquals(10, list.size());
	}
}
