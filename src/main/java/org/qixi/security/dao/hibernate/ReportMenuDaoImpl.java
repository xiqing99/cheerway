package org.qixi.security.dao.hibernate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.ReportMenu;
import org.qixi.security.dao.ReportMenuDao;


public class ReportMenuDaoImpl extends GenericDAOImpl<ReportMenu, Integer> implements ReportMenuDao
{
	@Override
	public List<Map<String, Object>> getSubList(String modulName)
	{
		List<Map<String, Object>> maplist = new ArrayList<>();
		ReportMenu menu = getByName(modulName);
		
		if(menu == null)
			return maplist;			
		
		for(ReportMenu subMenu : menu.getSubMenuList())
		{
			loadTreeNode(subMenu, maplist);
		}
	
		return maplist;
	}
	
	@Override
	public ReportMenu getByName(String name)
	{
		return (ReportMenu)getCurrentSession().createQuery("from ReportMenu o where o.name =?")
						.setParameter(0, name)
						.uniqueResult();
		
	}
	
	private void loadTreeNode(ReportMenu entity, List<Map<String, Object>> list)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("text", entity.getName());
		map.put("id", entity.getUrl());
		map.put("qtip", entity.getTips());
		
		if(entity.getSubMenuList().size() == 0)
		{
			map.put("leaf", true);
			list.add(map);
			return;
		}else {
			List<Map<String, Object>> childrenList = new ArrayList<>();
			
			map.put("expanded", true);
			
			for(ReportMenu subMenu : entity.getSubMenuList())
			{
				loadTreeNode(subMenu, childrenList);
			}
			
			map.put("Children", childrenList);
			list.add(map);
			
			return;
		}
	}	
	
}
