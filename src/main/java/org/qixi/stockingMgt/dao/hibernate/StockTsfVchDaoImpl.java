package org.qixi.stockingMgt.dao.hibernate;


import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.security.beans.VchSeqSeed;
import org.qixi.stockingMgt.beans.StockTsfVch;
import org.qixi.stockingMgt.dao.StockTsfVchDao;

public class StockTsfVchDaoImpl extends BaseVoucherDAOImpl<StockTsfVch> implements StockTsfVchDao
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.StockTsfSeqNum);
	}	

}
