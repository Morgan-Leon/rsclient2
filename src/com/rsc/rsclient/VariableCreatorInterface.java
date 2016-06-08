package com.rsc.rsclient;

/**
 * �����������ӿڣ�ʵ�ָýӿڵ����У�{@link VariableCreator}
 * 
 * @author changhu
 */
public interface VariableCreatorInterface {

	/**
	 * ��������
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz);
	
	/**
	 * ��������
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 * @param value ����ֵ
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz, Object value);
	
}
