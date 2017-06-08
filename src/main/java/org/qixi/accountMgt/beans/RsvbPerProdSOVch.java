package org.qixi.accountMgt.beans;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.qixi.stockingMgt.beans.ProdStockOutVch;

@Entity
@Table(name="receivable_per_stockout")
public class RsvbPerProdSOVch extends BaseFundVch
{

	private static final long serialVersionUID = 1L;
	
	private ProdStockOutVch stOutVch;
	
	
	@OneToOne(optional=false)
	@JoinColumn(name="prod_stockout_vch_id", nullable=false)
	public ProdStockOutVch getStOutVch()
	{
		return stOutVch;
	}
	public void setStOutVch(
					ProdStockOutVch stOutVch)
	{
		this.stOutVch = stOutVch;
	}
	
}
