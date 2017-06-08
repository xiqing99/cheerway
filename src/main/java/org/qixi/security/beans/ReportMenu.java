package org.qixi.security.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

@Entity
@BatchSize(size=20)
@Table(name="report_menu")
public class ReportMenu implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1830533363472417267L;
	private int id;
	private String name;
	private String url;
	private String tips;
	private ReportMenu parentMenu;
	private List<ReportMenu> subMenuList = new ArrayList<>();
	
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
	
	@Column(nullable=false)
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	
	public String getUrl()
	{
		return url;
	}
	public void setUrl(String url)
	{
		this.url = url;
	}
	
	public String getTips()
	{
		return tips;
	}
	public void setTips(String tips)
	{
		this.tips = tips;
	}
	
	@ManyToOne
	@JoinColumn(name="parent_id")
	public ReportMenu getParentMenu()
	{
		return parentMenu;
	}
	public void setParentMenu(
					ReportMenu parentMenu)
	{
		this.parentMenu = parentMenu;
	}
	
	@OneToMany(mappedBy="parentMenu")
	public List<ReportMenu> getSubMenuList()
	{
		return subMenuList;
	}
	public void setSubMenuList(
					List<ReportMenu> subMenuList)
	{
		this.subMenuList = subMenuList;
	}
	
}
