package com.rsc.rsclient;

import com.rsc.rsclient.exception.MethodException;

/**
 * ҵ�񷽷�ִ������ӿڡ�ʵ�ָýӿڵ�����{@link MethodEngine}
 * @author changhu 
 */
public interface MethodEngineInterface {

	/**
	 * ִ��ҵ�񷽷���
	 * 
	 * @param method ҵ�񷽷�
	 * @param service ҵ����
	 * @param variablePool ������
	 * @return {@link Variable} ����ֵ
	 * @throws MethodException
	 */
	public VariableAbstract invoke(MethodAbstract method, Service service,
			VariablePool variablePool) throws MethodException;
}
