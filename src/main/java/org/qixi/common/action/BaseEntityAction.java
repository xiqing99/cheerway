package org.qixi.common.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.exception.ConstraintViolationException;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;

@SuppressWarnings("serial")
public abstract class BaseEntityAction<T> extends BaseAction
{
	protected IGenericService<T> service;
	
	protected T entity;
	protected List<ComboElem> comboList = new ArrayList<>();
	protected Integer id;


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
	
	public String loadAll()
	{
		list = service.getAll();
		
		return SUCCESS;
	}
	
	public String loadListForCombo()
	{
		comboList = service.getListForCombo();
		
		return SUCCESS;
	}
	
	public String save()
	{
		Result result = new Result();

		try
		{
			result = service.save(entity);
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("save.failure.constraintViolation");
		}		
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));
			
			if(result.dataMap != null)
			{
				resultMap.put("id", result.dataMap.get("id"));
			}
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, result.cause);
		}		

		return SUCCESS;
	}
	
	public String delete()
	{		
		Result result = new Result();
		
		try
		{
			result = service.delById(id);
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("delete.failure.constraintViolation");
		}
		if(result.success)
		{
			setActionResult(true,  getText("delete.success"));
		}else {
			setActionResult(false, result.cause);
		}
				
		return SUCCESS;		
	}			
	
	public IGenericService<T> getService()
	{
		return service;
	}
	public void setService(
					IGenericService<T> service)
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

	public List<ComboElem> getComboList()
	{
		return comboList;
	}

	public void setComboList(
					List<ComboElem> comboList)
	{
		this.comboList = comboList;
	}
	
}
