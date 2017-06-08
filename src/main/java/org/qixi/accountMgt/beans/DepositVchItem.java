package org.qixi.accountMgt.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.salesMgt.beans.SaleVch;

@Entity
@Table(name="deposit_vch_item")
public class DepositVchItem 
{
	
	private Integer id;
	private Double amount;
	private SaleVch saleVch;
	private DepositVch ownerVoucher;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}	
	
	@Column(nullable = false, columnDefinition = "numeric(12,2) CHECK (amount > 0)")
	public Double getAmount()
	{
		return amount;
	}
	public void setAmount(
					Double amount)
	{
		this.amount = amount;
	}
	
	@ManyToOne(optional=false, fetch=FetchType.LAZY)
	@JoinColumn(name="owner_voucher_id", nullable=false)
	public DepositVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(
					DepositVch ownerVoucher)
	{
		this.ownerVoucher = ownerVoucher;
	}
	
	@ManyToOne(optional=false,fetch=FetchType.LAZY)
	@JoinColumn(name="sale_vch_id", nullable=false)
	public SaleVch getSaleVch()
	{
		return saleVch;
	}
	public void setSaleVch(
					SaleVch saleVch)
	{
		this.saleVch = saleVch;
	}
	
}
