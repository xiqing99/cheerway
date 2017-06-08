package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Product;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.service.IGenericService;

public interface IEmpGenInfoService extends IGenericService<EmpGenInfo>
{
	public List<Map<String, Object>> getListByDept(Integer deptId);
	public List<ComboElem> getListByDeptForCombo(Integer deptId);
	public List<Map<String, Object>> getDisabledList();
}
