package org.qixi.basicElem.beans;


import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.common.beans.BaseEntity;


@Entity
@Table(name="product_type")
public class ProductType extends BaseEntity
{

	private static final long serialVersionUID = 1L;
	
}
