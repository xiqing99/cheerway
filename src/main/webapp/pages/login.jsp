<%@ page contentType="text/html; charset=gb2312" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <title>用户登陆</title>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312"><style type="text/css">
<!--
body,td,th {
	color: #000099;
}
-->
</style></head>
    <body>
      <center>
        <h3>请输入用户名和密码来登陆</h3>       
			<div class="error ${param.error == true ? '' : 'hide'}">
			${sessionScope['SPRING_SECURITY_LAST_EXCEPTION'].message}
			</div>  
            <br />  
  
			<form action= ${pageContext.request.contextPath}/j_spring_security_check method="post">  
			    <table class="login" border="0" cellpadding="0" cellspacing="0">  
			      <tr>  
			        <td height="25" colspan="2" align="center"><span class="title">用户登录</span></td>  
			      </tr>  
			      <tr>  
			        <td width="52" height="28" align="right" nowrap="nowrap">用户名：</td>  
			        <td width="178" align="left"><input class="input" type="text" name="j_username" value="${sessionScope['SPRING_SECURITY_LAST_USERNAME']}"/></td>  
			      </tr>  
			      <tr>  
			        <td height="31" align="right">密码：</td>  
			        <td align="left"><input class="input" type="password" name="j_password" /></td>  
			      </tr>  
			      <tr>  
			        <td height="25">&nbsp;</td>  
			        <td nowrap="nowrap" align="left"><input type="checkbox" name="_spring_security_remember_me" />两周之内自动登陆</td>  
			      </tr>  
			      <tr>  
			        <td height="40" colspan="2" align="center">  
			            <input type="submit" value="登陆"/>  
			            <input type="reset" value="重置"/>  
			        </td>  
			      </tr>  
			    </table>  
			</form>  
        </center>
    </body>
</html>
