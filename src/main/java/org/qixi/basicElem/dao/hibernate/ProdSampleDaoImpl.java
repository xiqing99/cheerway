package org.qixi.basicElem.dao.hibernate;

import java.util.List;

import javax.persistence.Query;

import org.hibernate.criterion.Restrictions;
import org.qixi.basicElem.beans.ProdSample;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.basicElem.dao.ProdSampleDao;
import org.qixi.common.dao.EntityWithDisableFlagDAOImpl;


public class ProdSampleDaoImpl extends EntityWithDisableFlagDAOImpl<ProdSample, Integer> implements ProdSampleDao
{

	@SuppressWarnings("unchecked")
	@Override
	public List<ProdSample> getAllByCtgList(
					List<ProductCategory> ctgList)
	{
		List<ProdSample> list = getCurrentSession().createCriteria(ProdSample.class)
						.add(Restrictions.in("category", ctgList))
						.add(Restrictions.eq("disabled", false))
						.list();
		return list;
	}

	@Override
	public void updateLendEmp(Integer id, Integer empId)
	{
		java.util.Date date = new java.util.Date(System.currentTimeMillis());
		
		getCurrentSession().createQuery("update " + entityClass.getName() +" o set o.lendEmp.id = :empId, o.lendDate= :date where o.id = :id")
						.setParameter("empId", empId)
						.setParameter("date", date)
						.setParameter("id", id)
						.executeUpdate();
		
	}

}
