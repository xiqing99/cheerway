package org.qixi.accountMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.ReceiptVchItem;
import org.qixi.accountMgt.beans.ReceiptVch;
import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.accountMgt.dao.RsvbPerProdSOVchDao;
import org.qixi.accountMgt.service.ReceiptVchService;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.dao.CustomerDao;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.salesMgt.dao.SaleVchDao;
import org.springframework.beans.factory.annotation.Autowired;

public class ReceiptVchServiceImpl extends BaseVoucherServiceImpl<ReceiptVchItem> 
										implements ReceiptVchService
{	
	@Autowired
	SaleVchDao saleVchDao;
	
	@Autowired 
	RsvbPerProdSOVchDao rsvableDao;	
	
	@Autowired
	CustomerDao custDao;

	@Override
	protected Result auditAction(BaseVoucher<ReceiptVchItem> voucher)
	{
		ReceiptVch receiptVoucher= (ReceiptVch)voucher;
		
		Result result = checkValidityForAudit(receiptVoucher);
		
		if(result.success != true)
			return result;
		
		
		for(ReceiptVchItem item : receiptVoucher.getItems())
		{			
			rsvableDao.receive(item.getReceiable(), item.getAmount());
		}
		
		if(!receiptVoucher.getCustDpstRdmAmount().equals(0.0))
		{
			Customer cust = receiptVoucher.getSaleVch().getCustomer();
			custDao.updateDepositAmount(cust.getId(), cust.getDepositAmount() - receiptVoucher.getCustDpstRdmAmount());
		}

		if(!receiptVoucher.getOrderDpstRdmAmount().equals(0.0))
		{
			SaleVch saleVch = receiptVoucher.getSaleVch();
			
			saleVchDao.updateDepositAmount(saleVch.getId(), saleVch.getDepositAmount() - receiptVoucher.getOrderDpstRdmAmount());					
		}	
		
		return result;
	}

	private Result checkValidityForAudit(ReceiptVch voucher)
	{
		Result result = new Result();				

		for(ReceiptVchItem item : voucher.getItems())
		{
			RsvbPerProdSOVch receivable = item.getReceiable();
			
			if(item.getAmount() > receivable.getRemainedAmount())
			{
				result.success = false;
				result.cause ="account.failure.receivableOutOfRange";
				return result;
			}
			
		}		

		if(voucher.getSaleVch().getDepositAmount() < voucher.getOrderDpstRdmAmount())
		{
			result.success = false;
			result.cause ="account.failure.depositIsOutofRange";
			return result;
		}
		
		if(voucher.getSaleVch().getCustomer().getDepositAmount() < voucher.getCustDpstRdmAmount())
		{
			result.success = false;
			result.cause ="account.failure.depositIsOutofRange";
			return result;
		}
		
		return result;
	}

	@Override
	protected void buildSpeciMap(BaseVoucher<ReceiptVchItem> voucher, Map<String, Object> map)
	{
		ReceiptVch receiptVoucher= (ReceiptVch)voucher;

		map.put("entity.account", receiptVoucher.getAccount());
		map.put("entity.receivedAmount", receiptVoucher.getReceivedAmount());
		map.put("entity.custDpstRdmAmount", receiptVoucher.getCustDpstRdmAmount());
		map.put("entity.orderDpstRdmAmount", receiptVoucher.getOrderDpstRdmAmount());
		
		List<Map<String, Object>> itemList = new ArrayList<>();
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		for(ReceiptVchItem item : receiptVoucher.getItems())
		{
			Map<String, Object> itemMap = new HashMap<>();
			
			RsvbPerProdSOVch rsvb = item.getReceiable();
			
			itemMap.put("id", item.getId());
			itemMap.put("rsvbVchId", rsvb.getId());
			itemMap.put("osVoucherSeqNum", rsvb.getStOutVch().getSequenceNum());
			itemMap.put("amount", item.getAmount());
			itemMap.put("createdDate", format.format(rsvb.getCreatedDate()));
			itemMap.put("totalAmount", rsvb.getTotalAmount());
			itemList.add(itemMap);
		}
		
		map.put("itemList", itemList);		

		SaleVch saleVch = receiptVoucher.getSaleVch();
		
		map.put("entity.saleVch.id", saleVch.getId());
		map.put("entity.customer.id", saleVch.getCustomer().getId());
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());	
		map.put("entity.custDeposit", saleVch.getCustomer().getDepositAmount());
		map.put("entity.orderDeposit", saleVch.getDepositAmount());
		
		return;
	}	
	
	@Override
	public Result save(
					ReceiptVch entity, Integer operatorEmpId)
	{
		Double totalAmount = 0.0;
		for (ReceiptVchItem item : entity.getItems())
		{
			totalAmount += item.getAmount();
		}
		
		Double inputAmount = entity.getReceivedAmount() + entity.getCustDpstRdmAmount() + entity.getOrderDpstRdmAmount();
		
		System.out.println(totalAmount);
		System.out.println(inputAmount);
		
		if( !totalAmount.equals(inputAmount))
		{
			Result result = new Result();
			
			result.success = false;
			result.cause = "save.failure.invalidData";
			
			return result;
		}
				
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
		
		seqNum = "SK" + seqNum + indexString;
		
		return seqNum;
	}		
	
	@Override
	protected void buildSpeciMapForList(BaseVoucher<ReceiptVchItem> voucher, Map<String, Object> map)
	{
		ReceiptVch receiptVoucher= (ReceiptVch)voucher;

		buildSalesVchInfo(receiptVoucher, map);
		
		map.put("totalAmount", receiptVoucher.getReceivedAmount() + receiptVoucher.getCustDpstRdmAmount() + receiptVoucher.getOrderDpstRdmAmount());
		map.put("paidAmount", receiptVoucher.getReceivedAmount());
		map.put("dpstRedeemAmount", receiptVoucher.getCustDpstRdmAmount() + receiptVoucher.getOrderDpstRdmAmount());
		map.put("payWay", receiptVoucher.getPayWay());		
		
		return;
	}	

	protected void buildSpeciMapForDetailList(BaseVoucher<ReceiptVchItem> voucher, List<Map<String, Object>> mapList)
	{
		ReceiptVch receiptVoucher= (ReceiptVch)voucher;
	
		for (ReceiptVchItem item : voucher.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(voucher);

			buildSalesVchInfo(receiptVoucher, map);
			map.put("payWay", receiptVoucher.getPayWay());	
			map.put("osVoucherSeqNum", item.getReceiable().getStOutVch().getSequenceNum());
			map.put("amount", item.getAmount());
			
			mapList.add(map);				
		}	
		
		return;
	}	
	
	private void buildSalesVchInfo(ReceiptVch voucher, Map<String, Object>map)
	{
		SaleVch saleVch = voucher.getSaleVch();
		
		map.put("saleVchSeqNum", saleVch.getSequenceNum());
		map.put("custName", saleVch.getCustomer().getName());
		map.put("currencyName", saleVch.getCustomer().getCurrency().getName());			
	}

	@Override
	public Map<String, Object> createNewByRsvbId(Integer rsvbId)
	{
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		RsvbPerProdSOVch rsvb = rsvableDao.get(rsvbId);
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("entity.state", State.PROPOSED);
		
		map.put("entity.receivedAmount", 0);
		map.put("entity.custDpstRdmAmount", 0);
		map.put("entity.orderDpstRdmAmount", 0);
		
		List<Map<String, Object>> itemList = new ArrayList<>();			
		Map<String, Object> itemMap = new HashMap<>();		
		
		itemMap.put("rsvbVchId", rsvb.getId());
		itemMap.put("osVoucherSeqNum", rsvb.getStOutVch().getSequenceNum());
		itemMap.put("amount", rsvb.getTotalAmount());
		itemMap.put("createdDate", format.format(rsvb.getCreatedDate()));
		itemMap.put("totalAmount", rsvb.getTotalAmount());
		
		itemList.add(itemMap);
		map.put("itemList", itemList);		

		SaleVch saleVch = rsvb.getStOutVch().getSaleVch();
		
		map.put("entity.saleVch.id", saleVch.getId());
		map.put("entity.customer.id", saleVch.getCustomer().getId());
		map.put("entity.currencyName", saleVch.getCustomer().getCurrency().getName());	
		map.put("entity.custDeposit", saleVch.getCustomer().getDepositAmount());
		map.put("entity.orderDeposit", saleVch.getDepositAmount());

		return map;
	}
	
}
