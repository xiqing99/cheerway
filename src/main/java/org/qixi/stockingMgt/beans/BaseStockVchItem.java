package org.qixi.stockingMgt.beans;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;



@MappedSuperclass
public abstract class BaseStockVchItem<TI, TO> implements Serializable
{
	private Integer id;
	private TI mtItem;
	private Double unitPrice;
	private Double quantity;
	private TO ownerVoucher;
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
	
	@Column(name="quantity", nullable=false,columnDefinition = "numeric(12,2) CHECK (quantity > 0)")
	public Double getQuantity()
	{
		return quantity;
	}
	public void setQuantity(Double quantity)
	{
		this.quantity = quantity;
	}

	@ManyToOne(optional=false)
	@JoinColumn(name="owner_voucher_id", nullable=false)
	public TO getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					TO ownerVoucher)
	{
		this.ownerVoucher = ownerVoucher;
	}

	@ManyToOne(optional=false)
	@JoinColumn(name="matertial_item_id", nullable=false)	
	public TI getMtItem()
	{
		return mtItem;
	}

	public void setMtItem(TI mtItem)
	{
		this.mtItem = mtItem;
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

	public String getNotes()
	{
		return notes;
	}

	public void setNotes(String notes)
	{
		this.notes = notes;
	}	
}
