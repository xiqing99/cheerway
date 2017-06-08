package org.qixi.salesMgt.service.impl;


import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.dao.DepartmentDao;
import org.qixi.basicElem.dao.MarketAreaDao;
import org.qixi.basicElem.dao.ProductDao;
import org.qixi.salesMgt.dao.IGSaleVchDao;
import org.qixi.salesMgt.service.ReportService;
import org.qixi.security.dao.ReportMenuDao;
import org.springframework.beans.factory.annotation.Autowired;

public class ReportServiceImpl<T> implements ReportService
{
	@Autowired
	ReportMenuDao menuDao;
	
	@Autowired
	MarketAreaDao marketAreaDao;
	
	@Autowired
	DepartmentDao deptDao;
	
	IGSaleVchDao<T> orderDao;
	
	public IGSaleVchDao<T> getOrderDao()
	{
		return orderDao;
	}


	public void setOrderDao(
					IGSaleVchDao<T> orderDao)
	{
		this.orderDao = orderDao;
	}

	@Autowired
	ProductDao productDao;


	@Override
	public List<Map<String, Object>> getMenuList()
	{
		return menuDao.getSubList("salesMgt");
	}

	private static enum ReportCritera
	{
		BY_CUSTOMER,
		BY_RSPEMP,
		BY_PRODUCT,
		BY_PROD_MODEL
	}
	
	private void getMonthlyReport(Date startDate, Date endDate, ReportCritera critera, List<Map<String, Object>> rstList)
	{
				
		int index = 0;
		while(startDate.getTime() < endDate.getTime())
		{
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(startDate);
			calendar.add(Calendar.MONTH, 1);
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			
			Date end = new Date(calendar.getTimeInMillis());
			
			switch (critera)
			{
			case BY_CUSTOMER:
			{
				Map<Integer, Double>  priceMonthMap = orderDao.getTotalPriceSumMapByCust(startDate, end);
				Map<Integer, Double>  ctnNumMonthMap = orderDao.getCtnNumSumMapByCust(startDate, end);
				
				for(Map<String, Object> map : rstList)
				{
					if(priceMonthMap.get(map.get("custId")) != null)
						map.put("price"+index, priceMonthMap.get(map.get("custId")));
					
					if(ctnNumMonthMap.get(map.get("custId")) != null)
						map.put("ctnNum"+index, ctnNumMonthMap.get(map.get("custId")));
				}
				break;
			}
			case BY_RSPEMP:
			{
				Map<Integer, Double> priceMap = orderDao.getTotalPriceInCnSumMapByRspEmp(startDate, end);
				Map<Integer, Double> profitMap = orderDao.getTotalProfitInCnSumMapByRspEmp(startDate, end);
				for(Map<String, Object> map : rstList)
				{
					if(priceMap.get(map.get("empId")) != null)
						map.put("price"+index, priceMap.get(map.get("empId")));
					
					if(profitMap.get(map.get("empId")) != null)
						map.put("profit"+index, profitMap.get(map.get("empId")));
				}
				break;
			}
			case BY_PROD_MODEL:
			{
				Map<String, Double> monthMap = orderDao.getProdModelNumQtySumMap(startDate, end);
				
				Map<String, Double> priceMonthMap = orderDao.getProdModelNumPriceSumMap(startDate, end);
				
				for(Map<String, Object> map : rstList)
				{
					if(monthMap.get(map.get("prodModelNum")) != null)
						map.put("amount"+index, monthMap.get(map.get("prodModelNum")));
					
					if(priceMonthMap.get(map.get("prodModelNum")) != null)
						map.put("priceAmount"+index, priceMonthMap.get(map.get("prodModelNum")));
				}
				
				break;
			}
			case BY_PRODUCT:
			{
				Map<Integer, Double> monthMap = orderDao.getProdIdQtySumMap(startDate, end);
				
				Map<Integer, Double> priceMonthMap = orderDao.getProdIdPriceSumMap(startDate, end);
				
				for(Map<String, Object> map : rstList)
				{
					if(monthMap.get(map.get("prodId")) != null)
						map.put("amount"+index, monthMap.get(map.get("prodId")));
					
					if(priceMonthMap.get(map.get("prodId")) != null)
						map.put("priceAmount"+index, priceMonthMap.get(map.get("prodId")));
				}
				
				break;
			}
			default:
				break;
			}
			
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			startDate.setTime(calendar.getTimeInMillis());
			index++;
		}
		
	}


	@Override
	public List<Map<String, Object>> getMonthReportByMarketArea(
					Integer marketAreaId,
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> custList = marketAreaDao.getCustListForReport(marketAreaId);
		Map<Integer, Double> priceSumMap = orderDao.getTotalPriceSumMapByCust(startDate, endDate);
		Map<Integer, Double> priceSumInCnMap = orderDao.getTotalPriceInCnSumMapByCust(startDate, endDate);
		Map<Integer, Double> profitSumInCnMap = orderDao.getTotalProfitInCnSumMapByCust(startDate, endDate);
		Map<Integer, Double> ctnNumSumMap = orderDao.getCtnNumSumMapByCust(startDate, endDate);
		
		for(Map<String, Object> custMap : custList)
		{
			if(priceSumMap.get(custMap.get("custId")) != null)
			{
				custMap.put("totalPrice", priceSumMap.get(custMap.get("custId")));		
			}

			if(priceSumInCnMap.get(custMap.get("custId")) != null)
			{
				custMap.put("totalPriceInCn", priceSumInCnMap.get(custMap.get("custId")));		
				mapList.add(custMap);
			}
			
			if(profitSumInCnMap.get(custMap.get("custId")) != null)
			{
				custMap.put("totalProfitInCn", profitSumInCnMap.get(custMap.get("custId")));
			}
			
			if(ctnNumSumMap.get(custMap.get("custId")) != null)
			{
				custMap.put("ctnNum", ctnNumSumMap.get(custMap.get("custId")));		
			}			
		}
		
		getMonthlyReport(startDate, endDate, ReportCritera.BY_CUSTOMER, mapList);
		
		return mapList;
	}

	@Override
	public List<Map<String, Object>> getMonthReportByRspEmp(
					Integer deptId,
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> empList = deptDao.getEmpListForReport(deptId);
		Map<Integer, Double> priceMap = orderDao.getTotalPriceInCnSumMapByRspEmp(startDate, endDate);
		Map<Integer, Double> profitMap = orderDao.getTotalProfitInCnSumMapByRspEmp(startDate, endDate);
		
		for(Map<String, Object> emp : empList)
		{
			if(priceMap.get(emp.get("empId"))!= null)
			{
				emp.put("totalPriceInCn", priceMap.get(emp.get("empId")));
			}
			
			if(profitMap.get(emp.get("empId")) != null)
			{
				emp.put("totalProfitInCn", profitMap.get(emp.get("empId")));
			}
		}
		
		getMonthlyReport(startDate, endDate, ReportCritera.BY_RSPEMP, empList);		
		 		
		return empList;
	}

	public List<Map<String, Object>> getMonthReportByProdModelNum(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> prodList = productDao.getModeNumList();
		Map<String, Double> qtyAmountMap = orderDao.getProdModelNumQtySumMap(startDate, endDate);
		Map<String, Double> priceAmountMap = orderDao.getProdModelNumPriceSumMap(startDate, endDate);
		
		for(Map<String, Object> map : prodList)
		{
			if(qtyAmountMap.get(map.get("prodModelNum")) != null)
			{
				map.put("totalAmount", qtyAmountMap.get(map.get("prodModelNum")));		
			}
			
			if(priceAmountMap.get(map.get("prodModelNum")) != null)
			{
				map.put("priceTotalAmount", priceAmountMap.get(map.get("prodModelNum")));		
				mapList.add(map);
			}			
		}		
		
		getMonthlyReport(startDate, endDate, ReportCritera.BY_PROD_MODEL, mapList);		
		
		return mapList;

	}	

	public List<Map<String, Object>> getMonthReportByProd(
					Date startDate,
					Date endDate)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<Map<String, Object>> prodList = productDao.getListForReport();
		Map<Integer, Double> qtyAmountMap = orderDao.getProdIdQtySumMap(startDate, endDate);
		Map<Integer, Double> priceAmountMap = orderDao.getProdIdPriceSumMap(startDate, endDate);
		
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
		
		getMonthlyReport(startDate, endDate, ReportCritera.BY_PRODUCT, mapList);		
		
		return mapList;

	}	
	
}
