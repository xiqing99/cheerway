package org.qixi.stockingMgt.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.qixi.common.service.IGenericService;
import org.qixi.stockingMgt.beans.Inventory;

public interface InventoryService extends IGenericService<Inventory>
{
	public List<Map<String, Object>> getAll();
	public List<Map<String, Object>> getListByStore(Integer storeId);
	public List<Map<String, Object>> getProdListByStore(Integer storeId);
	public List<Map<String, Object>> getMonthRptByProduct(Date startDate, Date endDate);
	public List<Map<String, Object>> getMonthRptByProdModelNum(Date startDate,Date endDate);
}
