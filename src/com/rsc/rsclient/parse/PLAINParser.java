package com.rsc.rsclient.parse;

import java.util.ArrayList;

import java.util.List;
import java.util.Map;

import com.rsc.rsclient.exception.ParserException;

/**
 * �ı�������
 * 
 * @author changhu
 */
public class PLAINParser extends Parser {

	/**
	 * ���ַ�������ΪList
	 * 
	 * @param str �ַ���
	 * @param enc �ַ�������
	 */
	public List marshalToList(String str) throws ParserException {
		throw new ParserException("");
	}

	/**
	 * ���ַ�������ΪMap
	 * 
	 * @param str �ַ���
	 * @param enc �ַ�������
	 */
	public Map marshalToMap(String str) throws ParserException {
		throw new ParserException("");
	}

	/**
	 * ��ֵ�������Ϊ�ַ���
	 * 
	 * @param bean ֵ����
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
	 * ��ֵ�������Ϊ�ַ���
	 * 
	 * @param name ֵ����
	 * @param bean ֵ����
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
