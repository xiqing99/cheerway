package org.qixi.security.dao;

import java.util.List;
import java.util.Map;

import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.ReportMenu;


public interface ReportMenuDao extends IGenericDao<ReportMenu, Integer>
{
	public List<Map<String, Object>> getSubList(String modulName);
	
	public ReportMenu getByName(String name);
}
