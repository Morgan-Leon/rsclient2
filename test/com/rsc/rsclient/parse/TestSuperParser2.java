package com.rsc.rsclient.parse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class TestSuperParser2 {

	public static void main(String[] args) {
		for (int i = 0; i < 999; i++) {
			MyParser p = new MyParser();
			p.start();
		}
	}

}

class MyParser extends Thread {

	public void run() {
		super.run();
		try {
			while (true) {
				this.doParser();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void doParser() throws Exception {
		Map result = new HashMap();
		int limit = this.createRandomInt();
		List data = new ArrayList();
		for (int i = 0; i < limit; i++) {
			Map map = new HashMap();
			map.put("code", "±àÂë-" + this.createRandomInt());
			map.put("name", "Ãû³Æ-" + this.createRandomInt());
			map.put("price", Double.valueOf(this.createRandomInt() * 12.6));
			data.add(map);
		}
		result.put("items", data);
		String str = SuperParser.unmarshal(result);
		String swap = "code";
		int r = (str.length() - str.replaceAll(swap, "").length())
				/ swap.length();
		if (limit != r) {
			this.print(str);
			this.print(limit + " " + r);
		}
	}

	public void print(Object obj) {
		System.out.println(System.currentTimeMillis() + " : " + obj);
	}

	private int createRandomInt() {
		Random rnd = new Random();
		return rnd.nextInt(10);
	}
}
