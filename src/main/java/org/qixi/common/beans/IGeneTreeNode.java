package org.qixi.common.beans;

import java.util.List;

public abstract interface IGeneTreeNode<T> 
{		
	public Integer getId();

	public void setId(Integer id);

	public String getName();

	public void setName(String name);

	public String getDescription();

	public void setDescription(String description);
	
	public void setSupNode(T supNode);
	
	public void setSubNodesList(List<T> subNodesList);
	
	public IGeneTreeNode<T> getSupNode();

	public List<IGeneTreeNode<T>> getSubNodesIntfaceList();
			
}
