package org.qixi.basicElem.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Date;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.hibernate.exception.ConstraintViolationException;
import org.qixi.basicElem.beans.ProdSample;
import org.qixi.basicElem.service.ProdSampleService;
import org.qixi.common.action.BaseEntityAction;
import org.qixi.common.beans.Result;
import org.qixi.security.beans.UserSecure;
import org.springframework.security.core.context.SecurityContextHolder;

import com.opensymphony.xwork2.ActionContext;

public class ProdSampleAction extends BaseEntityAction<ProdSample>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	final static Logger  logger = Logger.getLogger(ProdSampleAction.class);  
	
    private File upload;  
    private String uploadFileName;	
    private String uploadContentType;  
    
    private static String BLANK_IMA = "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    
    private static final int BUFFER_SIZE = 16 * 1024; 

    private Integer ctgId;
    
    @Override
	public String save()
	{
		String savedPicUrl = BLANK_IMA;
		
		if(this.upload != null)
		{

			savedPicUrl = entity.getPicUrl();
			
			entity.setPicUrl(savePicture());
		}
		
		Result result = new Result();

		try
		{
			result = ((ProdSampleService)service).save(entity, getCurrentUserEmpId());
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("save.failure.constraintViolation");
		}		
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));
			
			if(result.dataMap != null)
			{
				resultMap.put("id", result.dataMap.get("id"));
				resultMap.put("picUrl", result.dataMap.get("picUrl"));
			}
			if(savedPicUrl != BLANK_IMA)
			{
				delPicture(savedPicUrl);
			}			
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, getText(result.cause));
			
			if(entity.getPicUrl() != BLANK_IMA)
			{
				delPicture(entity.getPicUrl());
			}
		}		

		return SUCCESS;
	}    
    
    @Override
    public String delete()
    {		
		Result result = new Result();
		
		try
		{
			result = ((ProdSampleService)service).delById(id, getCurrentUserEmpId());
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("delete.failure.constraintViolation");
		}
		
		if(result.success)
		{
			setActionResult(true,  getText("delete.success"));
			
			if(result.cause != BLANK_IMA)
			{
				delPicture(result.cause);
			}
		}else {
			setActionResult(false, getText(result.cause));
		}
				
		return SUCCESS;	
    }

	public String loadByCtg()
	{
		list = ((ProdSampleService)service).getListByCtg(ctgId);
		return SUCCESS;
	}	
	
	public String loadDisabledList()
	{
		list = ((ProdSampleService)service).getDisabledList();
		
		return SUCCESS;
	}    
    
	public String lend()
	{
		Result result = new Result();

		try
		{
			result = ((ProdSampleService)service).updateLendEmp(id, getCurrentUserEmpId());
		}
		catch (ConstraintViolationException e)
		{
			result.success = false;
			result.cause = getText("save.failure.constraintViolation");
		}
		
		if(result.success)
		{
			setActionResult(true,  getText("save.success"));			
		}else {
			if(result.cause == null)
				result.cause ="save.failure";
			setActionResult(false, result.cause);
		}	
		
		return SUCCESS;
	}
	protected Integer getCurrentUserEmpId()
	{
		UserSecure currentUser = (UserSecure) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return currentUser.getEmployeeId();
	}    
    
    private void delPicture(String picUrl)
    {
    	int pos = picUrl.lastIndexOf("/");  
    	
    	String fileName = picUrl.substring(pos);
    	  
    	String dir = getRootPath() + fileName;
    	
    	System.out.println("delFile= "+dir);  
    	
    	File orgFile = new File(dir);
    	
    	if(orgFile.exists())
    	{
    		if(!orgFile.delete())
    		{
    			logger.error("delete picture failed!  " + fileName);
    		}
    	}
    }
    
    private String savePicture()
    {    	    	
    	String rootPath = getRootPath();
    	
    	Date date = new Date(System.currentTimeMillis());
    	String genFileName = date.getTime() + getFileExp(this.uploadFileName);
    	
    	String toSrc = rootPath + "/" + genFileName;
    	
    	System.out.println("toFile= "+toSrc);  
    	
    	File toFile = new File(toSrc);
    	
    	writeFile(this.upload, toFile);
    	
    	return "userImage/sample/" + genFileName;
    }   
 
    private String getRootPath()
    {
    	ActionContext actionContext = ActionContext.getContext();
    	
    	ServletContext servletContext = (ServletContext)actionContext.get(ServletActionContext.SERVLET_CONTEXT);
    	
    	String rootPath = servletContext.getRealPath("userImage/sample");
    	
    	return rootPath;
    }
 
    private String getFileExp(String name) {  
        int pos = name.lastIndexOf(".");  
  
        return name.substring(pos);  
    }     
    
    private static void writeFile(File src, File dst) {  
        
        try {  
            InputStream in = null;  
            OutputStream out = null;  
            try {  
            	
                in = new BufferedInputStream(new FileInputStream(src), BUFFER_SIZE);
                out = new BufferedOutputStream(new FileOutputStream(dst), BUFFER_SIZE);

                byte[] buffer = new byte[BUFFER_SIZE];  
                while (in.read(buffer) > 0) {  
                    out.write(buffer);  
                }  
            } finally {  
                if (null != in) {  
                    in.close();  
                }  
                if (null != out) {  
                    out.close();  
                }  
            }  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }      
    
    public File getUpload()
	{
		return upload;
	}
	public void setUpload(File upload)
	{
		this.upload = upload;
	}

	public String getUploadFileName()
	{
		return uploadFileName;
	}

	public void setUploadFileName(
					String uploadFileName)
	{
		this.uploadFileName = uploadFileName;
	}

	public String getUploadContentType()
	{
		return uploadContentType;
	}

	public void setUploadContentType(
					String uploadContentType)
	{
		this.uploadContentType = uploadContentType;
	}

	public Integer getCtgId()
	{
		return ctgId;
	}

	public void setCtgId(Integer ctgId)
	{
		this.ctgId = ctgId;
	}
}
