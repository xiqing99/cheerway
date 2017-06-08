package org.qixi.security.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.WorkGroup;
import org.qixi.security.dao.WorkGroupDao;
import org.qixi.security.service.WorkGroupService;
import org.springframework.beans.factory.annotation.Autowired;

public class WorkGroupServiceImpl  implements WorkGroupService
{
	@Autowired
	WorkGroupDao dao;

	@Override
	public List<ComboElem> getEmpComboByGroupId(
					Integer groupId)
	{
		return  dao.getEmpComboList(groupId);
	}

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		WorkGroup group = dao.get(id);
		
		if(group == null)
		{
			return map;
		}
		
		map.put("entity.id", group.getId());
		map.put("entity.name", group.getName());
		map.put("entity.description", group.getDescription());
		
		List<Map<String, Object>> empMapList = new ArrayList<>();
		
		for(EmpGenInfo emp : group.getEmpList())
		{
			Map<String, Object> empMap = new HashMap<>();
			
			empMap.put("id", emp.getId());
			empMap.put("name", emp.getName());
			empMap.put("deptName", emp.getDept().getName());
			empMap.put("posName", emp.getPosition().getName());
			empMap.put("email", emp.getEmail());

			empMapList.add(empMap);							
		}
		
		map.put("empList", empMapList);
		
		return map;
	}

	@Override
	public Result save(WorkGroup entity)
	{
		if(entity.getId() == null || entity.getId()==0)
		{
			dao.save(entity);
		}else {
			dao.update(entity);
		}
		
		return new Result();
	}

	@Override
	public Result delById(Integer id)
	{
		return null;
	}

	@Override
	public List<Map<String, Object>> getAll()
	{
		return null;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{		
		return dao.getComboList();
	}
}
