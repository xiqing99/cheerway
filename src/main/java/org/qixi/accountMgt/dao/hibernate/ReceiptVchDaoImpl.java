package org.qixi.accountMgt.dao.hibernate;


import org.qixi.accountMgt.beans.ReceiptVch;
import org.qixi.accountMgt.dao.ReceiptVchDao;
import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.security.beans.VchSeqSeed;

public class ReceiptVchDaoImpl extends BaseVoucherDAOImpl<ReceiptVch> implements
										ReceiptVchDao
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.ReceiptSeqNum);
	}	
	
}
