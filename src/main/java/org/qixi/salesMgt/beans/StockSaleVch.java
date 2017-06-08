package org.qixi.salesMgt.beans;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;


@Entity
@Table(name="stock_sale_vch")
@PrimaryKeyJoinColumn(name="sale_vch_id")
public class StockSaleVch extends SaleVch
{

	private static final long serialVersionUID = 6548926235939383588L;
	
}
