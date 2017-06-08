package org.qixi.basicElem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.dao.DepartmentDao;
import org.qixi.basicElem.dao.EmpGenInfoDao;
import org.qixi.basicElem.service.IEmpGenInfoService;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.springframework.beans.factory.annotation.Autowired;

public class EmpGenInfoServiceImpl implements IEmpGenInfoService
{
	@Autowired
	EmpGenInfoDao dao;
	
	@Autowired
	DepartmentDao deptDao;
	
	public Map<String, Object> getById(Integer id)
	{
		EmpGenInfo emp = dao.get(id);
		
		return buildJsonMap(emp);
	}
	
	public List<Map<String, Object>> getAll()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<EmpGenInfo> list = dao.getAll();
		
		for (EmpGenInfo emp : list)
		{
			mapList.add(buildJsonMap(emp));
		}
		
		return mapList;
	}
	
	public Result save(EmpGenInfo emp)
	{
		if (emp.getId() == null || emp.getId() == 0)
		{
			dao.save(emp);
		}else {
			dao.update(emp);
		}		
		
		return new Result();
	}
	
	private Map<String, Object> buildJsonMap(EmpGenInfo emp)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		if(emp != null)
		{
			map.put("id", emp.getId());
			map.put("name", emp.getName());
			map.put("email", emp.getEmail());
			map.put("extNum", emp.getExtNum());
			map.put("mobileNum", emp.getMobileNum());
			map.put("qq", emp.getQq());
			map.put("deptId", emp.getDept().getId());
			map.put("deptName", emp.getDept().getName());
			map.put("posName", emp.getPosition().getName());
			map.put("posId", emp.getPosition().getId());
			map.put("disabled", emp.getDisabled());
			map.put("description", emp.getDescription());
			map.put("sortIndex", emp.getSortIndex());
		}
		
		return map;
	}

	@Override
	public List<Map<String, Object>> getListByDept(
					Integer deptId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
				
		List<EmpGenInfo> infoList = deptDao.getEmpGenInfoList(deptId);				
		
		for (EmpGenInfo emp : infoList)
		{
			mapList.add(buildJsonMap(emp));
		}
		
		return mapList;
	}

	@Override
	public List<ComboElem> getListByDeptForCombo(
					Integer deptId)
	{
		return deptDao.getEmpComboList(deptId);
	}

	@Override
	public Result delById(Integer id)
	{
		Result result = new Result();
		
		dao.deleteById(id);
		
		result.success = true;
		return result;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		
		return dao.getComboList();
	}

	@Override
	public List<Map<String, Object>> getDisabledList()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<EmpGenInfo> list = dao.getAllDisabled();
		
		for (EmpGenInfo emp : list)
		{
			mapList.add(buildJsonMap(emp));
		}
		
		return mapList;
	}		
}
