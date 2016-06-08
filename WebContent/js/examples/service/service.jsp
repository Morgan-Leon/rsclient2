<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@include file="../pubservice.jsp"%>
<%!public void jspInit() {
	    this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("getJSON").addIntegerParameter("id").setMapReturnValue();
			mm.add("getHTML").setStringReturnValue();
			mm.add("getXML").setStringReturnValue("sheet");
			mm.add("getTEXT").setStringReturnValue();
			mm.add("getSCRIPT").setStringReturnValue();
			mm.add("getANY").setStringReturnValue();
		}

		public Map getJSON(int id) {
			Map map = new HashMap();
			map.put("id", new Integer(id));
			map.put("title", "XXX预算表_" + id);
			return map;
		}

		public String getHTML() {
			String str = "<div style='border:1px solid red; width:100px; height:100px'>来自服务器的一段HTML</div>";
			return str;
		}

		public Map getXML() {
			Map map = new HashMap();
			map.put("id", new Integer(100));
			map.put("title", "XXXX");
			Map u1 = new HashMap();
			u1.put("user_unique_id", "001");
			u1.put("user_name", "admin");
			Map u2 = new HashMap();
			u2.put("user_unique_id", "002");
			u2.put("user_name", "admin_2");
			map.put("u1", u1);
			map.put("u2", u2);
			return map;
		}

		public String getTEXT() {
			String str = "纯文本内容，就是纯文本内容.";
			return str;
		}

		public String getSCRIPT() {
			String str = "alert('hello world')";
			return str;
		}

		public int getANY() {
			return 10000;
		}
	}%>