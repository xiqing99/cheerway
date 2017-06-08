package org.qixi.security.service;

import java.util.List;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.service.IGenericService;
import org.qixi.security.beans.WorkGroup;

public interface WorkGroupService extends IGenericService<WorkGroup>
{
	List<ComboElem> getEmpComboByGroupId(Integer groupId);
}
