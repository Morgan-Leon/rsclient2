package com.rsc.rsclient.parse;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.rsc.rsclient.exception.NoneParserException;
import com.rsc.rsclient.exception.ParserException;

/**
 * �����࣬�������ϵͳ���õ�Parser�������ݽ���ͱ��롣<br/>
 * ���౻���ص�ʱ����������ļ���
 * �����ļ���com/rsc/rsclient/resource/proxy-config.xml
 * 
 * @author changhu
 */
public class SuperParser {

	private static Map registry;

	private static Logger logger = Logger.getLogger(SuperParser.class);

	static {
		try {
			SuperParser.registry = new HashMap();
			SuperParser.loadConfig(Thread.currentThread().getContextClassLoader().getResource("com/rsc/rsclient/resource/parser-config.xml"));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * ���������ļ���ע��Parser
	 * 
	 * @param url �ļ�UIL
	 * @throws ParserException
	 */
	private static void loadConfig(URL url) throws ParserException {
		logger.debug("load config url:" + url);
		try {
			InputStream stream = url.openStream();
			DocumentBuilder builder = DocumentBuilderFactory.newInstance()
					.newDocumentBuilder();
			Document config = builder.parse(stream);
			NodeList parsers = config.getElementsByTagName("parser");
			for (int i = 0; i < parsers.getLength(); i++) {
				Node provider = parsers.item(i);
				NamedNodeMap parser = provider.getAttributes();
				String prefix = parser.getNamedItem("prefix").getNodeValue()
						.toUpperCase();
				SuperParser.register(prefix, parser);
			}
			stream.close();
		} catch (IOException e) {
			e.printStackTrace();
			throw new ParserException("Cannot open stream from given url:"
					+ url.toExternalForm());
		} catch (ParserConfigurationException e) {
			throw new ParserException("Cannot parser config from url"
					+ url.getPath());
		} catch (SAXException e) {
			throw new ParserException("Cannot parser config from url"
					+ url.getPath());
		}
	}

	/**
	 * ע��Parser
	 * 
	 * @param prefix Parserǰ׺
	 * @param parser 
	 * @throws ParserException
	 */
	public static void register(String prefix, NamedNodeMap parser)
			throws ParserException {
		String className = parser.getNamedItem("class").getNodeValue();
		Class subClass = null;
		try {
			subClass = Class.forName(className);
			if (Parser.class.isAssignableFrom(subClass)) {
				Parser p = (Parser) subClass.newInstance();
				p.setPrefix(prefix);
				SuperParser.registry.put(prefix, p);
			} else {
				throw new ParserException("Class:" + subClass.getName()
						+ " is not subclass of " + Parser.class.getName());
			}
		} catch (ClassNotFoundException e1) {
			throw new ParserException("get an instance of Class: "
					+ e1.getMessage());
		} catch (InstantiationException e2) {
			throw new ParserException("get an instance of Class:"
					+ subClass.getName() + " exception!");
		} catch (IllegalAccessException e3) {
			throw new ParserException("get an instance of Class:"
					+ subClass.getName() + " exception!");
		}
	}

	/**
	 * �Դ���������н��롣�÷�����ʹ��Ĭ�ϵ��ַ����롣
	 * 
	 * @param bean ֵ
	 * @param clazz ����������
	 * @return {@link Object}
	 * @throws ParserException ��û�пɶԴ��������н���Ľ�����ʱ���׳��쳣
	 */
	public static Object marshal(Object bean, Class clazz) throws ParserException {
		List list = SuperParser.getParsers();
		Object obj = null;
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			Parser temp = (Parser) iter.next();
			try {
				obj = temp.marshal(bean, clazz);
				if (obj != null) {
					return obj;
				}
			} catch (ParserException e) {
				logger.debug("parser " + temp.getPrefix() + " cant unmartshal " + bean);
			}
		}
		if(obj == null){
			throw new ParserException("û�пɶ�"+bean+"���н���Ľ�����");
		}else {
			return obj;
		}
	}

	/**
	 * ʹ��ָ���Ľ������Դ���������н��롣
	 * 
	 * @param prefix ָ��������ǰ׺
	 * @param bean ֵ
	 * @param clazz ����������
	 * @return {@link Object}
	 * @throws NoneParserException ��û���ҵ�ָ���Ľ�����ʱ�׳����쳣 
	 * @throws ParserException 
	 */
	public static Object marshal(String prefix, Object bean, Class clazz) throws NoneParserException, ParserException {
		logger.debug("malshal bean: " + bean + " prefix:" + prefix );
		if(bean == null){
			return null;
		}
		Parser p = SuperParser.getParser(prefix);
		Object obj = p.marshal(bean, clazz);
		return obj;
	}

	/**
	 * ��ȡϵͳ���õĽ������б�����ָ���Ľ��������뵽�б��һ��λ�á�
	 * 
	 * @param prefix ��Ҫ�����һ��λ�õĽ�����
	 * @return
	 */
	public static List getParsers() {
		ArrayList list = new ArrayList();
		for (Iterator itor = SuperParser.registry.keySet().iterator(); itor.hasNext();) {
			Parser temp = (Parser) SuperParser.registry.get(itor.next());
			list.add(temp);
		}
		return list;
	}
	
	/**
	 * �Դ��������б��룬�÷�����һ��ʹ�ö���Ľ������Դ��������б��룬ֱ���ɹ�Ϊֹ��
	 * ���û�п��ԶԴ��������б���Ľ����������׳��쳣��
	 * 
	 * @param bean
	 * @return
	 * @throws ParserException
	 */
	public static String unmarshal(Object bean) throws ParserException {
		logger.debug("unmalshal bean: " + bean);
		if (bean == null) {
			return null;
		}
		List list = SuperParser.getParsers();
		String obj = null;
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			Parser temp = (Parser) iter.next();
			try {
				obj = temp.unmarshal(bean);
				if (obj != null) {
					return obj;
				}
			} catch (ParserException e) {
				logger.debug("parser " + temp.getPrefix() + " cant unmartshal " + bean);
			}
		}
		if(obj == null){
			throw new ParserException("û�пɶ�"+bean+"���б���Ľ�����");
		}else {
			return obj;
		}
	}

	/**
	 * �Դ��������б��룬�÷�����һ��ʹ�ö���Ľ������Դ��������б��룬ֱ���ɹ�Ϊֹ��
	 * ���û�п��ԶԴ��������б���Ľ����������׳��쳣��
	 * 
	 * @param bean
	 * @return
	 * @throws ParserException
	 */
	public static String unmarshal(Object bean, String name) throws ParserException {
		logger.debug("unmalshal bean: " + bean);
		if (bean == null) {
			return null;
		}
		List list = SuperParser.getParsers();
		String obj = null;
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			Parser temp = (Parser) iter.next();
			try {
				obj = temp.unmarshal(name, bean);
				if (obj != null) {
					return obj;
				}
			} catch (ParserException e) {
				logger.debug("parser " + temp.getPrefix() + " cant unmartshal " + bean);
			}
		}
		if(obj == null){
			throw new ParserException("û�пɶ�"+bean+"���б���Ľ�����");
		}else {
			return obj;
		}
	}
	
	/**
	 * ʹ��ָ���Ľ��������б���
	 * 
	 * @param prefix  ָ����������ǰ׺
	 * @param bean ֵ
	 * @return {@link String} �����ַ���
	 * @throws ParserException
	 * @throws NoneParserException
	 */
	public static String unmarshal(String prefix, Object bean)
			throws ParserException, NoneParserException {
		logger.debug("unmarshal bean: " + bean + " prefix:" + prefix);
		if (bean == null) {
			return null;
		}
		Parser p = SuperParser.getParser(prefix);
		return p.unmarshal(bean);
	}

	/**
	 * ʹ��ָ���Ľ��������б���
	 * 
	 * @param prefix ָ��������ǰ׺
	 * @param name ֵ����
	 * @param bean ֵ
	 * @return {@link String} �����ַ���
	 * @throws NoneParserException
	 * @throws ParserException
	 */
	public static String unmarshal(String prefix, Object bean, String name)
			throws NoneParserException, ParserException {
		logger.debug("unmarshal name: " + name + " bean: " + bean + " prefix: " + prefix);
		if (name == null || "".equals(name.trim())) {
			return SuperParser.unmarshal(prefix, bean);
		} else {
			Parser p = SuperParser.getParser(prefix);
			return p.unmarshal(name, bean);
		}
	}

	/**
	 * ����ǰ׺��ȡ�﷨�����������û�����øý������׳��쳣
	 * 
	 * @param prefix �﷨������ǰ׺
	 * @return {@link Parser}
	 * @throws NoneParserException 
	 */
	public static Parser getParser(String prefix) throws NoneParserException {
		Parser parser = null;
		for (Iterator i = SuperParser.registry.keySet().iterator(); i.hasNext();) {
			Parser temp = (Parser) SuperParser.registry.get(i.next());
			if (prefix != null && prefix.toUpperCase().equals(temp.getPrefix())) {
				parser = temp;
				break;
			}
		}
		if(parser == null){
			throw new NoneParserException("δ���ý�����"+prefix);
		}else {
			return parser;
		}
	}
}
