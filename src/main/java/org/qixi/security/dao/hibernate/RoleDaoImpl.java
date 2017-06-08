package org.qixi.security.dao.hibernate;


import org.hibernate.Query;
import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.Role;
import org.qixi.security.dao.RoleDao;

public class RoleDaoImpl extends GenericDAOImpl<Role, Integer> implements RoleDao
{

	@Override
	public void updateWithoutAuthorities(
					Role entity)
	{
		Query query = getCurrentSession().createQuery("update "+ entityClass.getName() +
						" o set o.name= :name, o.description= :description where o.id = :id")
						.setParameter("id", entity.getId())
						.setParameter("name", entity.getName())
						.setParameter("description", entity.getDescription());
		
		query.executeUpdate();
		
	}

}
