package org.qixi.basicElem.service;


import java.util.ArrayList;
import java.util.List;

import org.qixi.basicElem.beans.Store;
import org.qixi.basicElem.dao.StoreDao;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.service.GeneTreeNodeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

public class StoreService extends GeneTreeNodeServiceImpl<Store>
{
	
	@Autowired
	StoreDao storeDao;
	
	@Override
	public List<ComboElem> getListForCombo()
	{
		List<Store> list = storeDao.getAll();
		
		List<ComboElem> comboList = new ArrayList<>();
		
		for(Store store : list)
		{
			if(store.getSubNodesList() == null || store.getSubNodesList().size() == 0)
			{
				ComboElem combo = new ComboElem();
				combo.setId(store.getId());
				combo.setName(store.getName());
				
				comboList.add(combo);
			}	
		}
		
		return comboList;
		
	}	
}