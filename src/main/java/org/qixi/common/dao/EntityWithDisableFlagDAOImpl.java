package org.qixi.common.dao;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.qixi.common.beans.ComboElem;


public abstract class EntityWithDisableFlagDAOImpl<T, ID extends Serializable> 
								extends GenericDAOImpl<T, ID> implements IEntityWithDisableFlagDao<T, ID>
{

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getAll()
	{
		return getCurrentSession().createCriteria(entityClass.getName())
						.add(Restrictions.or(Restrictions.isNull("disabled"), Restrictions.eq("disabled", false)))
						.addOrder(Order.asc("sortIndex"))
						.list();
	}
	
	@Override
	public List<ComboElem> getComboList()
	{
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.id, o.name from " + entityClass.getName() +
						" o where o.disabled = null or o.disabled=false order by o.sortIndex")
						.list();
		return comboRstCast(list);
	}	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<T> getAllDisabled()
	{
		return getCurrentSession().createQuery("from " + entityClass.getName() + " o where o.disabled=true").list();
	}

	@SuppressWarnings("unchecked")
	public List<T> getListByCriteriaId(String criteriaName, Integer criteraId)
	{	
		
		return getCurrentSession().createCriteria(entityClass.getName())
									.add(Restrictions.or(Restrictions.isNull("disabled"), Restrictions.eq("disabled", false)))
									.add(Restrictions.eq(criteriaName, criteraId))
									.list();
	}	
	
	@Override
	public void disableById(Integer id)
	{
		Query query = getCurrentSession().createQuery("update " + entityClass.getName() +
						" o set o.disabled = true where o.id = :id")
						.setParameter("id", id);
		
		query.executeUpdate();
		return;	
	}	
}
