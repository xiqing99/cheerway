package org.qixi.common.dao;

import java.util.List;


public interface IBaseTreeNodeDao<T> extends IGenericDao<T, Integer>
{
	public List<T> getSubList(Integer id);
	public List<T> getSonList(Integer id);

}
