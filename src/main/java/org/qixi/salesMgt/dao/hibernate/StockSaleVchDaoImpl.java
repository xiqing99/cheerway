package org.qixi.salesMgt.dao.hibernate;


import org.qixi.salesMgt.beans.StockSaleVch;
import org.qixi.salesMgt.dao.StockSaleVchDao;
import org.qixi.security.beans.VchSeqSeed;

public class StockSaleVchDaoImpl extends GSaleVchDaoImpl<StockSaleVch> implements StockSaleVchDao
{

	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.StockSaleSeqNum);
	}	

}
