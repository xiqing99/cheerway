package org.qixi.manuMgt.service;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;
import org.qixi.manuMgt.beans.ProdMtItem;


public interface ProdMtItemService extends IGenericService<ProdMtItem>
{
	public List<Map<String, Object>> getListByCtg(Integer ctgId);
	public Result update(ProdMtItem mtItem);
	public List<Map<String, Object>> getDisabledList();
}
