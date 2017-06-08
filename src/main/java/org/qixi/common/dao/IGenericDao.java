package org.qixi.common.dao;

import java.io.Serializable;
import java.util.List;

import org.qixi.common.beans.ComboElem;

public interface IGenericDao<T, ID extends Serializable>
{
	public T get(ID id);
	
	public T load(ID id);
	
	public Integer save(T entity);
	
	public void update(T entity);
	
	public void delete(T entity);
	
	public List<T> getAll();
	
	public void deleteById(ID id);
	
	public List<ComboElem> getComboList();
	
	public List<T> getListByCriteriaId(String criteriaName, Integer criteraId);
}
