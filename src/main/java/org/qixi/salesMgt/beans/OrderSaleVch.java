package org.qixi.salesMgt.beans;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.qixi.basicElem.beans.EmpGenInfo;

@Entity
@Table(name="order_sale_vch")
@PrimaryKeyJoinColumn(name="sale_vch_id")
public class OrderSaleVch extends SaleVch
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6548926235939383588L;

	
	private String custOrderNum;

	private EmpGenInfo merchandiser;
	private ShippingCmp shippingCmp;
	private FreightCmp freightCmp;
	
	private Double freightCharge= 0.0;
	private Double transportCharge= 0.0;
	private Double exceptDeduction= 0.0;	
	
	private List<OrderDscpItem>  dscpItems = new ArrayList<>();
	

	@Column(name="cust_order_seq_num")
	public String getCustOrderNum()
	{
		return custOrderNum;
	}

	public void setCustOrderNum(
					String custOrderNum)
	{
		this.custOrderNum = custOrderNum;
	}

	@ManyToOne
	@JoinColumn(name="merchandiser_id")
	public EmpGenInfo getMerchandiser()
	{
		return merchandiser;
	}

	public void setMerchandiser(
					EmpGenInfo merchandiser)
	{
		this.merchandiser = merchandiser;
	}

	@ManyToOne
	@JoinColumn(name="shipping_cmp_id", nullable=true)
	public ShippingCmp getShippingCmp()
	{
		return shippingCmp;
	}

	public void setShippingCmp(
					ShippingCmp shippingCmp)
	{
		this.shippingCmp = shippingCmp;
	}

	@ManyToOne
	@JoinColumn(name="freight_cmp_id", nullable=true)
	public FreightCmp getFreightCmp()
	{
		return freightCmp;
	}

	public void setFreightCmp(
					FreightCmp freightCmp)
	{
		this.freightCmp = freightCmp;
	}

	@Column(name="freight_charge", nullable=false, columnDefinition = "numeric(12,2) default 0 CHECK (freight_charge >= 0)")
	public Double getFreightCharge()
	{
		return freightCharge;
	}

	public void setFreightCharge(
					Double freightCharge)
	{
		this.freightCharge = freightCharge;
	}

	@Column(name="transport_charge", nullable=false, columnDefinition = "numeric(12,2) default 0 CHECK (transport_charge >= 0)")
	public Double getTransportCharge()
	{
		return transportCharge;
	}

	public void setTransportCharge(
					Double transportCharge)
	{
		this.transportCharge = transportCharge;
	}

	@Column(name="except_deduction")
	public Double getExceptDeduction()
	{
		return exceptDeduction;
	}

	public void setExceptDeduction(
					Double excepDeduction)
	{
		this.exceptDeduction = excepDeduction;
	}

	@OneToMany(mappedBy="ownerVoucher", orphanRemoval=true)
	@Cascade(value = {org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.DELETE}) 
	public List<OrderDscpItem> getDscpItems()
	{
		return dscpItems;
	}

	public void setDscpItems(
					List<OrderDscpItem> dscItems)
	{
		this.dscpItems = dscItems;
	}
}
