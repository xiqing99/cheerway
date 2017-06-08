package org.qixi.basicElem.beans;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="prod_sample")
public class ProdSample
{
	private Integer id;
	private String name;
	private String  sortIndex;
	private ProductCategory category;
	private String description;
	
	private Customer customer;
	private String packDes;
	private Double weight;
	
	private EmpGenInfo rspEmp;
	private EmpGenInfo lendEmp;
	private Date lendDate;
	private String picUrl;
	private String notes;
	
	public static enum Type{
		KEEP_IN, RETURN
	}
	
	private Boolean     disabled = false;
	private Type type;
	
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
	
	@ManyToOne
	@JoinColumn(name="category_id", nullable = false)
	public ProductCategory getCategory()
	{
		return category;
	}
	public void setCategory(
					ProductCategory category)
	{
		this.category = category;
	}
	
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
	public void setDescription(
					String description)
	{
		this.description = description;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="cust_id", nullable = false)
	public Customer getCustomer()
	{
		return customer;
	}
	public void setCustomer(
					Customer customer)
	{
		this.customer = customer;
	}
	
	@Column(name="package_des")
	public String getPackDes()
	{
		return packDes;
	}
	public void setPackDes(String packDes)
	{
		this.packDes = packDes;
	}
	
	public Double getWeight()
	{
		return weight;
	}
	public void setWeight(Double weight)
	{
		this.weight = weight;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="rsp_emp_id", nullable=false)
	public EmpGenInfo getRspEmp()
	{
		return rspEmp;
	}
	public void setRspEmp(EmpGenInfo rspEmp)
	{
		this.rspEmp = rspEmp;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="lend_emp_id", nullable=false)	
	public EmpGenInfo getLendEmp()
	{
		return lendEmp;
	}
	public void setLendEmp(
					EmpGenInfo lendEmp)
	{
		this.lendEmp = lendEmp;
	}
	
	@Column(name="lend_date", nullable=false)
	public Date getLendDate()
	{
		return lendDate;
	}
	public void setLendDate(Date lendDate)
	{
		this.lendDate = lendDate;
	}
	
	@Column(name="picture_url", nullable = false)
	public String getPicUrl()
	{
		return picUrl;
	}
	public void setPicUrl(String picUrl)
	{
		this.picUrl = picUrl;
	}
	
	@Column(name="disabled", columnDefinition = "boolean default false")
	public Boolean getDisabled()
	{
		return disabled;
	}
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)	
	public Type getType()
	{
		return type;
	}
	public void setType(Type type)
	{
		this.type = type;
	}
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	
	public String getSortIndex()
	{
		return sortIndex;
	}
	public void setSortIndex(
					String sortIndex)
	{
		this.sortIndex = sortIndex;
	}
	
}
