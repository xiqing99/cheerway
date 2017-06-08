package org.qixi.common.action;



import java.sql.Date;
import java.util.Map;


import org.hibernate.exception.ConstraintViolationException;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.service.IBaseVoucherService;

public abstract class BaseVoucherAction<T> extends BaseAction
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;

	protected IBaseVoucherService<T> service;
	
	protected T entity;
	
	protected Integer id;	
	
	protected String itemListsJson ;
	protected Date startDate;
	protected Date endDate;
	protected Integer criteraId;
	protected VoucherState.State state; 

	
	public String loadEntity()
	{
		Map<String, Object> map = service.getById(id);
		
		if(map.containsKey("failureCause"))
		{
			setActionResult(false, getText((String)map.get("failureCause")));
			
		}else {
			resultMap.put("data", map);
			resultMap.put("success", true);					
		}
		
		return SUCCESS;
	}
	
	public String save()
	{
		Result result = service.save(entity, getCurrentUserEmpId());

		if(result.success)
		{
			setActionResult(true,  getText("save.success"));
			
			if(result.dataMap!= null)
			{
				resultMap.put("id", result.dataMap.get("id"));
				resultMap.put("seqNum", result.dataMap.get("seqNum"));
			}

		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, getText(result.cause));
		}		

		return SUCCESS;
	}
	
	public String delete()
	{		
		Result result = new Result();
		
		try
		{
			result = service.delById(id, getCurrentUserEmpId());
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = "delete.failure.constraintViolation";
		}
		if(result.success)
		{
			setActionResult(true,  getText("delete.success"));
		}else {
			setActionResult(false, getText(result.cause));
		}
				
		return SUCCESS;		
	}	
	
	public String loadMyDetailListByCreatedDateRange()
	{
		list = service.getDetailListByCreatedDateAndEmpId(startDate, endDate, getCurrentUserEmpId());
		
		return SUCCESS;
	}

	public String loadMyListByCreatedDateRange()
	{
		list = service.getListByCreatedDateAndEmpId(startDate, endDate, getCurrentUserEmpId());
		
		return SUCCESS;
	}	

	public String loadDetailListByCreatedDateRange()
	{
		list = service.getDetailListByCreatedDateRange(startDate, endDate,criteraId);
		
		return SUCCESS;
	}

	public String loadListByCreatedDateRange()
	{
		list = service.getListByCreatedDateRange(startDate, endDate,criteraId);
		
		return SUCCESS;
	}		
	
	public String updateState()
	{			
		Result result = service.updateState(state, id, getCurrentUserEmpId());
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));
			
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, getText(result.cause));
		}
		return SUCCESS;
	}	
	
	public String loadMyVchList()
	{
		list = service.getMyInProgressVchList(getCurrentUserEmpId());
		
		return SUCCESS;
	}
	
	public IBaseVoucherService<T> getService()
	{
		return service;
	}

	public void setService(
					IBaseVoucherService<T> service)
	{
		this.service = service;
	}

	public T getEntity()
	{
		return entity;
	}

	public void setEntity(T entity)
	{
		this.entity = entity;
	}

	public Integer getId()
	{
		return id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	public String getItemListsJson()
	{
		return itemListsJson;
	}


	public Date getEndDate()
	{
		return endDate;
	}

	public void setEndDate(
					Date endDate)
	{
		this.endDate = endDate;
	}

	public Date getStartDate()
	{
		return startDate;
	}

	public void setStartDate(
					Date startDate)
	{
		this.startDate = startDate;
	}

	public Integer getCriteraId()
	{
		return criteraId;
	}

	public void setCriteraId(Integer criteraId)
	{
		this.criteraId = criteraId;
	}

	public VoucherState.State getState()
	{
		return state;
	}

	public void setState(
					VoucherState.State state)
	{
		this.state = state;
	}	
	
}
