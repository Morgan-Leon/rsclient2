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
 * XML���������̳���{@link Parser}
 * 
 * @author changhu
 */
public class XMLParser extends Parser {

	/**
	 * ��ֵ�������ΪXML�ַ�������xmlΪ���ڵ� 
	 * 
	 * @param bean ֵ����
	 * @return {@link String} �������ַ���
	 */
	public String unmarshal(Object bean) throws ParserException {
		return this.unmarshal("xml", bean);
	}

	/**
	 * ��ֵ�������ΪXML�ַ���
	 * 
	 * @param name ֵ����
	 * @param bean ֵ����
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
	 * ��Map ת��ΪXML�ڵ�
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
	 * ��Listת��ΪXML�ڵ�
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
	 * ��ֵ����ת��ΪXML�ڵ�
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
	 * ��XML�ַ�������ΪList <div style="color:red;">δʵ��</div>
	 * 
	 * @param str XML�ַ���
	 * @param enc �ַ�������
	 */
	public List marshalToList(String str) throws ParserException {
		return new ArrayList();
	}

	/**
	 * ��XML�ַ�������ΪMAP  <div style="color:red;">δʵ��</div>
	 * 
	 * @param str XML�ַ���
	 * @param enc �ַ�������
	 */
	public Map marshalToMap(String str) throws ParserException {
		return new HashMap();
	}

}
