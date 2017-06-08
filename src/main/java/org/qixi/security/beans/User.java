package org.qixi.security.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@Table(name="user_login")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@BatchSize(size=10)
public class User implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4197419398143388140L;
	private Integer id;
	private String name;
	private String password;
	private boolean enabled;
	private EmpGenInfo empGenInfo;
	private Set<Role>  roles = new HashSet<Role>();
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="user_role",
		joinColumns= @JoinColumn(name="user_id"),
		inverseJoinColumns= @JoinColumn(name="role_id")
	)	
	public Set<Role> getRoles()
	{
		return roles;
	}
	
	public void setRoles(Set<Role> roles)
	{
		this.roles = roles;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}

	@Column(unique=true, nullable=false)
	public String getName()
	{
		return name;
	}
	
	@Column(nullable=false)
	public String getPassword()
	{
		return password;
	}
	
	@Column(name="enabled", columnDefinition = "boolean default true")
	public boolean isEnabled()
	{
		return enabled;
	}
	public void setEnabled(boolean enabled)
	{
		this.enabled = enabled;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public void setPassword(String password)
	{
		this.password = password;
	}	
	
	@Transient
	public List<GrantedAuthority> buildAuthority()
	{
		
		List<GrantedAuthority>  authList = new ArrayList<GrantedAuthority>(roles.size());
		
		for( Role role : roles)
		{
			authList.add(new SimpleGrantedAuthority(role.getName()));
		}
		
		return authList;
	}

	@OneToOne(fetch= FetchType.LAZY)
	@JoinColumn(name="emp_id", nullable=false)
	public EmpGenInfo getEmpGenInfo()
	{
		return empGenInfo;
	}

	public void setEmpGenInfo(
					EmpGenInfo empGenInfo)
	{
		this.empGenInfo = empGenInfo;
	}
}
