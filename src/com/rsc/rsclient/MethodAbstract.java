package com.rsc.rsclient;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * 业务方法抽象类。
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
	 * 构造方法。
	 * @param name 业务方法名称
	 * @throws MethodException 
	 */
	public MethodAbstract(String name) throws MethodException {
		this.setName(name);
		this.parameters = new ArrayList();
	}
	
	/**
	 * 设置业务方法名称。
	 * @param name 业务方法名称
	 * @throws MethodException 如果业务方法名称为null或空字符串会抛出异常。
	 */
	public void setName(String name) throws MethodException {
		if (name == null || "".equals(name.trim())) {
			throw new MethodException("method name is null or blank!");
		}
		this.name = name.trim();
	}

	/**
	 * 获取业务方法名称。
	 * @return {@link String} 业务方法名称
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * 获取业务方法参数类数组。
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
	 * 获取业务方法参数名称数组。
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
	 * 添加参数{@link Parameter}。
	 * @param parameter 参数
	 * @return {@link MethodAbstract}
	 */
	public MethodAbstract addParameter(ParameterAbstract parameter) {
		this.parameters.add(parameter);
		return this;
	}
	
	/**
	 * 获取业务方法参数列表 {@link Parameter}。
	 * @return {@link List}
	 */
	public List getParameters() {
		return this.parameters;
	}
	
	/**
	 * 设置返回值 {@link Parameter}。
	 * @param returnValue 返回值
	 * @return {@link MethodAbstract}
	 */
	public MethodAbstract setReturnValue(ParameterAbstract returnValue) {
		this.returnValue = returnValue;
		return this;
	}

	/**
	 * 获取返回值。
	 * @return {@link Parameter} 返回值
	 */
	public ParameterAbstract getReturnValue() {
		return this.returnValue;
	}
	

	/**
	 * 添加在执行当前业务方法之前，必须执行的业务方法，传入参数为要执行的业务方法的名称。<br/>
	 * 该业务方法和当前业务方法必须同属于同一个类，且已经注册。<br/>
	 * 业务方法的注册参见{@link Service#registerMethods(MethodMap)}。<br/>
	 * 可添加多个在执行该业务方法之前要执行的业务方法，将依照添加顺序执行依次执行这些业务方法。
	 * 
	 * @param name 业务方法名称
	 * @return {@link MethodAbstract} 当前业务方法
	 */
	public MethodAbstract addBeforeMethod(String name) {
		this.beforeMethods.add(name);
		return this;
	};

	/**
	 * 返回在执行当前业务方法之前必须执行的业务方法的名称列表。
	 * 
	 * @return {@link List} 业务方法名称
	 */
	public List getBeforeMethod() {
		return this.beforeMethods;
	}

	/**
	 * 添加在执行当前业务方法之后，必须执行的业务方法，传入参数为要执行的业务方法的名称。<br/>
	 * 该业务方法和当前业务方法必须同属于同一个类，且已经注册。<br/>
	 * 业务方法的注册参见{@link Service#registerMethods(MethodMap)}。<br/>
	 * 可添加多个在执行该业务方法之后要执行的业务方法，将依照添加顺序执行依次执行这些业务方法。
	 * 
	 * @param name 业务方法名称
	 * @return {@link MethodAbstract} 当前业务方法
	 */
	public MethodAbstract addAfterMethod(String name) {
		this.afterMethods.add(name);
		return this;
	}

	/**
	 * 返回在执行当前业务方法之后必须执行的业务方法的名称列表。
	 * 
	 * @return {@link List} 业务方法名称
	 */
	public List getAfterMethod() {
		return this.afterMethods;
	}

}
