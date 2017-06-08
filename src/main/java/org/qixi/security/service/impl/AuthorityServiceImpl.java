package org.qixi.security.service.impl;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.Role;
import org.qixi.security.dao.AuthorityDao;
import org.qixi.security.service.AuthorityService;
import org.springframework.beans.factory.annotation.Autowired;

public class AuthorityServiceImpl implements AuthorityService
{
	@Autowired
	AuthorityDao dao;

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		return null;
	}

	@Override
	public Result save(Role entity)
	{	
		return null;
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
		return  dao.getComboList();
	}
	

}
