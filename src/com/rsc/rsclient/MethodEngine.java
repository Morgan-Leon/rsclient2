package com.rsc.rsclient;

import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * ҵ�񷽷�ִ�����档ʵ���˽ӿ�{@link MethodEngineInterface}��
 * 
 * @author changhu 
 */
public class MethodEngine implements MethodEngineInterface {

	private Logger logger = Logger.getLogger(MethodEngine.class);

	/**
	 * ִ��ҵ�񷽷���
	 * 
	 * @param method ҵ�񷽷�
	 * @param service ҵ����
	 * @param variablePool ������
	 * @exception MethodException
	 * @return 
	 */
	public VariableAbstract invoke(MethodAbstract method, Service service,
			VariablePool variablePool) throws MethodException {
		try {
			
			this.beforeInvoke(method, service, variablePool);
			
			java.lang.reflect.Method rfMethod = service.getClass().getMethod(
					method.getName(), method.getParameterClasses());
			Object value = rfMethod.invoke(service, variablePool
					.getValues(method.getParameters()));
			VariableAbstract v = variablePool.getVariable(method.getReturnValue(),
					value);
			this.afterInvoke(method, service, variablePool);
			return v;
		} catch (Exception e) {
			logger.fatal("invoke method exception! " + e.getMessage(), e);
			throw new MethodException("invoke method exception! " + e.getMessage());
		}
	}
	
	/**
	 * ִ��ҵ�񷽷�֮ǰ��ҵ�񷽷���
	 * 
	 * @param method ҵ�񷽷�
	 * @param service ҵ����
	 * @param variablePool ������
	 * @throws MethodException
	 */
	public void beforeInvoke(MethodAbstract method, Service service,
			VariablePool variablePool) throws MethodException {
		List list = method.getBeforeMethod();
		for (Iterator i = list.iterator(); i.hasNext();) {
			this.invoke(service.getMethod((String) i.next()), service,
					variablePool);
		}
	}

	/**
	 * ִ�и�ҵ�񷽷�֮���ҵ�񷽷���
	 * 
	 * @param method ҵ�񷽷�
	 * @param service ҵ����
	 * @param variablePool ������
	 * @throws MethodException
	 */
	public void afterInvoke(MethodAbstract method, Service service,
			VariablePool variablePool) throws MethodException {
		List list = method.getAfterMethod();
		for (Iterator i = list.iterator(); i.hasNext();) {
			this.invoke(service.getMethod((String) i.next()), service,
					variablePool);
		}
	}

}
