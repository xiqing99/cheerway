package org.qixi.stockingMgt.action;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.common.action.BaseVoucherAction;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.stockingMgt.beans.StockTsfVch;
import org.qixi.stockingMgt.beans.StockTsfVchItem;

public class StockTsfVchAction extends BaseVoucherAction<StockTsfVch>
{

	private static final long serialVersionUID = 5027492093372560087L;	

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(itemListsJson));
	}

	private List<StockTsfVchItem> parseItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<StockTsfVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		StockTsfVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (StockTsfVchItem) JSONObject.toBean(jsonObject, StockTsfVchItem.class);
			
			Integer mtItemId = jsonObject.getInt("mtItemId");
			
			ProdMtItem mtItem = new ProdMtItem();
			mtItem.setId(mtItemId);
			
			item.setMtItem(mtItem);
	
			item.setOwnerVoucher(entity);						
			
			list.add(item);
		}
		
		return list;
	}
}
