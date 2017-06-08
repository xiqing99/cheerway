package org.qixi.salesMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Department;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.beans.StockSaleVch;
import org.qixi.salesMgt.dao.StockSaleVchDao;
import org.qixi.salesMgt.service.StockSaleVchService;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;
import org.springframework.beans.factory.annotation.Autowired;

public class StockSaleVchServiceImpl extends BaseVoucherServiceImpl<SaleVchItem> implements StockSaleVchService
{	
	
	@Autowired
	ProdStockOutVchDao outstockDao;
	
	@Autowired
	StockSaleVchDao stockSaleVchDao;
	
	@Override
	protected void buildSpeciMap(BaseVoucher<SaleVchItem> voucher, Map<String, Object> map)	
	{
		StockSaleVch saleVch = (StockSaleVch)voucher;

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");	
		
		if(saleVch.getDeliverDeadLine() != null)
		{
			String dateString = format.format(saleVch.getDeliverDeadLine());						
			map.put("entity.deliverDeadLine", dateString );
		}		
		
		if(saleVch.getPaymentDeadLine() != null)
		{
			String dateString = format.format(saleVch.getPaymentDeadLine());						
			map.put("entity.paymentDeadLine", dateString );
		}			
		
		
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());
		map.put("entity.customer.id", saleVch.getCustomer().getId());
		map.put("entity.exchangeRate", saleVch.getExchangeRate());
		map.put("entity.paymentMode.id", saleVch.getPaymentMode().getId());
		map.put("entity.otherExpense", saleVch.getOtherExpense());

		List<SaleVchItem> items = saleVch.getItems();
		List<Map<String, Object>> itemMaps = new ArrayList<>();
		
		for(SaleVchItem item : items)
		{
			Map<String, Object> itemMap = new HashMap<>();
			
			buildItemMap(item, itemMap);
			
			itemMaps.add(itemMap);
		}
		
		map.put("itemList", itemMaps);
		
	}
	
	
	@Override
	public Result save(StockSaleVch entity, Integer operatorEmpId)
	{		
		entity.setTotalPrice(cacTotalPrice(entity));		
		entity.setTotalExtraProfit(cacTotalExtraProfit(entity));
		return super.save(entity, operatorEmpId);
	}	
	
	private Double cacTotalPrice(StockSaleVch order)
	{
		double totalPrice = (double) 0;
		for(SaleVchItem item : order.getItems())
		{
			Double price = item.getUnitPrice()*item.getQuantity();
			totalPrice+=price;
		}
		
		return totalPrice;
	}	
	
	private Double cacTotalExtraProfit(StockSaleVch order)
	{
		double totalPrice = (double) 0;
		for(SaleVchItem item : order.getItems())
		{
			Double price =item.getQuantity()*(item.getUnitPrice() - item.getStdUnitPrice());
			totalPrice+=price;
		}
		
		return totalPrice - order.getOtherExpense();		
	}	
	
	
	@Override
	protected Result completeAction(BaseVoucher<SaleVchItem> voucher)
	{
		Result result = new Result();
		
		stockSaleVchDao.completeVoucher(voucher.getId());
		
		return result;
	}		
	
	@Override
	public List<ComboElem> getComboListByState(
					VoucherState.State state)
	{
		return stockSaleVchDao.getComboListByState(state);
	}

	@Override
	public List<ComboElem> getComboListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		return stockSaleVchDao.getComboListByCustAndState(custId, state);
	}

	@Override
	protected void buildSpeciMapForList(BaseVoucher<SaleVchItem> voucher, Map<String, Object> map)
	{
		StockSaleVch saleVch = (StockSaleVch)voucher;
		
		map.put("customerName", saleVch.getCustomer().getName());
		map.put("customerArea", saleVch.getCustomer().getArea().getName());
		map.put("currencyName", saleVch.getCustomer().getCurrency().getName());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String dateString;

		
		if(saleVch.getDeliverDeadLine() != null)
		{
			dateString = format.format(saleVch.getDeliverDeadLine());
			map.put("deliverDeadLine", dateString);
		}		
		
		if(saleVch.getPaymentDeadLine() != null)
		{
			dateString = format.format(saleVch.getPaymentDeadLine());
			map.put("paymentDeadLine", dateString);
		}	
		
		map.put("totalPrice", saleVch.getTotalPrice());
		map.put("totalExtraProfit", saleVch.getTotalExtraProfit());
		
		double exchangeRate= (double)1;
		
		if(saleVch.getExchangeRate() != null)
			exchangeRate = saleVch.getExchangeRate();
		
		map.put("totalPriceInCn", saleVch.getTotalPrice()*exchangeRate);
		
		map.put("totalExtraProfitInCn", saleVch.getTotalExtraProfit()*exchangeRate);
		return;
	}	

	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<SaleVchItem> voucher, List<Map<String, Object>> mapList)
	{
		StockSaleVch saleVch = (StockSaleVch)voucher;		
		
		for(SaleVchItem item : saleVch.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(voucher);
			
			map.put("customerName", saleVch.getCustomer().getName());
			map.put("currencyName", saleVch.getCustomer().getCurrency().getName());
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String dateString;

			
			if(saleVch.getDeliverDeadLine() != null)
			{
				dateString = format.format(saleVch.getDeliverDeadLine());
				map.put("deliverDeadLine", dateString);
			}		
			
			if(saleVch.getPaymentDeadLine() != null)
			{
				dateString = format.format(saleVch.getPaymentDeadLine());
				map.put("paymentDeadLine", dateString);
			}				
			
			buildItemMap(item, map);

			map.put("outStockQty", outstockDao.getQtyBySaleVchItem(item));		
			
			double itemPrice = item.getUnitPrice()*item.getQuantity();
			
			map.put("itemPrice", itemPrice);
			
			double exchangeRate= (double)1;
			
			if(saleVch.getExchangeRate() != null)
				exchangeRate = saleVch.getExchangeRate();
			
			map.put("itemPriceInCn", itemPrice*exchangeRate);
			
			mapList.add(map);						
		}
		return;
	}	
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyy");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("00000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "XH"+seqNum + indexString;
		
		return seqNum;
	}
	
	private void buildItemMap(SaleVchItem item, Map<String, Object> map)
	{
		map.put("itemId", item.getId());
		map.put("unitPrice", item.getUnitPrice());
		map.put("quantity", item.getQuantity());			
		map.put("notes", item.getNotes());

		item.getMtItem().buildMap(map);	
		map.put("stdUnitPrice", item.getStdUnitPrice());
	}
	
	@Override
	public List<Map<String, Object>> getListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<StockSaleVch> list = stockSaleVchDao.getListByCustAndState(custId, state);
		
		for(StockSaleVch saleVch : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("orderId", saleVch.getId());
			map.put("seqNum", saleVch.getSequenceNum());
			map.put("totalAmount", saleVch.getTotalPrice());
			map.put("currencyName", saleVch.getCustomer().getCurrency().getName());
			map.put("rspEmpName", saleVch.getRspEmp().getName());

			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String dateString;
			
			if(saleVch.getApprovedTime() != null)
			{
				dateString = format.format(saleVch.getApprovedTime());
				map.put("auditedDate", dateString);
			}
			mapList.add(map);
		}
					
		return mapList;
	}

	@Override
	protected String getCriteraName()
	{
		
		return "dept";
	}			
	
	@Override
	protected Integer getCriteraRootId()
	{
		return Department.SalesDeptRootId;
	}	
}
