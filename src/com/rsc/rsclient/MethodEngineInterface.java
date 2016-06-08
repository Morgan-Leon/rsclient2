package com.rsc.rsclient;

import com.rsc.rsclient.exception.MethodException;

/**
 * 业务方法执行引擎接口。实现该接口的类有{@link MethodEngine}
 * @author changhu 
 */
public interface MethodEngineInterface {

	/**
	 * 执行业务方法。
	 * 
	 * @param method 业务方法
	 * @param service 业务类
	 * @param variablePool 变量池
	 * @return {@link Variable} 返回值
	 * @throws MethodException
	 */
	public VariableAbstract invoke(MethodAbstract method, Service service,
			VariablePool variablePool) throws MethodException;
}
