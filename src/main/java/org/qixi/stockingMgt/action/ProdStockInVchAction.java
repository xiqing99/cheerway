package org.qixi.stockingMgt.action;


import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseVoucherAction;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.stockingMgt.beans.ProdStockInVch;
import org.qixi.stockingMgt.beans.ProdStockInVchItem;


public class ProdStockInVchAction extends BaseVoucherAction<ProdStockInVch>
{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(entity, itemListsJson));
	}

	private List<ProdStockInVchItem> parseItemList(ProdStockInVch ownerVoucher, String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<ProdStockInVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		ProdStockInVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (ProdStockInVchItem) JSONObject.toBean(jsonObject, ProdStockInVchItem.class);
			
			Integer mtItemId = jsonObject.getInt("mtItemId");
			
			ProdMtItem mtItem = new ProdMtItem();
			mtItem.setId(mtItemId);
			
			item.setMtItem(mtItem);
			
			item.setOwnerVoucher(ownerVoucher);						
			
			list.add(item);
		}		
		
		return list;
	}		
	
}
