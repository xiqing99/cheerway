package org.qixi.security.dao.hibernate;


import java.math.BigInteger;

import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.VchSeqSeed;
import org.qixi.security.dao.VchSeqSeedDao;


public class VchSeqSeedDaoImpl extends GenericDAOImpl<VchSeqSeed, Integer> implements VchSeqSeedDao
{

	@Override
	public void setSeqValue(
					String seqName,
					Integer value)
	{
		getCurrentSession().createSQLQuery("alter sequence " + seqName + " restart with " + value).executeUpdate();
		
	}

	@Override
	public Integer getSeqCurValue(
					String seqName)
	{
		BigInteger nextVal = (BigInteger)getCurrentSession().createSQLQuery("select last_value from " + seqName).uniqueResult();
		return nextVal.intValue();
	}


}
