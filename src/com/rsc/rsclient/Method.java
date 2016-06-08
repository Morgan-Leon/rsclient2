package com.rsc.rsclient;

import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * 业务方法类，继承自{@link MethodAbstract}抽象类，实现对各种常用类型的参数的添加和设置各种类型的返回值。
 * 
 * @author changhu
 */
public class Method extends MethodAbstract {

	private static Logger logger = Logger.getLogger(Method.class);

	private ParameterCreatorInterface parameterCreator;

	/**
	 * 构造方法，该构造方法中设置了默认的参数生成器和默认的空返回值。
	 * @param name 业务方法名称
	 * @throws MethodException 
	 */
	public Method(String name) throws MethodException {
		super(name);
		this.parameterCreator = new ParameterCreator();
		this.setReturnValue(this.parameterCreator.createObjectParameter(null,
				Void.TYPE));
	}

	/**
	 * 设置该业务方法参数生成器，由该参数生成器创建该业务方法的各种类型的参数。
	 * 默认的参数生成器为{@link ParameterCreator}
	 * 
	 * @param parameterCreator 该参数生成器必须实现接口{@link ParameterCreatorInterface}
	 */
	public void setParameterCreator(ParameterCreatorInterface parameterCreator) {
		this.parameterCreator = parameterCreator;
	}

	/**
	 * 添加char类型参数。
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addCharacterParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createCharacterParameter(parameterName));
	}

	/**
	 * 添加byte类型参数。
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addByteParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createByteParameter(parameterName));
	}

	/**
	 * 添加short类型参数。 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addShortParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createShortParameter(parameterName));
	}

	/**
	 * 添加long类型参数 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addLongParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createLongParameter(parameterName));
	}

	/**
	 * 添加float类型参数 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addFloatParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createFloatParameter(parameterName));
	}

	/**
	 * 添加double类型参数。 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addDoubleParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createDoubleParameter(parameterName));
	}

	/**
	 * 添加int类型参数。 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addIntegerParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createIntegerParameter(parameterName));
	}

	/**
	 * 添加boolean类型参数。 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addBooleanParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createBooleanParameter(parameterName));
	}

	/**
	 * 添加{@link String}类型参数。
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addStringParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createStringParameter(parameterName));
	}

	/**
	 * 添加{@link Map}类型参数。 
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addMapParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createMapParameter(parameterName));
	}

	/**
	 * 添加{@link List}类型参数。
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addListParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createListParameter(parameterName));
	}

	/**
	 * 添加{@link Object}类参数。
	 * @param parameterName 参数名称
	 * @return {@link Method}
	 */
	public Method addObjectParameter(String parameterName, Class parameterClass) {
		return (Method) this.addParameter(this.parameterCreator
				.createObjectParameter(parameterName, parameterClass));
	}

	/**
	 * 设置返回值，传入参数分别为返回值类型和返回值名称。
	 * @param returnValueClass  返回值类型
	 * @param returnValueName  返回值名称
	 * @return {@link Method}
	 */
	public Method setObjectReturnValue(Class returnValueClass,
			String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createObjectParameter(returnValueName, returnValueClass));
	}

	/**
	 * 设置{@link Object}类型返回值。
	 * @param returnValueClass  返回值类型
	 * @return {@link Method}
	 */
	public Method setObjectReturnValue(Class returnValueClass) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createObjectParameter(null, returnValueClass));
	}

	/**
	 * 设置char类型的返回值。
	 * @param returnValueName  返回值名称
	 * @return {@link Method}
	 */
	public Method setCharacterReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createCharacterParameter(returnValueName));
	}

	/**
	 * 设置char类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */
	public Method setCharacterReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createCharacterParameter(null));
	}

	/**
	 * 设置byte类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setByteReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createByteParameter(returnValueName));
	}

	/**
	 * 设置byte类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setByteReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createByteParameter(null));
	}

	/**
	 * 设置short类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setShortReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createShortParameter(returnValueName));
	}

	/**
	 * 设置short类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setShortReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createShortParameter(null));
	}

	/**
	 * 设置float类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setFloatReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createFloatParameter(returnValueName));
	}
	
	/**
	 * 设置float类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setFloatReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createFloatParameter(null));
	}

	/**
	 * 设置double类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setDoubleReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createDoubleParameter(returnValueName));
	}

	/**
	 * 设置double类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setDoubleReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createDoubleParameter(null));
	}

	/**
	 * 设置long类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setLongReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createLongParameter(returnValueName));
	}

	/**
	 * 设置long类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setLongReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createLongParameter(null));
	}

	/**
	 * 设置int类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setIntegerReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createIntegerParameter(returnValueName));
	}

	/**
	 * 设置int类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */	
	public Method setIntegerReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createIntegerParameter(null));
	}

	/**
	 * 设置boolean类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setBooleanReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createBooleanParameter(returnValueName));
	}

	/**
	 * 设置boolean类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */
	public Method setBooleanReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createBooleanParameter(null));
	}

	/**
	 * 设置{@link String}类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setStringReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createStringParameter(returnValueName));
	}

	/**
	 * 设置{@link String}类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */
	public Method setStringReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createStringParameter(null));
	}

	/**
	 * 设置{@link Map}类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setMapReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createMapParameter(returnValueName));
	}

	/**
	 * 设置{@link Map}类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */
	public Method setMapReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createMapParameter(null));
	}

	/**
	 * 设置{@link List}类型返回值。
	 * @param returnValueName 返回值名称
	 * @return {@link Method}
	 */
	public Method setListReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createListParameter(returnValueName));
	}

	/**
	 * 设置{@link List}类型返回值，该返回值没有名称。
	 * @return {@link Method}
	 */
	public Method setListReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createListParameter(null));
	}

}
