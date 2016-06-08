package com.rsc.rsclient.parse;

import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import com.rsc.rsclient.exception.NoneParserException;
import com.rsc.rsclient.exception.ParserException;

public class TestJSONParser extends TestCase {

	private static String PREFIX = "json";

	public void printObj(String prefix, Object obj) {
		if (Map.class.isAssignableFrom(obj.getClass())) {
			this.printMap((Map) obj);
		} else if (List.class.isAssignableFrom(obj.getClass())) {
			this.printList((List) obj);
		} else {
			System.out.println(prefix + "\t\t\t" + obj.getClass() + "\t\t\t"
					+ obj);
		}
	}

	public void printMap(Map map) {
		for (Iterator i = map.keySet().iterator(); i.hasNext();) {
			String key = (String) i.next();
			Object obj = map.get(key);
			this.printObj(key, obj);
		}
	}

	public void printList(List list) {
		for (Iterator i = list.iterator(); i.hasNext();) {
			Object obj = i.next();
			this.printObj("", obj);
		}
	}

	public void testMethod1() throws NoneParserException, ParserException {
		String bean = "{name:'jack', age:12, books:[{id:1,name:'java'}, {id:2, name:'c++'}]}";
		Object obj = SuperParser.marshal(PREFIX, bean, Map.class);
		this.printObj("", obj);
		this.assertNotNull(obj);
		this.assertTrue(Map.class.isAssignableFrom(obj.getClass()));
	}

	public void testMethod2() throws NoneParserException, ParserException {
		String bean = "[{name:'jack', age:12, books: [{id:1,name:'java'},{id:2, name:'c++'}]}]";
		Object obj = SuperParser.marshal(PREFIX, bean, List.class);
		this.printObj("", obj);
		this.assertNotNull(obj);
		this.assertTrue(List.class.isAssignableFrom(obj.getClass()));
	}

	public void testMethod3() throws NoneParserException, ParserException {
		String bean = "{'successful':true,'msg':'','sheet':{'adjust_type':'S','group':false,'varsion':'1'}}";
		Object obj = SuperParser.marshal(PREFIX, bean, Map.class);
		this.printObj("", obj);
		this.assertNotNull(obj);
		this.assertTrue(Map.class.isAssignableFrom(obj.getClass()));
	}

	public void testMethod4() throws NoneParserException, ParserException {
		String bean = "[{'successful':true,'msg':'','sheet':{'adjust_type':'S','group':false,'varsion':'1'}}]";
		Object obj = SuperParser.marshal(PREFIX, bean, List.class);
		this.printObj("", obj);
		this.assertNotNull(obj);
		this.assertTrue(List.class.isAssignableFrom(obj.getClass()));
	}

	public void testMethod5() throws NoneParserException, ParserException {
		String bean = "{'successful':true,'msg':'','sheet':{'adjust_type':'S','group':false,'varsion':'1'}}";
		Object obj = SuperParser.marshal(PREFIX, bean, Map.class);
		String str = SuperParser.unmarshal(PREFIX, obj);
		Object obj2 = SuperParser.marshal(PREFIX, str, Map.class);
		String str2 = SuperParser.unmarshal(PREFIX, obj2);
		System.out.println(bean);
		System.out.println(str);
		System.out.println(str2);
	}

	public void testMethod6() {

	}

	public void testMethod7() {

	}
}
