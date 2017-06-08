package org.qixi.security.action;


import java.util.HashSet;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.action.BaseEntityAction;
import org.qixi.security.beans.WorkGroup;
import org.qixi.security.service.WorkGroupService;

@SuppressWarnings("serial")
public class WorkGroupAction extends BaseEntityAction<WorkGroup>
{
	private String itemListsJson;

	public String getItemListsJson()
	{
		return itemListsJson;
	}

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		entity.setEmpList(parseEmpList(itemListsJson));
	}

	private Set<EmpGenInfo> parseEmpList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		Set<EmpGenInfo> set = new HashSet<>();
		
		for (int i = 0; i<jsonArray.size(); i++)
		{
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			EmpGenInfo emp = (EmpGenInfo) JSONObject.toBean(jsonObject, EmpGenInfo.class);
			
			set.add(emp);
		}		
		
		return set;
	}
	
	public String loadEmpComboListById()
	{
		comboList = ((WorkGroupService)service).getEmpComboByGroupId(id);
		
		return SUCCESS;
	}
}
