package org.qixi.basicElem.action;


import java.util.Map;

import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.service.CustomerService;
import org.qixi.common.action.BaseEntityAction;

public class CustomerAction extends BaseEntityAction<Customer>
{
	
	private Integer areaId;

	public String loadListByAreaId()
	{
		list = ((CustomerService)service).getListByAreaId(areaId);
		
		return SUCCESS;
	}
	
	public String loadComboListByAreaId()
	{
		comboList = ((CustomerService)service).getListByAreaIdForCombo(areaId);
		
		return SUCCESS;		
	}
	
	public String loadDisabledList()
	{
		list = ((CustomerService)service).getDisabledList();
		return SUCCESS;
	}	
	
	public String loadCurrency()
	{
		Map<String, Object> map = ((CustomerService)service).getCurrency(id);
		
		resultMap.put("data", map);
		resultMap.put("success", true);
		
		return SUCCESS;
	}
	
	public Integer getAreaId()
	{
		return areaId;
	}

	public void setAreaId(Integer areaId)
	{
		this.areaId = areaId;
	}
	
}
