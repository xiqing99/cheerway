package org.qixi.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.BaseEntity;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.dao.IGenericDao;

public  class GeneEntityServiceImpl implements IGenericService<BaseEntity>
{
	protected IGenericDao<BaseEntity, Integer> dao;
	
	public GeneEntityServiceImpl()
	{
		System.err.print(this);
	}
	
	public Map<String, Object> getById(Integer id)
	{
		Map<String, Object> map = new HashMap<>();
		
		BaseEntity entity = dao.get(id);
		
		if(entity == null)
		{
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}
		
		map.put("entity.id", entity.getId());
		map.put("entity.name", entity.getName());		
		map.put("entity.description", entity.getDescription());
		
		return map;		
	}
	
	public List<ComboElem> getListForCombo()
	{		
		return dao.getComboList();
	}

	public IGenericDao<BaseEntity, Integer> getDao()
	{
		return dao;
	}

	public void setDao(
					IGenericDao<BaseEntity, Integer> dao)
	{
		this.dao = dao;
	}

	@Override
	public List<Map<String, Object>> getAll()
	{
		List<Map<String, Object>> list = new ArrayList<>();		
		
		for(BaseEntity entity : dao.getAll())
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("id", entity.getId());
			map.put("name", entity.getName());
			map.put("description", entity.getDescription());
			
			list.add(map);
		}
		
		return list;
	}

	@Override
	public Result save(BaseEntity entity)
	{		
		if(entity.getId() == null || entity.getId() == 0)
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
		Result result = new Result();

		dao.deleteById(id);

		return result;		
	}
	
}
