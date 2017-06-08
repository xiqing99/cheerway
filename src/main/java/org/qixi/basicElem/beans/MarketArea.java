package org.qixi.basicElem.beans;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.common.beans.BaseTreeNode;
import org.springframework.security.web.header.writers.frameoptions.StaticAllowFromStrategy;



@Entity
@Table(name = "market_area")
public class MarketArea extends BaseTreeNode<MarketArea>
{

	private static final long serialVersionUID = 1L;

	public static Integer RootId = 1;
}
