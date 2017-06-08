package org.qixi.basicElem.dao.hibernate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.dao.BaseTreeNodeDAOImpl;
import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.dao.MarketAreaDao;
import org.stringtemplate.v4.compiler.CodeGenerator.list_return;

public class MarketAreaDaoImpl extends BaseTreeNodeDAOImpl<MarketArea> implements MarketAreaDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> getCustListForReport(
					Integer areaId)
	{
		List<MarketArea> areaList = getSubList(areaId);
		
		List<Object[]> rstList = getCurrentSession().createQuery("select o.id, o.name, o.area.name, o.currency.name from Customer o "+
                                                        "where o.area in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", areaList)
						.list();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Object[] rst : rstList)
		{
			Map<String, Object> map = new HashMap<String, Object>();
			
			map.put("custId", rst[0]);
			map.put("custName", rst[1]);
			map.put("areaName", rst[2]);
			map.put("currencyName", rst[3]);
			
			mapList.add(map);
		}
		
		return mapList;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Customer> getCustList(
					Integer areaId)
	{
		List<MarketArea> areaList = getSubList(areaId);
		
		
		return (List<Customer>)getCurrentSession().createQuery("from Customer o where o.area in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", areaList)
						.list();
	}

	
	@SuppressWarnings("unchecked")
	@Override
	public List<ComboElem> getCustListCombo(
					Integer areaId)
	{
		List<MarketArea> areaList = getSubList(areaId);
		
		
		List<Object[]> list = getCurrentSession().createQuery("select o.id, o.name from Customer o where o.area in(:list) and (o.disabled = null or o.disabled = false) order by o.sortIndex")
						.setParameterList("list", areaList)
						.list();
		
		return comboRstCast(list);
	}
}
