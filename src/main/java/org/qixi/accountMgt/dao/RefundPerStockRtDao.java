package org.qixi.accountMgt.dao;



import org.qixi.accountMgt.beans.RefundPerStockRt;

public interface RefundPerStockRtDao extends BaseFundVchDao<RefundPerStockRt>
{
	public void pay(Integer id);
}
