package org.qixi.basicElem.service.impl;

import java.util.Map;

import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.service.DeptService;
import org.qixi.common.beans.BaseTreeNode;
import org.qixi.common.beans.Result;
import org.qixi.common.service.BaseTreeNodeServiceImpl;

public class DeptServiceImpl extends BaseTreeNodeServiceImpl<Department> implements DeptService
{

	@Override
	public Result save(Department entity)
	{	
		return super.save(entity);
	}

	@Override
	protected void buildSpeciEntityMap(BaseTreeNode<Department> entity, Map<String, Object> map)
	{
		map.put("entity.supNode.id", entity.getSupNode().getId());
	}

}
