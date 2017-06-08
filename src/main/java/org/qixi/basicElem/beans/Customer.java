package org.qixi.basicElem.beans;

import java.util.Date;
import java.util.List;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.qixi.common.beans.BaseEntity;

@Entity
@PrimaryKeyJoinColumn(name="partner_id")
public class Customer extends Partner
{
	
	private CustPriority priority;
	private MarketArea  area;
	private Double depositAmount = 0.0;
	
	@ManyToOne
	@JoinColumn(name = "priority_id", nullable = false)	
	public CustPriority getPriority()
	{
		return priority;
	}
	
	@ManyToOne
	@JoinColumn(name = "market_area_id", nullable = false)
	public MarketArea getArea()
	{
		return area;
	}
	public void setPriority(
					CustPriority priority)
	{
		this.priority = priority;
	}
	public void setArea(MarketArea area)
	{
		this.area = area;
	}

	@Column(name="deposit_amount", nullable = false, columnDefinition = "numeric(12,2) default 0.0 CHECK (deposit_amount >= 0)")
	public Double getDepositAmount()
	{
		return depositAmount;
	}

	public void setDepositAmount(
					Double depositAmount)
	{
		this.depositAmount = depositAmount;
	}

}
