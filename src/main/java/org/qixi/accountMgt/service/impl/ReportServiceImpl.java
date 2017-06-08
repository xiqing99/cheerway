package org.qixi.accountMgt.service.impl;


import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.dao.RefundPerStockRtDao;
import org.qixi.accountMgt.dao.RsvbPerProdSOVchDao;
import org.qixi.accountMgt.service.ReportService;
import org.qixi.basicElem.dao.MarketAreaDao;
import org.qixi.basicElem.dao.ProductDao;
import org.qixi.security.dao.ReportMenuDao;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;
import org.springframework.beans.factory.annotation.Autowired;

public class ReportServiceImpl implements ReportService
{
	@Autowired
	ReportMenuDao menuDao;
	
	@Autowired
	MarketAreaDao marketAreaDao;
	
	@Autowired 
	RsvbPerProdSOVchDao rsvbPerOSVoucherDao;
	
	@Autowired
	RefundPerStockRtDao refundDao;
	
	@Autowired
	ProductDao prodDao;
	
	@Autowired
	ProdStockOutVchDao stockOutDao;


	@Override
	public List<Map<String, Object>> getMenuList()
	{
		return menuDao.getSubList("accountMgt");
	}

	@Override
	public List<Map<String, Object>> getSalesReportByMarketArea(
					Integer marketAreaId,
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> custList = marketAreaDao.getCustListForReport(marketAreaId);
		Map<Integer, Double> rsvbSumMap = rsvbPerOSVoucherDao.getCustAmountSumMap(startDate, endDate);
		Map<Integer, Double> rsvbSumInCnMap = rsvbPerOSVoucherDao.getCustAmountSumInCnMap(startDate, endDate);
		Map<Integer, Double> refundSumMap = refundDao.getCustAmountSumMap(startDate, endDate);
		Map<Integer, Double> refundSumInCnMap = refundDao.getCustAmountSumInCnMap(startDate, endDate);
		
		for(Map<String, Object> custMap : custList)
		{
			if(rsvbSumMap.get(custMap.get("custId")) != null)
			{
				custMap.put("totalAmount", rsvbSumMap.get(custMap.get("custId")));	
				custMap.put("totalAmountInCn", rsvbSumInCnMap.get(custMap.get("custId")));	
				custMap.put("totalRefundAmount", refundSumMap.get(custMap.get("custId")));
				custMap.put("totalRefundAmountInCn", refundSumInCnMap.get(custMap.get("custId")));
				mapList.add(custMap);
			}
		}
		
		int index = 0;
		while(startDate.getTime() < endDate.getTime())
		{
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(startDate);
			calendar.add(Calendar.MONTH, 1);
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			
			Date end = new Date(calendar.getTimeInMillis());
			
			rsvbSumMap = rsvbPerOSVoucherDao.getCustAmountSumMap(startDate, end);
			
			for(Map<String, Object> map : mapList)
			{
				if(rsvbSumMap.get(map.get("custId")) != null)
					map.put("amount"+index, rsvbSumMap.get(map.get("custId")));
			}
			
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			startDate.setTime(calendar.getTimeInMillis());
			index++;
		}
		
		return mapList;
	}

	@Override
	public List<Map<String, Object>> getOverdueReport(
					Date dueDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> custList = marketAreaDao.getCustListForReport(1);
		
		Map<Integer, Double> rsvbSumMap = rsvbPerOSVoucherDao.getCustOverDueAmountSumMap(dueDate);
		
		for(Map<String, Object> custMap : custList)
		{
			if(rsvbSumMap.get(custMap.get("custId")) != null)
			{
				custMap.put("totalAmount", rsvbSumMap.get(custMap.get("custId")));		
				mapList.add(custMap);
			}
		}
		return mapList;
	}

	@Override
	public List<Map<String, Object>> getSalesReportForProd(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> prodList = prodDao.getListForReport();
		Map<Integer, Double> qtyAmountMap = stockOutDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> priceAmountMap = stockOutDao.getProdIdPriceSumMap(startDate, endDate);
		
		for(Map<String, Object> map : prodList)
		{
			if(qtyAmountMap.get(map.get("prodId")) != null)
			{
				map.put("totalAmount", qtyAmountMap.get(map.get("prodId")));		
			}
			
			if(priceAmountMap.get(map.get("prodId")) != null)
			{
				map.put("priceTotalAmount", priceAmountMap.get(map.get("prodId")));		
				mapList.add(map);
			}			
		}
		
		int index = 0;
		while(startDate.getTime() < endDate.getTime())
		{
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(startDate);
			calendar.add(Calendar.MONTH, 1);
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			
			Date end = new Date(calendar.getTimeInMillis());
			
			Map<Integer, Double> monthMap = stockOutDao.getProdIdQtySumMap(startDate, end);
			
			Map<Integer, Double> priceMonthMap = stockOutDao.getProdIdPriceSumMap(startDate, end);
			
			for(Map<String, Object> map : prodList)
			{
				if(monthMap.get(map.get("prodId")) != null)
					map.put("amount"+index, monthMap.get(map.get("prodId")));
				
				if(priceMonthMap.get(map.get("prodId")) != null)
					map.put("priceAmount"+index, priceMonthMap.get(map.get("prodId")));
			}
			
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			startDate.setTime(calendar.getTimeInMillis());
			index++;
		}
		
		return mapList;
	}
		
}
