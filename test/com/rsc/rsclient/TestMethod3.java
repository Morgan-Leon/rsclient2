package com.rsc.rsclient;

import java.util.HashMap;
import java.util.Map;

import com.rsc.rsclient.exception.MethodException;

import junit.framework.TestCase;

public class TestMethod3 extends TestCase {

	static VariablePool vp;
	static {
		vp = new VariablePool();
		vp.add("id", "10");
		vp.add("a", Double.valueOf(100.11));
		vp.add("b", Double.valueOf(10.33));
	}

	public void testMethod1() throws MethodException {
		Service s = ServiceFactory.getService(this, MyService.class);
		System.out.println(s);
		VariableAbstract v = s.run("getSheet", vp);
		System.out.println(v);
	}

	public void testMethod2() throws MethodException {
		Service s = ServiceFactory.getService(this, MyService.class);
		System.out.println(s);
		VariableAbstract v = s.run("add", vp);
		System.out.println(v);
	}

	public void testMethod3() throws MethodException {
		Service s = ServiceFactory.getService(this, MyService.class);
		System.out.println(s);
		VariableAbstract v = s.run("testvoid", vp);
		if (Void.TYPE.equals(v.getClazz())) {
			System.out.println("void");
		} else {
			System.out.println("not void");
		}
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("getSheet").addIntegerParameter("id").setMapReturnValue();

			mm.add("add").addDoubleParameter("a").addDoubleParameter("b")
					.setDoubleReturnValue("c");

			mm.add("testvoid");
		}

		public Map getSheet(int id) {
			Map map = new HashMap();
			map.put("id", Integer.valueOf(id));
			map.put("title", "XXXXXXX");
			return map;
		}

		public double add(double a, double b) {
			return a + b;
		}

		public void testvoid() {
			System.out.println("test void");
		}
	}
}
