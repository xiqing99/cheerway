package org.qixi.manuMgt.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class SlbProdMtItemServiceTest
{
	@Resource(name="slbProdMtItemService")
	SlbProdMtItemService service;
	
	@Test
	public void testGetListByCtg()
	{
		List<Map<String, Object>> maplist = service.getListByCtg(1);		
		
//		assertEquals(2, maplist.size());
//		service.save(item);
		
	}
	
	
	
}
