package com.rsc.rsclient;

/**
 * �����࣬����ִ��ҵ�񷽷�ʱ�����ķ�װ���̳���{@link VariableAbstract}
 * 
 * @author changhu
 */
public class Variable extends VariableAbstract {

	/**
	 * ���췽��
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 */
	public Variable(String name, Class clazz) {
		super(name, clazz);
	}
	
	/**
	 * ���췽��
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 * @param value ����ֵ
	 */
	public Variable(String name, Class clazz, Object value) {
		super(name, clazz, value);
	}
}
