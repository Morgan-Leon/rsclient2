package com.rsc.rsclient.exception;

/**
 * δ�����Provider�쳣
 * 
 * @author changhu
 */
public class NoneProviderException extends Exception {

	private static final long serialVersionUID = 1L;

	private String path;

	/**
	 * 
	 * @return
	 */
	public String getRequestPath() {
		return this.path;
	}

	/**
	 * 
	 * @param path
	 */
	public NoneProviderException(String path) {
		super("request named:" + path + " has not relevant provider.");
		this.path = path;
	}
}
