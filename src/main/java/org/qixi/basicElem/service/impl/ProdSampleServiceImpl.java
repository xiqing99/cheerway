package org.qixi.basicElem.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.ProdSample;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.dao.ProdCtgDao;
import org.qixi.basicElem.dao.ProdSampleDao;
import org.qixi.basicElem.service.ProdSampleService;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

public class ProdSampleServiceImpl implements ProdSampleService
{
	@Autowired
	ProdSampleDao dao;
	
	@Autowired
	ProdCtgDao ctgDao;

	@Override
	public Map<String, Object> getById(
					Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		ProdSample entity = dao.get(id);		
		
		map.put("entity.id", entity.getId());
		map.put("entity.name", entity.getName());		
		map.put("entity.description", entity.getDescription());
		map.put("entity.category.id", entity.getCategory().getId());
		map.put("entity.customer.id", entity.getCustomer().getId());
		map.put("entity.rspEmp.id", entity.getRspEmp().getId());
		map.put("entity.lendEmp.id", entity.getLendEmp().getId());
		map.put("entity.packDes", entity.getPackDes());
		map.put("entity.picUrl", entity.getPicUrl());
		map.put("entity.notes", entity.getNotes());
		map.put("entity.type", entity.getType());
		map.put("entity.disabled", entity.getDisabled());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(entity.getLendDate() != null)
		{
			String dateString = format.format(entity.getLendDate());						
			map.put("entity.lendDate", dateString );
		}		

		return map;
	}

	@Override
	public Result save(ProdSample entity, Integer empId)
	{
		Result result = new Result();
		
		if(entity.getId() == null || entity.getId() == 0)
		{			
			Integer savedId = dao.save(entity);
			
			result.dataMap = new HashMap<>();
			result.dataMap.put("id", savedId);
			result.dataMap.put("picUrl", entity.getPicUrl());
			
		}else {
			ProdSample sample = dao.get(entity.getId());
			
			if(sample == null)
			{
				result.success = false;
				result.cause = "delete.failure.entityNonExist";
				return result;				
			}
			
			if(!sample.getRspEmp().getId().equals(empId))
			{
				result.success = false;
				result.cause = "updateState.failure.notAllowed";
				return result;					
			}
			
			BeanUtils.copyProperties(entity, sample);
			dao.update(sample);
		}
		
		return new Result();
	}

	@Override
	public Result delById(Integer id, Integer empId)
	{
		Result result = new Result();
		ProdSample sample = dao.get(id);
		result.cause = sample.getPicUrl();
		
		if(!sample.getRspEmp().getId().equals(empId))
		{
			result.success = false;
			result.cause = "updateState.failure.notAllowed";
			return result;					
		}
		
		dao.delete(sample);
		
		result.success = true;

		return result;
	}

	@Override
	public List<Map<String, Object>> getAll()
	{
		
		return getListByCtg(ProductCategory.RootId);
	}

	@Override
	public List<Map<String, Object>> getListByCtg(
					Integer ctgId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<ProdSample> sampleList = null;
		
		if (ctgId == ProductCategory.RootId)
		{
			sampleList = dao.getAll();
		}else {
			
			List<ProductCategory> ctgList = ctgDao.getSubList(ctgId);
			
			sampleList = dao.getAllByCtgList(ctgList);
		}
		
		for(ProdSample sample : sampleList)
		{
			mapList.add(buildEntityForList(sample));
		}
		
		return mapList;
	}

	@Override
	public List<Map<String, Object>> getDisabledList()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<ProdSample> sampleList = dao.getAllDisabled();
		
		for(ProdSample sample : sampleList)
		{
			mapList.add(buildEntityForList(sample));
		}
		
		return mapList;
	}	
	
	private Map<String, Object> buildEntityForList(ProdSample sample)
	{
		Map<String, Object> map = new HashMap<>();
		
		map.put("entityId", sample.getId());
		map.put("name", sample.getName());
		map.put("custName", sample.getCustomer().getName());
		map.put("packDes", sample.getPackDes());
		map.put("type", sample.getType());
		map.put("rspEmpName", sample.getRspEmp().getName());
		map.put("lendEmpName", sample.getLendEmp().getName());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String dateString = format.format(sample.getLendDate());						
		map.put("lendDate", dateString );	
		
		map.put("notes", sample.getNotes());
		
		return map;
	}
	
	@Override
	public Result save(ProdSample entity)
	{
		return null;
	}

	@Override
	public Result delById(Integer id)
	{
		return null;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		return null;
	}

	@Override
	public Result updateLendEmp(
					Integer eneityId,
					Integer empId)
	{
		dao.updateLendEmp(eneityId, empId);
		
		return new Result();
	}

}
