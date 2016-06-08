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
		    
			mm.add("sayHiTooo").addStringParameter("����").setStringReturnValue();
			
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

		public String sayHiTooo(String ����) {
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
            log("�����������������  ���� = " + ����);
            return ����;
        }
		
		public void service1() {
			log("ִ��service1����");
		}

		public void service2() {
			log("ִ��service2����");
		}

		public String service3() {
			log("ִ��service3����");
			return "Ҫ���ݸ�service3����Ϣ��";
		}

		public void service4(String message) {
			log("ִ��service4����");
			log("���յ���Ϣ��" + message);
		}

		public Map service5() {
			log("ִ��service5����");
			Map map = new HashMap();
			map.put("message", "������Ϣ");
			return map;
		}

		public void service6(Map map) {
			log("ִ��service6����");
			log("���յ���Ϣ:" + map);
		}

		public Sheet service7() {
			log("ִ��service7����");
			return new Sheet(100, "YYYYY");
		}

		public void service8(Sheet sheet) {
			log("ִ��service8����");
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