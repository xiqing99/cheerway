package org.qixi.manuMgt.service.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.manuMgt.dao.ProdMtItemDao;
import org.qixi.manuMgt.service.SlbProdMtItemService;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.springframework.beans.factory.annotation.Autowired;

public class SlbProdMtItemServiceImpl implements SlbProdMtItemService
{
	@Autowired 
	ProdMtItemDao dao;
	
	@Autowired
	InventoryDao inventorydao;
		

	@Override
	public List<Map<String, Object>> getListByCtg(Integer ctgId)
	{		
		List<ProdMtItem> list = dao.getSaleableListByProdCtg(ctgId);
		
		return buildMapList(list);
	}
	
	private List<Map<String, Object>> buildMapList(List<ProdMtItem> list)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		Map<Integer, Double> invtMap = inventorydao.getProdMtItemIdQtyMap();
		
		for(ProdMtItem item : list)
		{
			Map<String, Object> map = new HashMap<String, Object>();

			map.put("mtItemId", item.getId());
			map.put("mtNum", item.getMaterialNum());
			map.put("mtName", item.getName());
			map.put("unit", item.getUnit().getName());
			map.put("stdUnitPrice", item.getStdUnitPrice());
			map.put("mtDscp", item.getDescription());
			
			Product product = item.getProduct();
			
			map.put("subModelNum", product.getSubModelNum());
			map.put("modelNum", product.getModelNum());
			map.put("ctgName", product.getCategory().getName());
				
			map.put("custModelNum", item.getCustModelNum());		
			map.put("orderSeqNum", item.getOrderSeqNum());
			map.put("colorModel", item.getColorModel());
			map.put("packageModel", item.getPackageModel());
			map.put("saleable", item.isSaleable());
			
			if(invtMap.get(item.getId()) != null)
			{
				map.put("qtyInStore", invtMap.get(item.getId()));
			}
			
			mapList.add(map);
		}
		
		return mapList;
	}

	@Override
	public Result updSaleInfo(
					Integer id,
					boolean saleable,
					Double stdUnitPrice)
	{
		dao.updSaleableInfo(id, saleable, stdUnitPrice);
		
		return new Result();
	}

	@Override
	public List<Map<String, Object>> getUnsaleableList()
	{
		List<ProdMtItem> list = dao.getUnsaleableList();
		
		return buildMapList(list);
	}

	@Override
	public List<Map<String, Object>> getAllList()
	{
		List<ProdMtItem> list = dao.getSaleableListByProdCtg(ProductCategory.RootId);
		
		return buildMapList(list);
	}
}
