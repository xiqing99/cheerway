package org.qixi.accountMgt.beans;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.qixi.stockingMgt.beans.ProdStockReturnVch;

@Entity
@Table(name="refund_per_stock_return")
public class RefundPerStockRt extends BaseFundVch
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private ProdStockReturnVch returnVch;

	@OneToOne(optional=false)
	@JoinColumn(name="prod_stock_return_vch_id", nullable=false)	
	public ProdStockReturnVch getReturnVch()
	{
		return returnVch;
	}
	public void setReturnVch(
					ProdStockReturnVch returnVch)
	{
		this.returnVch = returnVch;
	}

}
