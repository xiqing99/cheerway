package org.qixi.common.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState.State;

public interface IBaseVoucherService<T>
{
	
	public List<Map<String, Object>> getDetailListByCreatedDateRange(
					Date startDate,
					Date endDate,
					Integer criteraId);
	public List<Map<String, Object>> getListByCreatedDateRange(
					Date startDate,
					Date endDate,
					Integer criteraId);	 

	public List<Map<String, Object>> getDetailListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId);
	
	public List<Map<String, Object>> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId);	 	
	
	public Result updateState(State newState, Integer voucherId, Integer operatorEmpId);
	public Result save(T entity, Integer operatorEmpId);
	public Result delById(Integer id, Integer operatorEmpId);
	public Map<String, Object> getById(Integer id);
	public List<Map<String, Object>> getMyInProgressVchList(Integer empId);
}
