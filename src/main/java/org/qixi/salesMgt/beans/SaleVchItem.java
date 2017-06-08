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

import org.qixi.manuMgt.beans.ProdMtItem;

@SuppressWarnings("serial")
@Entity
@Table(name="sale_vch_item")
public  class SaleVchItem implements Serializable
{

	private Integer id;
	private SaleVch ownerVoucher;
	private ProdMtItem mtItem;
	private Double quantity;
	private Double  unitPrice;
	private Double  stdUnitPrice;
	private String notes;
	
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
	public SaleVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					SaleVch ownerVoucher)
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
	
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="prod_mt_item_id", nullable=false)		
	public ProdMtItem getMtItem()
	{
		return mtItem;
	}
	public void setMtItem(ProdMtItem mtItem)
	{
		this.mtItem = mtItem;
	}
	
	public void buildMap(Map<String, Object> map)
	{
		map.put("quantity", quantity);
		map.put("unitPrice", unitPrice);
		map.put("stdUnitPrice", stdUnitPrice);
		map.put("notes", notes);
		
		
		mtItem.buildMap(map);
	}
	
}
