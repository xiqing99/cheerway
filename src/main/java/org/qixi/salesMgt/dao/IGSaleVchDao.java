package org.qixi.salesMgt.dao;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.dao.IBaseVoucherDao;

public interface IGSaleVchDao<T> extends IBaseVoucherDao<T>
{
	public List<ComboElem> getComboListByState(VoucherState.State state);
	public List<ComboElem> getComboListByCustAndState(Integer custId, VoucherState.State state);
	public List<T> getListByCustAndState(Integer custId, VoucherState.State state);
	public void  completeVoucher(Integer voucherId);
	public Double getDepositValue(Integer voucherId);
	public Map<Integer, Double> getCtnNumSumMapByCust(Date startDate, Date endDate);
	public Map<Integer, Double> getTotalPriceSumMapByCust(Date startDate, Date endDate);
	public Map<Integer, Double> getTotalPriceInCnSumMapByCust(Date startDate, Date endDate);
	public Map<Integer, Double> getTotalProfitInCnSumMapByCust(Date startDate, Date endDate);
	public Map<Integer, Double> getTotalPriceInCnSumMapByRspEmp(Date startDate, Date endDate);
	public Map<Integer, Double> getTotalProfitInCnSumMapByRspEmp(Date startDate, Date endDate);
	public Map<Integer, Double> getProdIdPriceSumMap(Date startDate, Date endDate);
	public Map<String, Double> getProdModelNumPriceSumMap(Date startDate, Date endDate);
	public void updateDepositAmount(Integer id, Double newValue);
	public List<Map<String, Object>> getListWithDeposit();
	public Map<String, Object> getCustInfo(Integer id);
}
