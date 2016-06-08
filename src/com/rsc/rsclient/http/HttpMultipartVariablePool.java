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
	 * 存入变量池中的session的变量名
	 */
	public static final String PARAMETER_HTTP_SESSION = "__parameter_sesssion_key";

	/**
	 * 存入变量池中的request的变量名
	 */
	public static final String PARAMETER_HTTP_REQUEST = "__parameter_request_key";

	/**
	 * 存入变量池中的response的变量名
	 */
	public static final String PARAMETER_HTTP_RESPONSE = "__parameter_response_key";

	/**
	 * 构造方法
	 * 
	 * @param request
	 *            HTTP请求对象
	 * @param response
	 *            HTTP响应对象
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
	 * 获取变量值
	 * 
	 * @param valirable
	 *            变量
	 * @param parameter
	 *            参数
	 * @return value 值
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
	 * 添加Session中的可用变量
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addSessionVariable(String variableName, Object value) {
		VariableAbstract variable = this.add(variableName, value);
		this.sessionVariableMap.put(variableName, variable);
	}

	/**
	 * 添加Request中的可用变量
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addRequestVariable(String variableName, Object value) {
		this.requestVariableMap
				.put(variableName, this.add(variableName, value));
	}

	/**
	 * 添加请求参数
	 * 
	 * @param variableName
	 * @param value
	 */
	public void addParameterVariable(String variableName, Object value) {
		this.parameterVariableMap.put(variableName, this.add(variableName,
				value));
	}

	/**
	 * 将请求中的可用参数添加到变量池中
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
		
		//设置上传时的临时文件目录,路径由upload.xml 中<local-upload-temp-docu-path> 指定,
		//此节点的路径需要自己手动创建,否则会报 java.io.FileNotFoundException
		File tempDir = new File(FtpConfig.getTempPath());
		if(!tempDir.exists()){
			tempDir.mkdirs();
		}
		factory.setRepository(tempDir);
		//表示多大的文件将启用临时文件 默认30M
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
