<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>

<%@ page import="java.util.*"%>

<%	
	response.setContentType("application/json;charset=UTF-8");
	String content = "{id:100, title:'XXXÔ¤Ëã±í'}";
	response.getWriter().write(content);
	response.getWriter().flush();
	response.getWriter().close();
%>