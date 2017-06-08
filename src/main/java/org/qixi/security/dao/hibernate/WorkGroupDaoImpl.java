package org.qixi.security.dao.hibernate;

import java.util.List;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.WorkGroup;
import org.qixi.security.dao.WorkGroupDao;


public class WorkGroupDaoImpl extends GenericDAOImpl<WorkGroup, Integer> implements WorkGroupDao
{

	@Override
	public List<ComboElem> getEmpComboList(Integer groupId)
	{
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select emp.id, emp.name from " + entityClass.getName() +
						" o join o.empList emp where o.id=?")
						.setParameter(0, groupId)
						.list();
		return comboRstCast(list);
	}		
}
