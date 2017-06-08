package org.qixi.stockingMgt.dao.hibernate;


import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.security.beans.VchSeqSeed;
import org.qixi.stockingMgt.beans.StockTakenVch;
import org.qixi.stockingMgt.dao.StockTakenVchDao;

public class StockTakenVchDaoImpl extends BaseVoucherDAOImpl<StockTakenVch> implements StockTakenVchDao
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.StockTakenSeqNum);
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
		List<Object[]> list = getCurrentSession().createQuery("select mtItem.product.id, sum(item.diffQuantity) from " 
						+ entityClass.getName() +
						" o join o.items item join item.inventory.mtItem mtItem where o.approvedTime between :startDate and :endDate and mtItem.class = ProdMtItem group by mtItem.product.id")
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
