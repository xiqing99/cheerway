package org.qixi.accountMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.DepositVch;
import org.qixi.accountMgt.beans.DepositVchItem;
import org.qixi.accountMgt.service.DepositVchService;
import org.qixi.basicElem.dao.CustomerDao;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.salesMgt.dao.SaleVchDao;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

public class DepositVchServiceImpl extends BaseVoucherServiceImpl<DepositVchItem>
										implements DepositVchService
{	
	@Autowired
	SaleVchDao saleVchDao;
	
	@Autowired
	CustomerDao custDao;
	
	@Override
	protected Result auditAction(BaseVoucher<DepositVchItem> voucher)
	{
		DepositVch depositVch = (DepositVch)voucher;
		
		for(DepositVchItem item : voucher.getItems())
		{
			saleVchDao.updateDepositAmount(item.getSaleVch().getId(), item.getSaleVch().getDepositAmount() + item.getAmount());
		}	
		
		if(!depositVch.getCustDepositAmount().equals(0.0))
		{
			custDao.updateDepositAmount(depositVch.getCustomer().getId(), depositVch.getCustomer().getDepositAmount() + depositVch.getCustDepositAmount());
		}
		
		return new Result();
	}
	
	@Override
	protected void buildSpeciMap(BaseVoucher<DepositVchItem> voucher, Map<String, Object> map)
	{
		DepositVch depositVoucher = (DepositVch)voucher;
		
		map.put("entity.custDepositAmount", depositVoucher.getCustDepositAmount());
		map.put("entity.customer.id", depositVoucher.getCustomer().getId());
		map.put("entity.currencyName", depositVoucher.getCustomer().getCurrency().getName());

		List<Map<String, Object>> itemList = new ArrayList<>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		for(DepositVchItem item : voucher.getItems())
		{
			Map<String, Object> itemMap = new HashMap<String, Object>();
			
			itemMap.put("amount", item.getAmount());

			SaleVch saleVch = item.getSaleVch();

			itemMap.put("saleVchSeqNum", saleVch.getSequenceNum());
			itemMap.put("saleVchId", saleVch.getId());
			itemMap.put("totalAmount", saleVch.getTotalPrice());
			itemMap.put("saleVchAuditedDate", format.format(saleVch.getApprovedTime()));
			
			itemList.add(itemMap);
		}
		
		map.put("itemList", itemList);		
		
		return;
	}

	@Override
	protected void buildSpeciMapForList(BaseVoucher<DepositVchItem> voucher, Map<String, Object> map)
	{
		DepositVch depositVoucher = (DepositVch)voucher;
		
		map.put("custName", depositVoucher.getCustomer().getName());		
		
		Double totalAmount = depositVoucher.getCustDepositAmount();
		for(DepositVchItem item : depositVoucher.getItems())
		{
			totalAmount += item.getAmount();
		}

		map.put("currencyName", depositVoucher.getCustomer().getCurrency().getName());
		map.put("totalAmount", totalAmount);
		map.put("payWay", depositVoucher.getPayWay());
		return;
	}	

	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<DepositVchItem> voucher, List<Map<String, Object>> mapList)
	{
		DepositVch depositVoucher = (DepositVch)voucher;

		Map<String, Object> map = buildEntityMapForList(voucher);
		
		map.put("custName", depositVoucher.getCustomer().getName());		
		map.put("amount", depositVoucher.getCustDepositAmount());
		map.put("currencyName", depositVoucher.getCustomer().getCurrency().getName());		
		mapList.add(map);		
		
		for (DepositVchItem item : voucher.getItems())
		{
			map = buildEntityMapForList(voucher);
			
			map.put("custName", depositVoucher.getCustomer().getName());		
			map.put("custDepositAmount", depositVoucher.getCustDepositAmount());
			map.put("saleVchSeqNum", item.getSaleVch().getSequenceNum());
			map.put("currencyName", depositVoucher.getCustomer().getCurrency().getName());
			map.put("amount", item.getAmount());
			
			mapList.add(map);				
		}		
		return;
	}	
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyyMMdd");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "YS" + seqNum + indexString;
		
		return seqNum;
	}

	@Override
	public Result save(
					DepositVch entity, Integer operatorEmpId)
	{
		Result result = new Result();
		
		Integer id = entity.getId();
		
		if(id == null || id == 0)
		{
			String seqNum = generateSeqNum();
			entity.setSequenceNum(seqNum);	
			
			Integer savedId = dao.save(entity);
			
			result.dataMap = new HashMap<>();
			result.dataMap.put("id", savedId);
			result.dataMap.put("seqNum", seqNum);
			
		}else {			
			BaseVoucher<DepositVchItem> voucher = dao.get(id);

			if(voucher == null)
			{
				result.success = false;
				result.cause = "delete.failure.entityNonExist";
				return result;
			}			
			
			if(voucher.getState() == VoucherState.State.AUDITED)
			{
				result = updateAfterAudited(voucher);
				if(result.success != true)			
					return result;
			}		
			
			if(!voucher.getRspEmp().getId().equals(operatorEmpId) && !voucher.getAuditEmp().getId().equals(operatorEmpId))
			{
				result.success = false;
				result.cause = "updateState.failure.notAllowed";
				return result;				
			}
			
			List<DepositVchItem> list = voucher.getItems();
			list.clear();
			list.addAll(entity.getItems());
			
			BeanUtils.copyProperties(entity, voucher);
			voucher.setItems(list);
			
			dao.update(voucher);				
		}		
		
		return result;
	}	
	
	
	public List<Map<String, Object>> getSalesVchByCust(Integer custId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<SaleVch> vchList = saleVchDao.getListByCustAndState(custId, State.AUDITED);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		for(SaleVch saleVch : vchList)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("saleVchId", saleVch.getId());
			map.put("saleVchSeqNum", saleVch.getSequenceNum());
			map.put("totalAmount", saleVch.getTotalPrice());	
			map.put("currencyName", saleVch.getCustomer().getCurrency().getName());					
		    map.put("auditedDate", format.format(saleVch.getApprovedTime()) );
		    map.put("rspEmpName", saleVch.getRspEmp().getName());
			mapList.add(map);
		}
		
		return mapList;
	}

	@Override
	public Double getDepositeForSaleVch(
					Integer vchId)
	{
		return saleVchDao.getDepositValue(vchId);
	}					
	
	
	@Override
	public Map<String, Object> getDepositForCust(
					Integer custId)
	{
		return custDao.getDepositInfo(custId);
	}

	@Override
	public List<Map<String, Object>> getDepositAmountPerSaleVchList()
	{
		return saleVchDao.getListWithDeposit();
	}

	@Override
	public List<Map<String, Object>> getDepositAmountPerCustList()
	{
		
		return custDao.getListWithDeposit();
	}
}
