package org.qixi.security.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.Authority;
import org.qixi.security.beans.Role;
import org.qixi.security.dao.AuthorityDao;
import org.qixi.security.dao.RoleDao;
import org.qixi.security.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;

public class RoleServiceImpl implements RoleService
{
	@Autowired
	RoleDao dao;
	
	@Autowired
	AuthorityDao authDao;

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		if(id == null || id == 0)
		{
			return buildEmptyRole();
		}
		
		Map<String, Object> map = new HashMap<String, Object>();
		Role role = dao.get(id);
		
		map.put("entity.id", role.getId());
		map.put("entity.name", role.getName());
		map.put("entity.description", role.getDescription());
		
		List<Map<String, Object>> authMapList = new ArrayList<>();
		
		List<Authority> authList = authDao.getAll();
		
		for(Authority authority : authList)
		{
			Map<String, Object> authMap = new HashMap<>();
			
			authMap.put("id", authority.getId());
			authMap.put("name", authority.getName());
			authMap.put("description", "");
			
			if(checkAuthorized(authority, role.getAuthorities()))
			{
				authMap.put("authorized", true);
			}else {
				authMap.put("authorized", false);
			}
			authMapList.add(authMap);
		}
		
		map.put("authList", authMapList);
		return map;
	}
	
	private boolean checkAuthorized(Authority auth, Set<Authority> authSet)
	{
		for(Authority authority : authSet)
		{
			if(auth.getId() == authority.getId())
				return true;
		}
		
		return false;
	}

	private Map<String, Object> buildEmptyRole()
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("entity.id", 0);
		map.put("entity.name", "");
		map.put("entity.description", "");
		
		List<Authority> authList = authDao.getAll();
		List<Map<String, Object>> authMapList = new ArrayList<>();
		
		for(Authority authority : authList)
		{
			Map<String, Object> authMap = new HashMap<>();
			
			authMap.put("id", authority.getId());
			authMap.put("name", authority.getName());
			authMap.put("description", "");
			
			authMap.put("authorized", false);
			
			authMapList.add(authMap);
		}
		
		map.put("authList", authMapList);
		
		return map;
	}
	
	
	@Override
	public Result save(Role entity)
	{	
		if(entity.getId() == null || entity.getId() ==0)
		{
			dao.save(entity);
		}else {
			
			if(entity.getAuthorities() == null || entity.getAuthorities().size() == 0)
			{
				dao.updateWithoutAuthorities(entity);
			}else {
				dao.update(entity);
			}		
		}
		
		return new Result();
	}

	@Override
	public Result delById(Integer id)
	{
		dao.deleteById(id);;
		return new Result();
	}

	@Override
	public List<Map<String, Object>> getAll()
	{	
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Role> list = dao.getAll();
		
		for(Role role : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("id", role.getId());
			map.put("name", role.getName());
			map.put("description", role.getDescription());
			
			mapList.add(map);
		}
			
		return mapList;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		return  dao.getComboList();
	}
	

}
