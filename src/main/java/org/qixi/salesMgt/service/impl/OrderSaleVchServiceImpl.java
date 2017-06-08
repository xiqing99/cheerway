package org.qixi.salesMgt.service.impl;

import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Department;
import org.qixi.common.beans.BaseVoucher;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.qixi.common.beans.VoucherState;
import org.qixi.common.beans.VoucherState.State;
import org.qixi.common.service.BaseVoucherServiceImpl;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.manuMgt.beans.MtItem.Type;
import org.qixi.manuMgt.beans.ProdMtItem;
import org.qixi.manuMgt.dao.ProdMtItemDao;
import org.qixi.salesMgt.beans.OrderDscpItem;
import org.qixi.salesMgt.beans.OrderSaleVch;
import org.qixi.salesMgt.beans.SaleVchItem;
import org.qixi.salesMgt.dao.OrderSaleVchDao;
import org.qixi.salesMgt.service.OrderSaleVchService;
import org.qixi.stockingMgt.dao.ProdStockInVchDao;
import org.qixi.stockingMgt.dao.ProdStockOutVchDao;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

public class OrderSaleVchServiceImpl extends BaseVoucherServiceImpl<SaleVchItem> implements OrderSaleVchService
{	
	@Autowired
	ProdStockInVchDao instockDao;
	
	@Autowired
	ProdStockOutVchDao outstockDao;
	
	@Autowired
	OrderSaleVchDao orderSaleVchDao;
	
	@Autowired
	ProdMtItemDao  mtItemDao;

	@Override
	protected Result reProposeAction(BaseVoucher<SaleVchItem> voucher)
	{
		Result result = new Result();
		
		if(voucher.getState() == State.FL_AUDITED)
		{
			return result;
		}
		
		result.success = false;
		result.cause = "updateState.failure.notAllowed";
		return result;
	}	
	
	@Override
	protected Result auditAction(BaseVoucher<SaleVchItem> voucher)
	{
		Result result = new Result();
		
		OrderSaleVch order = (OrderSaleVch)voucher;
		
		for(int index = 0; index<order.getDscpItems().size(); index++)
		{
			OrderDscpItem desItem = order.getDscpItems().get(index);
			
			ProdMtItem mtItem = new ProdMtItem();
			
			mtItem.setProduct(desItem.getProduct());
			mtItem.setPackageModel(desItem.getPackageModel());
			mtItem.setStdUnitPrice(desItem.getStdUnitPrice() * order.getExchangeRate());

			mtItem.setOrderSeqNum(order.getSequenceNum());
			mtItem.setColorModel(desItem.getColorModel());			
			
			mtItem.setCustModelNum(desItem.getCustModelNum());	
			
			DecimalFormat dFormat = new DecimalFormat("00");
			String indexString = dFormat.format(index+1);
			
			mtItem.setMaterialNum(order.getSequenceNum() + "I" + indexString);
			
			mtItem.setUnit(desItem.getProduct().getUnit());
			mtItem.setUnitCost(desItem.getStdUnitPrice()* order.getExchangeRate());
			mtItem.setSource(MtItem.Source.PRODUCE);
			mtItem.setType(Type.PRODUCT);
			
			if(desItem.getProduct().getSubModelNum().equals(""))
			{
				mtItem.setName(desItem.getProduct().getModelNum());
			}else {
				mtItem.setName(desItem.getProduct().getModelNum() + "-" + desItem.getProduct().getSubModelNum());
			}
			
			
			mtItem.setCreatedEmp(order.getFirstLevelAuditEmp());
			
			Integer mtItemId = mtItemDao.save(mtItem);
			mtItem.setId(mtItemId);
			
			
			SaleVchItem saleVchItem = new SaleVchItem();
			
			saleVchItem.setMtItem(mtItem);
			saleVchItem.setOwnerVoucher(order);
			saleVchItem.setQuantity(desItem.getQuantity());
			saleVchItem.setStdUnitPrice(desItem.getStdUnitPrice());
			saleVchItem.setUnitPrice(desItem.getUnitPrice());
			
			order.getItems().add(saleVchItem);
			
		}
		
		order.getDscpItems().clear();
		
		dao.update(order);
		return result;
	}	
	
	@Override
	protected void buildSpeciMap(BaseVoucher<SaleVchItem> voucher, Map<String, Object> map)	
	{
		OrderSaleVch order = (OrderSaleVch)voucher;

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");	
		
		if(order.getDeliverDeadLine() != null)
		{
			String dateString = format.format(order.getDeliverDeadLine());						
			map.put("entity.deliverDeadLine", dateString );
		}		
		
		if(order.getPaymentDeadLine() != null)
		{
			String dateString = format.format(order.getPaymentDeadLine());						
			map.put("entity.paymentDeadLine", dateString );
		}			
		
		
		map.put("entity.currencyName", order.getCustomer().getCurrency().getName());
		map.put("entity.customer.id", order.getCustomer().getId());
		map.put("entity.custOrderNum", order.getCustOrderNum());		
		map.put("entity.exchangeRate", order.getExchangeRate());
		map.put("entity.paymentMode.id", order.getPaymentMode().getId());
		map.put("entity.freightCharge", order.getFreightCharge());
		map.put("entity.transportCharge", order.getTransportCharge());
		map.put("entity.exceptDeduction", order.getExceptDeduction());
		map.put("entity.otherExpense", order.getOtherExpense());
		map.put("entity.containerNum", order.getContainerNum());

		if(order.getMerchandiser() != null)
			map.put("entity.merchandiser.id", order.getMerchandiser().getId());
		
		if(order.getFreightCmp() != null)
			map.put("entity.freightCmp.id", order.getFreightCmp().getId());
		
		if(order.getShippingCmp() != null)
			map.put("entity.shippingCmp.id", order.getShippingCmp().getId());	
		

		List<Map<String, Object>> itemMaps = new ArrayList<>();
		
		if(order.getState() == State.AUDITED || order.getState() == State.COMPLETED)
		{
			for(SaleVchItem item : order.getItems())
			{
				Map<String, Object> itemMap = new HashMap<>();
				
				item.buildMap(itemMap);
				
				itemMaps.add(itemMap);
			}
		}else
		{
			for(OrderDscpItem item : order.getDscpItems())
			{
				Map<String, Object> itemMap = new HashMap<>();
				
				item.buildMap(itemMap);
				
				itemMaps.add(itemMap);
			}
		}
		
		map.put("itemLists", itemMaps);
		
	}
	
	
	@Override
	public Result save(OrderSaleVch entity, Integer operatorEmpId)
	{		
		Result result = new Result();

		if(entity.getFreightCmp() != null && entity.getFreightCmp().getId() == null)
			entity.setFreightCmp(null);
		
		if(entity.getShippingCmp() != null && entity.getShippingCmp().getId() == null)
			entity.setShippingCmp(null);
		
		if(entity.getMerchandiser() != null && entity.getMerchandiser().getId() == null)
			entity.setMerchandiser(null);
		
		entity.setTotalPrice(cacTotalPrice(entity));
		
		entity.setTotalExtraProfit(cacTotalExtraProfit(entity));				
		
		Integer id = entity.getId();
		
		if(id == null || id == 0)
		{
			String seqNum = generateSeqNum();
			entity.setSequenceNum(seqNum);	
			
			Integer savedId = dao.save(entity);
			
			result.dataMap = new HashMap<>();
			result.dataMap.put("id", savedId);
			result.dataMap.put("seqNum", seqNum);
			
		}else {			
			OrderSaleVch voucher = orderSaleVchDao.get(id);

			if(voucher == null)
			{
				result.success = false;
				result.cause = "delete.failure.entityNonExist";
				return result;
			}							
			
			if(!voucher.getRspEmp().getId().equals(operatorEmpId) && !voucher.getAuditEmp().getId().equals(operatorEmpId))
			{
				result.success = false;
				result.cause = "updateState.failure.notAllowed";
				return result;				
			}
			
			List<SaleVchItem> itemList = voucher.getItems();
			List<OrderDscpItem> dscpItemList = voucher.getDscpItems();
									
			if(voucher.getState() == State.AUDITED || voucher.getState() == State.COMPLETED)
			{
				itemList.clear();
				itemList.addAll(entity.getItems());
			}else {
				dscpItemList.clear();
				dscpItemList.addAll(entity.getDscpItems());
			}	
			
			BeanUtils.copyProperties(entity, voucher);
			voucher.setItems(itemList);
			voucher.setDscpItems(dscpItemList);
			
			dao.update(voucher);				
		}			
		
		return result;
	}
	
	private Double cacTotalPrice(OrderSaleVch order)
	{
		double totalPrice = (double) 0;
		
		if(order.getItems().size() != 0)
		{
			for(SaleVchItem item : order.getItems())
			{
				Double price = item.getUnitPrice()*item.getQuantity();
				totalPrice+=price;
			}
		}else {
			for(OrderDscpItem item : order.getDscpItems())
			{
				Double price = item.getUnitPrice()*item.getQuantity();
				totalPrice+=price;
			}
		}
	
		return totalPrice - order.getOtherExpense();
	}
	
	private Double cacTotalExtraProfit(OrderSaleVch order)
	{
		double totalPrice = (double) 0;
		
		if(order.getItems().size() != 0)
		{
			for(SaleVchItem item : order.getItems())
			{
				Double price =item.getQuantity()*(item.getUnitPrice() - item.getStdUnitPrice());
				totalPrice+=price;
			}
		}else {
			for(OrderDscpItem item : order.getDscpItems())
			{
				Double price =item.getQuantity()*(item.getUnitPrice() - item.getStdUnitPrice());
				totalPrice+=price;
			}
		}

		return totalPrice;		
	}
	
	@Override
	protected Result completeAction(BaseVoucher<SaleVchItem> voucher)
	{
		Result result = new Result();
		
		orderSaleVchDao.completeVoucher(voucher.getId());
		
		return result;
	}		
	
	@Override
	public List<ComboElem> getComboListByState(
					VoucherState.State state)
	{
		return orderSaleVchDao.getComboListByState(state);
	}

	@Override
	public List<ComboElem> getComboListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		return orderSaleVchDao.getComboListByCustAndState(custId, state);
	}

	@Override
	protected void buildSpeciMapForList(BaseVoucher<SaleVchItem> voucher, Map<String, Object> map)
	{
		OrderSaleVch order = (OrderSaleVch)voucher;

		map.put("customerOrderNum", order.getCustOrderNum());
		
		if(order.getMerchandiser() != null)
			map.put("merEmpName", order.getMerchandiser().getName());
		
		map.put("customerName", order.getCustomer().getName());
		map.put("customerArea", order.getCustomer().getArea().getName());
		map.put("currencyName", order.getCustomer().getCurrency().getName());
		map.put("containerNum", order.getContainerNum());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String dateString;

		
		if(order.getDeliverDeadLine() != null)
		{
			dateString = format.format(order.getDeliverDeadLine());
			map.put("deliverDeadLine", dateString);
		}		
		
		if(order.getPaymentDeadLine() != null)
		{
			dateString = format.format(order.getPaymentDeadLine());
			map.put("paymentDeadLine", dateString);
		}	
		
		map.put("totalPrice", order.getTotalPrice());
		map.put("totalExtraProfit", order.getTotalExtraProfit());
		
		double exchangeRate= (double)1;
		
		if(order.getExchangeRate() != null)
			exchangeRate = order.getExchangeRate();
		
		map.put("totalPriceInCn", order.getTotalPrice()*exchangeRate);
		map.put("totalExtraProfitInCn", order.getTotalExtraProfit()*exchangeRate);
		
		return;
	}	

	@Override
	protected void buildSpeciMapForDetailList(BaseVoucher<SaleVchItem> voucher, List<Map<String, Object>> mapList)
	{
		OrderSaleVch order = (OrderSaleVch)voucher;		
		
		for(SaleVchItem item : order.getItems())
		{
			Map<String, Object> map = buildEntityMapForList(voucher);
			
			map.put("customerName", order.getCustomer().getName());
			map.put("currencyName", order.getCustomer().getCurrency().getName());
			
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String dateString;

			
			if(order.getDeliverDeadLine() != null)
			{
				dateString = format.format(order.getDeliverDeadLine());
				map.put("deliverDeadLine", dateString);
			}		
			
			if(order.getPaymentDeadLine() != null)
			{
				dateString = format.format(order.getPaymentDeadLine());
				map.put("paymentDeadLine", dateString);
			}				
			
			item.buildMap(map);

			if(order.getState() == State.AUDITED || order.getState() == State.COMPLETED)
			{
				map.put("inStockQty", instockDao.getQtyBySaleVchItem(item));
				map.put("outStockQty", outstockDao.getQtyBySaleVchItem(item));	
			}	
			
			double itemPrice = item.getUnitPrice()*item.getQuantity();
			
			map.put("itemPrice", itemPrice);
			
			double exchangeRate= (double)1;
			
			if(order.getExchangeRate() != null)
				exchangeRate = order.getExchangeRate();
			
			map.put("itemPriceInCn", itemPrice*exchangeRate);
			
			mapList.add(map);						
		}
		return;
	}	
	
	@Override
	protected String generateSeqNum()
	{
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat dF = new SimpleDateFormat("yyyy");			
		String seqNum = dF.format(date);
		
		DecimalFormat dFormat = new DecimalFormat("00000");
		String indexString = dFormat.format(dao.getNextSerialNum());
		
		seqNum = "WD"+seqNum + indexString;
		
		return seqNum;
	}

	@Override
	public List<Map<String, Object>> getListByCustAndState(
					Integer custId,
					VoucherState.State state)
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<OrderSaleVch> list = orderSaleVchDao.getListByCustAndState(custId, state);
		
		for(OrderSaleVch order : list)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("orderId", order.getId());
			map.put("seqNum", order.getSequenceNum());
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


}
