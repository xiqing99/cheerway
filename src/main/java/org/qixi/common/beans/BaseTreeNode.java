package org.qixi.common.beans;


import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;


@SuppressWarnings("serial")
@MappedSuperclass
public abstract class BaseTreeNode<T> extends BaseEntity
{
	private T supNode;

	public static Integer ROOT_ID = 1;
	
	@ManyToOne()
	@JoinColumn(name="sup_id")
	public T getSupNode()
	{
		return supNode;
	}

	public void setSupNode(
					T supNode)
	{
		this.supNode = supNode;
	}		
	
}
