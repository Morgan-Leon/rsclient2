package com.rsc.rsclient;

/**
 * 参数生成器接口
 * 
 * @author changhu
 */
public interface ParameterCreatorInterface {
	
	/**
	 * 创建参数
	 * 
	 * @param parameterName 参数名称
	 * @param parameterClass 参数类型
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createParameter(String parameterName,
			Class parameterClass);

	/**
	 * 创建char类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createCharacterParameter(String parameterName);

	/**
	 * 创建byte类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createByteParameter(String parameterName);

	/**
	 * 创建short类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createShortParameter(String parameterName);

	/**
	 * 创建long类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createLongParameter(String parameterName);

	/**
	 * 创建float类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createFloatParameter(String parameterName);

	/**
	 * 创建double类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createDoubleParameter(String parameterName);

	/**
	 * 创建int类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createIntegerParameter(String parameterName);

	/**
	 * 创建boolean类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createBooleanParameter(String parameterName);

	/**
	 * 创建char类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createStringParameter(String parameterName);

	/**
	 * 创建{@link Map}类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createMapParameter(String parameterName);

	/**
	 * 创建{@link List}类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createListParameter(String parameterName);

	/**
	 * 创建{@link Object}类型参数
	 * 
	 * @param parameterName 参数名称
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createObjectParameter(String parameterName,
			Class parameterClass);
}
