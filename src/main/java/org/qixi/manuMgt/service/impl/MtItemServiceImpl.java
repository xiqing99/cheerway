package org.qixi.manuMgt.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.manuMgt.dao.MtItemDao;
import org.qixi.manuMgt.service.MtItemService;
import org.springframework.beans.factory.annotation.Autowired;

public class MtItemServiceImpl implements MtItemService
{
	@Autowired 
	MtItemDao dao;
	
	@Override
	public List<Map<String, Object>> getAll()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		return mapList;
	}
 
	@Override
	public Result disableById(
					Integer id)
	{
		dao.disableById(id);
		return new Result();
	}	
	
	@Override
	public Map<String, Object> getById(
					Integer id)
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
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Result save(MtItem entity)
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

}
