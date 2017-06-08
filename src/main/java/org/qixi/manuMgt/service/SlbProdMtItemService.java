package org.qixi.manuMgt.service;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.Result;


public interface SlbProdMtItemService
{
	public List<Map<String, Object>> getAllList();
	public List<Map<String, Object>> getListByCtg(Integer ctgId);
	public Result updSaleInfo(Integer id, boolean saleable, Double stdUnitPrice);
	public List<Map<String, Object>> getUnsaleableList();
}
