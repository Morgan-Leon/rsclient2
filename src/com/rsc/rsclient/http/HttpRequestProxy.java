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
 * 处理HTTP请求的代理类，实现接口{@link RequestProxyInterface}
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
	 * 构造方法
	 * 
	 * @param request
	 *            HTTP请求对象
	 * @param response
	 *            HTTP响应对象
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
	 * 根据不同的请求类型创建变量池，如果是多媒体文件则返回{@link HttpMultipartVariablePool}实例.
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
	 * 获取请求业务方法名称
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
	 * 获取参数数据类型
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
	 * 获取请求数据的类型
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
	 * 构造方法
	 * 
	 * @param request
	 *            HTTP请求对象
	 * @param response
	 *            HTTP响应对象
	 * @param context
	 *            Servlet上下文
	 * @throws Exception
	 */
	public HttpRequestProxy(HttpServletRequest request,
			HttpServletResponse response, ServletContext context)
			throws Exception {
		this(request, response);
		this.context = context;
	};

	/**
	 * 获取Servlet上下文
	 * 
	 * @return
	 */
	public ServletContext getServletContext() {
		return this.context;
	}

	/**
	 * 获取contextpath
	 * 
	 * @return {@link String}
	 */
	public String getContextPath() {
		return this.context.getRealPath("/") + "/WEB-INF";
	}

	/**
	 * 获取http请求
	 * 
	 * @return {@link HttpServletRequest}
	 */
	public HttpServletRequest getRequest() {
		return this.request;
	}

	/**
	 * 获取http响应
	 * 
	 * @return {@link HttpServletResponse}
	 */
	public HttpServletResponse getResponse() {
		return this.response;
	}

	/**
	 * 获取请求数据类型
	 * 
	 * @return {@link String} rsAccept
	 */
	public String getRsAccept() {
		return this.rsAccept;
	}

	/**
	 * 获取业务方法名称
	 * 
	 * @return {@link Stirng} rsMethod
	 */
	public String getRsMethod() {
		return this.rsMethod;
	}

	/**
	 * 获取变量池
	 * 
	 * @return {@link VariablePool} variablePool
	 */
	public VariablePool getVariablePool() {
		return this.variablePool;
	}

	/**
	 * 设置变量池
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
	 * 设置错误信息
	 * 
	 * @param {@link String} msg 错误信息
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
	 * 获取content type
	 * 
	 * @return {@link String} contentType
	 */
	public String getContentType() {
		return this.request.getContentType();
	}

	/**
	 * 获取输入流
	 * 
	 * @return {@link java.io.InputStream}
	 * @throws java.io.IOException
	 */
	public InputStream getInputStream() throws IOException {
		return this.request.getInputStream();
	}

	/**
	 * 获取输出流
	 * 
	 * @return {@link java.io.OutputStream} outputStream
	 * @exception java.io.IOException
	 */
	public OutputStream getOutputStream() throws IOException {
		return this.response.getOutputStream();
	}

	/**
	 * 获取远端地址
	 * 
	 * @return {@link String} remoteAddress
	 */
	public String getRemoteAddress() {
		return this.request.getRemoteHost();
	}

	/**
	 * 获取URI
	 * 
	 * @return {@link String} uri
	 */
	public String getURI() {
		return this.request.getRequestURI();
	}

	/**
	 * 设置content type
	 * 
	 * @param type
	 */
	public void setContentType(String type) {
		logger.debug("response content type:" + type);
		this.response.setContentType(type);
	}

	/**
	 * 响应文本
	 * 
	 * @param content
	 *            信息
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
	 * 处理业务逻辑
	 * 
	 * @param 业务类
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
