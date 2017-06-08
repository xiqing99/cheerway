package org.qixi.manuMgt.action;

import org.hibernate.exception.ConstraintViolationException;
import org.qixi.common.action.BaseAction;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.service.SlbProdMtItemService;
import org.springframework.beans.factory.annotation.Autowired;

public class SlbProdMtItemAction extends BaseAction
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	SlbProdMtItemService service;
	
	private Integer ctgId;
	private Integer id;
	private boolean saleable;
	private Double stdUnitPrice;
	
	public String loadAll()
	{
		list = service.getAllList();
		
		return SUCCESS;
	}	
	
	public String loadByCtgId()
	{
		list = service.getListByCtg(ctgId);
		
		return SUCCESS;
	}
	
	public String updSaleableInfo()
	{
		Result result = new Result();

		try
		{
			result = service.updSaleInfo(id, saleable, stdUnitPrice);
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("save.failure.constraintViolation");
		}		
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));			
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, result.cause);
		}		

		return SUCCESS;
	}	
	
	public String loadUnsaleableList()
	{
		list = service.getUnsaleableList();
		return SUCCESS;
	}

	public Integer getCtgId()
	{
		return ctgId;
	}

	public void setCtgId(Integer ctgId)
	{
		this.ctgId = ctgId;
	}	
	
	public Integer getId()
	{
		return id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	public boolean isSaleable()
	{
		return saleable;
	}

	public void setSaleable(boolean saleable)
	{
		this.saleable = saleable;
	}

	public Double getStdUnitPrice()
	{
		return stdUnitPrice;
	}

	public void setStdUnitPrice(
					Double stdUnitPrice)
	{
		this.stdUnitPrice = stdUnitPrice;
	}

}
