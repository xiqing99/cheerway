package org.qixi.accountMgt.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.common.beans.BaseVoucher;
import org.qixi.salesMgt.beans.SaleVch;

@Entity
@Table(name="refundment_vch")
public class RefundmentVch extends BaseVoucher<RefundmentVchItem>
{	
	private SaleVch saleVch;
	private String account;
	private Double paidAmount = 0.0;
	private Double custDepositAmount = 0.0;
	private Double orderDepositAmount = 0.0;	
	
	
	@ManyToOne(optional=false)
	@JoinColumn(name="sale_vch_id")
	public SaleVch getSaleVch()
	{
		return saleVch;
	}
	public void setSaleVch(
					SaleVch saleVch)
	{
		this.saleVch = saleVch;
	}
	
	@Column(name="paid_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (paid_amount >= 0)")
	public Double getPaidAmount()
	{
		return paidAmount;
	}
	public void setPaidAmount(
					Double paidAmount)
	{
		this.paidAmount = paidAmount;
	}
	
	public String getAccount()
	{
		return account;
	}
	public void setAccount(
					String account)
	{
		this.account = account;
	}

	@Column(name="cust_deposit_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (cust_deposit_amount >= 0)")
	public Double getCustDepositAmount()
	{
		return custDepositAmount;
	}
	public void setCustDepositAmount(
					Double custDepositAmount)
	{
		this.custDepositAmount = custDepositAmount;
	}
	
	@Column(name="order_deposit_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (order_deposit_amount >= 0)")	
	public Double getOrderDepositAmount()
	{
		return orderDepositAmount;
	}
	public void setOrderDepositAmount(
					Double orderDepositAmount)
	{
		this.orderDepositAmount = orderDepositAmount;
	}

}
