package org.qixi.stockingMgt.beans;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.salesMgt.beans.OrderSaleVch;

@SuppressWarnings("serial")
@Entity
@Table(name="prod_stock_in_vch")
public  class ProdStockInVch extends BaseVoucher<ProdStockInVchItem>
{
	private OrderSaleVch orderSaleVch;	
	private Store store;
	private String divNum;
	private Department manuLine;
	private EmpGenInfo manuLineRspEmp;
	
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
	
	public String getDivNum()
	{
		return divNum;
	}
	public void setDivNum(String divNum)
	{
		this.divNum = divNum;
	}
	
	@ManyToOne
	@JoinColumn(name="manuline_rsp_emp_id", nullable=false)
	public EmpGenInfo getManuLineRspEmp()
	{
		return manuLineRspEmp;
	}
	public void setManuLineRspEmp(
					EmpGenInfo manuLineRspEmp)
	{
		this.manuLineRspEmp = manuLineRspEmp;
	}
	
	@ManyToOne
    @JoinColumn(name="manuline_dept_id",nullable=false)
	public Department getManuLine()
	{
		return manuLine;
	}
	public void setManuLine(
					Department manuLine)
	{
		this.manuLine = manuLine;
	}		
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="order_sale_vch_id", nullable=false)
	public OrderSaleVch getOrderSaleVch()
	{
		return orderSaleVch;
	}
	public void setOrderSaleVch(
					OrderSaleVch orderSaleVch)
	{
		this.orderSaleVch = orderSaleVch;
	}					
}
