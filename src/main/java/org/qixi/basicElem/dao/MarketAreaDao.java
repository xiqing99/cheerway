package org.qixi.basicElem.dao;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.IBaseTreeNodeDao;

public interface MarketAreaDao extends IBaseTreeNodeDao<MarketArea>
{
	public List<Map<String, Object>> getCustListForReport(Integer areaId);
	public List<Customer> getCustList(Integer areaId);
	public List<ComboElem> getCustListCombo(Integer areaId);
}
