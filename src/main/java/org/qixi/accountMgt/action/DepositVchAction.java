package org.qixi.accountMgt.action;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.qixi.accountMgt.beans.DepositVch;
import org.qixi.accountMgt.beans.DepositVchItem;
import org.qixi.accountMgt.service.DepositVchService;
import org.qixi.common.action.BaseVoucherAction;
import org.qixi.salesMgt.beans.SaleVch;

public class DepositVchAction extends BaseVoucherAction<DepositVch>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;
	
	private Integer custId;
	private Integer saleVchId;

	public String loadSalesVchByCust()
	{
		list = ((DepositVchService)service).getSalesVchByCust(custId);
		
		return SUCCESS;
	}

	public String loadDepositBySaleVch()
	{
		resultMap.put("data", ((DepositVchService)service).getDepositeForSaleVch(saleVchId));
		resultMap.put("success", true);	
		
		return SUCCESS;
	}

	public String loadDepositByCust()
	{
		resultMap.put("data", ((DepositVchService)service).getDepositForCust(custId));
		resultMap.put("success", true);	
		
		return SUCCESS;
	}	
	
	public String loadDepositAmountPerSaleVchList()
	{
		list = ((DepositVchService)service).getDepositAmountPerSaleVchList();
		
		return SUCCESS;
	}

	public String loadDepositAmountPerCustList()
	{
		list = ((DepositVchService)service).getDepositAmountPerCustList();
		
		return SUCCESS;
	}	
	
	public void setItemListsJson(
					String itemListsJson)
	{
		this.itemListsJson = itemListsJson;
		
		entity.setItems(parseItemList(itemListsJson));
	}

	private List<DepositVchItem> parseItemList(String jsonString)
	{
		JSONArray jsonArray = JSONArray.fromObject(jsonString);		
		List<DepositVchItem> list = new ArrayList<>();
		
		JSONObject jsonObject;
		DepositVchItem item;
		for (int i = 0; i<jsonArray.size(); i++)
		{
			jsonObject = jsonArray.getJSONObject(i);
			
			item = (DepositVchItem) JSONObject.toBean(jsonObject, DepositVchItem.class);
			
			Integer saveVchId = jsonObject.getInt("saleVchId");
			
			SaleVch saleVch = new SaleVch();
			saleVch.setId(saveVchId);
			
			item.setSaleVch(saleVch);
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

	public Integer getSaleVchId()
	{
		return saleVchId;
	}

	public void setSaleVchId(
					Integer saleVchId)
	{
		this.saleVchId = saleVchId;
	}	
}
