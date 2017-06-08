package org.qixi.accountMgt.dao.hibernate;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.dao.BaseFundVchDao;
import org.qixi.common.dao.GenericDAOImpl;

public abstract class BaseFundVchDaoImpl<T> extends GenericDAOImpl<T, Integer> implements
													BaseFundVchDao<T>
{

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getListByCreatedDateRange(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<T>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where o.createdDate between :startDate and :endDate order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.list();
	}	

	@Override
	public Map<Integer, Double> getCustAmountSumMap(Date startDate, Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.partner.id, sum(o.totalAmount) from " + entityClass.getName() +
						" o  where o.createdDate between :startDate and :endDate group by o.partner.id")
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
	public Map<Integer, Double> getCustOverDueAmountSumMap(
					Date dueDate)
	{
		java.util.Date date = new Date(dueDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.partner.id, sum(o.remainedAmount) from " + entityClass.getName() +
						" o  where o.deadlineDate <= :date and o.remainedAmount != 0 group by o.partner.id")
						.setDate("date", date)
						.list();
		
		Map<Integer, Double> map = new HashMap<>();
		for(Object[] object : list)
		{
			map.put((Integer)object[0], (Double)object[1]);
		}
		
		return map;
	}	

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getOverdueList(Date dueDate)
	{		
		return (List<T>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where o.deadlineDate <= :date and o.remainedAmount != 0 order by o.createdDate desc")
						.setDate("date", dueDate)
						.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getListBySaleVchId(
					Integer saleVchId)
	{
		List<T> rsvbList = getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where  o.stOutVch.saleVch.id = :id and o.remainedAmount != 0")
						.setParameter("id", saleVchId)
						.list();
		return rsvbList;
	}

	@Override
	public Map<Integer, Double> getCustAmountSumInCnMap(
					Date startDate,
					Date endDate)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select o.partner.id, sum(o.totalAmount * o.exchangeRate) from " + entityClass.getName() +
						" o  where o.createdDate between :startDate and :endDate group by o.partner.id")
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

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getInProgressListByEmpId(
					Integer empId)
	{
		List<T> list = getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where o.accountEmp.id = :empId and o.remainedAmount != 0 ")
						.setParameter("empId", empId)
						.list();
		
		return list;
	}	
}
