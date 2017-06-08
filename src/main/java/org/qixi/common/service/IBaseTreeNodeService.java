package org.qixi.common.service;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;


public interface IBaseTreeNodeService<T> extends IGenericService<T>
{
	public List<Map<String, Object>> getTree(Integer rootId);	 
	public List<ComboElem> getListForCombo(Integer rootId);
	
}
