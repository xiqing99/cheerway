package org.qixi.accountMgt.action;

import org.qixi.accountMgt.service.ReportService;
import org.qixi.common.action.BaseReportAction;



public class ReportAction extends BaseReportAction
{
	private static final long serialVersionUID = -5642751095304260760L;

	
	public String loadSaleReportByMarketArea()
	{
		list = ((ReportService)service).getSalesReportByMarketArea(criteraId, startDate, endDate);
		
		return SUCCESS;		
	}

	public String loadOverdueReport()
	{
		list = ((ReportService)service).getOverdueReport(endDate);
		
		return SUCCESS;
	}
	
	public String loadSaleReportPerProd()
	{
		list = ((ReportService)service).getSalesReportForProd(startDate, endDate);
		
		return SUCCESS;		
	}	
}
