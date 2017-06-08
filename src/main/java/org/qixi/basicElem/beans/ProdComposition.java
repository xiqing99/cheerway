package org.qixi.basicElem.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="prod_composition")
public class ProdComposition
{
	private Integer id;
	private Product product;
	private Product subProduct;
	private Integer amount;
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
	
	@ManyToOne
	@JoinColumn(name="prod_id")
	public Product getProduct()
	{
		return product;
	}
	public void setProduct(Product product)
	{
		this.product = product;
	}
	
	@ManyToOne
	@JoinColumn(name="comp_prod_id")
	public Product getSubProduct()
	{
		return subProduct;
	}
	public void setSubProduct(
					Product subProduct)
	{
		this.subProduct = subProduct;
	}
	
	@Column(nullable=false)
	public Integer getAmount()
	{
		return amount;
	}
	public void setAmount(Integer amount)
	{
		this.amount = amount;
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
