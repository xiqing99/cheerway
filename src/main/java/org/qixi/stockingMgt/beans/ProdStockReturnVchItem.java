package org.qixi.stockingMgt.beans;


import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.manuMgt.beans.ProdMtItem;


@Entity
@Table(name="prod_stock_return_vch_item")
public class ProdStockReturnVchItem extends BaseStockVchItem<ProdMtItem,ProdStockReturnVch>
{

}
