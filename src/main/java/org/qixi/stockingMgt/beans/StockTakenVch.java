package org.qixi.stockingMgt.beans;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;


@Entity
@Table(name="stock_taken_vch")
public class StockTakenVch extends BaseVoucher<StockTakenVchItem>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Store store;
	
	@ManyToOne
	@JoinColumn(name="store_id", nullable=false)
	public Store getStore()
	{
		return store;
	}
	public void setStore(Store store)
	{
		this.store = store;
	}
}
