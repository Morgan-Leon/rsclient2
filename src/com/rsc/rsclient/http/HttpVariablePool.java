package com.rsc.rsclient.http;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.rsc.rsclient.Parameter;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.parse.SuperParser;

/**
 * HTTP��������أ���session��request��attribute��parameter�п��õı������з�װ��
 * �̳���{@link VairablePool}
 * 
 * @author changhu 
 */
public class HttpVariablePool extends VariablePool {

	private Map sessionVariableMap;

	private Map parameterVariableMap;

	private Map requestVariableMap;
	
	private String rsDataType;
	
	private static Logger logger = Logger.getLogger(HttpVariablePool.class);
	
	/**
	 * ����������е�session�ı�����
	 */
	public static final String PARAMETER_HTTP_SESSION = "__parameter_sesssion_key";

	/**
	 * ����������е�request�ı�����
	 */
	public static final String PARAMETER_HTTP_REQUEST = "__parameter_request_key";

	/**
	 * ����������е�response�ı�����
	 */
	public static final String PARAMETER_HTTP_RESPONSE = "__parameter_response_key";
	
	
	/**
	 * ���췽��
	 * 
	 * @param request HTTP�������
	 * @param response HTTP��Ӧ����
	 */
	public HttpVariablePool(HttpServletRequest request,
			HttpServletResponse response) {
		super();
		this.sessionVariableMap = new HashMap();
		this.requestVariableMap = new HashMap();
		this.parameterVariableMap = new HashMap();
		this.bindParameters(request, response);
	}

	/**
	 * 
	 * @param request
	 * @param response
	 * @param rsDataType
	 */
	public HttpVariablePool(HttpServletRequest request,
			HttpServletResponse response, String rsDataType) {
		super();
		this.rsDataType = rsDataType;
		this.sessionVariableMap = new HashMap();
		this.requestVariableMap = new HashMap();
		this.parameterVariableMap = new HashMap();
		this.bindParameters(request, response);
	}
	
	/**
	 * ��ȡ����ֵ
	 * 
	 * @param valirable ����
	 * @param parameter ����
	 * @return value ֵ
	 */
	public Object getValue(VariableAbstract variable, Parameter parameter) {
		Object value = variable.getValue();
		if (variable.getClazz().isPrimitive()) {
			return value;
		} else {
			if (variable.getClazz().isAssignableFrom(parameter.getClazz())) {
				return value;
			} else {
				try {
					if(this.rsDataType != null){
						return SuperParser.marshal(this.rsDataType, value, parameter.getClazz());
					}else {
						return SuperParser.marshal(value, parameter.getClazz());	
					}
				} catch (Exception e) {
					logger.error(e.getMessage());
					return null;
				}
			}
		}
	}

	/**
	 * ���Session�еĿ��ñ���
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addSessionVariable(String variableName, Object value) {
		VariableAbstract variable = this.add(variableName, value);
		this.sessionVariableMap.put(variableName, variable);
	}

	/**
	 * ���Request�еĿ��ñ���
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addRequestVariable(String variableName, Object value) {
		this.requestVariableMap
				.put(variableName, this.add(variableName, value));
	}

	/**
	 * ����������
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addParameterVariable(String variableName, Object value) {
		this.parameterVariableMap.put(variableName, this.add(variableName, value));
	}

	/**
	 * �������еĿ��ò�����ӵ���������
	 * 
	 * @param request
	 */
	private void bindParameters(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		this.add(PARAMETER_HTTP_SESSION, HttpSession.class, session);
		this.add(PARAMETER_HTTP_REQUEST, HttpServletRequest.class, request);		
		this.add(PARAMETER_HTTP_RESPONSE, HttpServletResponse.class, response);
		
		Enumeration sessEnum = request.getSession().getAttributeNames();
		
		while (sessEnum.hasMoreElements()) {
			String variableName = (String) sessEnum.nextElement();
			this.addSessionVariable(variableName, request.getSession()
					.getAttribute(variableName));
		}
		Enumeration attrEnum = request.getAttributeNames();
		while (attrEnum.hasMoreElements()) {
			String variableName = (String) attrEnum.nextElement();
			this.addRequestVariable(variableName, request
					.getAttribute(variableName));
		}
		Enumeration paramEnum = request.getParameterNames();
		while (paramEnum.hasMoreElements()) {
			String variableName = (String) paramEnum.nextElement();
			String parameter = request.getParameter(variableName);
			try {
				variableName = java.net.URLDecoder.decode(variableName, ContentType.getEncoding());
				parameter = java.net.URLDecoder.decode(parameter, ContentType.getEncoding());
				logger.debug(variableName + "=" + parameter);
				this.addParameterVariable(variableName, parameter);
			} catch (UnsupportedEncodingException e) {
				logger.error(e.getMessage());
			}
		}
	};

}
