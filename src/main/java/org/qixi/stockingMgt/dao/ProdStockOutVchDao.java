package org.qixi.stockingMgt.dao;


import java.sql.Date;
import java.util.Map;

import org.qixi.common.dao.IBaseVoucherDao;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.stockingMgt.beans.ProdStockOutVch;

public interface ProdStockOutVchDao extends IBaseVoucherDao<ProdStockOutVch>
{
	public Double getQtyBySaleVchItem(SaleVchItem orderItem);
	public Map<Integer, Double> getProdIdPriceSumMap(Date startDate, Date endDate);
}
