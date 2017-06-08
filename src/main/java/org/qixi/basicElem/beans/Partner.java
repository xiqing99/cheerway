package org.qixi.basicElem.beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.hibernate.annotations.Cascade;
import org.qixi.common.beans.BaseEntity;

@Entity
@Inheritance(strategy= InheritanceType.JOINED)
public abstract class Partner extends BaseEntity
{
	
	public static enum Credit
	{
		HIGH, MEDIUM, LOW
	};
	
	private Date        startDate;
	private List<Contacts> contactsList = new ArrayList<>();
	private Department  respDept;
	private EmpGenInfo  respEmp;
	private Currency    currency;
	private String      address;
	private Credit      credit;	
	private String      phone;
	private String      fax;
	private String      email;
	private String      sortIndex;
	private String      fullName;
	private Boolean     disabled;

	
	@Column(name="disabled", columnDefinition = "boolean default false")
	public Boolean getDisabled()
	{
		return disabled;
	}
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}	
	
	public Date getStartDate()
	{
		return startDate;
	}
	
	@OneToMany( mappedBy = "partner", orphanRemoval=true)
	@Cascade(value = {org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.DELETE})  
	public List<Contacts> getContactsList()
	{
		return contactsList;
	}
	@ManyToOne
	@JoinColumn(name="resp_dept_id", nullable=false)
	public Department getRespDept()
	{
		return respDept;
	}
	
	@ManyToOne
	@JoinColumn(name="resp_emp_id", nullable=false)	
	public EmpGenInfo getRespEmp()
	{
		return respEmp;
	}
	
	public String getAddress()
	{
		return address;
	}

	public void setStartDate(Date startDate)
	{
		this.startDate = startDate;
	}
	public void setContactsList(
					List<Contacts> contactsList)
	{		
		
		for(Contacts contacts : contactsList)
		{
			contacts.setPartner(this);
		}
		
		this.contactsList = contactsList;
	}
	public void setRespDept(
					Department respDept)
	{
		this.respDept = respDept;
	}
	public void setRespEmp(
					EmpGenInfo respEmp)
	{
		this.respEmp = respEmp;
	}
	public void setAddress(String address)
	{
		this.address = address;
	}

	public String getPhone()
	{
		return phone;
	}

	public void setPhone(String phone)
	{
		this.phone = phone;
	}

	public String getFax()
	{
		return fax;
	}

	public void setFax(String fax)
	{
		this.fax = fax;
	}

	public String getEmail()
	{
		return email;
	}

	public void setEmail(String email)
	{
		this.email = email;
	}
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	public Credit getCredit()
	{
		return credit;
	}
	public void setCredit(Credit credit)
	{
		this.credit = credit;
	}
	
	@ManyToOne
	@JoinColumn(name="currency_id", nullable=false)
	public Currency getCurrency()
	{
		return currency;
	}

	public void setCurrency(
					Currency currency)
	{
		this.currency = currency;
	}
	
	@Column(name="sort_index")
	public String getSortIndex()
	{
		return sortIndex;
	}
	public void setSortIndex(String sortIndex)
	{
		this.sortIndex = sortIndex;
	}
	
	@Column(name="full_name", nullable=false)
	public String getFullName()
	{
		return fullName;
	}
	public void setFullName(
					String fullName)
	{
		this.fullName = fullName;
	}
	
}
