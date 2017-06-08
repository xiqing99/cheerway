package org.qixi.salesMgt.beans;


import javax.persistence.Entity;
import javax.persistence.Table;

import org.qixi.common.beans.BaseEntity;


@Entity
@Table(name="payment_mode")
public class PaymentMode extends BaseEntity
{

	private static final long serialVersionUID = 1L;
		
}
