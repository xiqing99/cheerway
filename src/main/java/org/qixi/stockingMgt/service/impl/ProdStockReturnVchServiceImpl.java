package org.qixi.stockingMgt.service.impl;


import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.dao.RefundPerStockRtDao;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.SaleVch;


import org.qixi.stockingMgt.beans.ProdStockReturnVch;
import org.qixi.stockingMgt.beans.ProdStockReturnVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;
import org.qixi.stockingMgt.service.ProdStockReturnVchService;
import org.springframework.beans.factory.annotation.Autowired;


public class ProdStockReturnVchServiceImpl extends BaseVoucherServiceImpl<ProdStockReturnVchItem>   
													implements ProdStockReturnVchService
{
	@Autowired
	RefundPerStockRtDao refundDao;
	
	@Autowired
	InventoryDao inventoryDao;
	
	protected void buildSpeciMap(BaseVoucher<ProdStockReturnVchItem> voucher, Map<String, Object> map)
	{
		ProdStockReturnVch outstockVoucher = (ProdStockReturnVch)voucher;
		
		map.put("entity.store.id", outstockVoucher.getStore().getId());
		map.put("entity.extraExpense", outstockVoucher.getExtraExpense());
		map.put("entity.accountRspEmp.id", outstockVoucher.getAccountRspEmp().getId());	
		
		SaleVch saleVch = outstockVoucher.getSaleVch();
		
		map.put("entity.saleVch.id", saleVch.getId());
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());		
		map.put("entity.custName", saleVch.getCustomer().getFullName());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		for(ProdStockReturnVchItem item : outstockVoucher.getItems())
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
	protected void buildSpeciMapForList(BaseVoucher<ProdStockReturnVchItem> voucher, Map<String, Object> map)
	{
		ProdStockReturnVch outstockVoucher = (ProdStockReturnVch)voucher;
		
		map.put("storeName", outstockVoucher.getStore().getName());				
		map.put("saleVchSeqNum", outstockVoucher.getSaleVch().getSequenceNum());
		map.put("customerName", outstockVoucher.getSaleVch().getCustomer().getName());
	}	
	
	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<ProdStockReturnVchItem> voucher, List<Map<String, Object>> mapList)
	{
		ProdStockReturnVch outstockVoucher = (ProdStockReturnVch)voucher;
		
		for (ProdStockReturnVchItem item : outstockVoucher.getItems())
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
	protected Result auditAction(BaseVoucher<ProdStockReturnVchItem> voucher)
	{
		Result result = new Result();
		ProdStockReturnVch stockReturnVch = (ProdStockReturnVch)voucher;					
		
		for (ProdStockReturnVchItem item : voucher.getItems())
		{
			
			inventoryDao.inputStock(stockReturnVch.getStore(), item.getMtItem(), item.getQuantity());
		}
		
		createRefund(stockReturnVch);
		
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
		
		seqNum = "TH" + seqNum + indexString;
		
		return seqNum;
	}

	@Override
	public Result save(
					ProdStockReturnVch entity, Integer operatorEmpId)
	{
		return super.save((BaseVoucher<ProdStockReturnVchItem>)entity, operatorEmpId);
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
	
	private void createRefund(ProdStockReturnVch voucher)
	{
		RefundPerStockRt refund = new RefundPerStockRt();
		
		refund.setReturnVch(voucher);
		refund.setAccountEmp(voucher.getAccountRspEmp());
		
		Double totalAmount = voucher.getExtraExpense();
		for (ProdStockReturnVchItem item : voucher.getItems())
		{								
			totalAmount += item.getUnitPrice()*item.getQuantity();
		}
		
		refund.setTotalAmount(totalAmount);
		refund.setRemainedAmount(totalAmount);
		
		Date deadlineDate = voucher.getSaleVch().getPaymentDeadLine();
		Customer customer = voucher.getSaleVch().getCustomer();
	
		refund.setDeadlineDate(deadlineDate);
		refund.setPartner(customer);
		
		refund.setExchangeRate(voucher.getSaleVch().getExchangeRate());
		
		Date createdDate = new Date(System.currentTimeMillis());
		refund.setCreatedDate(createdDate);
		
		refundDao.save(refund);
				
	}
	
}
