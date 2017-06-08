package org.qixi.stockingMgt.dao.hibernate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.qixi.basicElem.beans.Store;
import org.qixi.common.dao.GenericDAOImpl;
import org.qixi.manuMgt.beans.MtItem;
import org.qixi.stockingMgt.beans.Inventory;
import org.qixi.stockingMgt.beans.StockTakenVchItem;
import org.qixi.stockingMgt.dao.InventoryDao;


public class InventoryDaoImpl extends GenericDAOImpl<Inventory, Integer> implements InventoryDao
{

	@Override
	public void inputStock(Store store, MtItem item, Double quantity)
	{
		Inventory inventory = getInventory(store, item);
		
		if(inventory == null)
		{
			inventory = new Inventory();
			inventory.setMtItem(item);;;
			inventory.setStore(store);
			inventory.setQuantity(quantity);
			
			save(inventory);
		}else {
			updateQuantity(inventory, inventory.getQuantity() + quantity);
		}
		
	}

	@Override
	public boolean isAdequate(Store store, MtItem item, Double quantity)
	{
		Inventory inventory = getInventory(store, item);
		
		if(inventory != null && inventory.getQuantity() >= quantity)
			return true;
		
		return false;
	}	
	
	@Override
	public void outputStock(Store store, MtItem item, Double quantity)
	{
		Inventory inventory = getInventory(store, item);
		
		updateQuantity(inventory, inventory.getQuantity() - quantity);
		
	}	
	
	private Inventory getInventory(Store store, MtItem item)
	{
		Criteria criteria = getCurrentSession().createCriteria(entityClass);
		
		criteria.add(Restrictions.eq("store.id", store.getId()));
		criteria.add(Restrictions.eq("mtItem.id", item.getId()));
		
		return (Inventory) criteria.uniqueResult();
	}
	
	private void updateQuantity(Inventory inventory, Double quantity)
	{
		Query query = getCurrentSession().createQuery("update " + entityClass.getName() +
						" o set o.quantity= :quantity where o.id = :id")
						.setParameter("quantity", quantity)
						.setParameter("id", inventory.getId());
		
		query.executeUpdate();
		return;		
	}	

	@Override
	public void takeStock(
					Store store,
					StockTakenVchItem item)
	{
		if(item.getDiffQuantity() == 0.0)
			return;
		
		Inventory inventory = load(item.getInventory().getId());		
		
		if(inventory == null)
		{
			return;
		}
		
		updateQuantity(inventory, inventory.getQuantity() + item.getDiffQuantity());
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Inventory> getListByStoreId(
					Integer storeId)
	{
		return (List<Inventory>)getCurrentSession().createQuery("from "+ entityClass.getName() + " o where o.store.id =? ")
						.setInteger(0, storeId)
						.list();
	}

	@Override
	public Map<String, Double> getProdModelNumQtyMap()
	{
		Map<String, Double> map = new HashMap<>();
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.product.modelNum ,sum(o.quantity) from "+ entityClass.getName() + 
										" o join o.mtItem item where item.class = ProdMtItem group by item.product.modelNum")
						.list();

		for (Object[] rst : list)
		{			
			map.put((String)rst[0], (Double)rst[1]);
			
		}
		
		return map;
	}

	@Override
	public Map<Integer, Double> getProdIdQtySumMap()
	{
		Map<Integer, Double> map = new HashMap<>();
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.product.id ,sum(o.quantity) from "+ entityClass.getName() + 
										" o join o.mtItem item where item.class = ProdMtItem  group by item.product.id")
						.list();

		for (Object[] rst : list)
		{			
			map.put((Integer)rst[0], (Double)rst[1]);
			
		}
		
		return map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Inventory> getProdListByStoreId(Integer storeId)
	{
		return (List<Inventory>)getCurrentSession().createQuery("select o from "+ entityClass.getName() + 
						" o join o.mtItem item where o.store.id =? and item.class = ProdMtItem")
						.setInteger(0, storeId)
						.list();
	}

	@Override
	public Map<Integer, Double> getProdMtItemIdQtyMap()
	{
		Map<Integer, Double> map = new HashMap<>();
		
		@SuppressWarnings("unchecked")
		List<Object[]> list = getCurrentSession().createQuery("select item.id ,sum(o.quantity) from "+ entityClass.getName() + 
										" o join o.mtItem item where item.class = ProdMtItem  group by item.id")
						.list();

		for (Object[] rst : list)
		{			
			map.put((Integer)rst[0], (Double)rst[1]);
			
		}
		
		return map;
	}	
	
}
