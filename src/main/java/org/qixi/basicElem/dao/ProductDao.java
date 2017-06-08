package org.qixi.basicElem.dao;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.dao.IEntityWithDisableFlagDao;


public interface ProductDao extends IEntityWithDisableFlagDao<Product, Integer>
{
	public List<Product> getAllByCtgList(List<ProductCategory> ctgList);
	public List<Map<String, Object>> getModeNumList();
	public List<Map<String, Object>> getListForReport();
}
