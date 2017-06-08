package org.qixi.manuMgt.action;

import org.hibernate.exception.ConstraintViolationException;
import org.qixi.common.action.BaseEntityAction;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.manuMgt.service.ProdMtItemService;

public class ProdMtItemAction extends BaseEntityAction<ProdMtItem>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer ctgId;
	
	public String loadByCtgId()
	{
		list = ((ProdMtItemService)service).getListByCtg(ctgId);
		
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
	
	public String update()
	{
		Result result = new Result();

		try
		{
			result = ((ProdMtItemService)service).update(entity);
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
	
	public String loadDisabledList()
	{
		list = ((ProdMtItemService)service).getDisabledList();
		return SUCCESS;
	}

}
