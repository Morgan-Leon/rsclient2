<%@ page language="java" contentType="text/html; charset=GB2312"%>
<%
  String userinfo = "Rs.ns('rs.userInfo'); "
    +"rs.userInfo = {userId:"
    +"'"+(String)request.getAttribute("userId")+"'"
    +", userName:"
    +"'"+(String)request.getAttribute("userName")+"'"
    +", userCode:"
    +"'"+(String)request.getAttribute("userCode")+"'"
    +", companyCode:"
    +"'"+(String)request.getAttribute("companyCode")+"'"
    +", userAgent:"
    +"'"+(String)request.getHeader("user-agent")+"'"
    +", osName:"
    +"'"+(String)System.getProperty("os.name")+"'"
    +"};";
    response.getWriter().write(userinfo);
	response.getWriter().flush();
	response.getWriter().close();
%>
