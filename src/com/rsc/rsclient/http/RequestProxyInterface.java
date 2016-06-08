package com.rsc.rsclient.http;

import com.rsc.rsclient.Service;

/**
 * �������ӿڣ�ʵ�ָýӿڵ����У�{@link HttpRequestProxy}
 * 
 * @author changhu
 */
public interface RequestProxyInterface {

	/**
	 * ��ȡURI
	 * 
	 * @return {@link String} uri
	 */
	public String getURI();

	/**
	 * ��ȡcontent type
	 * 
	 * @return {@link String} contentType
	 */
	public String getContentType();

	/**
	 * ��ȡ�ַ�������
	 * 
	 * @return {@link String} characterEncoding
	 */
	public String getCharacterEncoding();

	/**
	 * ��ȡԶ�˵�ַ
	 * 
	 * @return {@link String} remoteAddress
	 */
	public String getRemoteAddress();

	/**
	 * ��ȡ������
	 * 
	 * @return {@link java.io.InputStream}
	 * @throws java.io.IOException
	 */
	public java.io.InputStream getInputStream() throws java.io.IOException;

	/**
	 * ����contentType
	 * @param type
	 */
	public void setContentType(String type);
	
	/**
	 * ��ȡ�����
	 * 
	 * @return java.io.OutputStream
	 * @throws java.io.IOException
	 */
	public java.io.OutputStream getOutputStream() throws java.io.IOException;

	/**
	 * ��Ӧ�ı�
	 * 
	 * @param content ��Ϣ
	 */
	public void respond(String content) throws java.io.IOException;
	
	/**
	 * ִ��ҵ���߼�
	 * 
	 * @param engine ҵ����
	 * @throws Exception
	 */
	public void doService(Service service) throws Exception;
}
