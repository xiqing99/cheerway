package org.qixi.basicElem.beans;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="partner_id")
public class Provider extends Partner
{
	
	private ProviderCtg ctg;

	@ManyToOne
	@JoinColumn(name="ctg_id")
	public ProviderCtg getCtg()
	{
		return ctg;
	}

	public void setCtg(ProviderCtg ctg)
	{
		this.ctg = ctg;
	}

}
