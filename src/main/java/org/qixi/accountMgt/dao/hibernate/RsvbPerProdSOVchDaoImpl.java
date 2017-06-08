package org.qixi.accountMgt.dao.hibernate;

import java.sql.Date;
import java.util.List;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.accountMgt.dao.RsvbPerProdSOVchDao;

public class RsvbPerProdSOVchDaoImpl extends BaseFundVchDaoImpl<RsvbPerProdSOVch> implements
													RsvbPerProdSOVchDao
{
	@Override
	public void receive(RsvbPerProdSOVch voucher,
					Double value)
	{
		java.util.Date date = null;
		Double remainedAmount = voucher.getRemainedAmount() - value;
		
		if(remainedAmount == 0)
		{
			date = new java.util.Date(System.currentTimeMillis());
			
		}
		
		getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.remainedAmount=:amount, o.paidOffDate=:date where o.id=:id")
							.setParameter("date", date)
							.setParameter("amount", remainedAmount)
							.setParameter("id", voucher.getId())
							.executeUpdate();	
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RsvbPerProdSOVch> getListBySaleVchId(
					Integer saleVchId)
	{
		List<RsvbPerProdSOVch> rsvbList = getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where  o.stOutVch.saleVch.id = :id and o.remainedAmount != 0")
						.setParameter("id", saleVchId)
						.list();
		return rsvbList;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RsvbPerProdSOVch> getInProgressListByEmpId(
					Integer empId)
	{
		List<RsvbPerProdSOVch> list = getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where (o.accountEmp.id = :empId or o.stOutVch.saleVch.rspEmp.id = :empId) and o.remainedAmount != 0 ")
						.setParameter("empId", empId)
						.list();
		
		return list;
	}	

	@SuppressWarnings("unchecked")
	@Override
	public List<RsvbPerProdSOVch> getMyListByCreatedDateAndEmpId(Date startDate,Date endDate, Integer empId)
	{
		List<RsvbPerProdSOVch> list = getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.accountEmp.id = :id or o.stOutVch.saleVch.rspEmp.id = :id) and " +
						" (o.createdDate between :startDate and :endDate) order by o.createdDate desc")
						.setParameter("id", empId)
						.setDate("startDate", startDate)
						.setDate("endDate", endDate)
						.list();
		return list;
	}		
}
