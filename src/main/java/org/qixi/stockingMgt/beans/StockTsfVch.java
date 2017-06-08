package org.qixi.stockingMgt.beans;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;


@Entity
@Table(name="stock_transfer_vch")
public class StockTsfVch extends BaseVoucher<StockTsfVchItem>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Store srcStore;
	private Store dstStore;
	
	@ManyToOne
	@JoinColumn(name="src_store_id", nullable=false)
	public Store getSrcStore()
	{
		return srcStore;
	}
	public void setSrcStore(Store srcStore)
	{
		this.srcStore = srcStore;
	}
	
	@ManyToOne
	@JoinColumn(name="dst_store_id", nullable=false)
	public Store getDstStore()
	{
		return dstStore;
	}
	public void setDstStore(Store dstStore)
	{
		this.dstStore = dstStore;
	}

}
