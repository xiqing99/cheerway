package org.qixi.manuMgt.beans;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.ProductUnit;

@Entity
@Table(name="material_item")
@Inheritance(strategy= InheritanceType.JOINED)
public class MtItem
{
	
	public static enum Source {
		PURCHASE, PRODUCE, OUTSOURCE
	}

	public static enum Type {
		PRODUCT, SEMI_PRODUCT, RAW_MATERIAL
	}	
	
	private Integer id;
	private String materialNum;
	private String name;
	private ProductUnit unit; 	
	private Double unitCost = 0.0;
	private Source source;
	private Type type;

	private EmpGenInfo createdEmp;
	private Double maxQuantityInStock;
	private Double minQuantityInStock;
	private String description;
	private Boolean     disabled = false;
	private String  sortIndex;



	
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
	
	@Column(name="material_num", nullable=false, unique=true)
	public String getMaterialNum()
	{
		return materialNum;
	}
	public void setMaterialNum(
					String materialNum)
	{
		this.materialNum = materialNum;
	}
	
	@Column(name="disabled", nullable=false, columnDefinition = "boolean default false")
	public Boolean getDisabled()
	{
		return disabled;
	}
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}		
	
	@Column(name="max_quantity_in_stock")
	public Double getMaxQuantityInStock()
	{
		return maxQuantityInStock;
	}
	public void setMaxQuantityInStock(
					Double maxQuantityInStock)
	{
		this.maxQuantityInStock = maxQuantityInStock;
	}
	
	@Column(name="min_quantity_in_stock")
	public Double getMinQuantityInStock()
	{
		return minQuantityInStock;
	}
	public void setMinQuantityInStock(
					Double minQuantityInStock)
	{
		this.minQuantityInStock = minQuantityInStock;
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
	@JoinColumn(name="unit_id", nullable=false)
	public ProductUnit getUnit()
	{
		return unit;
	}
	public void setUnit(ProductUnit unit)
	{
		this.unit = unit;
	}		
	
	@Column(name="unit_cost", nullable=false, columnDefinition = "numeric(12,2) CHECK (unit_cost > 0)")
	public Double getUnitCost()
	{
		return unitCost;
	}
	public void setUnitCost(
					Double unitCost)
	{
		this.unitCost = unitCost;
	}
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	public Source getSource()
	{
		return source;
	}
	public void setSource(Source source)
	{
		this.source = source;
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
	
	@ManyToOne(optional=false)
	@JoinColumn(name="created_emp_id", nullable=false)
	public EmpGenInfo getCreatedEmp()
	{
		return createdEmp;
	}
	public void setCreatedEmp(
					EmpGenInfo createdEmp)
	{
		this.createdEmp = createdEmp;
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
