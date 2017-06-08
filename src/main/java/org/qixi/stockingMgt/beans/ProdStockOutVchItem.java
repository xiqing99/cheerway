package org.qixi.stockingMgt.beans;


import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.manuMgt.beans.ProdMtItem;


@Entity
@Table(name="prod_stock_out_vch_item")
public class ProdStockOutVchItem extends BaseStockVchItem<ProdMtItem,ProdStockOutVch>
{

}
