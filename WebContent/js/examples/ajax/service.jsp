<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@include file="../pubservice.jsp"%>
<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("sayHi");
			mm.add("sayHiToSb").addStringParameter("name");
			mm.add("sayHiToo").addStringParameter("name").addMapParameter("books").setStringReturnValue();
		    
			mm.add("sayHiTooo").addStringParameter("名字").setStringReturnValue();
			
			mm.add("service1");
			mm.add("service2").addBeforeMethod("service1").addAfterMethod(
					"service3");

			mm.add("service3").setStringReturnValue("msg").addAfterMethod(
					"service4");
			mm.add("service4").addStringParameter("msg");

			mm.add("service5").setMapReturnValue("map").addAfterMethod(
					"service6");
			mm.add("service6").addMapParameter("map");

			mm.add("service7").setObjectReturnValue(Sheet.class, "sheet");
			mm.add("service8").addObjectParameter("sheet", Sheet.class)
					.addBeforeMethod("service7");
		}

		public void sayHi() {
			System.out.println("hi world!");
			
		}

		public void sayHiToSb(String name) {
			System.out.println("hi " + name);
		}

		public Map sayHiToo(String name, Map books) {
			try {
				Thread.sleep(1000);
			} catch (Exception e) {
				e.printStackTrace();
			}
			Map map = new HashMap();
			map.put("name", name);
			map.put("books", books);
			System.out.println(map);
			return map;
		}

		public String sayHiTooo(String 名字) {
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
            log("传入参数名字是中文  名字 = " + 名字);
            return 名字;
        }
		
		public void service1() {
			log("执行service1方法");
		}

		public void service2() {
			log("执行service2方法");
		}

		public String service3() {
			log("执行service3方法");
			return "要传递给service3的消息体";
		}

		public void service4(String message) {
			log("执行service4方法");
			log("接收到信息：" + message);
		}

		public Map service5() {
			log("执行service5方法");
			Map map = new HashMap();
			map.put("message", "传递信息");
			return map;
		}

		public void service6(Map map) {
			log("执行service6方法");
			log("接收到消息:" + map);
		}

		public Sheet service7() {
			log("执行service7方法");
			return new Sheet(100, "YYYYY");
		}

		public void service8(Sheet sheet) {
			log("执行service8方法");
			log(sheet.toString());
		}
	}

	public class Sheet {
		int id;

		String title;

		public Sheet(int id, String title) {
			this.id = id;
			this.title = title;
		}

		public String toString() {
			return "sheet:{id:" + this.id + " title:" + this.title+ "}";
		}
	}%>