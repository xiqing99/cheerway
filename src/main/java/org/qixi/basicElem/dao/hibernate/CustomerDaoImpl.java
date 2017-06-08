package org.qixi.basicElem.dao.hibernate;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.qixi.basicElem.beans.Currency;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.dao.CustomerDao;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;


public class CustomerDaoImpl extends EntityWithDisableFlagDAOImpl<Customer, Integer> implements CustomerDao
{

	@Override
	public Currency getCurrency(
					Integer custId)
	{
		
		return (Currency)getCurrentSession().createQuery("select o.currency from " +entityClass.getName() + " o where o.id =?")
						.setParameter(0, custId)
						.uniqueResult();
	}

	@Override
	public void updateDepositAmount(
					Integer custId,
					Double amount)
	{
		Query query = getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.depositAmount = :newValue where o.id = :id")
						.setParameter("newValue", amount)
						.setParameter("id", custId);
		
		query.executeUpdate();
		
	}

	@Override
	public Map<String, Object> getDepositInfo(
					Integer custId)
	{
		Object[] objects = (Object[]) getCurrentSession().createQuery("select o.currency.name, o.depositAmount from " +entityClass.getName() + " o where o.id =?")
						.setParameter(0, custId)
						.uniqueResult();
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("currencyName", objects[0]);
		map.put("depositAmount", objects[1]);
		
		return map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> getListWithDeposit()
	{
		List<Object[]> list =  getCurrentSession().createQuery("select o.name, o.currency.name, o.depositAmount from " + entityClass.getName() 
						+ " o where o.depositAmount != 0")
						.list();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Object[] info : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("custName", info[0]);
			map.put("currencyName", info[1]);
			map.put("depositAmount", info[2]);
			
			mapList.add(map);
		}
		
		return mapList;
	}		
	
}
