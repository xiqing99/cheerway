package org.qixi.security.dao;

import java.util.List;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.WorkGroup;

public interface WorkGroupDao extends IGenericDao<WorkGroup, Integer>
{
	public List<ComboElem> getEmpComboList(Integer groupId);
}
