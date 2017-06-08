package org.qixi.security.action;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseEntityAction;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.Role;
import org.qixi.security.beans.User;
import org.qixi.security.beans.UserSecure;
import org.qixi.security.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserAction extends BaseEntityAction<User>
{

	private String orgPassword;
	private String itemListsJson;
	
	public String loadCurrentUser()
	{
		UserSecure currentUser = (UserSecure) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		Map<String, Object> userMap = new HashMap<String, Object>();
		
		userMap.put("entity.id",currentUser.getUserId());
		userMap.put("entity.name", currentUser.getUsername());
		
		resultMap.put("data", userMap);
		resultMap.put("success", true);		
		
		return SUCCESS;
	}
	
	public String updateCurrentUser()
	{
		Result result =  ((UserService)service).updatePassword(entity, orgPassword);
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));
			
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, getText(result.cause));
		}
		
		return SUCCESS;		
	}
	
	public String loadByEmpGenInfoId()
	{
		Map<String, Object> map = ((UserService)service).getByEmpGenInfoId(id);
		
		if(map.containsKey("failureCause"))
		{
			setActionResult(false, getText((String)map.get("failureCause")));
			
		}else {
			resultMap.put("data", map);
			resultMap.put("success", true);					
		}
		
		return SUCCESS;
	}
	
	public String getOrgPassword()
	{
		return orgPassword;
	}
	public void setOrgPassword(
					String orgPassword)
	{
		this.orgPassword = orgPassword;
	}

	public String getItemListsJson()
	{
		return itemListsJson;
	}

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		entity.setRoles(parseRoleList(itemListsJson));;
	}
	
	private Set<Role> parseRoleList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		Set<Role> set = new HashSet<>();
		
		for (int i = 0; i<jsonArray.size(); i++)
		{
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			Role role = (Role) JSONObject.toBean(jsonObject, Role.class);
			
			set.add(role);
		}		
		
		return set;
	}		
}