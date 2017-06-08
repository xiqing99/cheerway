package org.qixi.salesMgt.beans;

import java.io.Serializable;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Product;

@Entity
@Table(name="order_dscp_item")
public class OrderDscpItem implements Serializable
{
	private Integer id;
	private OrderSaleVch ownerVoucher;

	private Double quantity;
	private Double  unitPrice;
	private Double stdUnitPrice;
	private String notes;

	private Product product;
	private String  packageModel;
	private String  colorModel;
	private String  custModelNum;
	
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
	
	@ManyToOne(optional=false)
	@JoinColumn(name="owner_voucher_id", nullable=false)
	public OrderSaleVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					OrderSaleVch ownerVoucher)
	{
		this.ownerVoucher = ownerVoucher;
	}
	
	@Column(name="quantity", nullable=false, columnDefinition = "numeric(12,2) CHECK (quantity > 0)")
	public Double getQuantity()
	{
		return quantity;
	}
	public void setQuantity(Double quantity)
	{
		this.quantity = quantity;
	}
	
	@Column(name="unit_price", nullable=false, columnDefinition = "numeric(12,2) CHECK (unit_price > 0)")
	public Double getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(
					Double unitPrice)
	{
		this.unitPrice = unitPrice;
	}

	@Column(name="std_unit_price",nullable=false, columnDefinition = "numeric(12,2) CHECK (std_unit_price > 0)")	
	public Double getStdUnitPrice()
	{
		return stdUnitPrice;
	}
	public void setStdUnitPrice(
					Double stdUnitPrice)
	{
		this.stdUnitPrice = stdUnitPrice;
	}
	
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}		

	@ManyToOne
	@JoinColumn(name="product_id", nullable=false)
	public Product getProduct()
	{
		return product;
	}
	public void setProduct(Product product)
	{
		this.product = product;
	}
	
	@Column(name="package_model", nullable=false)
	public String getPackageModel()
	{
		return packageModel;
	}
	public void setPackageModel(
					String packageModel)
	{
		this.packageModel = packageModel;
	}
	
	@Column(name="color_model")
	public String getColorModel()
	{
		return colorModel;
	}
	public void setColorModel(
					String colorModel)
	{
		this.colorModel = colorModel;
	}	
	
	@Column(name="custModelNum")
	public String getCustModelNum()
	{
		return custModelNum;
	}
	public void setCustModelNum(
					String custModelNum)
	{
		this.custModelNum = custModelNum;
	}
	public void buildMap(Map<String, Object> map)
	{
		map.put("notes", getNotes());
		map.put("quantity", getQuantity());
		map.put("unitPrice", getUnitPrice());
		map.put("stdUnitPrice", getStdUnitPrice());
		map.put("packageModel", getPackageModel());
		map.put("productId", product.getId());
		map.put("subModelNum", product.getSubModelNum());
		map.put("modelNum", product.getModelNum());
		map.put("ctgName", product.getCategory().getName());
		map.put("unit", product.getUnit().getName());			
		map.put("colorModel", getColorModel());
		map.put("custModelNum", getCustModelNum());		
	}
}
