package org.qixi.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.IGeneTreeNode;
import org.qixi.common.beans.Result;
import org.qixi.common.dao.IGenericDao;

public abstract class GeneTreeNodeServiceImpl<T> implements IGenericService<T>
{
	protected IGenericDao<IGeneTreeNode<T>, Integer> dao;
	
	public Map<String, Object> getById(Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		IGeneTreeNode<T> entity =  dao.get(id);
		
		if(entity == null)
		{
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}		
		
		map.put("entity.id", entity.getId());
		map.put("entity.name", entity.getName());
		map.put("entity.description", entity.getDescription());
		map.put("entity.supNode.id", entity.getSupNode().getId());
		
		return map;
	}
	
	protected Result save(IGeneTreeNode<T> entity)
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
	
	
	public List<Map<String, Object>> getAll()
	{
		return getTree(1);
	}
	
	public List<Map<String, Object>> getTree(Integer rootId)
	{		
		List<Map<String, Object>> list = new ArrayList<>();
		
		loadTreeNode(dao.get(rootId), list);
		
		return list;	
	}
	
	private void loadTreeNode(IGeneTreeNode<T> entity, List<Map<String, Object>> list)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("text", entity.getName());
		map.put("id", entity.getId());
		
		map.put("expanded", true);
		
		if(entity.getSubNodesIntfaceList().size() == 0)
		{
			map.put("leaf", true);
			list.add(map);
			return;
		}else {
			List<Map<String, Object>> childrenList = new ArrayList<>();
			
			for(IGeneTreeNode<T> subNode : entity.getSubNodesIntfaceList())
			{
				loadTreeNode(subNode, childrenList);
			}
			
			map.put("Children", childrenList);
			list.add(map);
			
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public Result save(T entity)
	{
		return save((IGeneTreeNode<T>)entity);
		
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		return dao.getComboList();
	}	
	
	public IGenericDao<IGeneTreeNode<T>, Integer> getDao()
	{
		return dao;
	}

	public void setDao(
					IGenericDao<IGeneTreeNode<T>, Integer> dao)
	{
		this.dao = dao;
	}		
}
