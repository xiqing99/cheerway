package org.qixi.common.beans;

import java.io.Serializable;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;

import org.hibernate.annotations.Cascade;
import org.qixi.basicElem.beans.Department;
import org.qixi.basicElem.beans.EmpGenInfo;



@SuppressWarnings("serial")
@MappedSuperclass
public abstract class BaseVoucher<T> implements Serializable
{	
	private Integer id;
	private Date createdDate;
	private EmpGenInfo rspEmp;
	private EmpGenInfo auditEmp;
	private EmpGenInfo firstLevelAuditEmp;
	private String notes;
	private Department dept;
	private Date approvedTime;
	private List<T>  items = new ArrayList<>();
	
	private VoucherState.State state;
	private String sequenceNum;	

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
	
	@ManyToOne()
	@JoinColumn(name="audit_emp_id", nullable=false)
	public EmpGenInfo getAuditEmp()
	{
		return auditEmp;
	}
	public void setAuditEmp(
					EmpGenInfo auditEmp)
	{
		this.auditEmp = auditEmp;
	}

	@ManyToOne()
	@JoinColumn(name="fl_audit_emp_id")
	public EmpGenInfo getFirstLevelAuditEmp()
	{
		return firstLevelAuditEmp;
	}

	public void setFirstLevelAuditEmp(
					EmpGenInfo firstLevelAuditEmp)
	{
		this.firstLevelAuditEmp = firstLevelAuditEmp;
	}	

	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	public VoucherState.State getState()
	{
		return state;
	}
	public void setState(VoucherState.State state)
	{
		this.state = state;
	}
	
	@Column(name="sequence_num", nullable=false, unique=true)
	public String getSequenceNum()
	{
		return sequenceNum;
	}
	public void setSequenceNum(
					String sequenceNum)
	{
		this.sequenceNum = sequenceNum;
	}
	

	
	@ManyToOne
	@JoinColumn(name="rsp_emp_id", nullable = false)
	public EmpGenInfo getRspEmp()
	{
		return rspEmp;
	}
	public void setRspEmp(EmpGenInfo rspEmp)
	{
		this.rspEmp = rspEmp;
	}
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}

	@ManyToOne
	@JoinColumn(name="rsp_dept_id", nullable=false)
	public Department getDept()
	{
		return dept;
	}

	public void setDept(Department dept)
	{
		this.dept = dept;
	}	
	
	@Column(name="approved_time")
	public Date getApprovedTime()
	{
		return approvedTime;
	}

	public void setApprovedTime(
					Date approvedTime)
	{
		this.approvedTime = approvedTime;
	}

	@OneToMany(mappedBy="ownerVoucher", orphanRemoval=true)
	@Cascade(value = {org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.DELETE})  	
	public List<T> getItems()
	{
		return items;
	}

	public void setItems(
					List<T> items)
	{
		this.items = items;
	}	
	
	public void buildMap(Map<String, Object> map)
	{
		map.put("seqNum", getSequenceNum());
		map.put("voucherId", getId());
		map.put("state", getState());
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		if(getCreatedDate() != null)
		{
			String dateString = format.format(getCreatedDate());						
			map.put("createdDate", dateString );
		}

		if(getApprovedTime() != null)
		{
			String dateString = format.format(getApprovedTime());						
			map.put("approvedDate", dateString );
		}
		
		map.put("notes", getNotes());		
		map.put("rspEmpName", getRspEmp().getName());
		map.put("auditEmpName", getAuditEmp().getName());
		
	}
}
