package org.qixi.accountMgt.action;


import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.accountMgt.beans.RefundPerStockRt;
import org.qixi.accountMgt.beans.RefundmentVch;
import org.qixi.accountMgt.beans.RefundmentVchItem;
import org.qixi.common.action.BaseVoucherAction;

public class RefundmentVchAction extends BaseVoucherAction<RefundmentVch>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(itemListsJson));
	}

	private List<RefundmentVchItem> parseItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<RefundmentVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		RefundmentVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (RefundmentVchItem) JSONObject.toBean(jsonObject, RefundmentVchItem.class);
			
			Integer refundPerStockRtId = jsonObject.getInt("refundPerStockRtId");
			RefundPerStockRt refundPerStockRt = new RefundPerStockRt();
			refundPerStockRt.setId(refundPerStockRtId);
			
			item.setRefundPerStockRt(refundPerStockRt);;
			item.setOwnerVoucher(entity);
			
			list.add(item);
		}
		
		return list;
	}
}
