package org.qixi.basicElem.beans;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="emp_gen_info")
public class EmpGenInfo 
{

	private static final long serialVersionUID = 1L;

	private Integer id;
	private String name;
	private String description;
	private String extNum;
	private String mobileNum;
	private String email;
	private String qq;
	private Position position;
	private Department dept;	
	private Boolean     disabled;
	private String      sortIndex;

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
	
	@Column(nullable = false, unique=true)
	public String getName()
	{
		return name;
	}
	
	public void setName(String name)
	{
		this.name = name;
	}	

	public String getDescription()
	{
		return description;
	}
	public void setDescription(
					String description)
	{
		this.description = description;
	}			
	
	@Column(name="disabled", columnDefinition = "boolean default false")
	public Boolean getDisabled()
	{
		return disabled;
	}
	public void setDisabled(Boolean disabled)
	{
		this.disabled = disabled;
	}	
	
	@ManyToOne()
	@JoinColumn(name="dept_id", nullable = false)
	public Department getDept()
	{
		return dept;
	}

	public void setDept(Department dept)
	{
		this.dept = dept;
	}


/*	public Integer getEmpId()
	{
		return empId;
	}

	public void setEmpId(Integer empId)
	{
		this.empId = empId;
	}*/


	public String getExtNum()
	{
		return extNum;
	}

	public void setExtNum(String extNum)
	{
		this.extNum = extNum;
	}

	@Column(unique=true)
	public String getMobileNum()
	{
		return mobileNum;
	}

	public void setMobileNum(
					String mobileNum)
	{
		this.mobileNum = mobileNum;
	}

	
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

	@ManyToOne
	@JoinColumn(name="pos_id", nullable = false)
	public Position getPosition()
	{
		return position;
	}

	public void setPosition(
					Position position)
	{
		this.position = position;
	}
	
	@Column(name="sort_index")
	public String getSortIndex()
	{
		return sortIndex;
	}
	public void setSortIndex(
					String sortIndex)
	{
		this.sortIndex = sortIndex;
	}	

}
