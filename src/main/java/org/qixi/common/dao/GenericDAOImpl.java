package org.qixi.common.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.qixi.common.beans.ComboElem;
import org.springframework.beans.factory.annotation.Autowired;


public abstract class GenericDAOImpl<T, ID extends Serializable> implements IGenericDao<T, ID>
{
	@Autowired
	private SessionFactory sessionFactory;
	
	protected Class<T> entityClass;
	
	@SuppressWarnings("unchecked")
	public GenericDAOImpl()
	{
        this.entityClass = (Class<T>) ((ParameterizedType) getClass()
                        .getGenericSuperclass()).getActualTypeArguments()[0];
	}
	
	public Class<T> getEntityClass()
	{
		return entityClass;
	}
	
	protected final Session getCurrentSession()
	{
		return sessionFactory.getCurrentSession();
	}

	@SuppressWarnings("unchecked")
	@Override
	public T get(ID id)
	{		
		return (T) getCurrentSession().get(entityClass, id);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public T load(ID id)
	{
		return (T)getCurrentSession().load(entityClass, id);
	}

	@Override
	public Integer save(T entity)
	{
		return (Integer) getCurrentSession().save(entity);
		
	}

	@Override
	public void update(T entity)
	{
		getCurrentSession().update(entity);
		
	}

	@Override
	public void delete(T entity)
	{
		getCurrentSession().delete(entity);
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getAll()
	{

		return getCurrentSession().createQuery("from " + entityClass.getName()).list();
	}

	@Override
	public void deleteById(ID id)
	{

			Query query = getCurrentSession().createQuery("delete from " + entityClass.getName() + " o where o.id = :id")
							.setParameter("id", id);
			query.executeUpdate();

	
	}
	
	@Override
	public List<ComboElem> getComboList()
	{
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.id, o.name from " + entityClass.getName() +" o")
						.list();
		return comboRstCast(list);
	}	

	@SuppressWarnings("unchecked")
	public List<T> getListByCriteriaId(String criteriaName, Integer criteraId)
	{		
		return (List<T>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where o." + criteriaName 
						+".id =:id")
						.setInteger("id", criteraId)
						.list();		
	}
	
	protected List<ComboElem> comboRstCast(List<Object[]> objList)
	{
		List<ComboElem> elemList = new ArrayList<>();
		
		for(Object[] object : objList)
		{
			ComboElem elem = new ComboElem();
			
			elem.setId((Integer)object[0]);
			elem.setName((String)object[1]);
			
			elemList.add(elem);
		}
		
		return elemList;			
	}	

	public SessionFactory getSessionFactory()
	{
		return sessionFactory;
	}

	public void setSessionFactory(
					SessionFactory sessionFactory)
	{
		this.sessionFactory = sessionFactory;
	}

}
