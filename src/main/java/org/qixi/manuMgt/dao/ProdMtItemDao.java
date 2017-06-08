package org.qixi.manuMgt.dao;


import java.util.List;

import org.qixi.common.dao.IEntityWithDisableFlagDao;
import org.qixi.manuMgt.beans.ProdMtItem;

public interface ProdMtItemDao extends IEntityWithDisableFlagDao<ProdMtItem, Integer>
{
	public List<ProdMtItem> getListByProdCtg(Integer ctgId);
	public List<ProdMtItem> getSaleableListByProdCtg(Integer ctgId);
	public List<ProdMtItem> getUnsaleableList();
	public void updSaleableInfo(Integer id, boolean saleable, Double salePrice);
}
