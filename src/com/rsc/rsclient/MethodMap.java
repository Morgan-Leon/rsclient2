package com.rsc.rsclient;

import java.util.HashMap;
import java.util.Set;

import org.apache.log4j.Logger;

/**
 * ҵ�񷽷�Map�� ���ڹ���ҵ�����е�ҵ�񷽷�����Ϊҵ�񷽷����ƣ�ֵΪҵ�񷽷�����
 * @author changhu 
 */
public class MethodMap {

	/**
	 * 
	 */
	private HashMap methodMap;

	/**
	 * 
	 */
	private static Logger logger = Logger.getLogger(MethodMap.class);

	/**
	 * ���췽��
	 */
	public MethodMap() {
		this.methodMap = new HashMap();
	}

	/**
	 * ���ҵ�񷽷����������Ϊҵ�񷽷����ƣ�����ҵ�񷽷����ƴ���һ��ҵ�񷽷���
	 * @param name ҵ�񷽷�����
	 * @return method ҵ�񷽷�
	 * @throws Exception
	 */
	public Method add(String name) throws Exception {
		Method method = new Method(name);
		this.methodMap.put(name, method);
		return method;
	}

	/**
	 * ����ҵ�񷽷���ֵset
	 * 
	 * @return
	 */
	public Set keySet() {
		return this.methodMap.keySet();
	}

	/**
	 * ����ҵ�񷽷����ƻ�ȡҵ�񷽷���
	 * 
	 * @param name ҵ�񷽷�����
	 * @return method  ҵ�񷽷�
	 * @throws Exception
	 */
	public Method getMethod(String name) throws Exception {
		Method method = (Method) this.methodMap.get(name);
		if (method == null) {
			throw new Exception("method " + name + " is null");
		} else {
			return method;
		}
	}
}
