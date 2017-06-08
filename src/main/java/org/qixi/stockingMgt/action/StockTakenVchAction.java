package org.qixi.stockingMgt.action;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseVoucherAction;
import org.qixi.stockingMgt.beans.Inventory;
import org.qixi.stockingMgt.beans.StockTakenVch;
import org.qixi.stockingMgt.beans.StockTakenVchItem;

public class StockTakenVchAction extends BaseVoucherAction<StockTakenVch>
{

	private static final long serialVersionUID = 5027492093372560087L;	

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(itemListsJson));
	}

	
	private List<StockTakenVchItem> parseItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<StockTakenVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		StockTakenVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (StockTakenVchItem) JSONObject.toBean(jsonObject, StockTakenVchItem.class);
			
			Integer inventoryId = jsonObject.getInt("inventoryId");
			Inventory inventoryStandard = new Inventory();
			inventoryStandard.setId(inventoryId);
			
			item.setInventory(inventoryStandard);
			item.setOwnerVoucher(entity);						
			
			list.add(item);
		}
		
		return list;
	}
}
