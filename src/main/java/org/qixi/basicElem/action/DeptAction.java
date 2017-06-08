package org.qixi.basicElem.action;

import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.service.DeptService;
import org.qixi.common.action.BaseEntityAction;


public class DeptAction extends BaseEntityAction<Department>
{
	private static final long serialVersionUID = 1L;
	
	public String loadSubTree()
	{
		list = ((DeptService)service).getTree(id);
		return SUCCESS;
	}
	
	public String loadSubComboList()
	{
		comboList = ((DeptService)service).getListForCombo(id);
		
		return SUCCESS;
	}

}