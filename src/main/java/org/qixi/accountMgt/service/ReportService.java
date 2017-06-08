package org.qixi.accountMgt.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.service.IReportService;

public interface ReportService extends IReportService
{
	public List<Map<String, Object>> getSalesReportByMarketArea(Integer marketAreaId, Date startDate, Date endDate);
	public List<Map<String, Object>> getOverdueReport(Date dueDate);
	public List<Map<String, Object>> getSalesReportForProd(Date startDate, Date endDate);
}
