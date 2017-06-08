package org.qixi.basicElem.dao;


import java.util.List;




import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.dao.IBaseTreeNodeDao;

public interface ProdCtgDao extends IBaseTreeNodeDao<ProductCategory>
{
	public List<Product> getProductList(Integer ctgId);
}
