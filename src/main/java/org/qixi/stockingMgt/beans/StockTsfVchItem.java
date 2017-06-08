package org.qixi.stockingMgt.beans;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.manuMgt.beans.MtItem;

@Entity
@Table(name="stock_transfer_vch_item")
public class StockTsfVchItem implements Serializable
{
	
	private Integer id;
	private StockTsfVch ownerVoucher;
	private Double quantity;
	private MtItem mtItem;
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
	
	
	@Column(name="quantity", nullable=false, columnDefinition = "numeric(12,2) CHECK (quantity > 0)")
	public Double getQuantity()
	{
		return quantity;
	}
	public void setQuantity(
					Double quantity)
	{
		this.quantity = quantity;
	}	
	
	@ManyToOne(optional=false)
	@JoinColumn(name="mt_item_id",nullable=false)
	public MtItem getMtItem()
	{
		return mtItem;
	}
	public void setMtItem(MtItem mtItem)
	{
		this.mtItem = mtItem;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="owner_voucher_id", nullable=false)	
	public StockTsfVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					StockTsfVch ownerVoucher)
	{
		this.ownerVoucher = ownerVoucher;
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
