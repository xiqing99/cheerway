package org.qixi.stockingMgt.dao.hibernate;

import java.sql.Date;
import java.util.List;

import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.security.beans.VchSeqSeed;
import org.qixi.stockingMgt.beans.ProdStockReturnVch;
import org.qixi.stockingMgt.dao.ProdStockReturnVchDao;


public class ProdStockReturnVchDaoImpl extends BaseVoucherDAOImpl<ProdStockReturnVch> implements ProdStockReturnVchDao 
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.ProdStockRtSeqNum);
	}		
	
	@Override
	public Double getQtyBySaleVchItem(SaleVchItem orderItem)
	{
		
		Double quantity =   (Double)getCurrentSession().createQuery("select sum(item.quantity) from " + entityClass.getName() +
						" voucher join voucher.items item where voucher.state = 'AUDITED' and voucher.saleVch.id = :orderId and item.mtItem.id = :mtItemId")
						.setParameter("orderId", orderItem.getOwnerVoucher().getId())
						.setParameter("mtItemId", orderItem.getMtItem().getId())
						.uniqueResult();
		
		if(quantity == null)
			return 0.0;
		
		return quantity;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ProdStockReturnVch> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<ProdStockReturnVch>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.createdDate between :startDate and :endDate) and " + 
						" ((o.rspEmp.id = :empId or o.auditEmp.id = :empId) or (o.saleVch.rspEmp.id = :empId )) order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.setInteger("empId", empId)
						.list();
	}	
}
