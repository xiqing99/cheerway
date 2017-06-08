package org.qixi.salesMgt.action;


import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.basicElem.beans.Product;
import org.qixi.common.action.BaseVoucherAction;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.OrderDscpItem;
import org.qixi.salesMgt.beans.OrderSaleVch;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.service.OrderSaleVchService;

public class OrderSaleVchAction extends BaseVoucherAction<OrderSaleVch>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;
	
	private Integer custId;
	private List<ComboElem> comboList = new ArrayList<>();
	
	public String loadComboListByState()
	{
		setComboList(((OrderSaleVchService)service).getComboListByState(state));
		
		return SUCCESS;
	}
	
	public String loadComboListByCustIdAndState()
	{
		setComboList(((OrderSaleVchService)service).getComboListByCustAndState(custId, state));
		
		return SUCCESS;
	}

	public String loadComboListByCust()
	{
		setComboList(((OrderSaleVchService)service).getComboListByCustAndState(custId, State.ALL));
		
		return SUCCESS;
	}	
	
	public String loadListByCustIdAndState()
	{
		list = ((OrderSaleVchService)service).getListByCustAndState(custId, state);
		
		return SUCCESS;
	}	
	
	public String getItemListsJson()
	{
		return itemListsJson;
	}

	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		if(entity.getState() == State.AUDITED ||entity.getState() == state.COMPLETED)
		{
			entity.setItems(parseSaleVchItemList(itemListsJson));
		}else {
			entity.setDscpItems(parseDscpItemList(itemListsJson));
		}
	}

	private List<OrderDscpItem> parseDscpItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<OrderDscpItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		OrderDscpItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (OrderDscpItem) JSONObject.toBean(jsonObject, OrderDscpItem.class);			
			
			Integer productId = jsonObject.getInt("productId");
			Product product = new Product();
			product.setId(productId);			
			item.setProduct(product);						
			item.setOwnerVoucher(entity);
			
			list.add(item);
		}
		
		return list;
	}

	private List<SaleVchItem> parseSaleVchItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<SaleVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		SaleVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (SaleVchItem) JSONObject.toBean(jsonObject, SaleVchItem.class);			
			
			Integer mtItemId = jsonObject.getInt("mtItemId");
			ProdMtItem mtItem = new ProdMtItem();
			mtItem.setId(mtItemId);
			
			item.setMtItem(mtItem);				
			item.setOwnerVoucher(entity);
			
			list.add(item);
		}
		
		return list;
	}	

	public Integer getCustId()
	{
		return custId;
	}

	public void setCustId(Integer custId)
	{
		this.custId = custId;
	}

	public List<ComboElem> getComboList()
	{
		return comboList;
	}

	public void setComboList(
					List<ComboElem> comboList)
	{
		this.comboList = comboList;
	}

}
