package org.qixi.basicElem.dao;

import java.util.List;

import org.qixi.basicElem.beans.ProdSample;
import org.qixi.basicElem.beans.ProductCategory;
import org.qixi.common.dao.IEntityWithDisableFlagDao;


public interface ProdSampleDao extends IEntityWithDisableFlagDao<ProdSample, Integer>
{
	public List<ProdSample> getAllByCtgList(List<ProductCategory> ctgList);
	public void updateLendEmp(Integer id, Integer empId);

}
