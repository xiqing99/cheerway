package org.qixi.stockingMgt.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.service.IGenericService;
import org.qixi.common.service.IReportService;

public interface ReportService extends IReportService
{
	public List<Map<String, Object>> getSingleMonthReport(Date startDate, Date endDate);
	public List<Map<String, Object>> getMultiMonthReport(Date startDate, Date endDate);
}
