package org.qixi.stockingMgt.action;

import org.qixi.common.action.BaseReportAction;
import org.qixi.stockingMgt.service.ReportService;


public class ReportAction extends BaseReportAction
{

	/**
	 * 
	 */
	private static final long serialVersionUID = -5642751095304260760L;

	public String loadStockReportSingleMonth()
	{
		list = ((ReportService)service).getSingleMonthReport(startDate, endDate);
		
		return SUCCESS;
	}
	
	public String loadStockReportMultiMonth()
	{
		list = ((ReportService)service).getMultiMonthReport(startDate, endDate);
		
		return SUCCESS;		
	}

}
