package com.rsc.rsclient;

/**
 * 参数类，用于对业务方法参数的的封装。继承自{@link ParameterAbstract}
 * 
 * @author changhu
 */
public class Parameter extends ParameterAbstract{

	public Parameter(Class clazz) {
		super(clazz);
	}
	
	public Parameter(String name, Class clazz) {
		super(name, clazz);
	}
}
