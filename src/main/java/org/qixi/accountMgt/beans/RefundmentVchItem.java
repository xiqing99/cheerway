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


@Entity
@Table(name="refundment_vch_item")
public class RefundmentVchItem 
{
	private Integer id;
	private RefundPerStockRt refundPerStockRt;
	private Double amount;
	private RefundmentVch ownerVoucher;
	
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
	public void setAmount(Double amount)
	{
		this.amount = amount;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="owner_voucher_id", nullable=false)
	public RefundmentVch getOwnerVoucher()
	{
		return ownerVoucher;
	}
	public void setOwnerVoucher(RefundmentVch owner)
	{
		this.ownerVoucher = owner;
	}
	
	@ManyToOne(fetch=FetchType.LAZY, optional = false)
	@JoinColumn(name="refund_per_stockrt_id", nullable = false)
	public RefundPerStockRt getRefundPerStockRt()
	{
		return refundPerStockRt;
	}
	public void setRefundPerStockRt(
					RefundPerStockRt refundPerStockRt)
	{
		this.refundPerStockRt = refundPerStockRt;
	}

}
