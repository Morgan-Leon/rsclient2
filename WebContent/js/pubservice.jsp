<%@ page import="java.lang.reflect.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.text.*"%>
<%@ page import="java.util.Date"%>

<%@ page import="com.rsc.rsclient.*"%>
<%@ page import="com.rsc.rsclient.http.*"%>
<%@ page import="com.rsc.rsclient.util.*"%>

<%@ page import="com.rsc.rs.pub.dbUtil.*"%>
<%@ page import="com.rsc.rs.pub.util.*"%>
<%@ page import="com.rsc.rs.pub.util.functions.*"%>
<%@ page import="com.rsc.rs.pub.util.DateUtil"%>


<%!
    private Service service;
%><%
    String ipAddress = request.getRemoteAddr();
    request.setAttribute("ip_address", ipAddress);
    HttpRequestProxy proxy = new HttpRequestProxy(request, response);
	proxy.doService(service);
%>
