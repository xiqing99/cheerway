package org.qixi.stockingMgt.service.impl;


import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.dao.ProductDao;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.stockingMgt.beans.Inventory;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.dao.ProdStockInVchDao;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;
import org.qixi.stockingMgt.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;

public class InventoryServiceImpl implements InventoryService
{
	@Autowired
	InventoryDao dao;	

	@Autowired
	ProductDao   prodDao;
	
	@Autowired
	ProdStockInVchDao stockInDao;
	
	@Autowired
	ProdStockOutVchDao stockOutDao;
	
	
	@Override
	public List<Map<String, Object>> getAll()
	{
		List<Map<String, Object>> rstList = new ArrayList<>();
		
		List<Inventory> list = dao.getAll();
		
		for(Inventory inventory : list)
		{	
			Map<String, Object> map = new HashMap<>();
			
			inventory.buildMap(map);
			
			rstList.add(map);
		}
		
		return rstList;
	}

	@Override
	public List<Map<String, Object>> getListByStore(
					Integer storeId)
	{
		List<Map<String, Object>> rstList = new ArrayList<>();
		
		List<Inventory> list = dao.getListByStoreId(storeId);
		
		for(Inventory inventory : list)
		{			
			Map<String, Object> map = new HashMap<>();
			
			inventory.buildMap(map);
			rstList.add(map);
		}
		
		return rstList;
	}

	@Override
	public List<Map<String, Object>> getProdListByStore(
					Integer storeId)
	{
		List<Map<String, Object>> rstList = new ArrayList<>();
		
		List<Inventory> list = dao.getProdListByStoreId(storeId);
		
		for(Inventory inventory : list)
		{			
			Map<String, Object> map = new HashMap<>();
			
			inventory.buildMap(map);
			rstList.add(map);
			
		}
		
		return rstList;
	}	
	
	@Override
	public Map<String, Object> getById(
					Integer id)
	{	
		return null;
	}


	@Override
	public Result delById(Integer id)
	{	
		Result result = new Result();
		
		Inventory inventory = dao.get(id);
		
		if(inventory == null || inventory.getQuantity() > 0)
		{
			result.success = false;
			result.cause = "updateState.failure.notAllowed";
			
			return result;
		}
		
		dao.deleteById(id);
		
		return result;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public List<Map<String, Object>> getMonthRptByProduct(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		Map<Integer, Double> inventoryMap = dao.getProdIdQtySumMap();

		List<Product> prodList = prodDao.getAll();	
		
		Map<Integer, Double> instockMap = stockInDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> outstockMap = stockOutDao.getProdIdQtySumMap(startDate, endDate);
		
		for(Product product : prodList)
		{
			Map<String, Object> map = new HashMap<>();
			
			Integer prodId = product.getId();
			
			map.put("prodModelNum", product.getModelNum());
			map.put("prodSubModelNum", product.getSubModelNum());
			
			if(inventoryMap.get(prodId) != null)
			{
				map.put("inventQty", inventoryMap.get(prodId));
			}
			
			
			if(instockMap.get(prodId) != null)
			{
				map.put("instockQty", instockMap.get(prodId));
			}
			
			if(outstockMap.get(prodId) != null)
			{
				map.put("outstockQty", outstockMap.get(prodId));
			}
			
			mapList.add(map);
		}
		
		return mapList;
	}
	
	
	@Override
	public List<Map<String, Object>> getMonthRptByProdModelNum(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> prodList = prodDao.getModeNumList();	
		Map<String, Double> inventoryMap = dao.getProdModelNumQtyMap();
		Map<String, Double> instockMap = stockInDao.getProdModelNumQtySumMap(startDate, endDate);
		Map<String, Double> outstockMap = stockOutDao.getProdModelNumQtySumMap(startDate, endDate);
		
		for(Map<String, Object> map : prodList)
		{
			String modelNum = (String)map.get("prodModelNum");
			
			if(instockMap.get(modelNum) != null)
			{
				map.put("instockQty", instockMap.get(modelNum));
			}
			
			if(outstockMap.get(modelNum) != null)
			{
				map.put("outstockQty", outstockMap.get(modelNum));
			}
			
			if(inventoryMap.get(modelNum) != null)
			{
				map.put("inventQty", inventoryMap.get(modelNum));
			}
			
			mapList.add(map);
		}
		
		return mapList;
	}	

	@Override
	public Result save(
					Inventory entity)
	{
		// TODO Auto-generated method stub
		return null;
	}

}
