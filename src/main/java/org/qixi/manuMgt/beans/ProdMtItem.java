package org.qixi.manuMgt.beans;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Product;



@Entity
@Table(name="prod_material_item")
@PrimaryKeyJoinColumn(name="mt_item_id")
public class ProdMtItem extends MtItem
{
	private Product product;
	private String packageModel;
	private Double stdUnitPrice;
	private String orderSeqNum;
	private String  colorModel;
	private String  custModelNum;
	private boolean saleable = false;
	
	@ManyToOne(optional=false)
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
	
	@Column(name="std_unit_price", nullable=false, columnDefinition = "numeric(12,2) CHECK (std_unit_price > 0)")
	public Double getStdUnitPrice()
	{
		return stdUnitPrice;
	}
	public void setStdUnitPrice(
					Double stdUnitPrice)
	{
		this.stdUnitPrice = stdUnitPrice;
	}	

	@Column(name="order_seq_num", nullable=false)
	public String getOrderSeqNum()
	{
		return orderSeqNum;
	}
	public void setOrderSeqNum(
					String orderSeqNum)
	{
		this.orderSeqNum = orderSeqNum;
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
	
	@Column(name="cust_model_num")
	public String getCustModelNum()
	{
		return custModelNum;
	}
	public void setCustModelNum(
					String custModelNum)
	{
		this.custModelNum = custModelNum;
	}
	
	@Column(nullable=false, columnDefinition = "boolean default false")
	public boolean isSaleable()
	{
		return saleable;
	}
	public void setSaleable(boolean saleable)
	{
		this.saleable = saleable;
	}
	public void buildMap(Map<String, Object> map)
	{
		map.put("mtItemId", getId());
		map.put("mtNum", getMaterialNum());
		map.put("productId", product.getId());
		map.put("subModelNum", product.getSubModelNum());
		map.put("modelNum", product.getModelNum());
		map.put("packageModel", getPackageModel());
		map.put("ctgName", product.getCategory().getName());
		map.put("unit", getUnit().getName());	
		map.put("custModelNum", getCustModelNum());		
		map.put("orderSeqNum", getOrderSeqNum());
		map.put("colorModel", getColorModel());		
		map.put("mtStdUnitPrice", stdUnitPrice);
	}
	
}
