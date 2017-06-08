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
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.stockingMgt.beans.ProdStockInVch;
import org.qixi.stockingMgt.beans.ProdStockInVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.service.ProdStockInVchService;
import org.springframework.beans.factory.annotation.Autowired;


public class ProdStockInVchServiceImpl extends BaseVoucherServiceImpl<ProdStockInVchItem> 
												implements ProdStockInVchService
{
	
	@Autowired
	InventoryDao inventoryDao;

	@Override
	protected Result auditAction(BaseVoucher<ProdStockInVchItem> voucher)
	{
		ProdStockInVch instockVoucher = (ProdStockInVch)voucher;
		
		for (ProdStockInVchItem item : instockVoucher.getItems())
		{	
			inventoryDao.inputStock(instockVoucher.getStore(), item.getMtItem(), item.getQuantity());
		}	
		
		return new Result();
	}	
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyyMMdd");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "RK" + seqNum + indexString;
		
		return seqNum;
	}

	@Override
	protected void buildSpeciMap(BaseVoucher<ProdStockInVchItem> voucher, Map<String, Object> map)
	{
		ProdStockInVch instockVoucher = (ProdStockInVch)voucher;
		
		map.put("entity.store.id", instockVoucher.getStore().getId());
		map.put("entity.divNum", instockVoucher.getDivNum());
		map.put("entity.manuLine.id", instockVoucher.getManuLine().getId());
		map.put("entity.manuLineRspEmp.id", instockVoucher.getManuLineRspEmp().getId());
		map.put("entity.orderSaleVch.id", instockVoucher.getOrderSaleVch().getId());
		map.put("entity.custName", instockVoucher.getOrderSaleVch().getCustomer().getFullName());
		map.put("entity.currencyName", instockVoucher.getOrderSaleVch().getCustomer().getCurrency().getName());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		for(ProdStockInVchItem item : instockVoucher.getItems())
		{
			Map<String, Object> itemMap = new HashMap<String, Object>();
			
			itemMap.put("id", item.getId());
			itemMap.put("unitPrice", item.getUnitPrice());			
			itemMap.put("notes", item.getNotes());
			itemMap.put("quantity", item.getQuantity());
			
			ProdMtItem mtItem = item.getMtItem();
			
			itemMap.put("mtItemId", mtItem.getId());
			itemMap.put("mtNum", mtItem.getMaterialNum());
			itemMap.put("mtName", mtItem.getName());
			itemMap.put("unit", mtItem.getUnit().getName());
			itemMap.put("packageModel", mtItem.getPackageModel());
			itemMap.put("custModelNum", mtItem.getCustModelNum());

			itemList.add(itemMap);
		}
		
		map.put("itemList", itemList);
		
		return;
	}

	@Override
	protected void buildSpeciMapForList(BaseVoucher<ProdStockInVchItem> voucher, Map<String, Object> map)
	{
		ProdStockInVch instockVoucher = (ProdStockInVch)voucher;
		
		map.put("storeName", instockVoucher.getStore().getName());
		map.put("manuLine", instockVoucher.getManuLine().getName());
		map.put("manuLineRspEmp", instockVoucher.getManuLineRspEmp().getName());
		map.put("saleVchSeqNum", instockVoucher.getOrderSaleVch().getSequenceNum());
		map.put("customerName", instockVoucher.getOrderSaleVch().getCustomer().getName());
		
	}	

	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<ProdStockInVchItem> voucher, List<Map<String, Object>> mapList)
	{
		ProdStockInVch instockVoucher = (ProdStockInVch)voucher;
		
		for(ProdStockInVchItem item : instockVoucher.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(instockVoucher);
			
			map.put("storeName", instockVoucher.getStore().getName());
			map.put("manuLine", instockVoucher.getManuLine().getName());
			map.put("manuLineRspEmp", instockVoucher.getManuLineRspEmp().getName());
			map.put("saleVchSeqNum", instockVoucher.getOrderSaleVch().getSequenceNum());
			map.put("customerName", instockVoucher.getOrderSaleVch().getCustomer().getName());
		
			map.put("quantity", item.getQuantity());
			
			ProdMtItem mtItem = item.getMtItem();
			
			map.put("mtItemId", mtItem.getId());
			map.put("mtNum", mtItem.getMaterialNum());
			map.put("mtName", mtItem.getName());
			map.put("unit", mtItem.getUnit().getName());

			
			mapList.add(map);
		}
		
		return;
	
	}

	@Override
	public Result save(
					ProdStockInVch entity, Integer operatorEmpId)
	{
		return super.save((BaseVoucher<ProdStockInVchItem>)entity, operatorEmpId);
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
