package com.rsc.rsclient;

/**
 * �����������ӿ�
 * 
 * @author changhu
 */
public interface ParameterCreatorInterface {
	
	/**
	 * ��������
	 * 
	 * @param parameterName ��������
	 * @param parameterClass ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createParameter(String parameterName,
			Class parameterClass);

	/**
	 * ����char���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createCharacterParameter(String parameterName);

	/**
	 * ����byte���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createByteParameter(String parameterName);

	/**
	 * ����short���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createShortParameter(String parameterName);

	/**
	 * ����long���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createLongParameter(String parameterName);

	/**
	 * ����float���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createFloatParameter(String parameterName);

	/**
	 * ����double���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createDoubleParameter(String parameterName);

	/**
	 * ����int���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createIntegerParameter(String parameterName);

	/**
	 * ����boolean���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createBooleanParameter(String parameterName);

	/**
	 * ����char���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createStringParameter(String parameterName);

	/**
	 * ����{@link Map}���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createMapParameter(String parameterName);

	/**
	 * ����{@link List}���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createListParameter(String parameterName);

	/**
	 * ����{@link Object}���Ͳ���
	 * 
	 * @param parameterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createObjectParameter(String parameterName,
			Class parameterClass);
}
