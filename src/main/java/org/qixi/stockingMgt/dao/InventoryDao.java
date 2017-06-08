package org.qixi.stockingMgt.dao;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Store;
import org.qixi.common.dao.IGenericDao;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.stockingMgt.beans.Inventory;
import org.qixi.stockingMgt.beans.StockTakenVchItem;

public interface InventoryDao extends IGenericDao<Inventory, Integer>
{
	public void inputStock(Store store, MtItem item, Double quantity);
	public void outputStock(Store store, MtItem item, Double quantity);
	public boolean isAdequate(Store store, MtItem item, Double quantity);
	public void takeStock(Store store, StockTakenVchItem item);
	
	public List<Inventory> getListByStoreId(Integer storeId);
	public List<Inventory> getProdListByStoreId(Integer storeId);
	
	public Map<String, Double> getProdModelNumQtyMap();
	public Map<Integer, Double> getProdIdQtySumMap();
	
	public Map<Integer, Double> getProdMtItemIdQtyMap();
}
