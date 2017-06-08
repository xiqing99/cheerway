package org.qixi.basicElem.action;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.service.IEmpGenInfoService;
import org.qixi.common.action.BaseEntityAction;

public class EmpGenInfoAction extends BaseEntityAction<EmpGenInfo>
{
	private Integer deptId;

	public String loadByDept()
	{
		list = ((IEmpGenInfoService)service).getListByDept(deptId);
		return SUCCESS;
	}
	
	public String loadByDeptForCombo()
	{
		comboList = ((IEmpGenInfoService)service).getListByDeptForCombo(deptId);
		return SUCCESS;
	}
	
	public String loadDisabledList()
	{
		list = ((IEmpGenInfoService)service).getDisabledList();
		return SUCCESS;
	}
	
	public Integer getDeptId()
	{
		return deptId;
	}

	public void setDeptId(Integer deptId)
	{
		this.deptId = deptId;
	}
	
	
}
