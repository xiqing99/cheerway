package org.qixi.security.dao;

import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.User;

public interface UserDao extends IGenericDao<User, Integer>
{
	public User getUserByName(String name);
	public void updatePassword(Integer userId, String newPassword);
	public User getByEmpGenInfoId(Integer empId);
}
