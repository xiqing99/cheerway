package org.qixi.basicElem.dao;

import java.util.List;

import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.IEntityWithDisableFlagDao;
import org.qixi.common.dao.IGenericDao;

public interface EmpGenInfoDao extends IEntityWithDisableFlagDao<EmpGenInfo, Integer>
{
	public List<EmpGenInfo> getByName(String name);
	public EmpGenInfo getByEmail(String email);
	public List<String> getNameListByPos(Integer posId);
	public Long getNumOfEmpForDept(Integer deptId);
	public List<EmpGenInfo> getAllByDeptList(List<Department> deptList);
	public List<ComboElem> getComboListByDeptId(Integer deptId);
}
