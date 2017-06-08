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
import javax.persistence.ManyToMany;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@BatchSize(size=10)
public class Authority implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1830533363472417267L;
	private int id;
	private String name;
	private String type;
	private String value;
	private String description;
	private Set<Role> roles = new HashSet<Role>();
	
	
	@ManyToMany(mappedBy="authorities", fetch=FetchType.EAGER)
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
	public int getId()
	{
		return id;
	}
	public void setId(int id)
	{
		this.id = id;
	}
	
	@Column(unique=true, nullable=false)
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	
	@Column(nullable=false)
	public String getType()
	{
		return type;
	}
	public void setType(String type)
	{
		this.type = type;
	}
	
	@Column(nullable=false)
	public String getValue()
	{
		return value;
	}
	public void setValue(String value)
	{
		this.value = value;
	}
	public String getDescription()
	{
		return description;
	}
	public void setDescription(
					String description)
	{
		this.description = description;
	}
}
