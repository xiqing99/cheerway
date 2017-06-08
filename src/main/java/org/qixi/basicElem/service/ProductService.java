package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Product;
import org.qixi.common.service.IGenericService;

public interface ProductService extends IGenericService<Product>
{
	public List<Map<String, Object>> getListByCtg(Integer ctgId);
	public List<Map<String, Object>> getDisabledList();
}
