package com.rsc.rsclient.http;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.rsc.rsclient.Service;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.parse.SuperParser;

/**
 * ����HTTP����Ĵ����࣬ʵ�ֽӿ�{@link RequestProxyInterface}
 * 
 * @author changhu
 */
public class HttpRequestProxy implements RequestProxyInterface {

	private static Logger logger = Logger.getLogger(HttpRequestProxy.class);

	private ServletContext context;

	private HttpServletRequest request;

	private HttpServletResponse response;

	private VariablePool variablePool;

	private String rsMethod;

	private String rsAccept;
	
	private String rsDataType;

	/**
	 * ���췽��
	 * 
	 * @param request
	 *            HTTP�������
	 * @param response
	 *            HTTP��Ӧ����
	 * @throws Exception
	 */
	public HttpRequestProxy(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		this.request = request;
		this.response = response;
		this.rsMethod = this.getRsMethod(request);
		this.rsAccept = this.getRsAccept(request);
		this.rsDataType = this.getRsDataType(request);
		this.variablePool = this.getVariablePool(request, response, this.rsDataType);
	};

	/**
	 * ���ݲ�ͬ���������ʹ��������أ�����Ƕ�ý���ļ��򷵻�{@link HttpMultipartVariablePool}ʵ��.
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public VariablePool getVariablePool(HttpServletRequest request,
			HttpServletResponse response, String rsDataType) {
		boolean multipartRequest = ServletFileUpload.isMultipartContent(request);
		VariablePool vp = null;
		if (multipartRequest) {
			vp = new HttpMultipartVariablePool(request, response, rsDataType);
		} else {
			vp = new HttpVariablePool(request, response, rsDataType);
		}
		vp.add("httpRequestProxy", this);
		return vp;
	}

	/**
	 * ��ȡ����ҵ�񷽷�����
	 * 
	 * @param request
	 * @return rsMethod
	 */
	public String getRsMethod(HttpServletRequest request) {
		String rsMethod = request.getHeader("Rs-method");
		if (rsMethod == null || "".equals(rsMethod.trim())) {
			rsMethod = request.getParameter("Rs-method");
		}
		return rsMethod;
	}

	/**
	 * ��ȡ������������
	 * 
	 * @param request
	 * @return
	 */
	public String getRsDataType(HttpServletRequest request){
		String rsDataType = request.getHeader("Rs-dataType");
		if (rsDataType == null || "".equals(rsDataType.trim())) {
			rsDataType = request.getParameter("Rs-dataType");
		}
		return rsDataType == null ? "json" : rsDataType;
	}
	
	/**
	 * ��ȡ�������ݵ�����
	 * 
	 * @param request
	 * @return rsAccept
	 */
	public String getRsAccept(HttpServletRequest request) {
		String rsAccept = request.getHeader("Rs-accept");
		if (rsAccept == null || "".equals(rsAccept.trim())) {
			rsAccept = request.getParameter("Rs-accept");
		}
		return rsAccept == null ? "json" : rsAccept;
	}

	/**
	 * ���췽��
	 * 
	 * @param request
	 *            HTTP�������
	 * @param response
	 *            HTTP��Ӧ����
	 * @param context
	 *            Servlet������
	 * @throws Exception
	 */
	public HttpRequestProxy(HttpServletRequest request,
			HttpServletResponse response, ServletContext context)
			throws Exception {
		this(request, response);
		this.context = context;
	};

	/**
	 * ��ȡServlet������
	 * 
	 * @return
	 */
	public ServletContext getServletContext() {
		return this.context;
	}

	/**
	 * ��ȡcontextpath
	 * 
	 * @return {@link String}
	 */
	public String getContextPath() {
		return this.context.getRealPath("/") + "/WEB-INF";
	}

	/**
	 * ��ȡhttp����
	 * 
	 * @return {@link HttpServletRequest}
	 */
	public HttpServletRequest getRequest() {
		return this.request;
	}

	/**
	 * ��ȡhttp��Ӧ
	 * 
	 * @return {@link HttpServletResponse}
	 */
	public HttpServletResponse getResponse() {
		return this.response;
	}

	/**
	 * ��ȡ������������
	 * 
	 * @return {@link String} rsAccept
	 */
	public String getRsAccept() {
		return this.rsAccept;
	}

	/**
	 * ��ȡҵ�񷽷�����
	 * 
	 * @return {@link Stirng} rsMethod
	 */
	public String getRsMethod() {
		return this.rsMethod;
	}

	/**
	 * ��ȡ������
	 * 
	 * @return {@link VariablePool} variablePool
	 */
	public VariablePool getVariablePool() {
		return this.variablePool;
	}

	/**
	 * ���ñ�����
	 * 
	 * @param variablePool
	 */
	public void setVariablePool(VariablePool variablePool){
		this.variablePool = variablePool;
	}
	
	/**
	 * 
	 * @return
	 */
	public String getCharacterEncoding() {
		return this.request.getCharacterEncoding();
	}

	/**
	 * ���ô�����Ϣ
	 * 
	 * @param {@link String} msg ������Ϣ
	 */
	public void sendServerError(String msg) {
		try {
			logger.info("send error 500 " + msg);
			this.response.sendError(500, msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * ��ȡcontent type
	 * 
	 * @return {@link String} contentType
	 */
	public String getContentType() {
		return this.request.getContentType();
	}

	/**
	 * ��ȡ������
	 * 
	 * @return {@link java.io.InputStream}
	 * @throws java.io.IOException
	 */
	public InputStream getInputStream() throws IOException {
		return this.request.getInputStream();
	}

	/**
	 * ��ȡ�����
	 * 
	 * @return {@link java.io.OutputStream} outputStream
	 * @exception java.io.IOException
	 */
	public OutputStream getOutputStream() throws IOException {
		return this.response.getOutputStream();
	}

	/**
	 * ��ȡԶ�˵�ַ
	 * 
	 * @return {@link String} remoteAddress
	 */
	public String getRemoteAddress() {
		return this.request.getRemoteHost();
	}

	/**
	 * ��ȡURI
	 * 
	 * @return {@link String} uri
	 */
	public String getURI() {
		return this.request.getRequestURI();
	}

	/**
	 * ����content type
	 * 
	 * @param type
	 */
	public void setContentType(String type) {
		logger.debug("response content type:" + type);
		this.response.setContentType(type);
	}

	/**
	 * ��Ӧ�ı�
	 * 
	 * @param content
	 *            ��Ϣ
	 * @exception java.io.IOException
	 */
	public void respond(String content) throws IOException {
		System.out.println("" + Thread.currentThread().getId() + " response:" + content);
		//logger.debug("response content:" + content);
		this.getResponse().getWriter().write(content);
		this.getResponse().getWriter().flush();
		this.getResponse().getWriter().close();
	}

	/**
	 * ����ҵ���߼�
	 * 
	 * @param ҵ����
	 * @exception Exception
	 */
	public void doService(Service service) throws Exception {
		System.out.println("" + Thread.currentThread().getId() 
				+ " rsMethod " + this.rsMethod + " variablePool :" + this.variablePool);
		VariableAbstract returnValue = service.run(this.rsMethod,
				this.variablePool);
		if (!Void.TYPE.equals(returnValue.getClazz())) {
			this.setContentType(ContentType.get(this.rsAccept) + "; charset=" + ContentType.getEncoding());
			String content = SuperParser.unmarshal(this.rsAccept, returnValue.getValue(), returnValue.getName());
			this.respond(content != null ? content : "");
		}
	}
}
