package org.qixi.salesMgt.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Department;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.salesMgt.beans.SaleVch;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.dao.SaleVchDao;
import org.qixi.salesMgt.service.SaleVchService;
import org.springframework.beans.factory.annotation.Autowired;

public class SaleVchServiceImpl extends BaseVoucherServiceImpl<SaleVchItem> implements SaleVchService
{	
	@Autowired
	SaleVchDao dao;
		
	
	@Override
	public List<ComboElem> getComboListByState(
					State state)
	{
		return dao.getComboListByState(state);
	}

	@Override
	public List<ComboElem> getComboListByCustAndState(
					Integer custId,
					State state)
	{
		return dao.getComboListByCustAndState(custId, state);
	}

	@Override
	public List<Map<String, Object>> getItemsList(
					Integer orderId)
	{
		SaleVch order = dao.get(orderId);
		
		List<Map<String, Object>> list = new ArrayList<>();
		
		for(SaleVchItem item : order.getItems())
		{
			Map<String, Object> map = new HashMap<>();
			
			
			map.put("unitPrice", item.getUnitPrice());
			map.put("quantity", item.getQuantity());			
			
			ProdMtItem mtItem = item.getMtItem();
			
			map.put("mtItemId", mtItem.getId());
			map.put("mtNum", mtItem.getMaterialNum());
			map.put("mtName", mtItem.getName());
			map.put("unit", mtItem.getUnit().getName());
			map.put("custModelNum", mtItem.getCustModelNum());
			map.put("packageModel", mtItem.getPackageModel());
			map.put("ctgName", mtItem.getProduct().getCategory().getName());
			list.add(map);
		}
		
		return list;
	}

	@Override
	public List<Map<String, Object>> getListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<SaleVch> list = dao.getListByCustAndState(custId, state);
		
		for(SaleVch order : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("saleVchId", order.getId());
			map.put("saleVchSeqNum", order.getSequenceNum());
			map.put("totalAmount", order.getTotalPrice());
			map.put("currencyName", order.getCustomer().getCurrency().getName());
			map.put("rspEmpName", order.getRspEmp().getName());

			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String dateString;
			
			if(order.getApprovedTime() != null)
			{
				dateString = format.format(order.getApprovedTime());
				map.put("auditedDate", dateString);
			}
			mapList.add(map);
		}
					
		return mapList;
	}

	@Override
	protected String getCriteraName()
	{
		
		return "dept";
	}			
	
	@Override
	protected Integer getCriteraRootId()
	{
		return Department.SalesDeptRootId;
	}

	@Override
	public Result save(
					SaleVch entity,
					Integer operatorEmpId)
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getCustInfoById(
					Integer saleVchId)
	{
		return dao.getCustInfo(saleVchId);
	}

}
