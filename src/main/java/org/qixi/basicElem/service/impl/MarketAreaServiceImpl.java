package org.qixi.basicElem.service.impl;

import java.util.Map;

import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.service.MarketAreaService;
import org.qixi.common.beans.BaseTreeNode;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseTreeNodeServiceImpl;

public class MarketAreaServiceImpl extends BaseTreeNodeServiceImpl<MarketArea> implements MarketAreaService
{

	@Override
	public Result save(MarketArea entity)
	{	
		return super.save(entity);
	}

	@Override
	protected void buildSpeciEntityMap(BaseTreeNode<MarketArea> entity, Map<String, Object> map)
	{
		map.put("entity.supNode.id", entity.getSupNode().getId());
	}
	
}
