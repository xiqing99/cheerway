package org.qixi.accountMgt.service;

import java.util.List;
import java.util.Map;

import org.qixi.accountMgt.beans.DepositVch;
import org.qixi.common.service.IBaseVoucherService;

public interface DepositVchService extends IBaseVoucherService<DepositVch>
{
	public List<Map<String, Object>> getSalesVchByCust(Integer custId);
	public Double getDepositeForSaleVch(Integer vchId);
	public Map<String, Object> getDepositForCust(Integer custId);
	public List<Map<String, Object>> getDepositAmountPerSaleVchList();
	public List<Map<String, Object>> getDepositAmountPerCustList();
}
