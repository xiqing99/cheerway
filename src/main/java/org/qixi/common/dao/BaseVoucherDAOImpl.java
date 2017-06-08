package org.qixi.common.dao;

import java.math.BigInteger;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.qixi.common.beans.VoucherState.State;


public  class BaseVoucherDAOImpl<T> extends GenericDAOImpl<T, Integer> implements IBaseVoucherDao<T>
{

	protected static String VchRptCriteraStr = " (o.approvedTime between :startDate and :endDate) and (o.state = 'AUDITED' or o.state = 'COMPLETED') ";
	
	@Override
	public Integer getNextSerialNum()
	{
		return null;
	}
	
	protected Integer getNextSerialNumByName(String seqName)
	{
		BigInteger nextVal = (BigInteger)getCurrentSession().createSQLQuery("select nextval('" + seqName + "')").uniqueResult();
		return nextVal.intValue();		
	}

/*	@Override
	public Integer getSerialNum()
	{
		return null;
	}	

	public Integer getSerialNumByName(String seqName)
	{
		BigInteger nextVal = (BigInteger)getCurrentSession().createSQLQuery("select last_value from " + seqName).uniqueResult();
		return nextVal.intValue();
	}	*/		

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
	public void updateState(
					State state,
					Integer id)
	{
		Query query = null;
		
		if(state == State.AUDITED)
		{
			java.util.Date date = new java.util.Date(System.currentTimeMillis());
			query = getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.state= :state, o.approvedTime= :time where o.id = :id")
							.setParameter("state", state)
							.setParameter("time", date)
							.setParameter("id", id);
		}else {
			
			query = getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.state= :state where o.id = :id")
							.setParameter("state", state)
							.setParameter("id", id);
		}
		
		query.executeUpdate();
		
	}

	@Override
	public State getState(Integer id)
	{
		return (State)getCurrentSession().createQuery("select o.state from " + entityClass.getName() + " o where o.id == ?")
		.setInteger(0, id).uniqueResult();		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getListByCreatedDateRangeAndCriteriaId(
					Date startDate,
					Date endDate,
					String criteriaName,
					Integer criteraId)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<T>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where o.createdDate between :startDate and :endDate and o." + criteriaName 
						+".id =:id order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.setInteger("id", criteraId)
						.list();
	}

	@Override
	public Map<Integer, Double> getProdIdQtySumMap(
					Date startDate,
					Date endDate)
	{
		Map<Integer, Double> map = new HashMap<>();
		
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.mtItem.product.id, sum(item.quantity)from " + entityClass.getName() +
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
	public Map<String, Double> getProdModelNumQtySumMap(
					Date startDate,
					Date endDate)
	{
		Map<String, Double> map = new HashMap<>();
		
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.mtItem.product.modelNum, sum(item.quantity)from " + entityClass.getName() +
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
	
	@SuppressWarnings("unchecked")
	@Override
	public List<T> getInProgressListByEmpId(Integer empId)
	{
		List<T> list = getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where (o.rspEmp.id = :empId or o.auditEmp.id = :empId) and o.state = 'PROPOSED' ")
						.setParameter("empId", empId)
						.list();
		
		return list;
	}

	@Override
	public Integer getInProgressNumByEmpId(Integer empId)
	{
		return (Integer)getCurrentSession().createQuery("select count(o) from " + entityClass.getName() + 
						" o where (o.rspEmp.id = :empId or o.auditEmp.id = :empId) and o.state = 'PROPOSED' ")
						.setParameter("empId", empId)
						.uniqueResult();
	}
	
	@Override
	public List<T> getListByAuditEmpId(
					Integer empId)
	{
		// TODO Auto-generated method stub
		return null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<T>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.createdDate between :startDate and :endDate) and " + 
						" (o.rspEmp.id = :empId or o.auditEmp.id = :empId) order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.setInteger("empId", empId)
						.list();
	}

}
