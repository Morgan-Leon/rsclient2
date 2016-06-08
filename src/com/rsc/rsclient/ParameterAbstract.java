package com.rsc.rsclient;

/**
 * 抽象参数类，用于对业务方法参数的的封装。具体实现类参见{@link Parameter}
 * 
 * @author changhu
 */
public abstract class ParameterAbstract {

	private String name;

	private Class clazz;
	
	/**
	 * 构造方法，传入参数为参数所属类。
	 * 
	 * @param clazz 参数类型
	 */
	public ParameterAbstract(Class clazz) {
		this.setClazz(clazz);
	}

	/**
	 * 构造方法，传入参数分别为参数名称，参数类型。
	 * 
	 * @param name 参数名称
	 * @param clazz 参数类型
	 */
	public ParameterAbstract(String name, Class clazz) {
		this.setName(name);
		this.setClazz(clazz);
	}

	/**
	 * 获取参数名称
	 * 
	 * @return {@link String} 参数名称
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * 设置参数名称
	 * 
	 * @param name 参数名称
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * 获取参数类型
	 * 
	 * @return {@link Class} 参数类型
	 */
	public Class getClazz() {
		return this.clazz;
	}

	/**
	 * 设置参数类型
	 * 
	 * @param {@link Class} clazz 参数类型
	 */
	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}

}
