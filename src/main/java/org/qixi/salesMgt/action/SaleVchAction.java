package org.qixi.salesMgt.action;


import java.util.ArrayList;
import java.util.List;

import org.qixi.accountMgt.service.DepositVchService;
import org.qixi.common.action.BaseVoucherAction;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.salesMgt.service.SaleVchService;

public class SaleVchAction extends BaseVoucherAction<SaleVch>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5027492093372560087L;
	
	private Integer custId;
	private List<ComboElem> comboList = new ArrayList<>();
	
	public String loadComboListByState()
	{
		setComboList(((SaleVchService)service).getComboListByState(state));
		
		return SUCCESS;
	}
	
	public String loadComboListByCustIdAndState()
	{
		setComboList(((SaleVchService)service).getComboListByCustAndState(custId, state));
		
		return SUCCESS;
	}

	public String loadComboListByCust()
	{
		setComboList(((SaleVchService)service).getComboListByCustAndState(custId, State.ALL));
		
		return SUCCESS;
	}	
	
	public String loadListByCustIdAndState()
	{
		list = ((SaleVchService)service).getListByCustAndState(custId, state);
		
		return SUCCESS;
	}	
	
	public String loadProdListById()
	{
		list = ((SaleVchService)service).getItemsList(id);
		return SUCCESS;
	}
	
	public String loadCustInfoById()
	{
		resultMap.put("data", ((SaleVchService)service).getCustInfoById(id));
		resultMap.put("success", true);		
		return SUCCESS;
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
