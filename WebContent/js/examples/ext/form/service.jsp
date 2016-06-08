<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@ page import="org.apache.commons.fileupload.FileItem"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("submit").addStringParameter("date").addStringParameter(
					"from").addStringParameter("to").addStringParameter(
					"subject").addStringParameter("msg").addObjectParameter(
					"attachment", FileItem.class).setBooleanReturnValue();
		}

		public boolean submit(String date, String from, String to, String subject,
				String msg, FileItem file) {
			log("submit ................................ ");
			log("date:" + date);
			log("from:" + from);
			log("to:" + to);
			log("subject:" + subject);
			log("msg:" + msg);
			log("file:" + file.getName());
			log(file.getString());
			
			return true;
		}

	}%>