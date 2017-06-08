package org.qixi.manuMgt.dao;


import org.qixi.common.dao.IEntityWithDisableFlagDao;
import org.qixi.manuMgt.beans.MtItem;

public interface MtItemDao extends IEntityWithDisableFlagDao<MtItem, Integer>
{
	public void disableById(Integer id);
}
