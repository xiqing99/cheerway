package org.qixi.basicElem.beans;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.qixi.common.beans.BaseEntity;
import org.qixi.common.beans.IGeneTreeNode;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@BatchSize(size = 20)
public class Store extends BaseEntity implements IGeneTreeNode<Store>
{

	private static final long serialVersionUID = 1L;
	
	public static Integer RootId = 1;

	private Store supNode;
	private List<Store> subNodesList = new ArrayList<Store>();
	
	@ManyToOne()
	@JoinColumn(name="sup_id")
	public Store getSupNode()
	{
		return supNode;
	}
	public void setSupNode(Store supNode)
	{
		this.supNode = supNode;
	}
	
	@OneToMany(mappedBy="supNode", fetch= FetchType.LAZY)
	public List<Store> getSubNodesList()
	{
		return subNodesList;
	}
	public void setSubNodesList(
					List<Store> subNodesList)
	{
		this.subNodesList = subNodesList;
	}

	@Transient
	public List<IGeneTreeNode<Store>> getSubNodesIntfaceList()
	{
		List<IGeneTreeNode<Store>> list = new ArrayList<>();
		for(Store node : subNodesList)
		{
			IGeneTreeNode<Store> entity = (IGeneTreeNode<Store>)node;
			list.add(entity);
		}		
		return list;
	}
	
}
