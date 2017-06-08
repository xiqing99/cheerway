package org.qixi.basicElem.service;

import java.util.List;
import java.util.Map;

import org.qixi.basicElem.beans.ProdSample;
import org.qixi.common.beans.Result;
import org.qixi.common.service.IGenericService;

public interface ProdSampleService extends IGenericService<ProdSample>
{
	public List<Map<String, Object>> getListByCtg(Integer ctgId);
	public Result save(ProdSample entity, Integer empId);
	public Result delById(Integer id, Integer empId);
	public Result updateLendEmp(Integer eneityId, Integer empId);
	public List<Map<String, Object>> getDisabledList();
}
