package com.rsc.rsclient.servlet;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.rsc.rsclient.Service;
import com.rsc.rsclient.VariablePool;

/**
 * 
 * 处理望远镜查询请求。
 * 
 * @author changhu
 */
public class ExportServlet extends ServiceServlet {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(ExportServlet.class);

	private ServletConfig config = null;

	private Service service = null;
	
	private static int bufferSize = 50*1024*1024 ;


	public void init(ServletConfig config) {
		this.config = config;
		String s = config.getInitParameter("bufferSize") ;
		if(s == null || "".equals(s)){
			bufferSize = 50 * 1024 * 1024 ;
		}else{
			bufferSize = Integer.parseInt(s) * 1024 * 1024 ;
		}
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
		String path = this.config.getServletContext().getRealPath("/");
		String accept = this.getRsAccept(request);
		String rsDataType = this.getRsDataType(request);
		VariablePool variablePool = this.getVariablePool(request, response, rsDataType);
		path += "profile\\" + variablePool.getVariable("sfilename").getStringValue();
		File file = new File(path);
		InputStream fis = new BufferedInputStream(new FileInputStream(path));
		String filename = variablePool.getVariable("cfilename").getStringValue(); 
		response.reset();
		// 设置response的Header
		response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes("GBK"), "ISO8859-1"));
		OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
		response.setContentType("text/msexcel");
		
		byte[] buffer = new byte[bufferSize] ;
		int n = 0 ;
		while((n = fis.read(buffer)) != -1){
			toClient.write(buffer,0,n) ;
			toClient.flush() ;
		}
		toClient.flush() ;
		fis.close() ;
		toClient.close();
        file.delete();
	}
}
