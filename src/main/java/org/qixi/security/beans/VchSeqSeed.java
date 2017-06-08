package org.qixi.security.beans;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="vch_seq_seed")
public class VchSeqSeed implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1830533363472417267L;
	
	public static  String OrderSaleSeqNum = "order_sale_serial_sequence";
	public static  String StockSaleSeqNum = "stock_sale_serial_sequence";
	public static  String ProdStockInSeqNum = "prod_stockin_serial_sequence";
	public static  String ProdStockOutSeqNum = "prod_stockout_serial_sequence";
	public static  String ProdStockRtSeqNum = "prod_stock_return_serial_sequence";
	public static  String StockTakenSeqNum = "stock_taken_serial_sequence";
	public static  String StockTsfSeqNum = "stock_transfer_serial_sequence";
	public static  String DepositeSeqNum = "deposite_serial_sequence";
	public static  String ReceiptSeqNum = "receipt_serial_sequence";
	public static  String RefundmentSeqNum = "refundment_serial_sequence";	
	
	private int id;
	private String name;
	private String description;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public int getId()
	{
		return id;
	}
	public void setId(int id)
	{
		this.id = id;
	}
	
	@Column(nullable=false, unique=true)
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	
	@Column(nullable= false, unique=true)
	public String getDescription()
	{
		return description;
	}
	public void setDescription(
					String description)
	{
		this.description = description;
	}

}
