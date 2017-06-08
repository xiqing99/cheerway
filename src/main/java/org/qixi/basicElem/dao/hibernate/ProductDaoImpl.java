package org.qixi.basicElem.dao.hibernate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.beans.ProductUnit;
import org.qixi.basicElem.dao.ProductDao;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;


public class ProductDaoImpl extends EntityWithDisableFlagDAOImpl<Product, Integer> implements ProductDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<Product> getAll()
	{
		Query query = getCurrentSession().createQuery("from Product p left join fetch p.category left join fetch p.unit left join fetch p.type where p.disabled = null or p.disabled=false");
		return (List<Product>)query.list();		
	}		
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Product> getAllByCtgList(
					List<ProductCategory> ctgList)
	{
		List<Product> list = getCurrentSession().createCriteria(Product.class)
						.add(Restrictions.in("category", ctgList))
						.add(Restrictions.eq("disabled", false))
						.list();
		return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> getModeNumList()
	{
		
		Criteria criteria = getCurrentSession().createCriteria(entityClass.getName());
		
		ProjectionList projList = Projections.projectionList(); 
		projList.add(Projections.distinct(Projections.property("modelNum")));
        projList.add(Projections.property("category")); 
        projList.add(Projections.property("unit")); 
        projList.add(Projections.property("minPrice")); 
		criteria.setProjection(projList);
		
		List<Object[]> list = criteria.list();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Object[] rstObject : list)
		{
			Map<String, Object> map = new HashMap<>();
			String modelNum = (String)rstObject[0];
			ProductCategory ctg = (ProductCategory)rstObject[1];
			ProductUnit unit = (ProductUnit)rstObject[2];
			Double unitPrice = (Double)rstObject[3];
			
			map.put("prodModelNum", modelNum);
			map.put("prodCtgName", ctg.getName());
			map.put("prodUnit", unit.getName());
			map.put("unitPrice", unitPrice);
			
			mapList.add(map);
		}
		
		return mapList;
	}

	@Override
	public List<Map<String, Object>> getListForReport()
	{
		List<Product> list = getAll();
		
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		for(Product product : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("prodId", product.getId());
			map.put("prodModelNum", product.getModelNum());
			map.put("subModelNum", product.getSubModelNum());
			map.put("prodCtgName", product.getCategory().getName());
			map.put("prodUnit", product.getUnit().getName());
			map.put("unitPrice", product.getCost());
			mapList.add(map);
		}
		
		return mapList;
	}

}
