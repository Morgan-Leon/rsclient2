package com.rsc.rsclient;

/**
 * ��������࣬���ڶ�ҵ�񷽷������ĵķ�װ������ʵ����μ�{@link Parameter}
 * 
 * @author changhu
 */
public abstract class ParameterAbstract {

	private String name;

	private Class clazz;
	
	/**
	 * ���췽�����������Ϊ���������ࡣ
	 * 
	 * @param clazz ��������
	 */
	public ParameterAbstract(Class clazz) {
		this.setClazz(clazz);
	}

	/**
	 * ���췽������������ֱ�Ϊ�������ƣ��������͡�
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 */
	public ParameterAbstract(String name, Class clazz) {
		this.setName(name);
		this.setClazz(clazz);
	}

	/**
	 * ��ȡ��������
	 * 
	 * @return {@link String} ��������
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * ���ò�������
	 * 
	 * @param name ��������
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * ��ȡ��������
	 * 
	 * @return {@link Class} ��������
	 */
	public Class getClazz() {
		return this.clazz;
	}

	/**
	 * ���ò�������
	 * 
	 * @param {@link Class} clazz ��������
	 */
	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}

}
