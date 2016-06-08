package com.rsc.rsclient.parse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import com.rsc.rsclient.exception.ParserException;

/**
 * XML解析器。继承自{@link Parser}
 * 
 * @author changhu
 */
public class XMLParser extends Parser {

	/**
	 * 将值对象编码为XML字符串，以xml为根节点 
	 * 
	 * @param bean 值对象
	 * @return {@link String} 编码后的字符串
	 */
	public String unmarshal(Object bean) throws ParserException {
		return this.unmarshal("xml", bean);
	}

	/**
	 * 将值对象编码为XML字符串
	 * 
	 * @param name 值名称
	 * @param bean 值对象
	 */
	public String unmarshal(String name, Object bean) throws ParserException {
		Element root = null;
		if (Map.class.isAssignableFrom(bean.getClass())
				|| List.class.isAssignableFrom(bean.getClass())) {
			root = this.objToElement(name, bean);
		} else {
			root = new Element(name);
			root.setText(bean.toString());
			if (!String.class.isAssignableFrom(bean.getClass())) {
				root.setAttribute("class", bean.getClass().getName());
			}
		}
		Document doc = new Document(root);
		XMLOutputter out = new XMLOutputter();
		return out.outputString(doc);
	}

	/**
	 * 将Map 转换为XML节点
	 * 
	 * @param el
	 * @param name
	 * @param map
	 */
	private void mapToXMLEl(Element el, String name, Map map) {
		for (Iterator keys = map.keySet().iterator(); keys.hasNext();) {
			String key = (String) keys.next();
			Object obj = map.get(key);
			el.addContent(this.objToElement(key, obj));
		}
	}

	/**
	 * 将List转换为XML节点
	 * 
	 * @param name
	 * @param list
	 * @return {@link List}
	 */
	private List listToXMLEl(String name, List list) {
		List els = new ArrayList();
		for (Iterator i = list.iterator(); i.hasNext();) {
			els.add(this.objToElement(name, i.next()));
		}
		return els;
	}

	/**
	 * 将值对象转换为XML节点
	 * 
	 * @param name
	 * @param obj
	 * @return {@link Element}
	 */
	private Element objToElement(String name, Object obj) {
		Element el = new Element(name);
		if (Map.class.isAssignableFrom(obj.getClass())) {
			this.mapToXMLEl(el, name, (Map) obj);
		} else if (List.class.isAssignableFrom(obj.getClass())) {
			el.addContent(this.listToXMLEl(name, (List) obj));
		} else if (String.class.isAssignableFrom(obj.getClass())) {
			el.setText(obj.toString());
		} else {
			el.setText(obj.toString());
			el.setAttribute(new Attribute("class", obj.getClass().getName()));
		}
		return el;
	}

	/**
	 * 将XML字符传解码为List <div style="color:red;">未实现</div>
	 * 
	 * @param str XML字符串
	 * @param enc 字符串编码
	 */
	public List marshalToList(String str) throws ParserException {
		return new ArrayList();
	}

	/**
	 * 将XML字符串解码为MAP  <div style="color:red;">未实现</div>
	 * 
	 * @param str XML字符串
	 * @param enc 字符串编码
	 */
	public Map marshalToMap(String str) throws ParserException {
		return new HashMap();
	}

}
