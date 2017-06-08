package org.qixi.accountMgt.beans;

import java.io.Serializable;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.basicElem.beans.Partner;

@MappedSuperclass
public abstract class BaseFundVch implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private Date deadlineDate;
	private Date paidOffDate;
	private Date createdDate;
	private Double totalAmount;
	private Double remainedAmount;
	private EmpGenInfo accountEmp;
	private String notes;
	private Partner partner;
	private Double exchangeRate;
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	@Column(name="deadline",nullable=false)
	public Date getDeadlineDate()
	{
		return deadlineDate;
	}
	public void setDeadlineDate(
					Date deadlineDate)
	{
		this.deadlineDate = deadlineDate;
	}	
	
	@Column(name="total_amount", nullable=false, columnDefinition = "numeric(12,2) CHECK (total_amount > 0)")
	public Double getTotalAmount()
	{
		return totalAmount;
	}
	public void setTotalAmount(
					Double totalAmount)
	{
		this.totalAmount = totalAmount;
	}
	
	@Column(name="remained_amount", nullable=false, columnDefinition = "numeric(12,2) CHECK (remained_amount >= 0)")
	public Double getRemainedAmount()
	{
		return remainedAmount;
	}
	public void setRemainedAmount(
					Double remainedAmoutn)
	{
		this.remainedAmount = remainedAmoutn;
	}
	
	@ManyToOne
	@JoinColumn(name="account_emp_id")
	public EmpGenInfo getAccountEmp()
	{
		return accountEmp;
	}
	public void setAccountEmp(
					EmpGenInfo accountEmp)
	{
		this.accountEmp = accountEmp;
	}
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	
	@Column(name="paid_off_date", nullable=true)
	public Date getPaidOffDate()
	{
		return paidOffDate;
	}
	public void setPaidOffDate(
					Date paidOffDate)
	{
		this.paidOffDate = paidOffDate;
	}
	
	@Column(name="created_date", nullable=false)
	public Date getCreatedDate()
	{
		return createdDate;
	}
	public void setCreatedDate(
					Date createdDate)
	{
		this.createdDate = createdDate;
	}	
	
	@ManyToOne(optional=false)
	@JoinColumn(name="partner_id", nullable=false)	
	public Partner getPartner()
	{
		return partner;
	}
	public void setPartner(
					Partner partner)
	{
		this.partner = partner;
	}
	
	@Column(name="exchange_rate", nullable=false, columnDefinition = "numeric(12,2) default 1 CHECK (exchange_rate >0)")
	public Double getExchangeRate()
	{
		return exchangeRate;
	}
	public void setExchangeRate(
					Double exchangRate)
	{
		this.exchangeRate = exchangRate;
	}

	public void buildMapForEntity(Map<String, Object> map)
	{	
		map.put("entity.id", getId());
		map.put("totalAmount", getTotalAmount());
		map.put("remainedAmount", getRemainedAmount());
		if(getAccountEmp() != null)
			map.put("entity.accountEmp.id", getAccountEmp().getId());
		
		map.put("custName", getPartner().getName());
		map.put("currencyName", getPartner().getCurrency().getName());		
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(getDeadlineDate() != null)
		{
			String dateString = format.format(getDeadlineDate());						
			map.put("entity.deadlineDate", dateString );
		}
		
		map.put("entity.exchangeRate", getExchangeRate());

		String dateString = format.format(getCreatedDate());						
		map.put("createdDate", dateString );		
		
		map.put("entity.notes", getNotes());	
	}
	
	public void buildMapForList(Map<String, Object> map, Date dueDate)
	{
		map.put("vchId", getId());
		if(getAccountEmp() != null)
			map.put("accountEmpName", getAccountEmp().getName());
		
		map.put("totalAmount", getTotalAmount());
		map.put("remainedAmount", getRemainedAmount());		
		map.put("custName", getPartner().getName());
		map.put("currencyName", getPartner().getCurrency().getName());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		String dateString = format.format(getCreatedDate());						
		map.put("createdDate", dateString );

		if(getDeadlineDate() != null)
		{
			dateString = format.format(getDeadlineDate());						
			map.put("deadlineDate", dateString );
			
			if(getRemainedAmount() > 0)
			{
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(getDeadlineDate());
				long millisDeadLine = calendar.getTimeInMillis();
				long millisDueDate;
				
				if(dueDate != null)
				{
					calendar.setTime(dueDate);
					millisDueDate = calendar.getTimeInMillis();
				}else {
					millisDueDate = System.currentTimeMillis();
				}

				
				long dateOfOverdue = (millisDeadLine - millisDueDate)/(1000 * 60 * 60 * 24);
				
				map.put("dateOfOverDue", dateOfOverdue);
			}
		}

		if(getPaidOffDate() != null)
		{
			dateString = format.format(getPaidOffDate());						
			map.put("paidOffDate", dateString );
		}		
		
		map.put("notes", getNotes());	
	
	}	
}
