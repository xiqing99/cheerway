package org.qixi.common.service;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;

public interface IGenericService<T>
{
	public Map<String, Object> getById(Integer id);
	public Result save(T entity);
	public Result delById(Integer id);
	public List<Map<String, Object>> getAll();
	public List<ComboElem> getListForCombo();	
}
