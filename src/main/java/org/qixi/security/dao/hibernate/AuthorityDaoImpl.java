package org.qixi.security.dao.hibernate;

import java.util.List;

import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.Authority;
import org.qixi.security.dao.AuthorityDao;

public class AuthorityDaoImpl extends GenericDAOImpl< Authority, Integer> implements AuthorityDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<Authority> getAllUrlResList()
	{
		return getCurrentSession().createQuery("from Authority a where a.type = 'URL'").list();
	}


}
