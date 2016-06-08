package com.rsc.rsclient.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.http.HttpMultipartVariablePool;
import com.rsc.rsclient.http.HttpVariablePool;

/**
 * 继承自{@link javax.servlet.http.HttpServlet}，封装了对用户登录信息的验证，如果用
 * 户没有登录，则提示用户已掉线。抽象方法
 * {@link ServiceServlet#doService(HttpServletRequest, HttpServletResponse)}
 * 定义了处理用户请求的接口，该抽象类的子类有 {@link StateServlet}和{@link GeneralselServlet}。
 * 
 * @author changhu
 */
public abstract class ServiceServlet extends ServiceValidate {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(ServiceServlet.class);

	/**
	 * 处理用户请求信息接口，无论是GET还是POST请求都通过该接口处理。
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public abstract void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	/**
	 * 处理GET请求
	 * 
	 * @param request
	 * @param response
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * 处理POST请求
	 * 
	 * @param request
	 * @param response
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			if (this.validate(request)) {
				this.doService(request, response);
			} else {
				response.sendError(500, "用户已掉线");
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
			response.sendError(500, e.getMessage());
		}
	}
	
	/**
	 * 根据不同的请求类型创建变量池，如果是多媒体文件则返回{@link HttpMultipartVariablePool}实例.
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	public VariablePool getVariablePool(HttpServletRequest request,
			HttpServletResponse response, String rsDataType) {
		boolean multipartRequest = ServletFileUpload
				.isMultipartContent(request);
		if (multipartRequest) {
			return new HttpMultipartVariablePool(request, response, rsDataType);
		} else {
			return new HttpVariablePool(request, response, rsDataType);
		}
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
	 * 获取参数数据类型
	 * 
	 * @param request
	 * @return
	 */
	public String getRsDataType(HttpServletRequest request) {
		String rsDataType = request.getHeader("Rs-dataType");
		if (rsDataType == null || "".equals(rsDataType.trim())) {
			rsDataType = request.getParameter("Rs-dataType");
		}
		return rsDataType == null ? "json" : rsDataType;
	}
}
