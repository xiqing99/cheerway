package org.qixi.basicElem.beans;


import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.common.beans.BaseTreeNode;

@Entity
@Table(name="product_category")
public class ProductCategory extends BaseTreeNode<ProductCategory>
{
	
	private static final long serialVersionUID = 1L;
	public static Integer RootId = 1;
}
