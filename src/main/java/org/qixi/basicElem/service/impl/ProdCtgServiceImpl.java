package org.qixi.basicElem.service.impl;

import java.util.Map;

import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.service.ProdCtgService;
import org.qixi.common.beans.BaseTreeNode;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseTreeNodeServiceImpl;

public class ProdCtgServiceImpl extends BaseTreeNodeServiceImpl<ProductCategory> implements ProdCtgService
{

	@Override
	public Result save(ProductCategory entity)
	{	
		return super.save(entity);
	}

	@Override
	protected void buildSpeciEntityMap(BaseTreeNode<ProductCategory> entity, Map<String, Object> map)
	{
		map.put("entity.supNode.id", entity.getSupNode().getId());
	}
	
}
