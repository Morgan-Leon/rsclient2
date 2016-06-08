package com.rsc.rsclient;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * ҵ�񷽷������ࡣ
 * @author changhu
 */
public abstract class MethodAbstract {

	private String name;

	private List parameters;

	private ParameterAbstract returnValue;

	private java.lang.reflect.Method refMethod;

	private List beforeMethods = new ArrayList();

	private List afterMethods = new ArrayList();
	
	private static Logger logger = Logger.getLogger(Method.class);
	
	/**
	 * ���췽����
	 * @param name ҵ�񷽷�����
	 * @throws MethodException 
	 */
	public MethodAbstract(String name) throws MethodException {
		this.setName(name);
		this.parameters = new ArrayList();
	}
	
	/**
	 * ����ҵ�񷽷����ơ�
	 * @param name ҵ�񷽷�����
	 * @throws MethodException ���ҵ�񷽷�����Ϊnull����ַ������׳��쳣��
	 */
	public void setName(String name) throws MethodException {
		if (name == null || "".equals(name.trim())) {
			throw new MethodException("method name is null or blank!");
		}
		this.name = name.trim();
	}

	/**
	 * ��ȡҵ�񷽷����ơ�
	 * @return {@link String} ҵ�񷽷�����
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * ��ȡҵ�񷽷����������顣
	 * 
	 * @return {@link Class}[]
	 */
	public Class[] getParameterClasses() {
		int size = this.parameters.size();
		Class[] clazz = new Class[size];
		for (int i = 0; i < size; i++) {
			Parameter parameter = (Parameter) this.parameters.get(i);
			clazz[i] = parameter.getClazz();
		}
		return clazz;
	}
	
	/**
	 * ��ȡҵ�񷽷������������顣
	 * @return {@link String}[]
	 */
	public String[] getParameterNames() {
		int size = this.parameters.size();
		String[] names = new String[size];
		for (int i = 0; i < size; i++) {
			Parameter parameter = (Parameter) this.parameters.get(i);
			names[i] = parameter.getName();
		}
		return names;
	}

	/**
	 * ��Ӳ���{@link Parameter}��
	 * @param parameter ����
	 * @return {@link MethodAbstract}
	 */
	public MethodAbstract addParameter(ParameterAbstract parameter) {
		this.parameters.add(parameter);
		return this;
	}
	
	/**
	 * ��ȡҵ�񷽷������б� {@link Parameter}��
	 * @return {@link List}
	 */
	public List getParameters() {
		return this.parameters;
	}
	
	/**
	 * ���÷���ֵ {@link Parameter}��
	 * @param returnValue ����ֵ
	 * @return {@link MethodAbstract}
	 */
	public MethodAbstract setReturnValue(ParameterAbstract returnValue) {
		this.returnValue = returnValue;
		return this;
	}

	/**
	 * ��ȡ����ֵ��
	 * @return {@link Parameter} ����ֵ
	 */
	public ParameterAbstract getReturnValue() {
		return this.returnValue;
	}
	

	/**
	 * �����ִ�е�ǰҵ�񷽷�֮ǰ������ִ�е�ҵ�񷽷����������ΪҪִ�е�ҵ�񷽷������ơ�<br/>
	 * ��ҵ�񷽷��͵�ǰҵ�񷽷�����ͬ����ͬһ���࣬���Ѿ�ע�ᡣ<br/>
	 * ҵ�񷽷���ע��μ�{@link Service#registerMethods(MethodMap)}��<br/>
	 * ����Ӷ����ִ�и�ҵ�񷽷�֮ǰҪִ�е�ҵ�񷽷������������˳��ִ������ִ����Щҵ�񷽷���
	 * 
	 * @param name ҵ�񷽷�����
	 * @return {@link MethodAbstract} ��ǰҵ�񷽷�
	 */
	public MethodAbstract addBeforeMethod(String name) {
		this.beforeMethods.add(name);
		return this;
	};

	/**
	 * ������ִ�е�ǰҵ�񷽷�֮ǰ����ִ�е�ҵ�񷽷��������б�
	 * 
	 * @return {@link List} ҵ�񷽷�����
	 */
	public List getBeforeMethod() {
		return this.beforeMethods;
	}

	/**
	 * �����ִ�е�ǰҵ�񷽷�֮�󣬱���ִ�е�ҵ�񷽷����������ΪҪִ�е�ҵ�񷽷������ơ�<br/>
	 * ��ҵ�񷽷��͵�ǰҵ�񷽷�����ͬ����ͬһ���࣬���Ѿ�ע�ᡣ<br/>
	 * ҵ�񷽷���ע��μ�{@link Service#registerMethods(MethodMap)}��<br/>
	 * ����Ӷ����ִ�и�ҵ�񷽷�֮��Ҫִ�е�ҵ�񷽷������������˳��ִ������ִ����Щҵ�񷽷���
	 * 
	 * @param name ҵ�񷽷�����
	 * @return {@link MethodAbstract} ��ǰҵ�񷽷�
	 */
	public MethodAbstract addAfterMethod(String name) {
		this.afterMethods.add(name);
		return this;
	}

	/**
	 * ������ִ�е�ǰҵ�񷽷�֮�����ִ�е�ҵ�񷽷��������б�
	 * 
	 * @return {@link List} ҵ�񷽷�����
	 */
	public List getAfterMethod() {
		return this.afterMethods;
	}

}
