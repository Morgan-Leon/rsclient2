package com.rsc.rsclient.parse;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import com.rsc.rsclient.exception.NoneParserException;
import com.rsc.rsclient.exception.ParserException;

public class TestXMLParser extends TestCase {

	public void testMethod1() throws ParserException, NoneParserException {
		Map map = new HashMap();
		map.put("id", new Integer(100));
		map.put("title", "XXXXXX");
		String str = SuperParser.unmarshal("xml", map, "sheet");
		System.out.println(str);
	}

	public void testMethod2() throws ParserException, NoneParserException {
		List list = new ArrayList();
		list.add("a");
		list.add("b");
		String str = SuperParser.unmarshal("xml", list);
		System.out.println(str);
	}

	public void testMethod3() throws ParserException, NoneParserException {
		Map map = new HashMap();
		map.put("id", new Integer(100));
		map.put("title", "XXXXXX");
		List list = new ArrayList();
		Map u1 = new HashMap();
		u1.put("user_unique_id", "001");
		u1.put("user_name", "admin");
		list.add(u1);
		Map u2 = new HashMap();
		u2.put("user_unique_id", "002");
		u2.put("user_name", "admin_2");
		list.add(u2);
		map.put("users", list);
		String str = SuperParser.unmarshal("xml", map, "sheet");
		System.out.println(str);
	}

	public void testMethod4() throws ParserException, NoneParserException {
		Map map = new HashMap();
		map.put("id", new Integer(100));
		map.put("title", "XXXXXX");
		Map u1 = new HashMap();
		u1.put("user_unique_id", "001");
		u1.put("user_name", "admin");
		Map u2 = new HashMap();
		u2.put("user_unique_id", "002");
		u2.put("user_name", "admin_2");
		map.put("u1", u1);
		map.put("u2", u2);
		String str = SuperParser.unmarshal("xml", map, "sheet");
		System.out.println(str);
	}

	public void testMethod5() throws JDOMException, IOException,
			ParserException, NoneParserException {
		Map map = new HashMap();
		map.put("id", new Integer(100));
		map.put("title", "XXXXXX");
		Map u1 = new HashMap();
		u1.put("user_unique_id", "001");
		u1.put("user_name", "admin");
		Map u2 = new HashMap();
		u2.put("user_unique_id", "002");
		u2.put("user_name", "admin_2");
		map.put("u1", u1);
		map.put("u2", u2);
		String str = SuperParser.unmarshal("xml", map, "sheet");

		Document doc = new SAXBuilder().build(new StringReader(str));
		Element root = doc.getRootElement();
		this.printElement(root);
	}

	public void printElement(Element el) {
		System.out.println(el.getName() + ":" + el.getText() + ":"
				+ el.getContentSize());
		List list = el.getChildren();
		for (Iterator i = list.iterator(); i.hasNext();) {
			this.printElement((Element) i.next());
		}
	}
	
	public void testMethod6(){
		String a = "abc";
		String b = "a" + "b" + "c";
		System.out.println(a.equals(b));
		System.out.println(a == b);
	}
}
