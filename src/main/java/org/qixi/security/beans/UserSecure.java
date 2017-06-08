package org.qixi.security.beans;

import java.util.Collection;
import java.util.Set;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.GrantedAuthority;

public class UserSecure extends User
{

	private static final long serialVersionUID = -1399672152056036319L;
	public Integer userId;
	public Integer employeeId;
	public Set<Role> roles;
	
	public UserSecure(String username, String password, boolean enabled,
					boolean accountNonExpired,
		            boolean credentialsNonExpired, 
		            boolean accountNonLocked,
					Collection<GrantedAuthority> authorities, 
					Integer userId,
					Integer employeeId,
					Set<Role> roles)
	{		
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
		this.userId = userId;
		this.employeeId = employeeId;
		this.roles = roles;
	}

	public Integer getEmployeeId()
	{
		return employeeId;
	}

	public void setEmployeeId(Integer employeeId)
	{
		this.employeeId = employeeId;
	}

	public Set<Role> getRoles()
	{
		return roles;
	}

	public void setRoles(Set<Role> roles)
	{
		this.roles = roles;
	}

	public Integer getUserId()
	{
		return userId;
	}

	public void setUserId(Integer userId)
	{
		this.userId = userId;
	}

}