package com.rsc.rsclient;

import java.util.HashMap;
import java.util.Set;

import org.apache.log4j.Logger;

/**
 * 业务方法Map。 用于管理业务类中的业务方法。键为业务方法名称，值为业务方法本身。
 * @author changhu 
 */
public class MethodMap {

	/**
	 * 
	 */
	private HashMap methodMap;

	/**
	 * 
	 */
	private static Logger logger = Logger.getLogger(MethodMap.class);

	/**
	 * 构造方法
	 */
	public MethodMap() {
		this.methodMap = new HashMap();
	}

	/**
	 * 添加业务方法，传入参数为业务方法名称，根据业务方法名称创建一个业务方法。
	 * @param name 业务方法名称
	 * @return method 业务方法
	 * @throws Exception
	 */
	public Method add(String name) throws Exception {
		Method method = new Method(name);
		this.methodMap.put(name, method);
		return method;
	}

	/**
	 * 返回业务方法键值set
	 * 
	 * @return
	 */
	public Set keySet() {
		return this.methodMap.keySet();
	}

	/**
	 * 根据业务方法名称获取业务方法，
	 * 
	 * @param name 业务方法名称
	 * @return method  业务方法
	 * @throws Exception
	 */
	public Method getMethod(String name) throws Exception {
		Method method = (Method) this.methodMap.get(name);
		if (method == null) {
			throw new Exception("method " + name + " is null");
		} else {
			return method;
		}
	}
}
