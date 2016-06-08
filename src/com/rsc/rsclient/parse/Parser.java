package com.rsc.rsclient.parse;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.ParserException;

/**
 * ������������
 * 
 * @author changhu
 */
public abstract class Parser {

	private String prefix;

	private static Logger logger = Logger.getLogger(Parser.class);

	/**
	 * ����ǰ׺
	 * 
	 * @param prefix
	 */
	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	/**
	 * ��ȡǰ׺
	 * 
	 * @return {@link String} prefix
	 */
	public String getPrefix() {
		return this.prefix;
	}

	/**
	 * ���ؽ�����Ϣ
	 * 
	 * @return {@link String} 
	 */
	public String toString() {
		return "prefix:" + this.getPrefix();
	}

	/**
	 * �������ַ�������ָ���ַ��������ΪMap
	 * 
	 * @param str Ҫ������ַ���
	 * @return {@link Map} 
	 * @throws ParserException
	 */
	public abstract Map marshalToMap(String str) throws ParserException;
	
	/**
	 * ��������ַ�������ָ�����ַ��������ΪList
	 * 
	 * @param str Ҫ������ַ���
	 * @return {@link List}
	 * @throws ParserException
	 */
	public abstract List marshalToList(String str) throws ParserException;

	/**
	 * �������������Ϊ�ַ���
	 * 
	 * @param bean �������
	 * @return {@link String} value ������
	 * @throws ParserException
	 */
	public abstract String unmarshal(Object bean) throws ParserException;

	/**
	 * �������������Ϊ�ַ�������ָ��ֵ���ơ�
	 * 
	 * @param name ֵ���� һͬ���뵽�ַ����С�
	 * @param bean ֵ
	 * @return {@link String}
	 * @throws ParserException
	 */
	public abstract String unmarshal(String name, Object bean) throws ParserException;
	
	/**
	 * ������ֵ����Ϊָ����������
	 * 
	 * @param bean ֵ
	 * @param clazz ָ���Ĳ�������
	 * @return {@link Object}
	 * @throws ParserException
	 */
	public Object marshal(Object bean, Class clazz) throws ParserException {
		logger.debug("method marshal bean: " + bean + " class: " + clazz);
		if (clazz == null) {
			throw new ParserException("class is null");
		}
		if (clazz.isPrimitive()) {
			return this.castPrimitive(bean, clazz);
		} else if (this.isWrapperPrimitiveClass(clazz)) {
			return this.castWrapperPrimitive(bean, clazz);
		} else if (clazz.isAssignableFrom(Map.class)) {
			if (bean != null) {
				return this.marshalToMap(bean.toString());
			} else {
				return null;
			}
		} else if (clazz.isAssignableFrom(List.class)) {
			if (bean != null) {
				return this.marshalToList(bean.toString());
			} else {
				return null;
			}
		} else if (clazz.isAssignableFrom(String.class)) {
			return bean.toString();
		} else {
			return bean;
		}
	}

	/**
	 * �ж��Ƿ��ǻ����������͵İ�װ��
	 * 
	 * @param clazz
	 * @return
	 */
	private boolean isWrapperPrimitiveClass(Class clazz) {
		if (clazz.isAssignableFrom(Integer.class)
				|| clazz.isAssignableFrom(Short.class)
				|| clazz.isAssignableFrom(Character.class)
				|| clazz.isAssignableFrom(Float.class)
				|| clazz.isAssignableFrom(Long.class)
				|| clazz.isAssignableFrom(Double.class)
				|| clazz.isAssignableFrom(Boolean.class)
				|| clazz.isAssignableFrom(Byte.class)) {
			return true;
		}
		return false;
	}

	/**
	 * ���������������
	 * 
	 * @param bean
	 * @param clazz
	 * @return
	 */
	private Object castPrimitive(Object bean, Class clazz) {
		logger.debug("method castPrimitive:" + " bean:" + bean + " class:"
				+ clazz);
		if (clazz.isAssignableFrom(Byte.TYPE)) {
			if (bean == null) {
				return new Byte((byte) 0);
			} else {
				return new Byte("" + bean);
			}
		} else if (clazz.isAssignableFrom(Short.TYPE)) {
			if (bean == null) {
				return new Short((short) 0);
			} else {
				return new Short("" + bean);
			}
		} else if (clazz.isAssignableFrom(Character.TYPE)) {
			if (bean != null && ("" + bean).length() >= 1) {
				return new Character(("" + bean).charAt(0));
			} else {
				return new Character((char) 0);
			}
		} else if (clazz.isAssignableFrom(Float.TYPE)) {
			if (bean == null) {
				return new Float((float) 0);
			} else {
				return new Float("" + bean);
			}
		} else if (clazz.isAssignableFrom(Integer.TYPE)) {
			if (bean == null) {
				return new Integer(0);
			} else {
				return new Integer("" + bean);
			}
		} else if (clazz.isAssignableFrom(Long.TYPE)) {
			if (bean == null) {
				return new Long((long) 0);
			} else {
				return new Long("" + bean);
			}
		} else if (clazz.isAssignableFrom(Double.TYPE)) {
			if (bean == null) {
				return new Double(0.0);
			} else {
				return new Double("" + bean);
			}
		} else if (clazz.isAssignableFrom(Boolean.TYPE)) {
			if (bean == null) {
				return new Boolean(false);
			} else {
				return new Boolean("" + bean);
			}
		} else {
			return bean;
		}
	}

	/**
	 * ��������������͵İ�װ��
	 * 
	 * @param bean
	 * @param clazz
	 * @return
	 */
	private Object castWrapperPrimitive(Object bean, Class clazz) {
		logger.debug("method castWrapperPrimitive: bean " + bean + "class "
				+ clazz);
		if (bean == null) {
			return null;
		}
		if (clazz.isAssignableFrom(Byte.class)) {
			return new Byte("" + bean);
		} else if (clazz.isAssignableFrom(Integer.class)) {
			return new Integer("" + bean);
		} else if (clazz.isAssignableFrom(Character.class)) {
			if (("" + bean).length() >= 1) {
				return new Character(("" + bean).charAt(0));
			} else {
				return null;
			}
		} else if (clazz.isAssignableFrom(Float.class)) {
			return new Float("" + bean);
		} else if (clazz.isAssignableFrom(Double.class)) {
			return new Double("" + bean);
		} else if (clazz.isAssignableFrom(Long.class)) {
			return new Long("" + bean);
		} else if (clazz.isAssignableFrom(Boolean.class)) {
			return new Boolean("" + bean);
		} else {
			return bean;
		}
	}
}
