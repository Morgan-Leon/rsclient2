package com.rsc.rsclient.exception;

/**
 * ҵ�񷽷��쳣
 * 
 * @author
 */
public class MethodException extends Exception {

	private static final long serialVersionUID = -7775392797622541533L;

	/**
	 * ���췽��
	 */
	public MethodException() {
		super();
	}

	/**
	 * ���췽��
	 * 
	 * @param message ��Ϣ
	 * @param cause
	 */
	public MethodException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * ���췽��
	 * 
	 * @param message ��Ϣ
	 */
	public MethodException(String message) {
		super(message);
	}

	/**
	 * ���췽��
	 * 
	 * @param cause 
	 */
	public MethodException(Throwable cause) {
		super(cause);
	}

}
