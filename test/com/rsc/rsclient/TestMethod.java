package com.rsc.rsclient;

import com.rsc.rsclient.exception.MethodException;

import junit.framework.TestCase;

public class TestMethod extends TestCase {

	private static VariablePool vp;

	static {
		vp = new VariablePool();
	}

	public void testMethod1() throws Exception {
		Service s = ServiceFactory.getService(Foo.class);
		VariableAbstract v = s.run("sayHi", vp);
		System.out.println(v.getStringValue());
	}

	public void testMethod2() throws Exception {
		Foo f = (Foo) ServiceFactory.getService(Foo.class);
		VariableAbstract v = f.run("who", vp);
	}

	public void testMethod3() throws Exception {
		Service s = ServiceFactory.getService(Foo.class);
		VariableAbstract v = s.run("bye", vp);
	}

	public void testMethod4() throws MethodException {
		Service s = ServiceFactory.getService(Foo.class);
		VariableAbstract v = s.run("byeToo", vp);
	}

}

class Foo extends Service {

	public void registerMethods(MethodMap mm) throws Exception {

		mm.add("who").setStringReturnValue("name");

		mm.add("sayHi").addStringParameter("name").setStringReturnValue("")
				.addBeforeMethod("who").addAfterMethod("bye");

		mm.add("bye").addStringParameter("name");

		//Ñ­»·
		mm.add("byeToo").addStringParameter("name").addAfterMethod("byeTooo");

		mm.add("byeTooo").addStringParameter("name");//.addAfterMethod("byeToo");
	}

	public String who() {
		String name = "Han Meimei";
		System.out.println("I'm " + name);
		return name;
	}

	public String sayHi(String name) {
		System.out.println("Hi " + name);
		System.out.println("I'm Li lei");
		return "Han Meimei really beautiful ";
	}

	public void bye(String name) {
		System.out.println("bye " + name);
	}

	public void byeToo(String name) {
		System.out.println("byeToo " + name);
	}

	public void byeTooo(String name) {
		System.out.println("byeTooo " + name);
	}
}
