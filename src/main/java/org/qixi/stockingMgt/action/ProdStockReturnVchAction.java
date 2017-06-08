package org.qixi.stockingMgt.action;


import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseVoucherAction;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.stockingMgt.beans.ProdStockReturnVch;
import org.qixi.stockingMgt.beans.ProdStockReturnVchItem;



public class ProdStockReturnVchAction extends BaseVoucherAction<ProdStockReturnVch>
{

	private static final long serialVersionUID = 1L;

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(entity, itemListsJson));
	}

	private List<ProdStockReturnVchItem> parseItemList(ProdStockReturnVch ownerVoucher, String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<ProdStockReturnVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		ProdStockReturnVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (ProdStockReturnVchItem) JSONObject.toBean(jsonObject, ProdStockReturnVchItem.class);
			
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
