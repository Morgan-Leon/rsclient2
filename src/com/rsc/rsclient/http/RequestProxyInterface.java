package com.rsc.rsclient.http;

import com.rsc.rsclient.Service;

/**
 * 请求代理接口，实现该接口的类有：{@link HttpRequestProxy}
 * 
 * @author changhu
 */
public interface RequestProxyInterface {

	/**
	 * 获取URI
	 * 
	 * @return {@link String} uri
	 */
	public String getURI();

	/**
	 * 获取content type
	 * 
	 * @return {@link String} contentType
	 */
	public String getContentType();

	/**
	 * 获取字符集编码
	 * 
	 * @return {@link String} characterEncoding
	 */
	public String getCharacterEncoding();

	/**
	 * 获取远端地址
	 * 
	 * @return {@link String} remoteAddress
	 */
	public String getRemoteAddress();

	/**
	 * 获取输入流
	 * 
	 * @return {@link java.io.InputStream}
	 * @throws java.io.IOException
	 */
	public java.io.InputStream getInputStream() throws java.io.IOException;

	/**
	 * 设置contentType
	 * @param type
	 */
	public void setContentType(String type);
	
	/**
	 * 获取输出流
	 * 
	 * @return java.io.OutputStream
	 * @throws java.io.IOException
	 */
	public java.io.OutputStream getOutputStream() throws java.io.IOException;

	/**
	 * 响应文本
	 * 
	 * @param content 信息
	 */
	public void respond(String content) throws java.io.IOException;
	
	/**
	 * 执行业务逻辑
	 * 
	 * @param engine 业务类
	 * @throws Exception
	 */
	public void doService(Service service) throws Exception;
}
