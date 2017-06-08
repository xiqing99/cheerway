package org.qixi.accountMgt.dao.hibernate;



import org.qixi.accountMgt.beans.DepositVch;
import org.qixi.accountMgt.dao.DepositVchDao;
import org.qixi.common.dao.BaseVoucherDAOImpl;
import org.qixi.security.beans.VchSeqSeed;

public class DepositVchDaoImpl extends BaseVoucherDAOImpl<DepositVch> implements
										DepositVchDao
{
	
	@Override
	public Integer getNextSerialNum()
	{
		return getNextSerialNumByName(VchSeqSeed.DepositeSeqNum);
	}	

}
