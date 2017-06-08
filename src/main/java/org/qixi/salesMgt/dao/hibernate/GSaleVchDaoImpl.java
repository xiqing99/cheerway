package org.qixi.salesMgt.dao.hibernate;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.salesMgt.dao.IGSaleVchDao;

public abstract class GSaleVchDaoImpl<T> extends BaseVoucherDAOImpl<T> implements IGSaleVchDao<T>
{		
	@SuppressWarnings("unchecked")
	@Override
	public List<ComboElem> getComboListByState(
					VoucherState.State state)
	{
		List<Object[]> list = getCurrentSession().createQuery("select  o.id, o.sequenceNum from " + entityClass.getName() + 
						" o where o.state =?")
						.setParameter(0, state)
						.list();			
		
		return comboRstCast(list);	
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ComboElem> getComboListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		Query query = null;
		
		if(state == State.ALL)
		{
			query = getCurrentSession().createQuery("select o.id, o.sequenceNum from " + entityClass.getName() + 
							" o where o.customer.id = ?")
							.setParameter(0, custId);
		}else {
			query = getCurrentSession().createQuery("select o.id, o.sequenceNum from " + entityClass.getName() + 
							" o where o.state =? and o.customer.id = ?")
							.setParameter(0, state)
							.setParameter(1, custId);
		}
		
		List<Object[]> list = query.list();
		
		return comboRstCast(list);	
	}


	@SuppressWarnings("unchecked")
	@Override
	public List<T> getListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		// TODO Auto-generated method stub
		return (List<T>)getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where o.state =? and o.customer.id = ?")
						.setParameter(0, state)
						.setParameter(1, custId)
						.list();
	}

	@Override
	public Map<Integer, Double> getTotalPriceSumMapByCust(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.customer.id, sum(o.totalPrice) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.customer.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}

	@Override
	public Map<Integer, Double> getCtnNumSumMapByCust(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.customer.id, sum(o.containerNum) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.customer.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}	
	
	@Override
	public Map<Integer, Double> getTotalPriceInCnSumMapByCust(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.customer.id, sum(o.totalPrice * o.exchangeRate) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.customer.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}	

	@Override
	public Map<Integer, Double> getTotalProfitInCnSumMapByCust(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.customer.id, sum(o.totalExtraProfit * o.exchangeRate) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.customer.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}	
	
	@Override
	public Map<Integer, Double> getTotalPriceInCnSumMapByRspEmp(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.rspEmp.id, sum(o.totalPrice * o.exchangeRate) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.rspEmp.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}

	@Override
	public Map<Integer, Double> getTotalProfitInCnSumMapByRspEmp(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.rspEmp.id, sum(o.totalExtraProfit * o.exchangeRate) from " + entityClass.getName() +
						" o  where" + VchRptCriteraStr + "group by o.rspEmp.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}	
	
	@Override
	public Map<String, Double> getProdModelNumPriceSumMap(
					Date startDate,
					Date endDate)
	{
		Map<String, Double> map = new HashMap<>();
		
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.mtItem.product.modelNum, sum(item.quantity*item.unitPrice*o.exchangeRate)from " + entityClass.getName() +
						" o join o.items item where " + VchRptCriteraStr + "group by item.mtItem.product.modelNum")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();

		for(Object[] object : list)
		{
			
			map.put((String)object[0], (Double)object[1]);

		}
		
		return map;
	}	

	@Override
	public Map<Integer, Double> getProdIdPriceSumMap(
					Date startDate,
					Date endDate)
	{
		Map<Integer, Double> map = new HashMap<>();
		
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.mtItem.product.id, sum(item.quantity*item.unitPrice*o.exchangeRate)from " + entityClass.getName() +
						" o join o.items item where " + VchRptCriteraStr + "group by item.mtItem.product.id")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();

		for(Object[] object : list)
		{
			
			map.put((Integer)object[0], (Double)object[1]);

		}
		
		return map;
	}	
	
	@Override
	public void completeVoucher(
					Integer voucherId)
	{
		// TODO Auto-generated method stub
		
	}	
		
	@Override
	public void updateDepositAmount(Integer id, Double newValue)
	{
		Query query = getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.depositAmount = :newValue where o.id = :id")
						.setParameter("newValue", newValue)
						.setParameter("id", id);
		
		query.executeUpdate();
	}	
	
	@Override
	public Double getDepositValue(Integer voucherId)
	{
		
		return (Double)getCurrentSession().createQuery("select o.depositAmount from " + entityClass.getName() +" o where o.id = :id")
						.setParameter("id", voucherId)
						.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> getListWithDeposit()
	{
		List<Object[]> list =  getCurrentSession().createQuery("select o.sequenceNum, o.customer.name, o.customer.currency.name, o.depositAmount from " + entityClass.getName() 
						+ " o where o.state = 'AUDITED' and o.depositAmount != 0")
						.list();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Object[] info : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("vchSeqNum", info[0]);
			map.put("custName", info[1]);
			map.put("currencyName", info[2]);
			map.put("depositAmount", info[3]);
			
			mapList.add(map);
		}
		
		return mapList;
	}		
	
	@Override
	public Map<String, Object> getCustInfo(Integer id)
	{
		Object[] objects =  (Object[]) getCurrentSession().createQuery("select o.customer.fullName, o.customer.currency.name from " 
						+ entityClass.getName() + " o where o.id = :id")
						.setParameter("id", id)
						.uniqueResult();
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("custName", objects[0]);
		map.put("currencyName", objects[1]);
		
		return map;
	}
	
}
