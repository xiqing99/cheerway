package org.qixi.common.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.security.beans.UserSecure;
import org.springframework.security.core.context.SecurityContextHolder;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public abstract class  BaseAction extends ActionSupport
{
	protected Map<String,Object> resultMap = new HashMap<String,Object>();
	protected List<Map<String, Object>> list = new ArrayList<>();
	
	protected void setActionResult(Boolean isSuc, String msg)
	{
		resultMap.clear();
		resultMap.put("success", isSuc);
		resultMap.put("message", msg);
	}

	protected Integer getCurrentUserEmpId()
	{
		UserSecure currentUser = (UserSecure) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return currentUser.getEmployeeId();
	}
	
	public Map<String,Object> getResultMap()
	{
		return resultMap;
	}

	public void setResultMap(
					Map<String,Object> resultMap)
	{
		this.resultMap = resultMap;
	}
	
	public List<Map<String, Object>> getList()
	{
		return list;
	}
	public void setList(
					List<Map<String, Object>> list)
	{
		this.list = list;
	}	
}