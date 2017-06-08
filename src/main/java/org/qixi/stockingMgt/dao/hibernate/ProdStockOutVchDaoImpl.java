package org.qixi.stockingMgt.dao.hibernate;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.security.beans.VchSeqSeed;
import org.qixi.stockingMgt.beans.ProdStockOutVch;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;


public class ProdStockOutVchDaoImpl extends BaseVoucherDAOImpl<ProdStockOutVch> implements ProdStockOutVchDao 
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.ProdStockOutSeqNum);
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
	public List<ProdStockOutVch> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		java.util.Date stDate = new Date(startDate.getTime());
		java.util.Date edDate = new Date(endDate.getTime());
		
		return (List<ProdStockOutVch>) getCurrentSession().createQuery("from " + entityClass.getName() +
						" o where (o.createdDate between :startDate and :endDate) and " + 
						" ((o.rspEmp.id = :empId or o.auditEmp.id = :empId) or (o.saleVch.rspEmp.id = :empId)) order by o.createdDate desc")
						.setDate("startDate", stDate)
						.setDate("endDate", edDate)
						.setInteger("empId", empId)
						.list();
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
		List<Object[]> list = getCurrentSession().createQuery("select item.mtItem.product.id, sum(item.quantity * item.unitPrice * o.saleVch.exchangeRate)from " + entityClass.getName() +
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
}
