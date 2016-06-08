package com.rsc.rsclient.servlet;

import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.rsc.rs.pub.net.ftp.FTPClient;
import com.rsc.rs.pub.net.ftp.FTPConnectMode;
import com.rsc.rs.pub.net.ftp.FTPTransferType;
import com.rsc.rsclient.Service;
import com.rsc.rsclient.ServiceFactory;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.ftp.FtpConfig;
import com.rsc.rsclient.ftp.FtpOperatorConfig;
import com.rsc.rsclient.http.ContentType;
import com.rsc.rsclient.parse.SuperParser;

/**
 * 处理附件的上传下载等操作请求
 * 
 * @author changhu
 */
public class AttachmentServlet extends ServiceServlet {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(AttachmentServlet.class);

	private ServletConfig config = null;

	private Service service = null;

	public void init(ServletConfig config) {
		this.config = config;
		this.service = ServiceFactory.getService(this, AttachmentService.class);
	}

	public void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String uploadType = request.getParameter("uploadType") ;
		if(uploadType != null){
			request.setCharacterEncoding("UTF-8") ;
		}
		String method = this.getRsMethod(request);
		if(method == null){
			method = "read" ;
		}
		String accept = this.getRsAccept(request);
		String rsDataType = this.getRsDataType(request);
		VariablePool variablePool = this.getVariablePool(request, response, rsDataType);
		variablePool.add("fileDir", String.class,request.getParameter("fileDir"));
		variablePool.add("attachmentId", String.class,request.getParameter("attachmentId"));
		variablePool.add("attachmentIndex", String.class,request.getParameter("attachmentIndex"));
		System.out.println("" + Thread.currentThread().getId() 
				+ " rsMethod " + method + " variablePool :" + variablePool);
		VariableAbstract returnValue = this.service.run(method, variablePool);
		if (method.equals("upload")) {
			response.setContentType(ContentType.get(accept) + "; charset=" + ContentType.getEncoding());
			String content = SuperParser.unmarshal("json", returnValue.getValue(),returnValue.getName());
			System.out.println("" + Thread.currentThread().getId() + " response:" + content);
			PrintWriter writer = response.getWriter();
			writer.write(content != null ? content : "");
			writer.flush();
			writer.close();
		} else if(method.equals("download")){
	        // 清空response
	        response.reset();
	        // 设置response的Header
	        response.addHeader("Content-Disposition", "attachment;filename=" + new String(request.getParameter("filename").getBytes("GBK"), "ISO8859-1"));
	        OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
	        response.setContentType(ContentType.get(accept));
	        toClient.write((byte[])returnValue.getValue());
	        toClient.flush();
	        toClient.close();
		} else if(method.equals("downloadFile")){
	        // 清空response
	        response.reset();
	        // 设置response的Header
	        response.addHeader("Content-Disposition", "attachment;filename=" + new String("全部附件包.zip".getBytes("GBK"), "ISO8859-1"));
	        OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
	        response.setContentType(ContentType.get(accept));
	        toClient.write((byte[])returnValue.getValue());
	        toClient.flush();
	        toClient.close();
		} else if(method.equals("deleteFile")){
			response.reset();
			response.setContentType(ContentType.get(accept) + "; charset=" + ContentType.getEncoding());
			String content = SuperParser.unmarshal("json", returnValue.getValue(),returnValue.getName());
			System.out.println("" + Thread.currentThread().getId() + " response:" + content);
			PrintWriter writer = response.getWriter();
			writer.write(content != null ? content : "");
			writer.flush();
			writer.close();
		} else if(method.equals("read")){//请求文件，文件将以流数据返回
			String filepath = returnValue.getValue().toString() ;
			response.reset();
			ServletOutputStream writer = response.getOutputStream();
			if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())){ 
				FileInputStream fis = new FileInputStream(filepath);
				byte[] buf = new byte[1000];
				int len = 0;
				while ((len = fis.read(buf)) != -1) {
					writer.write(buf, 0, len);
				}
			} else {
				FTPClient ftp = new FTPClient(FtpConfig.getFTPHost(), FtpConfig
						.getFTPPort());
				ftp.login(FtpConfig.getFTPUser(), FtpConfig.getFTPPass());
				ftp.setType(FTPTransferType.BINARY);
				ftp.setConnectMode(FTPConnectMode.ACTIVE);
				byte[] fbyte = ftp.get(filepath);
				writer.write(fbyte);
				writer.flush();
				writer.close();
				ftp.quit() ;
			}
		} else if(method.equals("preview")){
			Map map = (Map) returnValue.getValue() ;
			String contentType = (String) map.get("contentType") ;
			ServletOutputStream writer = response.getOutputStream();
			if(contentType != null){
				String filePath = (String) map.get("filePath") ;
				String fileName = new String(request.getParameter("filename").getBytes("GBK"), "ISO8859-1") ;
				response.setContentType(contentType);
				response.addHeader("Content-Disposition", "inline;filename=" + fileName);
				FileInputStream fis = new FileInputStream(filePath);
				byte[] buf = new byte[1024];
				int len = 0;
				while ((len = fis.read(buf)) != -1) {
					writer.write(buf, 0, len);
				}
				fis.close() ;
			} else {
				writer.write("不支持该格式的文件预览".getBytes()) ;
			}
			writer.flush() ;
			writer.close() ;
		}
	}
}
