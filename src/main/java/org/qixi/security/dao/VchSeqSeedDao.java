package org.qixi.security.dao;


import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.VchSeqSeed;


public interface VchSeqSeedDao extends IGenericDao<VchSeqSeed, Integer>
{
	public void setSeqValue(String seqName, Integer value);
	public Integer getSeqCurValue(String seqName);
	
}
