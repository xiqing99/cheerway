package org.qixi.common.dao;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.VoucherState.State;;

public interface IBaseVoucherDao<T> extends IGenericDao<T, Integer>
{

	public Integer getNextSerialNum();
	public State getState(Integer id);
	public void updateState(State state, Integer id);
	
	public List<T> getInProgressListByEmpId(Integer empId);
	public Integer getInProgressNumByEmpId(Integer empId);
	public List<T> getListByAuditEmpId(Integer empId);
	public List<T> getListByCreatedDateRange(Date startDate, Date endDate);
	public List<T> getListByCreatedDateRangeAndCriteriaId(Date startDate, Date endDate, String criteriaName, Integer criteraId);
	public List<T> getListByCreatedDateAndEmpId(Date startDate, Date endDate, Integer empId);
	public Map<Integer, Double> getProdIdQtySumMap(Date startDate, Date endDate);
	public Map<String, Double> getProdModelNumQtySumMap(Date startDate, Date endDate);
}
