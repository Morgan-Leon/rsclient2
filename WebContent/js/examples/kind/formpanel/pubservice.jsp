<%@ page import="java.lang.reflect.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.text.*"%>

<%@ page import="com.rsc.rsclient.*"%>
<%@ page import="com.rsc.rsclient.http.*"%>
<%@ page import="com.rsc.rsclient.util.*"%>

<%@ page import="com.rsc.rs.pub.dbUtil.*"%>
<%@ page import="com.rsc.rs.pub.util.*"%>
<%@ page import="com.rsc.rs.pub.util.functions.*"%>

<%!
    private Service service;
%><%
    request.setAttribute(WebKeys.CompanyCodeKey, "01");
    request.setAttribute(WebKeys.UserUniqueIdKey, "011");
    request.setAttribute(WebKeys.UsercodeKey, "admin");
    request.setAttribute(WebKeys.DbType, "Oracle");
    request.setAttribute(WebKeys.SelRsKey, new SelRs("", "sys"));
    
    HttpRequestProxy proxy = new HttpRequestProxy(request, response, this.getServletContext());
	proxy.doService(service);
%>
