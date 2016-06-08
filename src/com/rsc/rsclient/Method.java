package com.rsc.rsclient;

import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * ҵ�񷽷��࣬�̳���{@link MethodAbstract}�����࣬ʵ�ֶԸ��ֳ������͵Ĳ�������Ӻ����ø������͵ķ���ֵ��
 * 
 * @author changhu
 */
public class Method extends MethodAbstract {

	private static Logger logger = Logger.getLogger(Method.class);

	private ParameterCreatorInterface parameterCreator;

	/**
	 * ���췽�����ù��췽����������Ĭ�ϵĲ�����������Ĭ�ϵĿշ���ֵ��
	 * @param name ҵ�񷽷�����
	 * @throws MethodException 
	 */
	public Method(String name) throws MethodException {
		super(name);
		this.parameterCreator = new ParameterCreator();
		this.setReturnValue(this.parameterCreator.createObjectParameter(null,
				Void.TYPE));
	}

	/**
	 * ���ø�ҵ�񷽷��������������ɸò���������������ҵ�񷽷��ĸ������͵Ĳ�����
	 * Ĭ�ϵĲ���������Ϊ{@link ParameterCreator}
	 * 
	 * @param parameterCreator �ò�������������ʵ�ֽӿ�{@link ParameterCreatorInterface}
	 */
	public void setParameterCreator(ParameterCreatorInterface parameterCreator) {
		this.parameterCreator = parameterCreator;
	}

	/**
	 * ���char���Ͳ�����
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addCharacterParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createCharacterParameter(parameterName));
	}

	/**
	 * ���byte���Ͳ�����
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addByteParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createByteParameter(parameterName));
	}

	/**
	 * ���short���Ͳ����� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addShortParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createShortParameter(parameterName));
	}

	/**
	 * ���long���Ͳ��� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addLongParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createLongParameter(parameterName));
	}

	/**
	 * ���float���Ͳ��� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addFloatParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createFloatParameter(parameterName));
	}

	/**
	 * ���double���Ͳ����� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addDoubleParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createDoubleParameter(parameterName));
	}

	/**
	 * ���int���Ͳ����� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addIntegerParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createIntegerParameter(parameterName));
	}

	/**
	 * ���boolean���Ͳ����� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addBooleanParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createBooleanParameter(parameterName));
	}

	/**
	 * ���{@link String}���Ͳ�����
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addStringParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createStringParameter(parameterName));
	}

	/**
	 * ���{@link Map}���Ͳ����� 
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addMapParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createMapParameter(parameterName));
	}

	/**
	 * ���{@link List}���Ͳ�����
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addListParameter(String parameterName) {
		return (Method) this.addParameter(this.parameterCreator
				.createListParameter(parameterName));
	}

	/**
	 * ���{@link Object}�������
	 * @param parameterName ��������
	 * @return {@link Method}
	 */
	public Method addObjectParameter(String parameterName, Class parameterClass) {
		return (Method) this.addParameter(this.parameterCreator
				.createObjectParameter(parameterName, parameterClass));
	}

	/**
	 * ���÷���ֵ����������ֱ�Ϊ����ֵ���ͺͷ���ֵ���ơ�
	 * @param returnValueClass  ����ֵ����
	 * @param returnValueName  ����ֵ����
	 * @return {@link Method}
	 */
	public Method setObjectReturnValue(Class returnValueClass,
			String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createObjectParameter(returnValueName, returnValueClass));
	}

	/**
	 * ����{@link Object}���ͷ���ֵ��
	 * @param returnValueClass  ����ֵ����
	 * @return {@link Method}
	 */
	public Method setObjectReturnValue(Class returnValueClass) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createObjectParameter(null, returnValueClass));
	}

	/**
	 * ����char���͵ķ���ֵ��
	 * @param returnValueName  ����ֵ����
	 * @return {@link Method}
	 */
	public Method setCharacterReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createCharacterParameter(returnValueName));
	}

	/**
	 * ����char���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */
	public Method setCharacterReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createCharacterParameter(null));
	}

	/**
	 * ����byte���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setByteReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createByteParameter(returnValueName));
	}

	/**
	 * ����byte���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setByteReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createByteParameter(null));
	}

	/**
	 * ����short���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setShortReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createShortParameter(returnValueName));
	}

	/**
	 * ����short���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setShortReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createShortParameter(null));
	}

	/**
	 * ����float���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setFloatReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createFloatParameter(returnValueName));
	}
	
	/**
	 * ����float���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setFloatReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createFloatParameter(null));
	}

	/**
	 * ����double���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setDoubleReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createDoubleParameter(returnValueName));
	}

	/**
	 * ����double���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setDoubleReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createDoubleParameter(null));
	}

	/**
	 * ����long���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setLongReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createLongParameter(returnValueName));
	}

	/**
	 * ����long���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setLongReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createLongParameter(null));
	}

	/**
	 * ����int���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setIntegerReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createIntegerParameter(returnValueName));
	}

	/**
	 * ����int���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */	
	public Method setIntegerReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createIntegerParameter(null));
	}

	/**
	 * ����boolean���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setBooleanReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createBooleanParameter(returnValueName));
	}

	/**
	 * ����boolean���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */
	public Method setBooleanReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createBooleanParameter(null));
	}

	/**
	 * ����{@link String}���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setStringReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createStringParameter(returnValueName));
	}

	/**
	 * ����{@link String}���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */
	public Method setStringReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createStringParameter(null));
	}

	/**
	 * ����{@link Map}���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setMapReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createMapParameter(returnValueName));
	}

	/**
	 * ����{@link Map}���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */
	public Method setMapReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createMapParameter(null));
	}

	/**
	 * ����{@link List}���ͷ���ֵ��
	 * @param returnValueName ����ֵ����
	 * @return {@link Method}
	 */
	public Method setListReturnValue(String returnValueName) {
		return (Method) this.setReturnValue(this.parameterCreator
				.createListParameter(returnValueName));
	}

	/**
	 * ����{@link List}���ͷ���ֵ���÷���ֵû�����ơ�
	 * @return {@link Method}
	 */
	public Method setListReturnValue() {
		return (Method) this.setReturnValue(this.parameterCreator
				.createListParameter(null));
	}

}
