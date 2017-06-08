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

@Entity
@Table(name="stock_taken_vch_item")
public class StockTakenVchItem implements Serializable
{
	private Integer id;
	private StockTakenVch ownerVoucher;
	private Double expQuantity;
	private Double diffQuantity;	
	private Inventory inventory;

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
	
	
	@Column(name="expected_quantity", nullable=false, columnDefinition = "numeric(12,2) CHECK (expected_quantity >= 0)")
	public Double getExpQuantity()
	{
		return expQuantity;
	}
	public void setExpQuantity(
					Double expQuantity)
	{
		this.expQuantity = expQuantity;
	}
	
	@Column(name="diff_quantity", nullable=false)
	public Double getDiffQuantity()
	{
		return diffQuantity;
	}
	public void setDiffQuantity(
					Double diffQuantity)
	{
		this.diffQuantity = diffQuantity;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="inventory_id",nullable=false)
	public Inventory getInventory()
	{
		return inventory;
	}
	public void setInventory(
					Inventory inventory)
	{
		this.inventory = inventory;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="owner_voucher_id", nullable=false)	
	public StockTakenVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					StockTakenVch ownerVoucher)
	{
		this.ownerVoucher = ownerVoucher;
	}

}
