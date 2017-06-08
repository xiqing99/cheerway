package org.qixi.security.service;


import java.util.Map;

import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;
import org.qixi.security.beans.User;

public interface UserService extends IGenericService<User>
{
	public Map<String, Object> getByEmpGenInfoId(Integer empId);
	public Result updatePassword(User user, String orgPassword);
}
