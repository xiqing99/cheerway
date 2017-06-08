package org.qixi.basicElem.dao;


import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Currency;
import org.qixi.basicElem.beans.Customer;
import org.qixi.common.dao.IEntityWithDisableFlagDao;


public interface CustomerDao extends IEntityWithDisableFlagDao<Customer, Integer>
{
	public Currency getCurrency(Integer custId);
	public Map<String, Object> getDepositInfo(Integer custId);
	public void updateDepositAmount(Integer custId, Double amount);
	public List<Map<String, Object>> getListWithDeposit();
}
