package org.qixi.accountMgt.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.Result;

public interface BaseFundVchService<T> 
{
	public List<Map<String, Object>>  getListBySaleVchId(Integer saleVchId);
	public List<Map<String, Object>> getListByCreatedDateRange(Date startDate, Date endDate);
	public List<Map<String, Object>> getListByCreatedDateAndEmpId(Date startDate, Date endDate, Integer empId);
	public List<Map<String, Object>> getOverdueList(Date dueDate);
	public List<Map<String, Object>> getMyInProgressVchList(Integer empId);
	public Result save(T entity, Integer empId);
	public Map<String, Object> getById(Integer id);
}
