package org.qixi.basicElem.dao.hibernate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.BaseTreeNodeDAOImpl;
import org.qixi.common.dao.GenericDAOImpl;
import org.hibernate.Query;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.dao.DepartmentDao;

public class DepartmentDaoImpl extends BaseTreeNodeDAOImpl<Department> implements DepartmentDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> getEmpListForReport(
					Integer deptId)
	{
		List<Department> deptList = getSubList(deptId);
		
		List<Object[]> rstList = getCurrentSession().createQuery("select o.id, o.name, o.dept.name from EmpGenInfo o where o.dept in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", deptList)
						.list();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Object[] rst : rstList)
		{
			Map<String, Object> map = new HashMap<String, Object>();
			
			map.put("empId", rst[0]);
			map.put("empName", rst[1]);
			map.put("deptName", rst[2]);
			
			mapList.add(map);
		}
		
		return mapList;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<EmpGenInfo> getEmpGenInfoList(
					Integer deptId)
	{
		List<Department> deptList = getSubList(deptId);
		
		return (List<EmpGenInfo>)getCurrentSession().createQuery("from EmpGenInfo o where o.dept in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", deptList)
						.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ComboElem> getEmpComboList(
					Integer deptId)
	{
		List<Department> deptList = getSubList(deptId);
		
		List<Object[]> list = getCurrentSession().createQuery("select o.id, o.name from EmpGenInfo o where o.dept in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", deptList)
						.list();
		
		return comboRstCast(list);
	}

}
