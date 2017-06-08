package org.qixi.security.dao.hibernate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.security.beans.VoucherMenu;
import org.qixi.security.dao.VoucherMenuDao;


public class VoucherMenuDaoImpl extends GenericDAOImpl<VoucherMenu, Integer> implements VoucherMenuDao
{
	@Override
	public List<Map<String, Object>> getSubList(String modulName)
	{
		List<Map<String, Object>> maplist = new ArrayList<>();
		VoucherMenu menu = getByName(modulName);
		
		if(menu == null)
			return maplist;			
		
		for(VoucherMenu subMenu : menu.getSubMenuList())
		{
			loadTreeNode(subMenu, maplist);
		}
	
		return maplist;
	}
	
	@Override
	public VoucherMenu getByName(String name)
	{
		return (VoucherMenu)getCurrentSession().createQuery("from VoucherMenu o where o.name =?")
						.setParameter(0, name)
						.uniqueResult();
	}
	
	private void loadTreeNode(VoucherMenu entity, List<Map<String, Object>> list)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("text", entity.getName());
		map.put("loadUrl", entity.getLoadUrl());
		map.put("editUrl", entity.getEditUrl());
		map.put("qtip", entity.getTips());
		
		if(entity.getSubMenuList().size() == 0)
		{
			map.put("leaf", true);
			list.add(map);
			return;
		}else {
			List<Map<String, Object>> childrenList = new ArrayList<>();
			
			map.put("expanded", true);
			map.put("leaf", false);
			
			for(VoucherMenu subMenu : entity.getSubMenuList())
			{
				loadTreeNode(subMenu, childrenList);
			}
			
			map.put("Children", childrenList);
			list.add(map);
			
			return;
		}
	}	
	
}
