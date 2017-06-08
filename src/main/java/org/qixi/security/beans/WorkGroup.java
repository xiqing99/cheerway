package org.qixi.security.beans;


import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.qixi.basicElem.beans.EmpGenInfo;
import org.qixi.common.beans.BaseEntity;


@Entity
@Table(name="work_group")
public class WorkGroup extends BaseEntity
{

	private static final long serialVersionUID = 1L;
	
	private Set<EmpGenInfo> empList;

	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="work_Group_emp_map",
					joinColumns= @JoinColumn(name="work_group_id"),
					inverseJoinColumns=@JoinColumn(name="employee_id"))
	public Set<EmpGenInfo> getEmpList()
	{
		return empList;
	}

	public void setEmpList(
					Set<EmpGenInfo> empList)
	{
		this.empList = empList;
	}
	
}
