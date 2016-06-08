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
 * �̳���{@link javax.servlet.http.HttpServlet}����װ�˶��û���¼��Ϣ����֤�������
 * ��û�е�¼������ʾ�û��ѵ��ߡ����󷽷�
 * {@link ServiceServlet#doService(HttpServletRequest, HttpServletResponse)}
 * �����˴����û�����Ľӿڣ��ó������������ {@link StateServlet}��{@link GeneralselServlet}��
 * 
 * @author changhu
 */
public abstract class ServiceServlet extends ServiceValidate {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(ServiceServlet.class);

	/**
	 * �����û�������Ϣ�ӿڣ�������GET����POST����ͨ���ýӿڴ���
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public abstract void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception;

	/**
	 * ����GET����
	 * 
	 * @param request
	 * @param response
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * ����POST����
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
				response.sendError(500, "�û��ѵ���");
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
			response.sendError(500, e.getMessage());
		}
	}
	
	/**
	 * ���ݲ�ͬ���������ʹ��������أ�����Ƕ�ý���ļ��򷵻�{@link HttpMultipartVariablePool}ʵ��.
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
	 * ��ȡ������������
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
