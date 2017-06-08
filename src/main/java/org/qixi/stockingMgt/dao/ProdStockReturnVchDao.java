package org.qixi.stockingMgt.dao;


import org.qixi.common.dao.IBaseVoucherDao;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.stockingMgt.beans.ProdStockReturnVch;

public interface ProdStockReturnVchDao extends IBaseVoucherDao<ProdStockReturnVch>
{
	public Double getQtyBySaleVchItem(SaleVchItem orderItem);
}
