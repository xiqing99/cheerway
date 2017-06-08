package org.qixi.accountMgt.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.common.beans.BaseVoucher;
import org.qixi.salesMgt.beans.SaleVch;

@Entity
@Table(name="receipt_vch")
public class ReceiptVch extends BaseVoucher<ReceiptVchItem>
{
	public static enum PayWay
	{
		CASH,
		ACCOUNT
	};
	
	private SaleVch saleVch;
	private PayWay payWay = PayWay.ACCOUNT;
	private String account;
	private Double receivedAmount = 0.0;
	private Double custDpstRdmAmount = 0.0;
	private Double orderDpstRdmAmount = 0.0;
	
	
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
	
	@Column(name="recieved_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (recieved_amount >= 0)")
	public Double getReceivedAmount()
	{
		return receivedAmount;
	}
	public void setReceivedAmount(
					Double receivedAmount)
	{
		this.receivedAmount = receivedAmount;
	}
	@Column(name="cust_redeem_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (cust_redeem_amount >= 0)")
	public Double getCustDpstRdmAmount()
	{
		return custDpstRdmAmount;
	}
	public void setCustDpstRdmAmount(
					Double custDpstRdmAmount)
	{
		this.custDpstRdmAmount = custDpstRdmAmount;
	}
	
	@Column(name="order_redeem_amount",nullable = false, columnDefinition = "numeric(12,2) CHECK (order_redeem_amount >= 0)")	
	public Double getOrderDpstRdmAmount()
	{
		return orderDpstRdmAmount;
	}
	public void setOrderDpstRdmAmount(
					Double orderDpstRdmAmount)
	{
		this.orderDpstRdmAmount = orderDpstRdmAmount;
	}
	
	@Enumerated(EnumType.STRING)
	public PayWay getPayWay()
	{
		return payWay;
	}
	public void setPayWay(PayWay payWay)
	{
		this.payWay = payWay;
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

}
