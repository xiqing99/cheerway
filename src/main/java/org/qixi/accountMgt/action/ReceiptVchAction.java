package org.qixi.accountMgt.action;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.accountMgt.beans.ReceiptVch;
import org.qixi.accountMgt.beans.ReceiptVchItem;
import org.qixi.accountMgt.beans.RsvbPerProdSOVch;
import org.qixi.accountMgt.service.ReceiptVchService;
import org.qixi.common.action.BaseVoucherAction;

public class ReceiptVchAction extends BaseVoucherAction<ReceiptVch>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5116364019637757175L;
	
	private Integer rsvbId;
	
	public String initByRsvb()
	{
		Map<String, Object> map = ((ReceiptVchService)service).createNewByRsvbId(rsvbId);
		
		resultMap.put("data", map);
		resultMap.put("success", true);					

		return SUCCESS;
	}
	
	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(itemListsJson));
	}

	private List<ReceiptVchItem> parseItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<ReceiptVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		ReceiptVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (ReceiptVchItem) JSONObject.toBean(jsonObject, ReceiptVchItem.class);
			
			Integer receivableId = jsonObject.getInt("rsvbVchId");
			RsvbPerProdSOVch voucher = new RsvbPerProdSOVch();
			voucher.setId(receivableId);
			
			item.setReceiable(voucher);
			item.setOwnerVoucher(entity);
			
			list.add(item);
		}
		
		return list;
	}

	public Integer getRsvbId()
	{
		return rsvbId;
	}

	public void setRsvbId(Integer rsvbId)
	{
		this.rsvbId = rsvbId;
	}
}
