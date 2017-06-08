package org.qixi.accountMgt.dao;


import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.dao.IGenericDao;

public interface BaseFundVchDao<T> extends IGenericDao<T, Integer>
{
	public List<T> getListByCreatedDateRange(Date startDate,Date endDate);
	public Map<Integer, Double> getCustAmountSumMap(Date startDate, Date endDate);
	public Map<Integer, Double> getCustAmountSumInCnMap(Date startDate, Date endDate);
	public Map<Integer, Double> getCustOverDueAmountSumMap(Date dueDate);
	public List<T> getOverdueList(Date dueDate);
	public List<T> getListBySaleVchId(Integer saleVchId);
	public List<T> getInProgressListByEmpId(Integer empId);
	public List<T> getMyListByCreatedDateAndEmpId(Date startDate,Date endDate, Integer empId);
}
