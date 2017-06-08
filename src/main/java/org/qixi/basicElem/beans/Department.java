package org.qixi.basicElem.beans;

import javax.persistence.Entity;

import org.qixi.common.beans.BaseTreeNode;

@Entity
public class Department extends BaseTreeNode<Department>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static Integer RootId = 1;
	public static Integer SalesDeptRootId = 2;
}
