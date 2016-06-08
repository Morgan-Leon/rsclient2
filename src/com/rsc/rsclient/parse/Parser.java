package com.rsc.rsclient.parse;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.ParserException;

/**
 * 解析器抽象类
 * 
 * @author changhu
 */
public abstract class Parser {

	private String prefix;

	private static Logger logger = Logger.getLogger(Parser.class);

	/**
	 * 设置前缀
	 * 
	 * @param prefix
	 */
	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	/**
	 * 获取前缀
	 * 
	 * @return {@link String} prefix
	 */
	public String getPrefix() {
		return this.prefix;
	}

	/**
	 * 返回解析信息
	 * 
	 * @return {@link String} 
	 */
	public String toString() {
		return "prefix:" + this.getPrefix();
	}

	/**
	 * 将传入字符串根据指定字符编码解码为Map
	 * 
	 * @param str 要解码的字符串
	 * @return {@link Map} 
	 * @throws ParserException
	 */
	public abstract Map marshalToMap(String str) throws ParserException;
	
	/**
	 * 将传入的字符串根据指定的字符编码解码为List
	 * 
	 * @param str 要解码的字符串
	 * @return {@link List}
	 * @throws ParserException
	 */
	public abstract List marshalToList(String str) throws ParserException;

	/**
	 * 将传入参数编码为字符串
	 * 
	 * @param bean 传入对象
	 * @return {@link String} value 编码结果
	 * @throws ParserException
	 */
	public abstract String unmarshal(Object bean) throws ParserException;

	/**
	 * 将传入参数编码为字符串，并指定值名称。
	 * 
	 * @param name 值名称 一同编码到字符串中。
	 * @param bean 值
	 * @return {@link String}
	 * @throws ParserException
	 */
	public abstract String unmarshal(String name, Object bean) throws ParserException;
	
	/**
	 * 将传入值解码为指定参数类型
	 * 
	 * @param bean 值
	 * @param clazz 指定的参数类型
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
	 * 判断是否是基本数据类型的包装类
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
	 * 处理基本数据类型
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
	 * 处理基本数据类型的包装类
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
