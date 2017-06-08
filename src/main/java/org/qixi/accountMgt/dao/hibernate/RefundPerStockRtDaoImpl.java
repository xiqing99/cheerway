package org.qixi.accountMgt.dao.hibernate;

import java.sql.Date;
import java.util.List;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.dao.RefundPerStockRtDao;

public class RefundPerStockRtDaoImpl extends BaseFundVchDaoImpl<RefundPerStockRt> implements
											RefundPerStockRtDao
{
	@Override
	public void pay(Integer id)
	{
		java.util.Date date = null;

		date = new java.util.Date(System.currentTimeMillis());
		
		getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.remainedAmount = 0, o.paidOffDate=:date where o.id=:id")
							.setParameter("date", date)
							.setParameter("id", id)
							.executeUpdate();	
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RefundPerStockRt> getListBySaleVchId(
					Integer saleVchId)
	{
		List<RefundPerStockRt> list = getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where  o.returnVch.saleVch.id = :id and o.remainedAmount != 0")
						.setParameter("id", saleVchId)
						.list();
		return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RefundPerStockRt> getMyListByCreatedDateAndEmpId(Date startDate,Date endDate, Integer empId)
	{
		List<RefundPerStockRt> list = getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.accountEmp.id = :id or o.returnVch.saleVch.rspEmp.id = :id) and " +
						" (o.createdDate between :startDate and :endDate) order by o.createdDate desc")
						.setParameter("id", empId)
						.setDate("startDate", startDate)
						.setDate("endDate", endDate)						
						.list();
		return list;
	}	
	
}
