package org.qixi.common.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;


public  class BaseTreeNodeDAOImpl<T> extends GenericDAOImpl<T, Integer> implements IBaseTreeNodeDao<T>
{

	@Override
	public List<T> getSubList(Integer id)
	{
		List<T> list = new ArrayList<>();
		
		getNextLevelList(get(id), list);
		
		return list;
	}	
	
	@SuppressWarnings("unchecked")
	private void getNextLevelList(T node, List<T> rstList)
	{
		rstList.add(node);
		
		List<T> subList = getCurrentSession().createCriteria(entityClass)
						 .add(Restrictions.eq("supNode", node))
						 .list();
		
		if(subList.size() == 0)
		{
			return;
		}else {
			for(T subNode : subList)
			{
				getNextLevelList(subNode, rstList);
			}
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getSonList(Integer id)
	{

		return (List<T>)getCurrentSession().createCriteria(entityClass)
						 .add(Restrictions.eq("supNode.id", id))
						 .list();
	}

}
