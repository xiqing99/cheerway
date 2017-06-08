package org.qixi.basicElem.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;


@Entity
public class Contacts
{

	private static final long serialVersionUID = 1L;

	protected Integer id;
	protected String name;
	private String officePhone;
	private String fax;
	private String mobile;
	private String email;
	private String qq;
	private String job;
	private String department;	
	private String notes;
	private Partner partner;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public String getName()
	{
		return name;
	}
	
	public void setName(String name)
	{
		this.name = name;
	}	

	public String getMobile()
	{
		return mobile;
	}

	public void setMobile(
					String mobile)
	{
		this.mobile = mobile;
	}

	@Column()
	public String getEmail()
	{
		return email;
	}

	public void setEmail(String email)
	{
		this.email = email;
	}

	public String getQq()
	{
		return qq;
	}

	public void setQq(String qq)
	{
		this.qq = qq;
	}
	public String getOfficePhone()
	{
		return officePhone;
	}

	public String getDepartment()
	{
		return department;
	}
	public String getNotes()
	{
		return notes;
	}
	public void setOfficePhone(
					String officePhone)
	{
		this.officePhone = officePhone;
	}

	public void setDepartment(
					String department)
	{
		this.department = department;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	public String getFax()
	{
		return fax;
	}
	public void setFax(String fax)
	{
		this.fax = fax;
	}
	@ManyToOne()
	@JoinColumn(name = "partner_id", nullable = false)
	public Partner getPartner()
	{
		return partner;
	}
	public void setPartner(
					Partner partner)
	{
		this.partner = partner;
	}
	public String getJob()
	{
		return job;
	}
	public void setJob(String job)
	{
		this.job = job;
	}

}
