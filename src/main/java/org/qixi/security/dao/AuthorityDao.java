package org.qixi.security.dao;

import java.util.List;

import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.Authority;

public interface AuthorityDao extends IGenericDao<Authority, Integer>
{
	public List<Authority> getAllUrlResList();
}
