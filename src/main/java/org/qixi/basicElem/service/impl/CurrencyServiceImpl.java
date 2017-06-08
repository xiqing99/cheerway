package org.qixi.basicElem.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Currency;
import org.qixi.basicElem.dao.CurrencyDao;
import org.qixi.basicElem.service.CurrencyService;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.springframework.beans.factory.annotation.Autowired;

public class CurrencyServiceImpl implements CurrencyService
{
	@Autowired
	CurrencyDao dao;
	
	public Map<String, Object> getById(Integer id)
	{
		return null;
	}

	@Override
	public Result save(Currency entity)
	{
		if(entity.getId() == null || entity.getId() == 0)
		{
			dao.save(entity);
		}else {
			dao.update(entity);
		}		
		
		return new Result();	
	}

	@Override
	public Result delById(Integer id)
	{
		Result result = new Result();

		dao.deleteById(id);

		return result;		
	}

	@Override
	public List<Map<String, Object>> getAll()
	{
		List<Map<String, Object>> list = new ArrayList<>();		
		
		for(Currency entity : dao.getAll())
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("id", entity.getId());
			map.put("name", entity.getName());
			map.put("description", entity.getDescription());
			map.put("exchangeRate", entity.getExchangeRate());
			list.add(map);
		}
		
		return list;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		return dao.getComboList();
	}
	

}
