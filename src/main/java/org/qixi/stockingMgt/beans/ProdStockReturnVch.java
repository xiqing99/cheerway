package org.qixi.stockingMgt.beans;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.salesMgt.beans.SaleVch;

@SuppressWarnings("serial")
@Entity
@Table(name="prod_stock_return_vch")
public  class ProdStockReturnVch extends BaseVoucher<ProdStockReturnVchItem>
{
	private Store store;
	private Double  extraExpense = 0.0;
	private EmpGenInfo accountRspEmp;
	
	private SaleVch saleVch;

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
	
	@Column(name="extra_expense", nullable=false, columnDefinition = "numeric(12,2) default 0 ")
	public Double getExtraExpense()
	{
		return extraExpense;
	}
	public void setExtraExpense(
					Double extraExpense)
	{
		this.extraExpense = extraExpense;
	}
	
	@ManyToOne
	@JoinColumn(name="account_emp_id", nullable=false)
	public EmpGenInfo getAccountRspEmp()
	{
		return accountRspEmp;
	}
	
	public void setAccountRspEmp(
					EmpGenInfo accountRspEmp)
	{
		this.accountRspEmp = accountRspEmp;
	}
	
	@ManyToOne(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name="sale_vch_id", nullable=false)
	public SaleVch getSaleVch()
	{
		return saleVch;
	}
	public void setSaleVch(
					SaleVch saleVch)
	{
		this.saleVch = saleVch;
	}				
	
}
