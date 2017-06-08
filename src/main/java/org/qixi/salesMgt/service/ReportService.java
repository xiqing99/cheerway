package org.qixi.salesMgt.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.service.IReportService;

public interface ReportService extends IReportService
{
	public List<Map<String, Object>> getMonthReportByMarketArea(Integer marketAreaId, Date startDate, Date endDate);
	public List<Map<String, Object>> getMonthReportByRspEmp(Integer deptId, Date startDate, Date endDate);
	public List<Map<String, Object>> getMonthReportByProd(Date startDate, Date endDate);
	public List<Map<String, Object>> getMonthReportByProdModelNum(Date startDate, Date endDate);
}
