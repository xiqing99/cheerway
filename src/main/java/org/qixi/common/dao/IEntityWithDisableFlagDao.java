package org.qixi.common.dao;

import java.io.Serializable;
import java.util.List;

public interface IEntityWithDisableFlagDao<T, ID extends Serializable> extends IGenericDao<T, ID>
{
	
	public List<T> getAllDisabled();
	public void disableById(Integer id);
}
