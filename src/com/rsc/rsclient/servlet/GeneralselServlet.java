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
 * 
 * 处理望远镜查询请求。
 * 
 * @author changhu
 */
public class GeneralselServlet extends ServiceServlet {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(StateServlet.class);

	private ServletConfig config = null;

	private Service service = null;

	public void init(ServletConfig config) {
		this.config = config;
		this.service = ServiceFactory.getService(this, GeneralselService.class);
	}

	/**
	 * 处理Generalsel查询请求
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
		String workpath = this.config.getServletContext().getRealPath("/");
		variablePool.add("workpath", workpath);
		variablePool.add("response", response);
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
