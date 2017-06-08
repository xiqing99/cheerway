package org.qixi.security.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.Role;
import org.qixi.security.beans.User;
import org.qixi.security.dao.RoleDao;
import org.qixi.security.dao.UserDao;
import org.qixi.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;


public class UserServiceImpl implements UserService
{
	@Autowired
	UserDao dao;
	
	@Autowired
	RoleDao roleDao;

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		if(id == null || id == 0)
		{
			return buildEmptyUser();
		}
		
		User user = dao.get(id);

		if(user != null)
		{
			return buildUserMap(user);
		}else {
			return buildEmptyUser();
		}		
	}

	@Override
	public Map<String, Object> getByEmpGenInfoId(Integer empId)
	{
		User  user = dao.getByEmpGenInfoId(empId);
		
		if(user != null)
		{
			return buildUserMap(user);
		}else {
			return buildEmptyUser();
		}
	}
	
	private boolean checkAuthorized(Role role, Set<Role> roleSet)
	{
		for(Role roleIndex : roleSet)
		{
			if(role.getId() == roleIndex.getId())
				return true;
		}
		
		return false;
	}

	private Map<String, Object> buildUserMap(User user)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("entity.id", user.getId());
		map.put("entity.name", user.getName());
		map.put("entity.password", user.getPassword());
		map.put("entity.enabled", user.isEnabled());
		
		List<Map<String, Object>> rolemapList = new ArrayList<>();
		List<Role> roleList = roleDao.getAll();
		
		for(Role role : roleList)
		{
			Map<String, Object> roleMap = new HashMap<>();
			
			roleMap.put("id", role.getId());
			roleMap.put("name", role.getName());
			roleMap.put("description", role.getDescription());
			
			if(checkAuthorized(role, user.getRoles()))
			{
				roleMap.put("authorized", true);
			}else {
				roleMap.put("authorized", false);
			}
			
			rolemapList.add(roleMap);
		}
		
		map.put("roleList", rolemapList);
		return map;		
		
	}
	
	private Map<String, Object> buildEmptyUser()
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("entity.id", 0);
		map.put("entity.name", "");
		map.put("entity.password", "");
		map.put("entity.enabled", true);
		
		List<Role> roleList = roleDao.getAll();
		List<Map<String, Object>> roleMapList = new ArrayList<>();
		
		for(Role role : roleList)
		{
			Map<String, Object> roleMap = new HashMap<>();
			
			roleMap.put("id", role.getId());
			roleMap.put("name", role.getName());
			roleMap.put("description", role.getDescription());
			
			roleMap.put("authorized", false);
			
			roleMapList.add(roleMap);
		}
		
		map.put("roleList", roleMapList);
		
		return map;
	}	
	
	
	@Override
	public Result save(User entity)
	{	
		if(entity.getId() == null || entity.getId() ==0)
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
		dao.deleteById(id);;
		return new Result();
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

	@Override
	public Result updatePassword(
					User user,
					String orgPassword)
	{
		Result result = new Result();
		
		User userP = dao.getUserByName(user.getName());
		
		if(userP == null || !userP.getPassword().equals(orgPassword))
		{
			result.success = false;
			result.cause = "updateUser.failure.wrongpassword";
			
			return result;
		}
		
		dao.updatePassword(user.getId(), user.getPassword());
		
		return result;
	}
	

}
