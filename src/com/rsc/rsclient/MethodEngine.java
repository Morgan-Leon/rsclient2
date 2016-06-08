package com.rsc.rsclient;

import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

/**
 * 业务方法执行引擎。实现了接口{@link MethodEngineInterface}。
 * 
 * @author changhu 
 */
public class MethodEngine implements MethodEngineInterface {

	private Logger logger = Logger.getLogger(MethodEngine.class);

	/**
	 * 执行业务方法。
	 * 
	 * @param method 业务方法
	 * @param service 业务类
	 * @param variablePool 变量池
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
	 * 执行业务方法之前的业务方法。
	 * 
	 * @param method 业务方法
	 * @param service 业务类
	 * @param variablePool 变量池
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
	 * 执行该业务方法之后的业务方法。
	 * 
	 * @param method 业务方法
	 * @param service 业务类
	 * @param variablePool 变量池
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
