package org.qixi.security.action;

import java.util.HashSet;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseEntityAction;
import org.qixi.security.beans.Authority;
import org.qixi.security.beans.Role;

public class RoleAction extends BaseEntityAction<Role>
{

	private static final long serialVersionUID = 1L;
	
	private String itemListsJson;

	public String getItemListsJson()
	{
		return itemListsJson;
	}

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		entity.setAuthorities(parseAuthList(itemListsJson));
	}

	private Set<Authority> parseAuthList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		Set<Authority> set = new HashSet<>();
		
		for (int i = 0; i<jsonArray.size(); i++)
		{
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			Authority authority = (Authority) JSONObject.toBean(jsonObject, Authority.class);
			
			set.add(authority);
		}		
		
		return set;
	}	
}
