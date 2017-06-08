package org.qixi.basicElem.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.common.beans.BaseEntity;


@Entity
@Table(name="currency")
public class Currency extends BaseEntity
{

	private static final long serialVersionUID = 1L;
	
	private Double exchangeRate;

	@Column(name="exchange_rate", nullable=false, columnDefinition = "numeric(6,2) CHECK (exchange_rate > 0)")
	public Double getExchangeRate()
	{
		return exchangeRate;
	}

	public void setExchangeRate(
					Double exchangeRate)
	{
		this.exchangeRate = exchangeRate;
	}
	
}
