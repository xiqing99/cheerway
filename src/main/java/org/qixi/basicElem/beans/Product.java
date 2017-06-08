package org.qixi.basicElem.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints= {@UniqueConstraint(columnNames= {"model_num","sub_model_num"})})
public class Product
{
	private String modelNum;
	private String subModelNum;
	private ProductUnit unit;
	private ProductCategory category;
	private ProductType type;
	private Double cost;
//	private Set<ProdComposition> compositions = new HashSet<ProdComposition>();	
	private Boolean     disabled;
	private String  sortIndex;

	private Integer id;
	private String name;
	private String description;
	
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
	
	@Column(name="disabled", columnDefinition = "boolean default false")
	public Boolean getDisabled()
	{
		return disabled;
	}
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}		
	
	
	
	@Column(name="model_num", nullable = false)
	public String getModelNum()
	{
		return modelNum;
	}
	public void setModelNum(String number)
	{
		this.modelNum = number;
	}
	
	@ManyToOne
	@JoinColumn(name="unit_id", nullable = false)
	public ProductUnit getUnit()
	{
		return unit;
	}
	public void setUnit(ProductUnit unit)
	{
		this.unit = unit;
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
	
	public Double getCost()
	{
		return cost;
	}
	public void setCost(Double cost)
	{
		this.cost = cost;
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
	
	@Column(name="sub_model_num")
	public String getSubModelNum()
	{
		return subModelNum;
	}
	public void setSubModelNum(
					String subModelNum)
	{
		this.subModelNum = subModelNum;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="type_id", nullable=false)
	public ProductType getType()
	{
		return type;
	}
	public void setType(ProductType type)
	{
		this.type = type;
	}	
	
	@Column(name="sort_index")
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
