package org.qixi.common.util;


import javax.annotation.Resource;
import javax.mail.MessagingException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"file:src/test/SpringBeansTest.xml"})

public class EmailUtilTest
{
	@Resource(name="emailUtil")
	EmailUtil emailUtil;
	
	@Test
	public void testSendMail()
	{
		String html= "<html><head><META http-equiv=Content-Type content='text/html; charset=UTF-8'><title>云书签注册激活</title></head><body>欢迎使用，云书签。<br/><a href='www.baidu.com' >云书签</a><br>点击上面超链接 激活账户信息！</body><html>";	
		
/*		try
		{
			emailUtil.sendMail("测试邮件", html, true, "QingXi_99@163.com");
		}
		catch (MessagingException e)
		{
			System.out.println("发送邮件失败！");
			e.printStackTrace();
		}*/
	}
	
	
}
