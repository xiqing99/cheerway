package org.qixi.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.BaseTreeNode;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.dao.IBaseTreeNodeDao;

public  class BaseTreeNodeServiceImpl<T> 
{
	protected IBaseTreeNodeDao<BaseTreeNode<T>> dao;
	
	public Map<String, Object> getById(Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		BaseTreeNode<T> entity =  dao.get(id);
		
		if(entity == null)
		{
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}		
		
		map.put("entity.id", entity.getId());
		map.put("entity.name", entity.getName());
		map.put("entity.description", entity.getDescription());

		buildSpeciEntityMap(entity, map);
		
		return map;
	}	

	protected Result save(BaseTreeNode<T> entity)
	{
		if(entity.getId() == null)
		{
			dao.save(entity);
		}else {
			dao.update(entity);
		}
		
		return new Result();		
	}
	
	public Result delById(Integer id)
	{
		Result result = new Result();

		dao.deleteById(id);

		return result;		
	}	
	
	public List<ComboElem> getListForCombo()
	{
		
		return getListForCombo(BaseTreeNode.ROOT_ID);
	}
	
	public List<ComboElem> getListForCombo(Integer rootId)
	{
		if(rootId == BaseTreeNode.ROOT_ID)
		{
			return dao.getComboList();
		}else {
			List<BaseTreeNode<T>> subList = (List<BaseTreeNode<T>>) dao.getSubList(rootId);
			
			List<ComboElem> comboList = new ArrayList<>();
			
			for(BaseTreeNode<T> node : subList)
			{
				ComboElem elem = new ComboElem();
				elem.setId(node.getId());
				elem.setName(node.getName());
				
				comboList.add(elem);
				
			}			
			return comboList;
		}		
	}

	public List<Map<String, Object>> getTree(Integer rootId)
	{		
		List<Map<String, Object>> list = new ArrayList<>();
		
		loadTreeNode(dao.get(rootId), list);
		
		return list;	
	}
	
	private void loadTreeNode(BaseTreeNode<T> entity, List<Map<String, Object>> list)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("text", entity.getName());
		map.put("id", entity.getId());
		
		if(entity.getId() == 1)
			map.put("expanded", true);
		
		List<BaseTreeNode<T>> sonList = (List<BaseTreeNode<T>>) dao.getSonList(entity.getId());
		
		if(dao.getSonList(entity.getId()).size() == 0)
		{
			map.put("leaf", true);
			list.add(map);
			return;
		}else {
			List<Map<String, Object>> childrenList = new ArrayList<>();
			
			for(BaseTreeNode<T> subNode : sonList)
			{
				loadTreeNode(subNode, childrenList);
			}
			
			map.put("Children", childrenList);
			list.add(map);
			
			return;
		}
	}
	
	public List<Map<String, Object>> getAll()
	{		
		return getTree(1);
	}
	
	protected void buildSpeciEntityMap(BaseTreeNode<T> entity, Map<String, Object> map)
	{
		
	}

	public IBaseTreeNodeDao<BaseTreeNode<T>> getDao()
	{
		return dao;
	}

	public void setDao(
					IBaseTreeNodeDao<BaseTreeNode<T>> dao)
	{
		this.dao = dao;
	}
}
