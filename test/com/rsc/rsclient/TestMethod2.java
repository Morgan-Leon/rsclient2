package com.rsc.rsclient;

import java.util.Random;

public class TestMethod2 {

	public static void main(String[] args) throws Exception {
		Service s = ServiceFactory.getService(S1.class);
		long b = System.currentTimeMillis();
		for (int i = 0; i < 90000; i++) {
			RR rr = new RR(s, "add");
			rr.start();
		}
		System.out.println(System.currentTimeMillis() - b);
	}

}

class RR extends Thread {

	Service s;
	String methodName;

	VariablePool vm = new VariablePool();
	int a;
	int b;
	int c;

	public RR(Service s, String methodName) {
		this.s = s;
		this.methodName = methodName;
		this.a = this.createRandomInt();
		this.b = this.createRandomInt();
		this.c = this.a + this.b;
		this.vm.add("a", Integer.valueOf(this.a));
		this.vm.add("b", Integer.valueOf(this.b));
	}

	public void run() {
		try {
			VariableAbstract v = this.s.run(this.methodName, this.vm);
			if (v.getIntegerValue() != this.c) {
				throw new Exception("³ö´íÁË");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int createRandomInt() {
		Random rnd = new Random();
		int i = rnd.nextInt(10);
		return i;
	}
}

class S1 extends Service {

	public void registerMethods(MethodMap mm) throws Exception {
		mm.add("add").addIntegerParameter("a").addIntegerParameter("b")
				.setIntegerReturnValue("c");
	}

	public int add(int a, int b) {
		VariablePool vp = this.getCurrentVariablePool();
		Variable aaa = (Variable)vp.getVariable("a");
		int aa = aaa.getIntegerValue();
		Variable bbb = (Variable)vp.getVariable("b");
		int bb = bbb.getIntegerValue();
		if (aa != a || bb != b) {
			System.out.println("---->a " + "  " + aa + "  " + a);
			System.out.println("---->b " + "  " + bb + "  " + b);
		}
		return a + b;
	}
}
