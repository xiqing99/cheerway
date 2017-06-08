package org.qixi.stockingMgt.dao;


import org.qixi.common.dao.IBaseVoucherDao;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.stockingMgt.beans.ProdStockInVch;

public interface ProdStockInVchDao extends IBaseVoucherDao<ProdStockInVch>
{
	public Double getQtyBySaleVchItem(SaleVchItem orderItem);
}
