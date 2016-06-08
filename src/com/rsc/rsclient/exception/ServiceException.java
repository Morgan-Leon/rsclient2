package com.rsc.rsclient.exception;

/**
 * Service“Ï≥£
 * 
 * @author changhu
 */
public class ServiceException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private int msgKey;

	private String msg;

	public ServiceException(int msgKey) {
		this.msgKey = msgKey;
	}

	public ServiceException(String msg) {
		this.msg = msg;
	}

	public int getKey() {
		return this.msgKey;
	}

	public String getMessage() {
		return this.msg;
	}

}
