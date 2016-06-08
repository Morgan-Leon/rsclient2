package com.rsc.rsclient;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rsclient.exception.MethodException;

public abstract class Service {

	private Logger logger = Logger.getLogger(Service.class);

	private MethodMap methodMap;

	private MethodEngine methodEngine = new MethodEngine();

	public Map localVariablePool = Collections.synchronizedMap(new HashMap());

	public abstract void registerMethods(MethodMap mm) throws Exception;

	public Service() {
		this.methodMap = new MethodMap();
		try {
			this.registerMethods(this.methodMap);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public final Method getMethod(String methodName) throws MethodException {
		try {
			return this.methodMap.getMethod(methodName);
		} catch (Exception e) {
			logger.fatal("can't find the method : " + methodName, e);
			throw new MethodException("can't find the method : " + methodName);
		}
	}

	public VariableAbstract run(String methodName, VariablePool variablePool)
			throws MethodException {
		this.localVariablePool.put(Thread.currentThread(), variablePool);
		VariableAbstract variable = this.methodEngine.invoke(
				this.getMethod(methodName), this, variablePool);
		this.localVariablePool.remove(Thread.currentThread());
		return variable;
	}

	public final VariablePool getCurrentVariablePool() {
		return (VariablePool) this.localVariablePool
				.get(Thread.currentThread());
	}
}
