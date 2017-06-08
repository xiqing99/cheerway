package org.qixi.security.dao;

import java.util.List;
import java.util.Map;

import org.qixi.common.dao.IGenericDao;
import org.qixi.security.beans.VoucherMenu;


public interface VoucherMenuDao extends IGenericDao<VoucherMenu, Integer>
{
	public List<Map<String, Object>> getSubList(String modulName);
	
	public VoucherMenu getByName(String name);
}
