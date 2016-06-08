package com.rsc.rsclient;

/**
 * 变量类，用于执行业务方法时变量的封装。继承自{@link VariableAbstract}
 * 
 * @author changhu
 */
public class Variable extends VariableAbstract {

	/**
	 * 构造方法
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 */
	public Variable(String name, Class clazz) {
		super(name, clazz);
	}
	
	/**
	 * 构造方法
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @param value 变量值
	 */
	public Variable(String name, Class clazz, Object value) {
		super(name, clazz, value);
	}
}
