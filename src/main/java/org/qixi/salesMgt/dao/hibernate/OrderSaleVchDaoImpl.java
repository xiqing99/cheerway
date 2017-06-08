package org.qixi.salesMgt.dao.hibernate;


import java.sql.Date;
import java.util.List;

import org.qixi.salesMgt.beans.OrderSaleVch;
import org.qixi.salesMgt.dao.OrderSaleVchDao;
import org.qixi.security.beans.VchSeqSeed;

public class OrderSaleVchDaoImpl extends GSaleVchDaoImpl<OrderSaleVch> implements OrderSaleVchDao
{

	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.OrderSaleSeqNum);
	}	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<OrderSaleVch> getInProgressListByEmpId(Integer empId)
	{
		List<OrderSaleVch> list = getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where ((o.rspEmp.id = :empId or o.merchandiser.id = :empId) and (o.state != 'COMPLETED' and o.state != 'CANCELLED')) " + " or " +
						      "(o.auditEmp.id = :empId and o.state = 'FL_AUDITED')" + " or " +
						      "(o.firstLevelAuditEmp.id = :empId and o.state = 'PROPOSED')")
						.setParameter("empId", empId)
						.list();
		
		return list;
	}	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<OrderSaleVch> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<OrderSaleVch>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.createdDate between :startDate and :endDate) and " + 
						" (o.rspEmp.id = :empId or o.auditEmp.id = :empId or o.merchandiser.id = :empId) order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.setInteger("empId", empId)
						.list();
	}	
}
