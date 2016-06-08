package com.rsc.rsclient;

/**
 * 变量生成器接口，实现该接口的类有：{@link VariableCreator}
 * 
 * @author changhu
 */
public interface VariableCreatorInterface {

	/**
	 * 创建变量
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz);
	
	/**
	 * 创建变量
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @param value 变量值
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz, Object value);
	
}
