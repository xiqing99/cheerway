package org.qixi.security.action;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.qixi.security.beans.UserSecure;
import org.qixi.security.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import com.opensymphony.xwork2.ActionSupport;

public class LoginAction extends ActionSupport
{

	private static final long serialVersionUID = 1L;
	
	final static Logger  logger = Logger.getLogger(LoginAction.class);  
	
	@Autowired
	private LoginService loginService;		
	
	private Map<String, Object> loginResult = new HashMap<String, Object>();
	private Map<String, Object> errorMsgMap = new HashMap<String, Object>();
	
	private String node;
	private List<Map<String, Object>> menuList;
	
	public String loginSuccess()
	{	
		loginResult.put("success", true);	
		
		return SUCCESS;
	}
	
	public String loadUserInfo()
	{
		UserSecure currentUser = (UserSecure) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		loginResult.put("success", true);	
		loginResult.put("data", loginService.getEmpInfo(currentUser.getEmployeeId()));
		
		return SUCCESS;
	}
	
	public String loginFailed()
	{
		errorMsgMap.put("reason", getText("error.login.authenticationFailed"));
		loginResult.put("success", false);
		loginResult.put("errorMsg", errorMsgMap);
		
		logger.debug("Login failed.");
		return SUCCESS;
	}
	
	public String sessionTimetout()
	{
		HttpServletRequest request = ServletActionContext.getRequest(); 
		HttpServletResponse response = ServletActionContext.getResponse();
		
		if(request.getHeader("x-requested-with") != null && request.getHeader("x-requested-with").equalsIgnoreCase(  
                        "XMLHttpRequest"))
		{
			loginResult.put("success", false);	
			loginResult.put("message", getText("error.session.timeout"));
			response.addHeader("sessionstatus", "timeout");
			return "ajaxResult";
		}
		
		return "rediectResult";
	}
	
	public String loadMenu()
	{		
		if(SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != UserSecure.class)
		{
			return ERROR;
		}
		
		UserSecure currentUser = (UserSecure) SecurityContextHolder.getContext().getAuthentication().getPrincipal();	
		menuList = loginService.loadChildMenuNodeList(currentUser.getRoles(), node);
		return SUCCESS;
	}

	public String loadMyVchListMenu()
	{
		if(SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != UserSecure.class)
		{
			return ERROR;
		}
		
		menuList = loginService.getMyVchListMenu();
		
		return SUCCESS;		
	}	
	
	public Map<String, Object> getLoginResult()
	{
		logger.debug("getLoginResult");
		return loginResult;
	}

	public void setLoginResult(
					Map<String, Object> loginResult)
	{
		this.loginResult = loginResult;
	}

	public String getNode()
	{
		return node;
	}

	public void setNode(String node)
	{
		logger.debug("node value is set " + node);
		
/*		try
		{
			this.node = new String(node.getBytes("ISO-8859-1"),"UTF-8");
		}
		catch (UnsupportedEncodingException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		this.node = node;
		logger.debug(this.node);
	}

	public LoginService getLoginService()
	{
		return loginService;
	}

	public void setLoginService(
					LoginService loginService)
	{
		this.loginService = loginService;
	}

	public List<Map<String, Object>> getMenuList()
	{
		return menuList;
	}

	public void setMenuList(
					List<Map<String, Object>> menuList)
	{
		this.menuList = menuList;
	}
}