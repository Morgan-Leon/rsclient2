package com.rsc.rsclient.parse;

import java.util.HashMap;
import java.util.Map;

import com.rsc.rsclient.exception.NoneParserException;
import com.rsc.rsclient.exception.ParserException;

import junit.framework.TestCase;

public class TestSuperParser extends TestCase {

	public void testMethod1() throws ParserException {
		String bean = "100";
		Object obj = SuperParser.marshal(bean, Integer.TYPE);
		this.assertEquals(obj.getClass(), Integer.class);
		this.assertEquals(new Integer(100), obj);
	}

	public void testMethod2() throws ParserException {
		String bean = "200.00";
		Object obj = SuperParser.marshal(bean, Double.TYPE);
		this.assertEquals(obj.getClass(), Double.class);
		this.assertEquals(new Double(200), obj);
	}

	public void testMethod3() throws ParserException {
		String bean = "2";
		Object obj = SuperParser.marshal(bean, Byte.TYPE);
		this.assertEquals(obj.getClass(), Byte.class);
		this.assertEquals(new Byte((byte) 2), obj);
	}

	public void testMethod4()throws ParserException  {
		String bean = "200000000";
		Object obj = SuperParser.marshal(bean, Long.TYPE);
		this.assertEquals(obj.getClass(), Long.class);
		this.assertEquals(new Long((long) 200000000), obj);
	}

	public void testMethod5() throws ParserException {
		String bean = "2000";
		Object obj = SuperParser.marshal(bean, Short.TYPE);
		this.assertEquals(obj.getClass(), Short.class);
		this.assertEquals(new Short((short) 2000), obj);
	}

	public void testMethod6() throws ParserException {
		String bean = "asdfasddeadfasdfasdfas";
		Object obj = SuperParser.marshal(bean, String.class);
		this.assertEquals(obj.getClass(), String.class);
		this.assertEquals(bean, obj);
	}

	public void testMethod7() throws ParserException {
		String bean = "true";
		Object obj = SuperParser.marshal(bean, Boolean.class);
		this.assertEquals(obj.getClass(), Boolean.class);
		this.assertTrue(((Boolean) obj).booleanValue());
	}

	public void testMethod8() throws ParserException {
		String bean = "false";
		Object obj = SuperParser.marshal(bean, Boolean.class);
		this.assertEquals(obj.getClass(), Boolean.class);
		this.assertFalse(((Boolean) obj).booleanValue());
	}

	public void testMethod9() throws ParserException {
		String bean = "23.99";
		Object obj = SuperParser.marshal(bean, Float.TYPE);
		this.assertEquals(obj.getClass(), Float.class);
		this.assertEquals(new Float(23.99), obj);
	}

	public void testMethod10()throws ParserException  {
		String bean = "c";
		Object obj = SuperParser.marshal(bean, Character.TYPE);
		this.assertEquals(obj.getClass(), Character.class);
		this.assertEquals(new Character('c'), obj);
	}

	public void testMehtod11() throws ParserException {
		Object str = "%E5%A5%BD%E5%A5%BD";
		Object str2 = "%E9%98%BF%E5%BE%B7%E6%B3%95%E9%98%BF%E8%90%A8%E5%BE%B7%E9%98%BF%E6%96%AF%E8%92%82%E8%8A%AC%E9%98%BF%E6%96%AF%E8%92%82%E8%8A%AC";
		String res = (String) SuperParser.marshal(str2, String.class);
		System.out.println(res);
	}

	public void testMethod12() throws ParserException, NoneParserException {
		Map map = new HashMap();
		map.put("id", Integer.valueOf(1100));
		map.put("NAME", null);
		map.put("CODE", "xxxxxx");

		String str = SuperParser.unmarshal("json", map);
		System.out.println(str);
	}
}
