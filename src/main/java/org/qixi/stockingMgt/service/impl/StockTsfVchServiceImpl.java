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
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.stockingMgt.beans.StockTsfVch;
import org.qixi.stockingMgt.beans.StockTsfVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.service.StockTsfVchService;
import org.springframework.beans.factory.annotation.Autowired;

public class StockTsfVchServiceImpl  extends BaseVoucherServiceImpl<StockTsfVchItem >
											implements StockTsfVchService
{

	@Autowired
	InventoryDao inventoryDao;	

	@Override
	protected Result auditAction(BaseVoucher<StockTsfVchItem> voucher)
	{
		Result result = new Result();
		StockTsfVch stockTsfVoucher = (StockTsfVch)voucher;

		for (StockTsfVchItem item : stockTsfVoucher.getItems())
		{	
			if ( !inventoryDao.isAdequate(stockTsfVoucher.getSrcStore(), item.getMtItem(), item.getQuantity()))
			{
				result.success = false;
				result.cause = "stockMgt.inventoryService.outOfStock";
				
				return result;
			}		
		}		
		
		for (StockTsfVchItem item : stockTsfVoucher.getItems())
		{	
			inventoryDao.outputStock(stockTsfVoucher.getSrcStore(), item.getMtItem(), item.getQuantity());		
			inventoryDao.inputStock(stockTsfVoucher.getDstStore(), item.getMtItem(), item.getQuantity());
		}			
		
		return result;
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
					StockTsfVch entity, Integer operatorEmpId)
	{
		
		return super.save((BaseVoucher<StockTsfVchItem>)entity, operatorEmpId);
	}

	@Override
	protected void buildSpeciMap(BaseVoucher<StockTsfVchItem> voucher, Map<String, Object> map)
	{
		StockTsfVch stockTsfVch = (StockTsfVch)voucher;
		
		map.put("entity.srcStore.id", stockTsfVch.getSrcStore().getId());
		map.put("entity.dstStore.id", stockTsfVch.getDstStore().getId());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		for(StockTsfVchItem item : stockTsfVch.getItems())
		{
			Map<String, Object> itemMap = new HashMap<String, Object>();
			
			itemMap.put("id", item.getId());
			itemMap.put("quantity", item.getQuantity());
			itemMap.put("notes", item.getNotes());
			
			MtItem mtItem = item.getMtItem();
			
			itemMap.put("mtItemId", mtItem.getId());
			itemMap.put("mtNum", mtItem.getMaterialNum());
			itemMap.put("mtName", mtItem.getName());
			itemMap.put("mtUnit", mtItem.getUnit().getName());
			itemMap.put("mtUnitCost", mtItem.getUnitCost());
			itemMap.put("mtType", mtItem.getType());

			itemList.add(itemMap);
		}
		map.put("itemList", itemList);	
	}	

	@Override
	protected void buildSpeciMapForList(BaseVoucher<StockTsfVchItem> voucher, Map<String, Object> map)
	{
		StockTsfVch stockTsfVch = (StockTsfVch)voucher;
		
		map.put("srcStoreName", stockTsfVch.getSrcStore().getName());
		map.put("dstStoreName", stockTsfVch.getDstStore().getName());
	}		
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyy");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("00000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "YK" + seqNum + indexString;
		
		return seqNum;
	}
	
	@Override
	protected String getCriteraName()
	{
		
		return "srcStore";
	}	
	
	@Override
	protected Integer getCriteraRootId()
	{
		return Store.RootId;
	}		
}