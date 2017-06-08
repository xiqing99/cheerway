package org.qixi.basicElem.action;


import org.qixi.basicElem.beans.Product;
import org.qixi.basicElem.service.ProductService;
import org.qixi.common.action.BaseEntityAction;

public class ProductAction extends BaseEntityAction<Product>
{
	
	private Integer ctgId;
		
	public String loadByCtg()
	{
		list = ((ProductService)service).getListByCtg(ctgId);
		return SUCCESS;
	}	
	
	public String loadDisabledList()
	{
		list = ((ProductService)service).getDisabledList();
		
		return SUCCESS;
	}

	public Integer getCtgId()
	{
		return ctgId;
	}

	public void setCtgId(Integer ctgId)
	{
		this.ctgId = ctgId;
	}
	

}
