package org.qixi.stockingMgt.service.impl;


import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.accountMgt.dao.RsvbPerProdSOVchDao;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.SaleVch;


import org.qixi.stockingMgt.beans.ProdStockOutVch;
import org.qixi.stockingMgt.beans.ProdStockOutVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.service.ProdStockOutVchService;
import org.springframework.beans.factory.annotation.Autowired;


public class ProdStockOutVchServiceImpl extends BaseVoucherServiceImpl<ProdStockOutVchItem>   
													implements ProdStockOutVchService
{
	@Autowired
	RsvbPerProdSOVchDao rsvableDao;
	
	@Autowired
	InventoryDao inventoryDao;
	
	protected void buildSpeciMap(BaseVoucher<ProdStockOutVchItem> voucher, Map<String, Object> map)
	{
		ProdStockOutVch outstockVoucher = (ProdStockOutVch)voucher;
		
		map.put("entity.store.id", outstockVoucher.getStore().getId());
		map.put("entity.extraExpense", outstockVoucher.getExtraExpense());
		map.put("entity.accountRspEmp.id", outstockVoucher.getAccountRspEmp().getId());	
		
		SaleVch saleVch = outstockVoucher.getSaleVch();
		
		map.put("entity.saleVch.id", saleVch.getId());
		map.put("entity.custName", saleVch.getCustomer().getName());
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());		
		map.put("entity.custName", saleVch.getCustomer().getFullName());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		for(ProdStockOutVchItem item : outstockVoucher.getItems())
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
	protected void buildSpeciMapForList(BaseVoucher<ProdStockOutVchItem> voucher, Map<String, Object> map)
	{
		ProdStockOutVch outstockVoucher = (ProdStockOutVch)voucher;
		
		map.put("storeName", outstockVoucher.getStore().getName());				
		map.put("saleVchSeqNum", outstockVoucher.getSaleVch().getSequenceNum());
		map.put("customerName", outstockVoucher.getSaleVch().getCustomer().getName());
	}	
	
	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<ProdStockOutVchItem> voucher, List<Map<String, Object>> mapList)
	{
		ProdStockOutVch outstockVoucher = (ProdStockOutVch)voucher;
		
		for (ProdStockOutVchItem item : outstockVoucher.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(outstockVoucher);
			
			map.put("storeName", outstockVoucher.getStore().getName());			
			map.put("saleVchSeqNum", outstockVoucher.getSaleVch().getSequenceNum());
			map.put("customerName", outstockVoucher.getSaleVch().getCustomer().getName());
			
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
	protected Result auditAction(BaseVoucher<ProdStockOutVchItem> voucher)
	{
		Result result = new Result();
		ProdStockOutVch outstockVoucher = (ProdStockOutVch)voucher;
		
		for (ProdStockOutVchItem item : outstockVoucher.getItems())
		{	
			if ( !inventoryDao.isAdequate(outstockVoucher.getStore(), item.getMtItem(), item.getQuantity()))
			{
				result.success = false;
				result.cause = "stockMgt.inventoryService.outOfStock";
				
				return result;
			}		
		}			
		
		for (ProdStockOutVchItem item : voucher.getItems())
		{
			
			inventoryDao.outputStock(outstockVoucher.getStore(), item.getMtItem(), item.getQuantity());
		}
		
		createRsvb(outstockVoucher);
		
		return result;
	}	
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyyMMdd");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "CK" + seqNum + indexString;
		
		return seqNum;
	}

	@Override
	public Result save(
					ProdStockOutVch entity, Integer operatorEmpId)
	{
		return super.save((BaseVoucher<ProdStockOutVchItem>)entity, operatorEmpId);
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
	
	private void createRsvb(ProdStockOutVch voucher)
	{
		RsvbPerProdSOVch receivable = new RsvbPerProdSOVch();
		
		receivable.setStOutVch(voucher);
		receivable.setAccountEmp(voucher.getAccountRspEmp());
		
		Double totalAmount = voucher.getExtraExpense();
		for (ProdStockOutVchItem item : voucher.getItems())
		{								
			totalAmount += item.getUnitPrice()*item.getQuantity();
		
		}			
		receivable.setTotalAmount(totalAmount);
		receivable.setRemainedAmount(totalAmount);
		
		
		Date deadlineDate = voucher.getSaleVch().getPaymentDeadLine();
		Customer customer = voucher.getSaleVch().getCustomer();
	
		receivable.setDeadlineDate(deadlineDate);
		receivable.setPartner(customer);
		receivable.setExchangeRate(voucher.getSaleVch().getExchangeRate());
		
		Date createdDate = new Date(System.currentTimeMillis());
		receivable.setCreatedDate(createdDate);
		
		rsvableDao.save(receivable);
				
	}
	
}
