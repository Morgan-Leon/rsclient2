package com.rsc.rsclient;

/**
 * ������������ʵ�ֽӿ�{@link VaraibleCreatorInterface}
 * 
 * @author changhu
 */
public class VariableCreator implements VariableCreatorInterface {

	/**
	 * ��������
	 * 
	 * @param name ��������
	 * @param clazz ��������
	 * @return {@link VariableAbstract}
	 */
	public VariableAbstract createVariable(String name, Class clazz) {
		return new Variable(name, clazz);
	}
	
    /**
     * ��������
     * 
     * @param name ��������
     * @param clazz ��������
     * @param vlalue ����ֵ
     * @return {@link ValriableAbstract}
     */
	public VariableAbstract createVariable(String name, Class clazz, Object value) {
		return new Variable(name, clazz, value);
	}
}
