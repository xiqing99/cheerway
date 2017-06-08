package org.qixi.basicElem.service.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.dao.ProdCtgDao;
import org.qixi.basicElem.dao.ProductDao;
import org.qixi.basicElem.service.ProductService;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.springframework.beans.factory.annotation.Autowired;

public class ProductServiceImpl implements ProductService
{
	@Autowired
	ProductDao dao;
	
	@Autowired
	ProdCtgDao ctgDao;
	
	public Map<String, Object> getById(Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		Product product = dao.get(id);		
		
		map.put("entity.id", product.getId());
		map.put("entity.name", product.getName());
		map.put("entity.cost", product.getCost());
		map.put("entity.description", product.getDescription());
		map.put("entity.modelNum", product.getModelNum());
		map.put("entity.subModelNum", product.getSubModelNum());
		map.put("entity.category.id", product.getCategory().getId());
		map.put("entity.unit.id", product.getUnit().getId());
		map.put("entity.disabled", product.getDisabled());
		map.put("entity.type.id", product.getType().getId());

		return map;
	}
	
	public Result save(Product product)
	{
		if(product.getId() == null)
		{
			dao.save(product);
		}else {
			
			dao.update(product);
		}
		
		return new Result();
	}
	
	public List<Map<String, Object>> getAll()
	{		
		return getListByCtg(ProductCategory.RootId);
	}
	
	public List<Map<String, Object>> getListByCtg(Integer ctgId)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<Product> prodList = null;
		
		if (ctgId == ProductCategory.RootId)
		{
			prodList = dao.getAll();
		}else {
			prodList = ctgDao.getProductList(ctgId);
		}
		
		for(Product product : prodList)
		{
			mapList.add(buildEntityMap(product));
		}
		
		return mapList;
		
	}
	
	private Map<String, Object> buildEntityMap(Product product)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("entityId", product.getId());
		map.put("name", product.getName());
		map.put("cost", product.getCost());
		map.put("description", product.getDescription());
		map.put("modelNum", product.getModelNum());
		map.put("subModelNum", product.getSubModelNum());
		map.put("category", product.getCategory().getName());
		map.put("type", product.getType().getName());
		map.put("unit", product.getUnit().getName());
		map.put("unitPerPackage", 1);
		map.put("disabled", product.getDisabled());
		
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
		
		return dao.getComboList();
	}

	@Override
	public List<Map<String, Object>> getDisabledList()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		List<Product> prodList = dao.getAllDisabled();
		
		for(Product product : prodList)
		{
			mapList.add(buildEntityMap(product));
		}
		
		return mapList;
	}	
}
