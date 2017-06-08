package org.qixi.accountMgt.service;


import java.util.Map;

import org.qixi.accountMgt.beans.ReceiptVch;
import org.qixi.common.service.IBaseVoucherService;

public interface ReceiptVchService extends IBaseVoucherService<ReceiptVch>
{
	public Map<String, Object> createNewByRsvbId(Integer rsvbId);
}
