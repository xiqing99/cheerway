package org.qixi.basicElem.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Contacts;
import org.qixi.basicElem.beans.Currency;
import org.qixi.basicElem.beans.Customer;
import org.qixi.basicElem.beans.MarketArea;
import org.qixi.basicElem.dao.CustomerDao;
import org.qixi.basicElem.dao.MarketAreaDao;
import org.qixi.basicElem.service.CustomerService;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.beans.Result;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

public class CustomerServiceImpl implements CustomerService
{
	@Autowired
	CustomerDao dao;
	
	@Autowired
	MarketAreaDao areaDao;
	
	public Map<String, Object> getById(Integer id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		Customer customer = dao.get(id);
		
		map.put("entity.id", customer.getId());
		map.put("entity.name", customer.getName());
		map.put("entity.fullName", customer.getFullName());
		map.put("entity.sortIndex", customer.getSortIndex());
		map.put("entity.description", customer.getDescription());
		map.put("entity.area.id", customer.getArea().getId());
		map.put("entity.priority.id", customer.getPriority().getId());
		map.put("entity.address", customer.getAddress());
		map.put("entity.credit", customer.getCredit());		
		map.put("entity.respDept.id", customer.getRespDept().getId());
		map.put("entity.respEmp.id", customer.getRespEmp().getId());
		map.put("entity.phone", customer.getPhone());
		map.put("entity.fax", customer.getFax());
		map.put("entity.email", customer.getEmail());
		map.put("entity.disabled", customer.getDisabled());
		map.put("entity.currency.id", customer.getCurrency().getId());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(customer.getStartDate() != null)
		{
			String dateString = format.format(customer.getStartDate());						
			map.put("entity.startDate", dateString );
		}
		
		int index = 0;
		
		for(Contacts contact : customer.getContactsList())
		{
			if(index > 1)
				break;
			
			map.put("entity.contactsList["+ index+ "].id", contact.getId());
			map.put("entity.contactsList["+ index+ "].name", contact.getName());
			map.put("entity.contactsList["+ index+ "].department", contact.getDepartment());
			map.put("entity.contactsList["+ index+ "].email", contact.getEmail());
			map.put("entity.contactsList["+ index+ "].mobile", contact.getMobile());
			map.put("entity.contactsList["+ index+ "].notes", contact.getNotes());
			map.put("entity.contactsList["+ index+ "].officePhone", contact.getOfficePhone());
			map.put("entity.contactsList["+ index+ "].position", contact.getJob());
			map.put("entity.contactsList["+ index+ "].qq", contact.getQq());

			index++;
		}
		
		
		return map;
	}
	
	public Result save(Customer customer)
	{
		if(customer.getId() == null || customer.getId() == 0)
		{
			dao.save(customer);
		}else {
			Customer custP = dao.get(customer.getId());
			List<Contacts> list = custP.getContactsList();
			list.clear();
			list.addAll(customer.getContactsList());
			
			BeanUtils.copyProperties(customer, custP);

			custP.setContactsList(list);	
			dao.update(custP);
		}
		
		return new Result();
	}
	
	public List<Map<String, Object>> getAll()
	{		
		return getListByAreaId(MarketArea.RootId);
		
	}	
	
	private Map<String, Object> buildCustomerMap(Customer customer)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("entityId", customer.getId());
		map.put("name", customer.getName());
		map.put("sortIndex", customer.getSortIndex());
		map.put("description", customer.getDescription());
		map.put("area", customer.getArea().getName());
		map.put("priority", customer.getPriority().getName());
		map.put("address", customer.getAddress());
		map.put("credit", customer.getCredit());
		map.put("startDate", customer.getStartDate());
		map.put("respDept", customer.getRespDept().getName());
		map.put("respEmp", customer.getRespEmp().getName());			
		map.put("phone", customer.getPhone());
		map.put("fax", customer.getFax());
		map.put("email", customer.getEmail());
		map.put("disabled", customer.getDisabled());
		map.put("currencyName", customer.getCurrency().getName());
		map.put("fullName", customer.getFullName());
		
		return map;
	}

	@Override
	public List<Map<String, Object>> getContactLists()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(Customer customer)
	{
		dao.delete(customer);
		
	}

	@Override
	public Result delById(Integer id)
	{
		Result result = new Result();
		
		Customer customer = dao.get(id);
		
		if(customer == null)
		{
			result.success = false;
			result.cause = "delete.failure.entityNonExist";
			
			return result;
		}
		
		dao.delete(customer);	
		
		result.success = true;
		return result;
	}

	@Override
	public List<ComboElem> getListForCombo()
	{
		return dao.getComboList();
	}

	@Override
	public List<Map<String, Object>> getListByAreaId(
					Integer areaId)
	{
		List<Map<String, Object>> mapLists = new ArrayList<>();
		
		List<Customer> list; 
		if(areaId == MarketArea.RootId)
		{
			list = dao.getAll();
		}else {
			list = areaDao.getCustList(areaId);
		}		
		
		for(Customer customer : list)
		{
			mapLists.add(buildCustomerMap(customer));
		}
		
		return mapLists;
	}

	@Override
	public List<Map<String, Object>> getDisabledList()
	{
		List<Map<String, Object>> mapLists = new ArrayList<>();
		
		List<Customer> list = dao.getAllDisabled(); 		
		
		for(Customer customer : list)
		{
			mapLists.add(buildCustomerMap(customer));
		}
		
		return mapLists;
	}

	@Override
	public Map<String, Object> getCurrency(
					Integer custId)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		
		Currency currency = dao.getCurrency(custId);
		
		map.put("curName", currency.getName());
		map.put("exchangeRate", currency.getExchangeRate());
		
		return map;
	}

	@Override
	public List<ComboElem> getListByAreaIdForCombo(Integer areaId)
	{
		// TODO Auto-generated method stub
		return areaDao.getCustListCombo(areaId);
	}
}
