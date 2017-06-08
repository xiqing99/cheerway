package org.qixi.security.dao.hibernate;

import org.hibernate.Query;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;
import org.qixi.security.beans.User;
import org.qixi.security.dao.UserDao;

public class UserDaoImpl extends EntityWithDisableFlagDAOImpl<User, Integer> implements UserDao
{

	@Override
	public User getUserByName(
					String name)
	{
		Query query = getCurrentSession().createQuery("from User u where u.name = :name")
						.setString("name", name);
		return (User)query.uniqueResult();
	}

	@Override
	public void updatePassword(Integer userId, String newPassword)
	{
		Query query = getCurrentSession().createQuery("update "+ entityClass.getName() +
						" o set o.password= :password where o.id = :id")
						.setParameter("id", userId)
						.setParameter("password", newPassword);
		
		query.executeUpdate();
		
	}

	@Override
	public User getByEmpGenInfoId(Integer empId)
	{
		Query query = getCurrentSession().createQuery("from User u where u.empGenInfo.id = ?")
						.setParameter(0, empId);
		return (User)query.uniqueResult();
	}
}
