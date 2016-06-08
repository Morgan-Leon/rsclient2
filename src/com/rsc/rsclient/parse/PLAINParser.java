package com.rsc.rsclient.parse;

import java.util.ArrayList;

import java.util.List;
import java.util.Map;

import com.rsc.rsclient.exception.ParserException;

/**
 * 文本解析器
 * 
 * @author changhu
 */
public class PLAINParser extends Parser {

	/**
	 * 将字符串解码为List
	 * 
	 * @param str 字符串
	 * @param enc 字符串编码
	 */
	public List marshalToList(String str) throws ParserException {
		throw new ParserException("");
	}

	/**
	 * 将字符串解码为Map
	 * 
	 * @param str 字符串
	 * @param enc 字符串编码
	 */
	public Map marshalToMap(String str) throws ParserException {
		throw new ParserException("");
	}

	/**
	 * 将值对象编码为字符串
	 * 
	 * @param bean 值对象
	 * @return {@link Strign} value
	 */
	public String unmarshal(Object bean) throws ParserException {
		if (bean == null) {
			return null;
		} else {
			return bean.toString();
		}
	}

	/**
	 * 将值对象编码为字符串
	 * 
	 * @param name 值名称
	 * @param bean 值对象
	 * @return {@link Strign} value
	 */
	public String unmarshal(String name, Object bean) throws ParserException {
		if (name == null) {
			return this.unmarshal(bean);
		} else {
			return name + ":" + this.unmarshal(bean);
		}
	}

}
