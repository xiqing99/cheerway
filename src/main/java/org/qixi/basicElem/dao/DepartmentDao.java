package org.qixi.basicElem.dao;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.IBaseTreeNodeDao;
import org.qixi.common.dao.IGenericDao;

public interface DepartmentDao extends IBaseTreeNodeDao<Department>
{
	public List<Map<String, Object>> getEmpListForReport(Integer deptId);
	public List<EmpGenInfo> getEmpGenInfoList(Integer deptId);
	public List<ComboElem> getEmpComboList(Integer deptId);
}
