package org.qixi.salesMgt.beans;


import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Customer;
import org.qixi.common.beans.BaseVoucher;


@Entity
@Table(name="sale_vch")
@Inheritance(strategy= InheritanceType.JOINED)
public class SaleVch extends BaseVoucher<SaleVchItem>
{

	private static final long serialVersionUID = 6548926235939383588L;
	
	private Customer  customer;
	private PaymentMode paymentMode;
	private Double exchangeRate;
	private Double otherExpense= 0.0;
	private Double depositAmount= 0.0;
	private Double containerNum = 0.0;
	private Double    totalPrice= 0.0;
	private Double    totalExtraProfit= 0.0;		
	
	private Date deliverDeadLine;
	private Date paymentDeadLine;
	
	private Timestamp closedTime;
	
	
	@Column(name="deliver_deadline")
	public Date getDeliverDeadLine()
	{
		return deliverDeadLine;
	}
	
	@Column(name="payment_deadline")
	public Date getPaymentDeadLine()
	{
		return paymentDeadLine;
	}
	
	@ManyToOne(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name="customer_id", nullable=false)
	public Customer getCustomer()
	{
		return customer;
	}

	public void setDeliverDeadLine(
					Date deliverDeadLine)
	{
		this.deliverDeadLine = deliverDeadLine;
	}
	public void setPaymentDeadLine(
					Date paymentDeadLine)
	{
		this.paymentDeadLine = paymentDeadLine;
	}
	public void setCustomer(
					Customer customer)
	{
		this.customer = customer;
	}

	@Column(name="closed_time")
	public Timestamp getClosedTime()
	{
		return closedTime;
	}

	public void setClosedTime(
					Timestamp closedTime)
	{
		this.closedTime = closedTime;
	}

	@Column(name="exchange_rate",nullable=false,columnDefinition = "numeric CHECK (exchange_rate > 0)")
	public Double getExchangeRate()
	{
		return exchangeRate;
	}

	public void setExchangeRate(
					Double exchangeRate)
	{
		this.exchangeRate = exchangeRate;
	}

	@ManyToOne
	@JoinColumn(name="payment_mode_id", nullable=false)
	public PaymentMode getPaymentMode()
	{
		return paymentMode;
	}

	public void setPaymentMode(
					PaymentMode paymentMode)
	{
		this.paymentMode = paymentMode;
	}
	
	@Column(name="total_price", nullable=false, columnDefinition = "numeric(12,2) CHECK (total_price > 0)")
	public Double getTotalPrice()
	{
		return totalPrice;
	}

	public void setTotalPrice(
					Double totalPrice)
	{
		this.totalPrice = totalPrice;
	}

	@Column(name="total_extra_profit", nullable=false, columnDefinition = "numeric(12,2) default 0")
	public Double getTotalExtraProfit()
	{
		return totalExtraProfit;
	}

	public void setTotalExtraProfit(
					Double totalExtraProfit)
	{
		this.totalExtraProfit = totalExtraProfit;
	}

	@Column(name="other_expense", nullable=false, columnDefinition = "numeric(12,2) default 0 CHECK (other_expense >= 0)")
	public Double getOtherExpense()
	{
		return otherExpense;
	}

	public void setOtherExpense(
					Double otherExpense)
	{
		this.otherExpense = otherExpense;
	}

	@Column(name="deposit_amount", nullable=false, columnDefinition = "numeric(12,2) default 0 CHECK (deposit_amount >= 0)")
	public Double getDepositAmount()
	{
		return depositAmount;
	}

	public void setDepositAmount(
					Double depositAmount)
	{
		this.depositAmount = depositAmount;
	}

	@Column(name="container_num", nullable=false, columnDefinition = "numeric(12,2) default 0 CHECK (container_num >= 0)")
	public Double getContainerNum()
	{
		return containerNum;
	}

	public void setContainerNum(
					Double containerNum)
	{
		this.containerNum = containerNum;
	}
	
}
