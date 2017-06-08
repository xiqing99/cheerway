package org.qixi.accountMgt.service.impl;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.dao.RefundPerStockRtDao;
import org.qixi.accountMgt.service.RefundPerStockRtService;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.stockingMgt.beans.ProdStockReturnVch;
import org.springframework.beans.factory.annotation.Autowired;

public class RefundPerStockRtServiceImpl implements RefundPerStockRtService
{
	@Autowired
	RefundPerStockRtDao dao;

	public RefundPerStockRtDao getDao()
	{
		return dao;
	}

	public void setDao(
					RefundPerStockRtDao dao)
	{
		this.dao = dao;
	}

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		RefundPerStockRt voucher = dao.get(id);
		
		if(voucher == null)
		{
			Map<String, Object> map = new HashMap<>();
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}

		Map<String, Object> map = buildRefundPerStockRtMap(voucher);		
		
		return map;
	}	

	@Override
	public Result save(RefundPerStockRt entity, Integer empId)
	{
		Result result = new Result();
		
		if(entity.getId() == null || entity.getId() == 0)
		{
			result.success = false;
			result.cause = "update.failed.newNotAllowed";
			return result;
		}
		
		RefundPerStockRt voucher = dao.get(entity.getId());
		
		if(voucher == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			return result;
		}
		
/*		if(!voucher.getAccountEmp().getId().equals(empId))
		{
			result.success = false;
			result.cause = "updateState.failure.notAllowed";
			return result;				
		}*/
		
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
		List<RefundPerStockRt> list = dao.getListByCreatedDateRange(startDate, endDate);

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(RefundPerStockRt voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, null);
						
			mapsList.add(map);			
		}
		
		return mapsList;		
	}

	
	@Override
	public List<Map<String, Object>> getOverdueList(Date dueDate)
	{
		List<RefundPerStockRt> list = dao.getOverdueList(dueDate);
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(RefundPerStockRt voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, dueDate);

			mapList.add(map);
		}
			
		return mapList;
	}	
	
	@Override
	public List<Map<String, Object>> getListBySaleVchId(Integer saleVchId)
	{
		List<RefundPerStockRt> list = dao.getListBySaleVchId(saleVchId);
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(RefundPerStockRt voucher : list)
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
		List<RefundPerStockRt> list = dao.getInProgressListByEmpId(empId);
		
		for(RefundPerStockRt voucher : list)
		{
			Map<String, Object> map = new HashMap<String, Object>();		
			
			map.put("voucherId", voucher.getId());
			map.put("rspEmpName", voucher.getAccountEmp().getName());			
			map.put("state", State.AUDITED);
			
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
	
	private Map<String, Object> buildRefundPerStockRtMap(RefundPerStockRt voucher)
	{
		Map<String, Object> map = new HashMap<>();
		
		voucher.buildMapForEntity(map);
	
		ProdStockReturnVch stockRtVch = voucher.getReturnVch();
		
		map.put("stockRtVchSeqNum", stockRtVch.getSequenceNum());
		map.put("saleVchSeqNum", stockRtVch.getSaleVch().getSequenceNum());
		map.put("saleVchRspEmpName", stockRtVch.getSaleVch().getRspEmp().getName());		
		
		return map;		
	}

	private Map<String, Object> buildEntityMapForList(RefundPerStockRt voucher, Date dueDate)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		voucher.buildMapForList(map, dueDate);
		
		ProdStockReturnVch stockRtVch = voucher.getReturnVch();
		
		map.put("stockRtVchSeqNum", stockRtVch.getSequenceNum());
		map.put("saleVchSeqNum", stockRtVch.getSaleVch().getSequenceNum());
		map.put("saleVchRspEmpName", stockRtVch.getSaleVch().getRspEmp().getName());	
		
		return map;		
	}

	@Override
	public List<Map<String, Object>> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		List<RefundPerStockRt> list = dao.getMyListByCreatedDateAndEmpId(startDate, endDate, empId);

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(RefundPerStockRt voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher, null);
						
			mapsList.add(map);			
		}
		
		return mapsList;	
	}	
		
}
