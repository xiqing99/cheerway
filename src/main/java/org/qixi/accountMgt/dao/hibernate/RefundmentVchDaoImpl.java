package org.qixi.accountMgt.dao.hibernate;


import org.qixi.accountMgt.beans.RefundmentVch;
import org.qixi.accountMgt.dao.RefundmentVchDao;
import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.security.beans.VchSeqSeed;

public class RefundmentVchDaoImpl extends BaseVoucherDAOImpl<RefundmentVch> implements
										RefundmentVchDao
{
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.RefundmentSeqNum);
	}	
	
}
