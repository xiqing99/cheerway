package org.qixi.manuMgt.service.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.manuMgt.dao.ProdMtItemDao;
import org.qixi.manuMgt.service.ProdMtItemService;
import org.springframework.beans.factory.annotation.Autowired;

public class ProdMtItemServiceImpl implements ProdMtItemService
{
	@Autowired 
	ProdMtItemDao dao;	
	
	@Override
	public List<Map<String, Object>> getAll()
	{
		List<ProdMtItem> list = dao.getAll();
		
		return buildMapList(list);
	}
	
	@Override
	public Map<String, Object> getById(
					Integer id)
	{	
		ProdMtItem mtItem = dao.get(id);
		Map<String, Object> map = new HashMap<>();
		
		map.put("entity.id", mtItem.getId());
		map.put("entity.product.name", mtItem.getProduct().getName());
		map.put("entity.colorModel", mtItem.getColorModel());
		map.put("entity.createdEmp.name", mtItem.getCreatedEmp().getName());
		map.put("entity.custModelNum", mtItem.getCustModelNum());
		map.put("entity.description", mtItem.getDescription());
		map.put("entity.disabled", mtItem.getDisabled());
		map.put("entity.materialNum", mtItem.getMaterialNum());
		map.put("entity.maxQuantityInStock", mtItem.getMaxQuantityInStock());
		map.put("entity.minQuantityInStock", mtItem.getMinQuantityInStock());
		map.put("entity.name", mtItem.getName());
		map.put("entity.orderSeqNum", mtItem.getOrderSeqNum());
		map.put("entity.packageModel", mtItem.getPackageModel());
		map.put("entity.source", mtItem.getSource());
		map.put("entity.type", mtItem.getType());
		map.put("entity.stdUnitPrice", mtItem.getStdUnitPrice());
		map.put("entity.unit.id", mtItem.getUnit().getId());
		map.put("entity.unitCost", mtItem.getUnitCost());
		
		return map;
	}

	@Override
	public Result delById(Integer id)
	{		
		Result result = new Result();
		
		dao.deleteById(id);
		
		result.success = true;
		return result;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Result save(ProdMtItem entity)
	{
		Result result = new Result();
		
		if(entity.getId() == null || entity.getId() == 0)
		{
			dao.save(entity);
		}else {
			dao.update(entity);
		}		
		
		return result;
	}

	@Override
	public List<Map<String, Object>> getListByCtg(Integer ctgId)
	{
		if(ctgId == 1)
			return getAll();
		
		List<ProdMtItem> list = dao.getListByProdCtg(ctgId);
		
		return buildMapList(list);
	}
	
	private List<Map<String, Object>> buildMapList(List<ProdMtItem> list)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		
		for(ProdMtItem item : list)
		{
			Map<String, Object> map = new HashMap<String, Object>();

			map.put("mtItemId", item.getId());
			map.put("mtNum", item.getMaterialNum());
			map.put("mtName", item.getName());
			map.put("unit", item.getUnit().getName());
			map.put("unitPrice", item.getStdUnitPrice());
			map.put("mtDscp", item.getDescription());
			
			Product product = item.getProduct();
			
			map.put("subModelNum", product.getSubModelNum());
			map.put("modelNum", product.getModelNum());
			map.put("ctgName", product.getCategory().getName());
				
			map.put("custModelNum", item.getCustModelNum());		
			map.put("orderSeqNum", item.getOrderSeqNum());
			map.put("colorModel", item.getColorModel());
			map.put("packageModel", item.getPackageModel());
			map.put("disabled", item.getDisabled());
			mapList.add(map);
		}
		
		return mapList;
	}

	@Override
	public Result update(
					ProdMtItem mtItem)
	{
		Result result = new Result();
		
		ProdMtItem itemP = dao.get(mtItem.getId());
		
		if(itemP == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			return result;
		}
		
		itemP.setMaterialNum(mtItem.getMaterialNum());
		itemP.setName(mtItem.getName());
		itemP.setStdUnitPrice(mtItem.getStdUnitPrice());
		itemP.setUnitCost(mtItem.getStdUnitPrice());
		itemP.setDescription(mtItem.getDescription());
		itemP.setDisabled(mtItem.getDisabled());
		dao.update(itemP);
		
		return result;
	}

	@Override
	public List<Map<String, Object>> getDisabledList()
	{
		List<ProdMtItem> list = dao.getAllDisabled();
		
		return buildMapList(list);
	}

}
