package org.qixi.basicElem.dao.hibernate;

import java.util.List;

import org.qixi.common.dao.BaseTreeNodeDAOImpl;
import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.dao.ProdCtgDao;


public class ProdCtgDaoImpl extends BaseTreeNodeDAOImpl<ProductCategory> implements ProdCtgDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<Product> getProductList(
					Integer ctgId)
	{
		List<ProductCategory> ctgList = getSubList(ctgId);
		
		
		return (List<Product>)getCurrentSession().createQuery("from Product o where o.category in(:list) and (o.disabled = null or o.disabled = false) order by o.modelNum")
						.setParameterList("list", ctgList)
						.list();

	}

}
