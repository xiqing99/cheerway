package org.qixi.accountMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.beans.RefundmentVchItem;
import org.qixi.accountMgt.beans.RefundmentVch;
import org.qixi.accountMgt.dao.RefundPerStockRtDao;
import org.qixi.accountMgt.service.RefundmentVchService;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.dao.CustomerDao;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.salesMgt.dao.SaleVchDao;
import org.springframework.beans.factory.annotation.Autowired;

public class RefundmentVchServiceImpl extends BaseVoucherServiceImpl<RefundmentVchItem> 
										implements RefundmentVchService
{	
	@Autowired
	SaleVchDao saleVchDao;
	
	@Autowired
	CustomerDao custDao;
	
	@Autowired 
	RefundPerStockRtDao refundDao;	

	@Override
	protected Result auditAction(BaseVoucher<RefundmentVchItem> voucher)
	{
		RefundmentVch refundmentVch= (RefundmentVch)voucher;
		
		Result result = checkValidityForAudit(refundmentVch);
		
		if(result.success != true)
			return result;
		
		
		for(RefundmentVchItem item : refundmentVch.getItems())
		{			
			refundDao.pay(item.getRefundPerStockRt().getId());;
		}
		
		if(!refundmentVch.getCustDepositAmount().equals(0.0))
		{
			Customer cust = refundmentVch.getSaleVch().getCustomer();
			custDao.updateDepositAmount(cust.getId(), cust.getDepositAmount() + refundmentVch.getCustDepositAmount());
		}

		if(!refundmentVch.getOrderDepositAmount().equals(0.0))
		{
			SaleVch saleVch = refundmentVch.getSaleVch();
			
			saleVchDao.updateDepositAmount(saleVch.getId(), saleVch.getDepositAmount() + refundmentVch.getOrderDepositAmount());					
		}
		
		return result;
	}

	private Result checkValidityForAudit(RefundmentVch voucher)
	{
		Result result = new Result();				

		for(RefundmentVchItem item : voucher.getItems())
		{
			RefundPerStockRt refundPerStockRt = item.getRefundPerStockRt();
			
			if(item.getAmount() > refundPerStockRt.getRemainedAmount())
			{
				result.success = false;
				result.cause ="account.failure.receivableOutOfRange";
				return result;
			}
			
		}				
		return result;
	}

	@Override
	protected void buildSpeciMap(BaseVoucher<RefundmentVchItem> voucher, Map<String, Object> map)
	{
		RefundmentVch refundmentVch= (RefundmentVch)voucher;

		map.put("entity.account", refundmentVch.getAccount());
		map.put("entity.paidAmount", refundmentVch.getPaidAmount());
		map.put("entity.custDepositAmount", refundmentVch.getCustDepositAmount());
		map.put("entity.orderDepositAmount", refundmentVch.getOrderDepositAmount());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		for(RefundmentVchItem item : refundmentVch.getItems())
		{
			Map<String, Object> itemMap = new HashMap<>();
			
			RefundPerStockRt refundPerStockRt = item.getRefundPerStockRt();
			
			itemMap.put("id", item.getId());
			itemMap.put("refundPerStockRtId", refundPerStockRt.getId());
			itemMap.put("stockRtVchSeqNum", refundPerStockRt.getReturnVch().getSequenceNum());
			itemMap.put("amount", item.getAmount());
			itemMap.put("createdDate", format.format(refundPerStockRt.getCreatedDate()));
			itemMap.put("totalAmount", refundPerStockRt.getTotalAmount());
			itemMap.put("currencyName", refundPerStockRt.getPartner().getCurrency().getName());
			itemList.add(itemMap);
		}
		
		map.put("itemList", itemList);		

		SaleVch saleVch = refundmentVch.getSaleVch();
		
		map.put("entity.saleVch.id", saleVch.getId());
		map.put("entity.customer.id", saleVch.getCustomer().getId());
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());		
		
		return;
	}	
	
	@Override
	public Result save(
					RefundmentVch entity, Integer operatorEmpId)
	{
		Double totolAmount = 0.0;
		for (RefundmentVchItem item : entity.getItems())
		{
			totolAmount += item.getAmount();
		}
		
		entity.setPaidAmount(totolAmount - entity.getCustDepositAmount() - entity.getOrderDepositAmount());		
				
		return super.save(entity, operatorEmpId);
	}


	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyyMMdd");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "TK" + seqNum + indexString;
		
		return seqNum;
	}		
	
	@Override
	protected void buildSpeciMapForList(BaseVoucher<RefundmentVchItem> voucher, Map<String, Object> map)
	{
		RefundmentVch refundmentVch= (RefundmentVch)voucher;

		buildSalesVchInfo(refundmentVch, map);
		
		map.put("totalAmount", refundmentVch.getPaidAmount() + refundmentVch.getCustDepositAmount() + refundmentVch.getOrderDepositAmount());
		map.put("paidAmount", refundmentVch.getPaidAmount());
		map.put("dpstRedeemAmount", refundmentVch.getCustDepositAmount() + refundmentVch.getOrderDepositAmount());
	
		return;
	}	

	protected void buildSpeciMapForDetailList(BaseVoucher<RefundmentVchItem> voucher, List<Map<String, Object>> mapList)
	{
		RefundmentVch refundmentVch= (RefundmentVch)voucher;
	
		for (RefundmentVchItem item : voucher.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(voucher);

			buildSalesVchInfo(refundmentVch, map);
			map.put("stockRtVchSeqNum", item.getRefundPerStockRt().getReturnVch().getSequenceNum());
			map.put("amount", item.getAmount());
			
			mapList.add(map);				
		}	
		
		return;
	}	
	
	private void buildSalesVchInfo(RefundmentVch voucher, Map<String, Object>map)
	{
		SaleVch saleVch = voucher.getSaleVch();
		
		map.put("saleVchSeqNum", saleVch.getSequenceNum());
		map.put("custName", saleVch.getCustomer().getName());
		map.put("currencyName", saleVch.getCustomer().getCurrency().getName());			
	}
	
}
