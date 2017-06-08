package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.Customer;
import org.qixi.common.beans.ComboElem;
import org.qixi.common.service.IGenericService;

public interface CustomerService extends IGenericService<Customer>
{
	public List<Map<String, Object>> getContactLists();
	public void delete(Customer customer);
	public List<Map<String, Object>> getListByAreaId(Integer areaId);
	public List<ComboElem> getListByAreaIdForCombo(Integer areaId);	
	public List<Map<String, Object>> getDisabledList();
	public Map<String, Object> getCurrency(Integer custId);
}
