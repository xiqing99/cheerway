package org.qixi.accountMgt.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Customer;
import org.qixi.common.beans.BaseVoucher;

@Entity
@Table(name="deposit_vch")
public class DepositVch extends BaseVoucher<DepositVchItem>
{
	public static enum PayWay
	{
		CASH,
		ACCOUNT
	};
	
	private PayWay payWay = PayWay.ACCOUNT;
	private String account;
	private Customer customer;
	private Double  custDepositAmount = 0.0;
	
	
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
	
	public void setAccount(String account)
	{
		this.account = account;
	}
	
	@ManyToOne(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name="customer_id", nullable = false)
	public Customer getCustomer()
	{
		return customer;
	}
	public void setCustomer(
					Customer customer)
	{
		this.customer = customer;
	}
	
	@Column(name="cust_deposit_amount", nullable = false, columnDefinition = "numeric(12,2) CHECK (cust_deposit_amount >= 0)")
	public Double getCustDepositAmount()
	{
		return custDepositAmount;
	}
	public void setCustDepositAmount(
					Double depositAmount)
	{
		this.custDepositAmount = depositAmount;
	}
		
}
