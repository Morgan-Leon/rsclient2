package com.rsc.rsclient.servlet;

import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.rsc.rsclient.Service;
import com.rsc.rsclient.ServiceFactory;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.http.ContentType;
import com.rsc.rsclient.parse.SuperParser;

/**
 * 用户偏好信息处理类。对用户偏好信息进行增、删、改、查等操作。
 * 
 * @author changhu
 */
public class PageStateServlet extends ServiceServlet {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(PageStateServlet.class);

	private ServletConfig config = null;

	private Service service = null;

	public void init(ServletConfig config) {
		this.config = config;
		this.service = ServiceFactory.getService(this, PageStateService.class);
	}

	/**
	 * 处理用户偏好信息
	 * 
	 * @param request
	 * @param response
	 * @exception Exception
	 */
	public void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String method = this.getRsMethod(request);
		String accept = this.getRsAccept(request);
		String rsDataType = this.getRsDataType(request);
		
		VariablePool variablePool = this.getVariablePool(request, response, rsDataType);
		
		System.out.println("" + Thread.currentThread().getId() 
				+ " rsMethod " + method + " variablePool :" + variablePool);
		
		VariableAbstract returnValue = this.service.run(method, variablePool);
		if (!Void.TYPE.equals(returnValue.getClazz())) {
			response.setContentType(ContentType.get(accept) + "; charset=" + ContentType.getEncoding());
			String content = SuperParser.unmarshal(accept, returnValue.getValue(), returnValue.getName());
			
			System.out.println("" + Thread.currentThread().getId() + " response:" + content);
			//logger.debug("response:" + content);
			
			PrintWriter writer = response.getWriter();
			writer.write(content != null ? content : "");
			writer.flush();
			writer.close();
 		}
	}
}
