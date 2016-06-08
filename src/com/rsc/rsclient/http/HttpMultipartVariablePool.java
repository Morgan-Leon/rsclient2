package com.rsc.rsclient.http;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.rsc.rsclient.Parameter;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.ftp.FtpConfig;
import com.rsc.rsclient.parse.SuperParser;

public class HttpMultipartVariablePool extends VariablePool {

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
	 * @param request
	 *            HTTP�������
	 * @param response
	 *            HTTP��Ӧ����
	 */
	public HttpMultipartVariablePool(HttpServletRequest request,
			HttpServletResponse response) {
		super();
		this.sessionVariableMap = new HashMap();
		this.requestVariableMap = new HashMap();
		this.parameterVariableMap = new HashMap();
		this.bindParameters(request , response);
	}

	/**
	 * 
	 * @param request
	 * @param response
	 * @param rsDataType
	 */
	public HttpMultipartVariablePool(HttpServletRequest request,
			HttpServletResponse response, String rsDataType) {
		super();
		this.sessionVariableMap = new HashMap();
		this.requestVariableMap = new HashMap();
		this.parameterVariableMap = new HashMap();
		this.rsDataType = rsDataType;
		this.bindParameters(request , response);
	}

	/**
	 * ��ȡ����ֵ
	 * 
	 * @param valirable
	 *            ����
	 * @param parameter
	 *            ����
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
					if (this.rsDataType != null) {
						return SuperParser.marshal(this.rsDataType, value,
								parameter.getClazz());
					} else {
						return SuperParser.marshal(value, parameter.getClazz());
					}
				} catch (Exception e) {
					logger.debug(e.getMessage());
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
		this.parameterVariableMap.put(variableName, this.add(variableName,
				value));
	}

	/**
	 * �������еĿ��ò�����ӵ���������
	 * 
	 * @param request
	 */
	private void bindParameters(HttpServletRequest request , HttpServletResponse response) {
		
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
		DiskFileItemFactory factory = new DiskFileItemFactory();
		
		//�����ϴ�ʱ����ʱ�ļ�Ŀ¼,·����upload.xml ��<local-upload-temp-docu-path> ָ��,
		//�˽ڵ��·����Ҫ�Լ��ֶ�����,����ᱨ java.io.FileNotFoundException
		File tempDir = new File(FtpConfig.getTempPath());
		if(!tempDir.exists()){
			tempDir.mkdirs();
		}
		factory.setRepository(tempDir);
		//��ʾ�����ļ���������ʱ�ļ� Ĭ��30M
		factory.setSizeThreshold(30*1024*1024);
		
		
		ServletFileUpload upload = new ServletFileUpload(factory);
		try {
			List items = upload.parseRequest(request);
			Iterator iter = items.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				if (item.isFormField()) {
					this.processFormField(item);
				} else {
					this.processUploadedFile(item);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage(), e);
		}
	};

	public void processFormField(FileItem field)
			throws UnsupportedEncodingException {
		if (field.isFormField()) {
			String name = field.getFieldName();
			String value = field.getString();
			name = java.net.URLDecoder.decode(name, ContentType.getEncoding());
			value = java.net.URLDecoder
					.decode(value, ContentType.getEncoding());
			logger.debug(name + "=" + value);
			this.addParameterVariable(name, value);
		}
	}

	public void processUploadedFile(FileItem item) throws Exception {
		if (!item.isFormField()) {
			String name = item.getFieldName();
			name = java.net.URLDecoder.decode(name, ContentType.getEncoding());
			logger.debug(name + "=" + "{file:" + item.getName() + "}");
			this.addParameterVariable(name, item);
		}
	}

}
