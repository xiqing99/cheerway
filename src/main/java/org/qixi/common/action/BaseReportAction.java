package org.qixi.common.action;



import java.sql.Date;
import org.qixi.common.service.IReportService;

public abstract class BaseReportAction extends BaseAction
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;

	protected IReportService service;

	protected Date startDate;
	protected Date endDate;
	protected Integer criteraId;
	
	public String loadReportMenu()
	{
		list = service.getMenuList();
		
		return SUCCESS;
	}

	public IReportService getService()
	{
		return service;
	}

	public void setService(
					IReportService service)
	{
		this.service = service;
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


	public Integer getCriteraId()
	{
		return criteraId;
	}


	public void setCriteraId(
					Integer criteraId)
	{
		this.criteraId = criteraId;
	}	

}
