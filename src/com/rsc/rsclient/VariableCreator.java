package com.rsc.rsclient;

/**
 * 变量生成器，实现接口{@link VaraibleCreatorInterface}
 * 
 * @author changhu
 */
public class VariableCreator implements VariableCreatorInterface {

	/**
	 * 创建变量
	 * 
	 * @param name 变量名称
	 * @param clazz 变量类型
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz) {
		return new Variable(name, clazz);
	}
	
    /**
     * 创建变量
     * 
     * @param name 变量名称
     * @param clazz 变量类型
     * @param vlalue 变量值
     * @return {@link ValriableAbstract}
     */
	public VariableAbstract createVariable(String name, Class clazz, Object value) {
		return new Variable(name, clazz, value);
	}
}
