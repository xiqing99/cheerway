package org.qixi.security.action;


import org.qixi.common.action.BaseAction;
import org.qixi.security.service.SysSettingService;
import org.springframework.beans.factory.annotation.Autowired;


public class SysSettingAction extends BaseAction
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Autowired
	SysSettingService service;
	
	private String seqName;
	private Integer value;
	
	public String loadVoucherSeqNumSeeds()
	{
		list = service.getVchSeqSeedList();
		
		return SUCCESS;		
	}
	
	public String resetAllVoucherSeqNumSeeds()
	{
		service.resetAllSeqNumSeed();
		
		resultMap.put("success", true);
		
		return SUCCESS;
	}
	
	public String updateSeqValue()
	{
		service.updateSeqValue(seqName, value);
		
		resultMap.put("success", true);
		
		return SUCCESS;		
	}

	public String getSeqName()
	{
		return seqName;
	}

	public void setSeqName(String seqName)
	{
		this.seqName = seqName;
	}

	public Integer getValue()
	{
		return value;
	}

	public void setValue(Integer value)
	{
		this.value = value;
	}
	
}