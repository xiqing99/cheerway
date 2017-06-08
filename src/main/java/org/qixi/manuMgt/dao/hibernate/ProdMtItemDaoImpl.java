package org.qixi.manuMgt.dao.hibernate;

import java.util.List;

import org.hibernate.Query;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.manuMgt.dao.ProdMtItemDao;



public class ProdMtItemDaoImpl extends EntityWithDisableFlagDAOImpl<ProdMtItem, Integer> implements ProdMtItemDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<ProdMtItem> getListByProdCtg(Integer ctgId)
	{
		return (List<ProdMtItem>)getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where o.product.category.id = :id and o.disabled = false")
						.setParameter("id", ctgId)
						.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ProdMtItem> getSaleableListByProdCtg(
					Integer ctgId)
	{
		if(ctgId.equals(ProductCategory.RootId))
		{
			return (List<ProdMtItem>)getCurrentSession().createQuery("from " + entityClass.getName() + 
							" o where o.saleable = true and o.disabled = false")
							.list();			
		}
		
		return (List<ProdMtItem>)getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where o.product.category.id = :id and o.saleable = true and o.disabled = false")
						.setParameter("id", ctgId)
						.list();
	}

	@Override
	public void updSaleableInfo(
					Integer id,
					boolean saleable,
					Double stdUnitPrice)
	{
		Query query = getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.saleable= :saleable, o.stdUnitPrice= :stdUnitPrice where o.id = :id")
						.setParameter("saleable", saleable)
						.setParameter("stdUnitPrice", stdUnitPrice)
						.setParameter("id", id);
		
		query.executeUpdate();
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ProdMtItem> getUnsaleableList()
	{
		return (List<ProdMtItem>)getCurrentSession().createQuery("from " + entityClass.getName() + 
						" o where o.saleable = false and o.disabled = false")
						.list();	
	}
}
