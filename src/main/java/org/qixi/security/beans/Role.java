package org.qixi.security.beans;

import java.io.Serializable;
import java.util.HashSet;
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
import javax.persistence.OrderBy;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@BatchSize(size=20)
public class Role implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -431575228315344414L;
	private Integer id;
	private String name;
	private String description;
	private Set<Authority> authorities = new HashSet<Authority>();
	
	@ManyToMany(fetch=FetchType.EAGER)
	@JoinTable(name="role_auth",
					joinColumns= @JoinColumn(name="role_id"),
					inverseJoinColumns=@JoinColumn(name="auth_id"))
	@OrderBy("id ASC")
	public Set<Authority> getAuthorities()
	{
		return authorities;
	}
	public void setAuthorities(
					Set<Authority> authority)
	{
		this.authorities = authority;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	@Column(name="name", unique=true, nullable=false)
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public String getDescription()
	{
		return description;
	}
	public void setDescription(String disc)
	{
		this.description = disc;
	}
}
