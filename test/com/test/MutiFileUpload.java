package com.test;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import java.util.Iterator;

import java.util.List;

import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;

import org.apache.commons.fileupload.FileUploadException;

import org.apache.commons.fileupload.disk.DiskFileItemFactory;

import org.apache.commons.fileupload.servlet.ServletFileUpload;

/**
 * 
 * @author chb
 * 
 * 
 */

public class MutiFileUpload extends HttpServlet {

	private static final long serialVersionUID = 670829239023754119L;

	protected Map parameters;// 保存普通form表单域

	protected Map files;// 保存上传的文件

	/**
	 * 
	 * The directory in which uploaded files will be stored, if stored on disk.
	 */

	private int sizeThreshold = DiskFileItemFactory.DEFAULT_SIZE_THRESHOLD;

	/**
	 * 
	 * The maximum size permitted for the complete request, as opposed to
	 * 
	 * {@link #fileSizeMax}. A value of -1 indicates no maximum.
	 */

	private long sizeMax = -1;

	private String encoding = "utf-8";// 字符编码，当读取上传表单的各部分时会用到该encoding

	public String getEncoding() {

		return encoding;

	}

	public void setEncoding(String encoding) {

		this.encoding = encoding;

	}

	public long getSizeMax() {

		return sizeMax;

	}

	public void setSizeMax(long sizeMax) {

		this.sizeMax = sizeMax;

	}

	public int getSizeThreshold() {

		return sizeThreshold;

	}

	public void setSizeThreshold(int sizeThreshold) {

		this.sizeThreshold = sizeThreshold;

	}

	public void parse(HttpServletRequest request) {

		parameters = new HashMap();

		files = new HashMap();

		// Create a factory for disk-based file items

		DiskFileItemFactory factory = new DiskFileItemFactory();

		// Set factory constraints

		factory.setSizeThreshold(sizeThreshold);

		// factory.setRepository(repository);

		// Create a new file upload handler

		ServletFileUpload upload = new ServletFileUpload(factory);

		// Set overall request size constraint

		upload.setSizeMax(sizeMax);

		upload.setHeaderEncoding(encoding);

		try {

			List items = upload.parseRequest(request);

			Iterator iterator = items.iterator();

			while (iterator.hasNext()) {

				FileItem item = (FileItem) iterator.next();

				if (item.isFormField()) {

					String fieldName = item.getFieldName();

					String value = item.getString();

					parameters.put(fieldName, value);

				} else {

					String fieldName = item.getFieldName();

					files.put(fieldName, item);

				}

			}

		} catch (FileUploadException e) {

			e.printStackTrace();

		}

	}

	/**
	 * 得到上传文件的文件名
	 * 
	 * @param item
	 * 
	 * @return
	 */

	public String getFileName(FileItem item) {

		String fileName = item.getName();

		fileName = replace(fileName, "\\", "/");

		fileName = fileName.substring(fileName.lastIndexOf("/") + 1);

		return fileName;

	}

	/**
	 * 字符串替换
	 * 
	 * @param source
	 * 
	 * @param oldString
	 * 
	 * @param newString
	 * 
	 * @return
	 */

	public static String replace(String source, String oldString,
			String newString) {

		StringBuffer output = new StringBuffer();

		int lengthOfSource = source.length();

		int lengthOfOld = oldString.length();

		int posStart = 0;

		int pos;

		while ((pos = source.indexOf(oldString, posStart)) >= 0) {

			output.append(source.substring(posStart, pos));

			output.append(newString);

			posStart = pos + lengthOfOld;

		}

		if (posStart < lengthOfSource) {

			output.append(source.substring(posStart));

		}

		return output.toString();

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		parse(request);
		
		System.out.println(parameters.get("possess"));
		
		Iterator iterator = files.values().iterator();
		while (iterator.hasNext()) {
			FileItem item = (FileItem) iterator.next();
			String fileName = getFileName(item);
			File file = new File("/root/upload/" + fileName);
			try {
				item.write(file);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}