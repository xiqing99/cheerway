package org.qixi.stockingMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.stockingMgt.beans.StockTakenVch;
import org.qixi.stockingMgt.beans.StockTakenVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.service.StockTakenVchService;
import org.springframework.beans.factory.annotation.Autowired;

public class StockTakenVchServiceImpl  extends BaseVoucherServiceImpl<StockTakenVchItem >
											implements StockTakenVchService
{

	@Autowired
	InventoryDao inventoryDao;	

	@Override
	protected Result auditAction(BaseVoucher<StockTakenVchItem> voucher)
	{
		StockTakenVch stockTakenVoucher = (StockTakenVch)voucher;
		
		for (StockTakenVchItem item : stockTakenVoucher.getItems())
		{	
			inventoryDao.takeStock(stockTakenVoucher.getStore(), item);				
		}			
		
		return new Result();
	}
	
	@Override
	public List<Map<String, Object>> getDetailListByCreatedDateRange(
					Date startDate,
					Date endDate,
					Integer criteraId)
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Result save(
					StockTakenVch entity, Integer operatorEmpId)
	{
		
		return super.save((BaseVoucher<StockTakenVchItem>)entity, operatorEmpId);
	}

	@Override
	protected void buildSpeciMap(BaseVoucher<StockTakenVchItem> voucher, Map<String, Object> map)
	{
		StockTakenVch stockTakenVoucher = (StockTakenVch)voucher;
		
		map.put("entity.store.id", stockTakenVoucher.getStore().getId());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		for(StockTakenVchItem item : stockTakenVoucher.getItems())
		{
			Map<String, Object> itemMap = new HashMap<String, Object>();
			
			itemMap.put("id", item.getId());
			itemMap.put("expQuantity", item.getExpQuantity());
			itemMap.put("actQuantity", item.getExpQuantity() + item.getDiffQuantity());
			item.getInventory().buildMap(itemMap);;

			itemList.add(itemMap);
		}
		map.put("itemList", itemList);	
	}	

	@Override
	protected void buildSpeciMapForList(BaseVoucher<StockTakenVchItem> voucher, Map<String, Object> map)
	{
		StockTakenVch stockTakenVoucher = (StockTakenVch)voucher;
		
		map.put("storeName", stockTakenVoucher.getStore().getName());
	}		
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyy");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("00000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "PD" + seqNum + indexString;
		
		return seqNum;
	}
	
	@Override
	protected String getCriteraName()
	{
		
		return "store";
	}	
	
	@Override
	protected Integer getCriteraRootId()
	{
		return Store.RootId;
	}		
}