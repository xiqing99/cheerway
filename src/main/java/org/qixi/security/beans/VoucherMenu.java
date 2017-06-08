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
@Table(name="voucher_menu")
public class VoucherMenu implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1830533363472417267L;
	private int id;
	private String name;
	private String loadUrl;
	private String editUrl;
	private String tips;
	private VoucherMenu parentMenu;
	private List<VoucherMenu> subMenuList = new ArrayList<>();
	
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
	public VoucherMenu getParentMenu()
	{
		return parentMenu;
	}
	public void setParentMenu(
					VoucherMenu parentMenu)
	{
		this.parentMenu = parentMenu;
	}
	
	@OneToMany(mappedBy="parentMenu")
	public List<VoucherMenu> getSubMenuList()
	{
		return subMenuList;
	}
	
	public void setSubMenuList(
					List<VoucherMenu> subMenuList)
	{
		this.subMenuList = subMenuList;
	}
	
	@Column(name="load_url")
	public String getLoadUrl()
	{
		return loadUrl;
	}
	public void setLoadUrl(String loadUrl)
	{
		this.loadUrl = loadUrl;
	}
	
	@Column(name="edit_url")
	public String getEditUrl()
	{
		return editUrl;
	}
	public void setEditUrl(String editUrl)
	{
		this.editUrl = editUrl;
	}
	
}
