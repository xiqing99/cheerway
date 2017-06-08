package org.qixi.security.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import org.qixi.security.beans.VchSeqSeed;
import org.qixi.security.dao.VchSeqSeedDao;
import org.springframework.beans.factory.annotation.Autowired;

public class SysSettingService
{
	
	final static Logger logger= Logger.getLogger(SysSettingService.class);
	
	@Autowired
	VchSeqSeedDao seedSeqDao;
	
	public List<Map<String, Object>> getVchSeqSeedList()
	{
		List<Map<String, Object>> mapList = new ArrayList<>();
		
		List<VchSeqSeed> seqList = seedSeqDao.getAll();
		
		for(VchSeqSeed seedSeq : seqList)
		{
			Map<String, Object> map = new HashMap<>();
			
			map.put("seqName", seedSeq.getName());
			map.put("seqDesc", seedSeq.getDescription());
			map.put("curValue", seedSeqDao.getSeqCurValue(seedSeq.getName()));
			
			mapList.add(map);
		}
		
		return mapList;
	}
	
	public void resetAllSeqNumSeed()
	{
		List<VchSeqSeed> seqList = seedSeqDao.getAll();
		
		for(VchSeqSeed seedSeq : seqList)
		{
			seedSeqDao.setSeqValue(seedSeq.getName(), 1);
		}
		
		return;
	}
	
	public void updateSeqValue(String seqName, Integer value)
	{
		seedSeqDao.setSeqValue(seqName, value);
		
		return;
	}
}