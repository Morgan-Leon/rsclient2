package com.rsc.rsclient.exception;

/**
 * 业务方法异常
 * 
 * @author
 */
public class MethodException extends Exception {

	private static final long serialVersionUID = -7775392797622541533L;

	/**
	 * 构造方法
	 */
	public MethodException() {
		super();
	}

	/**
	 * 构造方法
	 * 
	 * @param message 信息
	 * @param cause
	 */
	public MethodException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * 构造方法
	 * 
	 * @param message 信息
	 */
	public MethodException(String message) {
		super(message);
	}

	/**
	 * 构造方法
	 * 
	 * @param cause 
	 */
	public MethodException(Throwable cause) {
		super(cause);
	}

}
