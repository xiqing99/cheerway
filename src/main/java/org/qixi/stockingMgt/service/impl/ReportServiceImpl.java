package org.qixi.stockingMgt.service.impl;


import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.dao.ProductDao;
import org.qixi.security.dao.ReportMenuDao;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.dao.ProdStockInVchDao;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;
import org.qixi.stockingMgt.dao.ProdStockReturnVchDao;
import org.qixi.stockingMgt.dao.StockTakenVchDao;
import org.qixi.stockingMgt.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;

public class ReportServiceImpl implements ReportService
{
	@Autowired
	ReportMenuDao menuDao;
	
	@Autowired
	InventoryDao inventoryDao;
	
	@Autowired
	ProdStockInVchDao instockDao;
	
	@Autowired
	ProdStockOutVchDao outstockDao;
	
	@Autowired
	ProductDao prodDao;

	@Autowired
	StockTakenVchDao stockTakenDao;

	@Autowired
	ProdStockReturnVchDao stockRtDao;
	
	
	@Override
	public List<Map<String, Object>> getSingleMonthReport(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> prodList = prodDao.getListForReport();
		
		Map<Integer, Double> instockMap = instockDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> outstockMap = outstockDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> stockTakenMap = stockTakenDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> stockRtMap = stockRtDao.getProdIdQtySumMap(startDate, endDate);
		
		Map<Integer, Double> inventoryMap = inventoryDao.getProdIdQtySumMap();
		
		for(Map<String, Object> map : prodList)
		{
			Integer prodId = (Integer)map.get("prodId");
			
			if(instockMap.get(prodId) != null)
			{
				map.put("instockQty", instockMap.get(prodId));
			}
			
			if(outstockMap.get(prodId) != null)
			{
				map.put("outstockQty", outstockMap.get(prodId));
			}

			if(stockTakenMap.get(prodId) != null)
			{
				map.put("stockTakenQty", stockTakenMap.get(prodId));
			}			

			if(stockRtMap.get(prodId) != null)
			{
				map.put("stockRtQty", stockRtMap.get(prodId));
			}			
			
			if(inventoryMap.get(prodId) != null)
			{
				map.put("endStockQty", inventoryMap.get(prodId));
			}
			
			mapList.add(map);
		}
		
		return mapList;
	}



	@Override
	public List<Map<String, Object>> getMenuList()
	{
		return menuDao.getSubList("stockMgt");
	}



	@Override
	public List<Map<String, Object>> getMultiMonthReport(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = getSingleMonthReport(startDate, endDate);
		
		int index = 0;
		while(startDate.getTime() < endDate.getTime())
		{
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(startDate);
			calendar.add(Calendar.MONTH, 1);
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			
			Date end = new Date(calendar.getTimeInMillis());
			
			Map<Integer, Double> instockMap = instockDao.getProdIdQtySumMap(startDate, end);
			Map<Integer, Double> outstockMap = outstockDao.getProdIdQtySumMap(startDate, end);
			
			for(Map<String, Object> map : mapList)
			{
				if(instockMap.get(map.get("prodId")) != null)
					map.put("instockQty" + index, instockMap.get(map.get("prodId")));
				
				if(outstockMap.get(map.get("prodId")) != null)
					map.put("outstockQty" + index, outstockMap.get(map.get("prodId")));
			}
			
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			startDate.setTime(calendar.getTimeInMillis());
			index++;
		}
		return mapList;
	}
		
}
