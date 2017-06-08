package org.qixi.security.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.dao.EmpGenInfoDao;
import org.qixi.security.beans.Authority;
import org.qixi.security.beans.Role;
import org.qixi.security.dao.VoucherMenuDao;
import org.springframework.beans.factory.annotation.Autowired;

public class LoginService
{
	@Autowired 
	VoucherMenuDao menuDao;
	
	@Autowired
	EmpGenInfoDao empDao;
	
	public Map<String, Object> getEmpInfo(Integer empId)
	{
		Map<String, Object> map = new HashMap<>();
		
		EmpGenInfo empGenInfo = empDao.get(empId);
		
		map.put("empDeptId", empGenInfo.getDept().getId());
		map.put("empId", empId);
		map.put("empName", empGenInfo.getName());
		
		return map;
	}
	
	public List<Map<String, Object>> getMyVchListMenu()
	{	
		return menuDao.getSubList("All_Voucher");
	}		
	
	public List<Map<String, Object>> loadChildMenuNodeList(Set<Role> roles, String nodeId)
	{
		 List<Map<String, Object>> menu = new ArrayList<Map<String,Object>>();		
		 
		 for(Role role : roles)
		 {			 
			 for (Authority res : role.getAuthorities())
			 {
				 if(StringUtils.indexOf(res.getName(), "/") >= 0)
				 {
					 String tmp = "";
					 
	                 if ("allModulesRoot".equals(nodeId)) {
	                     tmp = res.getName();
	                        
	                 } else if (StringUtils.indexOf(res.getName(), nodeId+"/") >= 0) {
	                     tmp = StringUtils.substringAfter(res.getName(), nodeId+"/");
	                 } else
	                     continue;
	                 
	                 
	                 String[] names= StringUtils.split(tmp, "/");
	                 
	                 if(checkNodeExisted(names[0], menu))
	                	 continue;
	                 
	                 Map< String, Object> map = new HashMap<String, Object>();
	                 map.put("text", names[0]);
	                 map.put("nodeId", "/"+ names[0]);
	                 map.put("index", res.getId());
	                 if(names.length > 1)
	                 {
	                	 map.put("leaf", false);
	                 }else {
						
	                	 map.put("loadUrl", res.getValue());
	                	 map.put("type", res.getType());
	                	 map.put("leaf", true);
					}
	                
	                
	                 
	                 menu.add(map);
				 }				
			}
		 }		 		 

		 Comparator<Map<String, Object>> comparator = new Comparator<Map<String, Object>>()
		 {

			@Override
			public int compare(
							Map<String, Object> o1,
							Map<String, Object> o2)
			{
				
				return (Integer)o1.get("index") - (Integer)o2.get("index");
			}
			 
		 };
		
		 Collections.sort(menu, comparator);		 
		 
		 return menu;		
	}	
	
	private boolean checkNodeExisted(String nodeText, List<Map<String, Object>> list)
	{
		for(Map<String, Object> map : list)
		{
			if(map.get("text").equals(nodeText))
				return true;
		}
		
		return false;
	}	
	
}