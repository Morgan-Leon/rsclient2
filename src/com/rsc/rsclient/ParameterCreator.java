package com.rsc.rsclient;

import java.util.List;
import java.util.Map;

/**
 * 参数生成器，实现接口{@link ParameterCreatorInterface}。
 * 
 * @author changhu 
 */
public class ParameterCreator implements ParameterCreatorInterface {

	/**
	 * 创建boolean类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createBooleanParameter(String parameterName) {
		return new Parameter(parameterName, Boolean.TYPE);
	}

	/**
	 * 创建byte类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createByteParameter(String parameterName) {
		return new Parameter(parameterName, Byte.TYPE);
	}

	/**
	 * 创建char类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createCharacterParameter(String parameterName) {
		return new Parameter(parameterName, Character.class);
	}

	/**
	 * 创建double类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createDoubleParameter(String parameterName) {
		return new Parameter(parameterName, Double.TYPE);
	}

	/**
	 * 创建float类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createFloatParameter(String parameterName) {
		return new Parameter(parameterName, Float.TYPE);
	}

	/**
	 * 创建int类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createIntegerParameter(String parameterName) {
		return new Parameter(parameterName, Integer.TYPE);
	}

	/**
	 * 创建long类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createLongParameter(String parameterName) {
		return new Parameter(parameterName, Long.TYPE);
	}

	/**
	 * 创建short类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createShortParameter(String parameterName) {
		return new Parameter(parameterName, Short.TYPE);
	}

	/**
	 * 创建{@link String}类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createStringParameter(String parameterName) {
		return new Parameter(parameterName, String.class);
	}	
	
	/**
	 * 创建{@link List}类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createListParameter(String parameterName) {
		return new Parameter(parameterName, List.class);
	}

	/**
	 * 创建{@link Map}类型参数
	 * 
	 * @param paramterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createMapParameter(String parameterName) {
		return new Parameter(parameterName, Map.class);
	}

	/**
	 * 创建{@link Object}类型参数
	 * 
	 * @param paramterName 参数名称
	 * @param paramterClass 参数类型
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createObjectParameter(String parameterName,
			Class parameterClass) {
		return new Parameter(parameterName, parameterClass);
	}

	/**
	 * 创建参数
	 * 
	 * @param paramterName 参数名称
	 * @param parameterClass 参数类型
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createParameter(String parameterName, Class parameterClass) {
		return new Parameter(parameterName, parameterClass);
	}
}
