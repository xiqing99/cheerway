package org.qixi.salesMgt.service;

import java.util.List;
import java.util.Map;

import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.service.IBaseVoucherService;
import org.qixi.salesMgt.beans.SaleVch;

public interface SaleVchService extends IBaseVoucherService<SaleVch>
{
	public List<ComboElem> getComboListByState(VoucherState.State state);
	public List<ComboElem> getComboListByCustAndState(Integer custId, VoucherState.State state);
	public List<Map<String, Object>> getItemsList(Integer orderId);
	public List<Map<String, Object>> getListByCustAndState(Integer custId, VoucherState.State state);
	public Map<String, Object> getCustInfoById(Integer saleVchId);
	
}
