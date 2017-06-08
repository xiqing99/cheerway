package org.qixi.common.beans;


import java.util.Map;

public class Result
{
	public boolean success;
	public String  cause;
	public Map<String, Object> dataMap;
	public Result()
	{
		success = true;
		cause = "success";
	}
}
