package org.qixi.stockingMgt.beans;

import java.io.Serializable;


import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.qixi.basicElem.beans.Store;
import org.qixi.manuMgt.beans.MtItem;


@Entity
@Table(name="inventory", uniqueConstraints= {@UniqueConstraint(columnNames= {"store_id", "mt_item_id"})})
public class Inventory  implements Serializable
{
	private Integer id;
	private Store store;
	private MtItem mtItem;
	private Double  quantity;
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	@ManyToOne
	@JoinColumn(name="store_id", nullable=false)
	public Store getStore()
	{
		return store;
	}
	public void setStore(Store store)
	{
		this.store = store;
	}
	
	@Column(name="quantity", nullable=false, columnDefinition = "numeric CHECK (quantity >= 0)")
	public Double getQuantity()
	{
		return quantity;
	}
	public void setQuantity(
					Double quantity)
	{
		this.quantity = quantity;
	}
	
	@ManyToOne(optional=false)
	@JoinColumn(name="mt_item_id", nullable=false)
	public MtItem getMtItem()
	{
		return mtItem;
	}
	public void setMtItem(MtItem mtItem)
	{
		this.mtItem = mtItem;
	}

	public void buildMap(Map<String, Object> map)
	{
		map.put("storeName", getStore().getName());
		map.put("quantity", getQuantity());
		map.put("inventoryId", getId());

		MtItem mtItem = getMtItem();
		
		map.put("mtItemId", mtItem.getId());
		map.put("mtNum", mtItem.getMaterialNum());
		map.put("mtName", mtItem.getName());
		map.put("mtUnit", mtItem.getUnit().getName());
		map.put("mtUnitCost", mtItem.getUnitCost());
		map.put("mtSource", mtItem.getSource());
		map.put("mtType", mtItem.getType());
		map.put("mtDscp", mtItem.getDescription());		
	}
}
