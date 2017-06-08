package org.qixi.salesMgt.action;


import org.qixi.common.action.BaseReportAction;
import org.qixi.salesMgt.service.ReportService;


public class OrderSaleReportAction extends BaseReportAction
{
	private static final long serialVersionUID = -5642751095304260760L;
	
	public String loadReportByMarketArea()
	{
		list = ((ReportService)service).getMonthReportByMarketArea(criteraId, startDate, endDate);
		
		return SUCCESS;		
	}
	
	public String loadReportByRspEmp()
	{
		list = ((ReportService)service).getMonthReportByRspEmp(criteraId, startDate, endDate);
		return SUCCESS;
	}

	public String loadReportByProdModelNum()
	{
		list = ((ReportService)service).getMonthReportByProdModelNum(startDate, endDate);
		return SUCCESS;
	}
	
	public String loadReportByProd()
	{
		list = ((ReportService)service).getMonthReportByProd(startDate, endDate);
		return SUCCESS;
	}	
}
