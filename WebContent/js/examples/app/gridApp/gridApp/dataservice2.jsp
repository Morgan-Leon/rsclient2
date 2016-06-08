<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("gather").addIntegerParameter("id").setBooleanReturnValue();
		}

		public boolean gather(int id) {
			log("传入参数：" + id);
			return true;
		}

	}%>