package org.qixi.accountMgt.service.impl;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.accountMgt.dao.RsvbPerProdSOVchDao;
import org.qixi.accountMgt.service.RsvbPerProdSOVchService;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.stockingMgt.beans.ProdStockOutVch;
import org.springframework.beans.factory.annotation.Autowired;

public class RsvbPerProdSOVchServiceImpl  implements RsvbPerProdSOVchService
{
	@Autowired
	RsvbPerProdSOVchDao dao;

	public RsvbPerProdSOVchDao getDao()
	{
		return dao;
	}

	public void setDao(
					RsvbPerProdSOVchDao dao)
	{
		this.dao = dao;
	}

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		RsvbPerProdSOVch voucher = dao.get(id);
		
		if(voucher == null)
		{
			Map<String, Object> map = new HashMap<>();
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}

		Map<String, Object> map = buildRsvbPerProdSOVchMap(voucher);		
		
		return map;
	}	

	@Override
	public Result save(RsvbPerProdSOVch entity, Integer empId)
	{
		Result result = new Result();
		
		if(entity.getId() == null || entity.getId() == 0)
		{
			result.success = false;
			result.cause = "update.failed.newNotAllowed";
			return result;
		}
		
		RsvbPerProdSOVch voucher = dao.get(entity.getId());
		
		if(voucher == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			return result;
		}

		if(!voucher.getAccountEmp().getId().equals(empId))
		{
			result.success = false;
			result.cause = "updateState.failure.notAllowed";
			return result;				
		}		
		
		voucher.setDeadlineDate(entity.getDeadlineDate());
		voucher.setAccountEmp(entity.getAccountEmp());
		voucher.setExchangeRate(entity.getExchangeRate());
		voucher.setNotes(entity.getNotes());
		
		dao.update(voucher);

		return result;
	}		
	
	@Override
	public List<Map<String, Object>> getListByCreatedDateRange(
					Date startDate,
					Date endDate)
	{
		List<RsvbPerProdSOVch> list = dao.getListByCreatedDateRange(startDate, endDate);

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(RsvbPerProdSOVch voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, null);
						
			mapsList.add(map);			
		}
		
		return mapsList;		
	}

	@Override
	public List<Map<String, Object>> getOverdueList(Date dueDate)
	{
		List<RsvbPerProdSOVch> list = dao.getOverdueList(dueDate);
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(RsvbPerProdSOVch voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, dueDate);

			mapList.add(map);
		}
			
		return mapList;
	}	
	
	@Override
	public List<Map<String, Object>> getListBySaleVchId(Integer saleVchId)
	{
		List<RsvbPerProdSOVch> list = dao.getListBySaleVchId(saleVchId);
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(RsvbPerProdSOVch voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, null);
			
			mapList.add(map);
		}
			
		return mapList;
	}
	
	@Override
	public List<Map<String, Object>> getMyInProgressVchList(
					Integer empId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<RsvbPerProdSOVch> list = dao.getInProgressListByEmpId(empId);
		
		for(RsvbPerProdSOVch voucher : list)
		{
			Map<String, Object> map = new HashMap<String, Object>();		
			
			map.put("voucherId", voucher.getId());
			map.put("rspEmpName", voucher.getAccountEmp().getName());			
			map.put("state", State.AUDITED);
			map.put("sequenceNum", voucher.getStOutVch().getSequenceNum());
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

			if(voucher.getCreatedDate() != null)
			{
				String dateString = format.format(voucher.getCreatedDate());						
				map.put("createdDate", dateString );
			}			
			
			if(voucher.getNotes() != null)
				map.put("notes", voucher.getNotes());
			
			mapList.add(map);	
		}
		
		return mapList;
	}		
	
	private Map<String, Object> buildRsvbPerProdSOVchMap(RsvbPerProdSOVch voucher)
	{
		Map<String, Object> map = new HashMap<>();
		
		voucher.buildMapForEntity(map);
	
		ProdStockOutVch stockOutVch = voucher.getStOutVch();
		
		map.put("osVoucherSeqNum", stockOutVch.getSequenceNum());
		map.put("saleVchSeqNum", stockOutVch.getSaleVch().getSequenceNum());
		map.put("saleVchPayMode", stockOutVch.getSaleVch().getPaymentMode().getName());
		map.put("saleVchRspEmpName", stockOutVch.getSaleVch().getRspEmp().getName());		
		
		return map;		
	}

	private Map<String, Object> buildEntityMapForList(RsvbPerProdSOVch voucher, Date dueDate)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		voucher.buildMapForList(map, dueDate);
		
		ProdStockOutVch stockOutVch = voucher.getStOutVch();
		
		map.put("osVoucherSeqNum", stockOutVch.getSequenceNum());
		map.put("saleVchSeqNum", stockOutVch.getSaleVch().getSequenceNum());
		map.put("saleVchPayMode", stockOutVch.getSaleVch().getPaymentMode().getName());
		map.put("saleVchRspEmpName", stockOutVch.getSaleVch().getRspEmp().getName());	
		
		return map;		
	}

	@Override
	public List<Map<String, Object>> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		List<RsvbPerProdSOVch> list = dao.getMyListByCreatedDateAndEmpId(startDate, endDate, empId);

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(RsvbPerProdSOVch voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, null);
						
			mapsList.add(map);			
		}
		
		return mapsList;
	}	
	
}
