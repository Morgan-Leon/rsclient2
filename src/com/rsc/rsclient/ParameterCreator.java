package com.rsc.rsclient;

import java.util.List;
import java.util.Map;

/**
 * ������������ʵ�ֽӿ�{@link ParameterCreatorInterface}��
 * 
 * @author changhu 
 */
public class ParameterCreator implements ParameterCreatorInterface {

	/**
	 * ����boolean���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createBooleanParameter(String parameterName) {
		return new Parameter(parameterName, Boolean.TYPE);
	}

	/**
	 * ����byte���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createByteParameter(String parameterName) {
		return new Parameter(parameterName, Byte.TYPE);
	}

	/**
	 * ����char���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createCharacterParameter(String parameterName) {
		return new Parameter(parameterName, Character.class);
	}

	/**
	 * ����double���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createDoubleParameter(String parameterName) {
		return new Parameter(parameterName, Double.TYPE);
	}

	/**
	 * ����float���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createFloatParameter(String parameterName) {
		return new Parameter(parameterName, Float.TYPE);
	}

	/**
	 * ����int���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createIntegerParameter(String parameterName) {
		return new Parameter(parameterName, Integer.TYPE);
	}

	/**
	 * ����long���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createLongParameter(String parameterName) {
		return new Parameter(parameterName, Long.TYPE);
	}

	/**
	 * ����short���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createShortParameter(String parameterName) {
		return new Parameter(parameterName, Short.TYPE);
	}

	/**
	 * ����{@link String}���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */	
	public ParameterAbstract createStringParameter(String parameterName) {
		return new Parameter(parameterName, String.class);
	}	
	
	/**
	 * ����{@link List}���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createListParameter(String parameterName) {
		return new Parameter(parameterName, List.class);
	}

	/**
	 * ����{@link Map}���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createMapParameter(String parameterName) {
		return new Parameter(parameterName, Map.class);
	}

	/**
	 * ����{@link Object}���Ͳ���
	 * 
	 * @param paramterName ��������
	 * @param paramterClass ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createObjectParameter(String parameterName,
			Class parameterClass) {
		return new Parameter(parameterName, parameterClass);
	}

	/**
	 * ��������
	 * 
	 * @param paramterName ��������
	 * @param parameterClass ��������
	 * @return {@link ParameterAbstract}
	 */
	public ParameterAbstract createParameter(String parameterName, Class parameterClass) {
		return new Parameter(parameterName, parameterClass);
	}
}
