
package org.qixi.common.service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.dao.IBaseVoucherDao;
import org.springframework.beans.BeanUtils;

public  class BaseVoucherServiceImpl<T> 
{
	private static Integer DefalultCriteraRootId = 1;
	
	protected IBaseVoucherDao<BaseVoucher<T>> dao;

	public Map<String, Object> getById(Integer id)
	{				
		BaseVoucher<T> voucher = dao.get(id);
		
		if(voucher == null)
		{
			Map<String, Object> map = new HashMap<>();
			map.put("failureCause", "load.failure.entityNotExist");
			return map;
		}

		Map<String, Object> map = buildBaseVoucherMap(voucher);		
		
		buildSpeciMap(voucher, map);
		
		return map;
	}	
	
	public List<Map<String, Object>> getListByCreatedDateRange(
					Date startDate,
					Date endDate,
					Integer criteraId)
	{
		List<BaseVoucher<T>>  list;
		
		if(criteraId == getCriteraRootId())
		{	
			list = dao.getListByCreatedDateRange(startDate, endDate);
		}else {
			list =  dao.getListByCreatedDateRangeAndCriteriaId(startDate, endDate, getCriteraName(), criteraId);
		}
		
		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(BaseVoucher<T> voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher);
							
			buildSpeciMapForList(voucher, map);
						
			mapsList.add(map);			
		}
		
		return mapsList;
	}
	
	public List<Map<String, Object>> getDetailListByCreatedDateRange(
					Date startDate,
					Date endDate,
					Integer criteraId)
	{
		List<BaseVoucher<T>>  list;
		
		if(criteraId == getCriteraRootId())
		{
			list = dao.getListByCreatedDateRange(startDate, endDate);
		}else {
			list =  dao.getListByCreatedDateRangeAndCriteriaId(startDate, endDate, getCriteraName(), criteraId);
		}

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(BaseVoucher<T> voucher : list)
		{
			buildSpeciMapForDetailList(voucher, mapsList);
		}
		
		return mapsList;
	}	

	public List<Map<String, Object>> getListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		List<BaseVoucher<T>>  list = dao.getListByCreatedDateAndEmpId(startDate, endDate, empId);
		
		
		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(BaseVoucher<T> voucher : list)
		{
			Map<String, Object> map = buildEntityMapForList(voucher);
							
			buildSpeciMapForList(voucher, map);
						
			mapsList.add(map);			
		}
		
		return mapsList;
	}
	
	public List<Map<String, Object>> getDetailListByCreatedDateAndEmpId(
					Date startDate,
					Date endDate,
					Integer empId)
	{
		List<BaseVoucher<T>>  list = dao.getListByCreatedDateAndEmpId(startDate, endDate, empId);

		List<Map<String, Object>> mapsList = new ArrayList<>();
		
		for(BaseVoucher<T> voucher : list)
		{
			buildSpeciMapForDetailList(voucher, mapsList);
		}
		
		return mapsList;
	}		
	
	public Result delById(Integer id, Integer operatorEmpId)
	{	
		Result result = new Result();
		
		BaseVoucher<T> voucher = dao.get(id);
		
		if(voucher == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			return result;
		}
		
		if(voucher.getState() != VoucherState.State.PROPOSED)
		{
			result.success = false;
			result.cause = "delete.failure.order.wrongState";
			return result;
		}

		if(!voucher.getRspEmp().getId().equals(operatorEmpId) && !voucher.getAuditEmp().getId().equals(operatorEmpId))
		{
			result.success = false;
			result.cause = "updateState.failure.notAllowed";
			return result;				
		}		
		
		dao.delete(voucher);	
		
		result.success = true;
		return result;	
	}

	public Result save(
					BaseVoucher<T> entity, Integer operatorEmpId)
	{
		Result result = new Result();

		if(entity.getItems().size() == 0)
		{
			result.success = false;
			result.cause = "save.failure.itemsNull";
			return result;
		}
		
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
			BaseVoucher<T> voucher = dao.get(id);

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
			
			List<T> list = voucher.getItems();
			list.clear();
			list.addAll(entity.getItems());
			
			BeanUtils.copyProperties(entity, voucher);
			voucher.setItems(list);
			
			dao.update(voucher);				
		}			
		return result;
	}

	public Result updateState(State newState, Integer voucherId, Integer operatorEmpId)
	{
		Result result = new Result();
		
		BaseVoucher<T> voucher = dao.get(voucherId);
		
		if (voucher == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			return result;	
		}		
		
		if(voucher.getState() == newState)
		{
			result.success = false;
			result.cause = "updateState.failure.sameState";
			return result;
		}		
		
		switch (newState)
		{
			case PROPOSED:
			{
				if(!voucher.getAuditEmp().getId().equals(operatorEmpId))
				{
					result.success = false;
					result.cause = "updateState.failure.notAllowed";
					return result;	
				}
				result = reProposeAction(voucher);
				break;
			}
			case FL_AUDITED:
			{
				if(!voucher.getFirstLevelAuditEmp().getId().equals(operatorEmpId))
				{
					result.success = false;
					result.cause = "updateState.failure.notAllowed";
					return result;	
				}
				result = firstLevelAuditAction(voucher);
				break;
			}
			case AUDITED:
			{
				if(!voucher.getAuditEmp().getId().equals(operatorEmpId))
				{
					result.success = false;
					result.cause = "updateState.failure.notAllowed";
					return result;	
				}
				
				result = auditAction(voucher);
				break;
			}	
			case CANCELLED:
			{
				result = cancelAction(voucher);
				break;
			}
			case COMPLETED:
				result = completeAction(voucher);
				break;
				
			default:
				break;
		}
		
		
		if(result.success != true)
			return result;
		
		dao.updateState(newState, voucherId);
		return result;
	}

	public List<Map<String, Object>> getMyInProgressVchList(Integer empId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<BaseVoucher<T>> list = dao.getInProgressListByEmpId(empId);
		
		for(BaseVoucher<T> vch : list)
		{
			mapList.add(buildEntityMapForList(vch));
		}
		
		return mapList;
	}
	
	protected Map<String, Object> buildBaseVoucherMap(BaseVoucher<T> voucher)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("entity.id", voucher.getId());
		
		if(voucher.getAuditEmp() != null)
			map.put("entity.auditEmp.id", voucher.getAuditEmp().getId());

		if(voucher.getFirstLevelAuditEmp() != null)
			map.put("entity.firstLevelAuditEmp.id", voucher.getFirstLevelAuditEmp().getId());		
		
		map.put("entity.rspEmp.id", voucher.getRspEmp().getId());
		map.put("entity.dept.id", voucher.getDept().getId());
		map.put("entity.sequenceNum", voucher.getSequenceNum());
		map.put("entity.state", voucher.getState());
		
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(voucher.getCreatedDate() != null)
		{
			String dateString = format.format(voucher.getCreatedDate());						
			map.put("entity.createdDate", dateString );
		}

		if(voucher.getApprovedTime() != null)
		{
			String dateString = format.format(voucher.getApprovedTime());						
			map.put("entity.approvedTime", dateString );
		}
		
		return map;		
	}
	
	protected void buildSpeciMap(BaseVoucher<T> voucher, Map<String, Object> map)
	{
		return;
	}

	protected void buildSpeciMapForList(BaseVoucher<T> voucher, Map<String, Object> map)
	{
		return;
	}	

	protected void buildSpeciMapForDetailList(BaseVoucher<T> voucher, List<Map<String, Object>> mapList)
	{
		return;
	}		
	
	protected Map<String, Object> buildEntityMapForList(BaseVoucher<T> voucher)
	{
		Map<String, Object> map = new HashMap<String, Object>();		
		
		map.put("voucherId", voucher.getId());
		
		if(voucher.getAuditEmp() != null)
			map.put("auditEmpName", voucher.getAuditEmp().getName());

		if(voucher.getFirstLevelAuditEmp() != null)
			map.put("firstLevelAuditEmpName", voucher.getFirstLevelAuditEmp().getName());		
		
		if(voucher.getDept() != null)
		{
			map.put("deptName", voucher.getDept().getName());
		}
		map.put("rspEmpName", voucher.getRspEmp().getName());
		map.put("sequenceNum", voucher.getSequenceNum());
		map.put("state", voucher.getState());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(voucher.getCreatedDate() != null)
		{
			String dateString = format.format(voucher.getCreatedDate());						
			map.put("createdDate", dateString );
		}
		
		if(voucher.getApprovedTime() != null)
		{
			String dateString = format.format(voucher.getApprovedTime());						
			map.put("approvedTime", dateString);			
		}
		
		if(voucher.getNotes() != null)
			map.put("notes", voucher.getNotes());
		
		return map;		
	}	

	protected String generateSeqNum()
	{
		
		return null;
	}	

	protected String getCriteraName()
	{
		return null;
	}	
	
	protected Integer getCriteraRootId()
	{
		return DefalultCriteraRootId;
	}
	
	protected Result auditAction(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		return result;
	}

	protected Result firstLevelAuditAction(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		return result;
	}	
	
	protected Result reProposeAction(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		result.success = false;
		result.cause = "updateState.failure.notAllowed";
		return result;
	}
	
	protected Result completeAction(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		return result;
	}	

	protected Result cancelAction(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		return result;
	}		
	
	protected Result updateAfterAudited(BaseVoucher<T> voucher)
	{
		Result result = new Result();
		
		result.success = false;
		result.cause = "updateState.failure.notAllowed";
		return result;
	}

	public IBaseVoucherDao<BaseVoucher<T>> getDao()
	{
		return dao;
	}

	public void setDao(
					IBaseVoucherDao<BaseVoucher<T>> dao)
	{
		this.dao = dao;
	}	
}
