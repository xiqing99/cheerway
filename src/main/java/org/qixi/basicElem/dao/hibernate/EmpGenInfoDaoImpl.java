package org.qixi.basicElem.dao.hibernate;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.dao.EmpGenInfoDao;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;
import org.qixi.common.dao.GenericDAOImpl;

public class EmpGenInfoDaoImpl extends EntityWithDisableFlagDAOImpl<EmpGenInfo, Integer> implements EmpGenInfoDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<EmpGenInfo> getByName(
					String name)
	{		
		Query query = getCurrentSession().createQuery("from EmpGenInfo e where e.name = :name" );
		query.setString("name", name);
		
		return (List<EmpGenInfo>)query.list();
	}

	@Override
	public EmpGenInfo getByEmail(
					String email)
	{
		Query query = getCurrentSession().createQuery("from EmpGenInfo e where e.email = :email" );
		query.setString("email", email);
		
		return  (EmpGenInfo)query.uniqueResult();
	}

	@Override
	public List<String> getNameListByPos(
					Integer posId)
	{
		Query query = getCurrentSession().createQuery("select e.name from EmpGenInfo e where e.position.id = :posId")
						.setInteger("posId", posId);
		
		
		return (List<String>)query.list();
	}

	@Override
	public Long getNumOfEmpForDept(
					Integer deptId)
	{
		Query query = getCurrentSession().createQuery("select count(*) from EmpGenInfo e where e.dept.id = :deptId")
						.setInteger("deptId", deptId);
		
		return (Long)query.uniqueResult();
	}

	@Override
	public List<EmpGenInfo> getAllByDeptList(
					List<Department> deptList)
	{
		List list = getCurrentSession().createCriteria(EmpGenInfo.class)
						.add(Restrictions.in("dept", deptList))
						.list();
		return list;
	}

	@Override
	public List<ComboElem> getComboListByDeptId(
					Integer deptId)
	{
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.id, o.name from EmpGenInfo o where o.dept.id =?")
						.setParameter(0, deptId)
						.list();
		return comboRstCast(list);
	}

}
