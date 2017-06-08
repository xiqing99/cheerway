package org.qixi.accountMgt.action;



import java.sql.Date;
import java.util.Map;

import org.qixi.accountMgt.service.BaseFundVchService;
import org.qixi.common.action.BaseAction;
import org.qixi.common.beans.Result;


public abstract class BaseFundVchAction<T> extends BaseAction
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;
	
	protected BaseFundVchService<T> service;
	protected T entity;
	protected Integer id;
	
	protected Date startDate;
	protected Date endDate;
	protected Integer saleVchId;
	
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
	
	public String loadListBySaleVch()
	{
		list = service.getListBySaleVchId(saleVchId);
		return SUCCESS;
	}

	public String loadListByCreatedDateRange()
	{
		list = service.getListByCreatedDateRange(startDate, endDate);
		return SUCCESS;
	}

	public String loadMyListByCreatedDateRange()
	{
		list = service.getListByCreatedDateAndEmpId(startDate, endDate, getCurrentUserEmpId());
		return SUCCESS;
	}	
	
	public String loadOverdueList()
	{
		list = service.getOverdueList(endDate);
		return SUCCESS;
	}	

	public String loadMyVchList()
	{
		list = service.getMyInProgressVchList(getCurrentUserEmpId());
		
		return SUCCESS;
	}	
	
	public Date getStartDate()
	{
		return startDate;
	}

	public void setStartDate(Date startDate)
	{
		this.startDate = startDate;
	}

	public Date getEndDate()
	{
		return endDate;
	}

	public void setEndDate(Date endDate)
	{
		this.endDate = endDate;
	}

	public BaseFundVchService<T> getService()
	{
		return service;
	}

	public void setService(
					BaseFundVchService<T> service)
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

	public Integer getSaleVchId()
	{
		return saleVchId;
	}

	public void setSaleVchId(
					Integer saleVchId)
	{
		this.saleVchId = saleVchId;
	}	
}
