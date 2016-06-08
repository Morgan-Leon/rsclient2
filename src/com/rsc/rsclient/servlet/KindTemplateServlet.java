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
import com.rsc.rsclient.servlet.ServiceServlet;

public class KindTemplateServlet extends ServiceServlet {

	private static Logger logger = Logger.getLogger(KindTemplateServlet.class);

	private ServletConfig config = null;

	private Service service = null;
	
	private String templateSavePath = null ;

	public void init(ServletConfig config) {
		templateSavePath = config.getServletContext().getRealPath("/") + config.getInitParameter("templateSavePath") ;
		this.config = config;
		this.service = ServiceFactory.getService(this,
				KindTemplateService.class);
	}

	public void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("UTF-8") ;
		String method = this.getRsMethod(request);
		String accept = this.getRsAccept(request);
		String rsDataType = this.getRsDataType(request);
		VariablePool variablePool = this.getVariablePool(request, response,
				rsDataType);
		variablePool.add("templateSavePath", String.class , templateSavePath) ;
		System.out.println("" + Thread.currentThread().getId() + " rsMethod "
				+ method + " variablePool :" + variablePool);
		VariableAbstract returnValue = this.service.run(method, variablePool);
		if ("readTemplate".equals(method)) {
			response.setContentType(ContentType.get(accept) + "; charset=" + ContentType.getEncoding());
			String content = SuperParser.unmarshal("json", returnValue
					.getValue(), returnValue.getName());
			System.out.println("" + Thread.currentThread().getId()
					+ " response:" + content);
			PrintWriter writer = response.getWriter();
			writer.write(content != null ? content : "");
			writer.flush();
			writer.close();
		} else if ("addTemplate".equals(method)) {
			response.setContentType(ContentType.get(accept) + "; charset="
					+ ContentType.getEncoding());
			String content = SuperParser.unmarshal("json", returnValue
					.getValue(), returnValue.getName());
			System.out.println("" + Thread.currentThread().getId()
					+ " response:" + content);
			PrintWriter writer = response.getWriter();
			writer.write(content != null ? content : "");
			writer.flush();
			writer.close();
		}
	}
}
