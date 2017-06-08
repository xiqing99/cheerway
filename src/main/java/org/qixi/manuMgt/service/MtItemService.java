package org.qixi.manuMgt.service;


import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;
import org.qixi.manuMgt.beans.MtItem;

public interface MtItemService extends IGenericService<MtItem>
{
	public Result disableById(Integer custProdId);
}
