package org.qixi.stockingMgt.action;


import org.qixi.basicElem.beans.Store;
import org.qixi.common.action.BaseEntityAction;
import org.qixi.stockingMgt.beans.Inventory;
import org.qixi.stockingMgt.service.InventoryService;

public class InventoryAction extends BaseEntityAction<Inventory>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;	
	
	private Integer storeId;
	private Integer custProdId;
	
	public String loadByStore()
	{
		if(storeId == Store.RootId)
			list = service.getAll();
		else
			list = ((InventoryService)service).getListByStore(storeId);
		
		return SUCCESS;
	}

	public Integer getStoreId()
	{
		return storeId;
	}

	public void setStoreId(
					Integer storeId)
	{
		this.storeId = storeId;
	}

	public Integer getCustProdId()
	{
		return custProdId;
	}

	public void setCustProdId(
					Integer custProdId)
	{
		this.custProdId = custProdId;
	}
	
	

}
