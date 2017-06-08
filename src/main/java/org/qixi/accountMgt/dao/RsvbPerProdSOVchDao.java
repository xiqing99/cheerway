package org.qixi.accountMgt.dao;


import org.qixi.accountMgt.beans.RsvbPerProdSOVch;


public interface RsvbPerProdSOVchDao extends BaseFundVchDao<RsvbPerProdSOVch>
{
	public void receive(RsvbPerProdSOVch voucher, Double value);
}
