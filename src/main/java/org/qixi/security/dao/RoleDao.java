package org.qixi.security.dao;

import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.Role;

public interface RoleDao extends IGenericDao<Role, Integer>
{
	public void updateWithoutAuthorities(Role entity);
}
