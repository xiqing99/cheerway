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
import org.qixi.basicElem.action.PositionAction;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.beans.Position;
import org.qixi.common.service.IGenericService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class PositionServiceTest
{
/*	@Resource(name = "positionService")
	IGenericService<Position> service;*/
	
	@Resource(name = "positionAction")
	PositionAction action;
	
	@Test
	public void testSave()
	{
		Position position = new Position();
		
		position.setName("普通员工");
		
		action.loadAll();
		
//		service.save(position);
		
	}
	
	@Ignore
	public void testGetAll()
	{
//		List<Map<String, Object>> list = service.getListForCombo();
		
//		assertEquals(16, list.size());
	}

	

}
