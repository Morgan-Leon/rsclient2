package com.rsc.rsclient.release;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;

public class ReleaseRsExtJs {
	
	private static Logger logger = Logger.getLogger(ReleaseRsExtJs.class);
	
	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
	
	public static void main(String[] args) {
		releaseJS(Release.DIR);
		releaseCSS(Release.DIR);
	}

	public static void releaseJS(String dir) {
		String path = Thread.currentThread().getContextClassLoader()
				.getResource("rs_ext_js_list.txt").getFile();
		try {
			
			
			File file = new File(dir + "rs/ext/rs-ext-debug.js");
			file.delete();
			file.createNewFile();
			
			BufferedWriter bw = new BufferedWriter(new FileWriter(file));
			
			bw.write("//版本更新时间:" + df.format(new Date())) ;
			
			List list = readFile(path);
			for (Iterator i = list.iterator(); i.hasNext();) {
				String fileName = dir + i.next();
				logger.info("正在读取文件：" + fileName);
				writeFile(fileName, bw);
			}
			bw.flush();
			bw.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void releaseCSS(String dir) {
		String path = Thread.currentThread().getContextClassLoader()
				.getResource("rs_ext_css_list.txt").getFile();
		try {

			File file = new File(dir + "rs/ext/resources/css/rs-ext-all.css");
			file.delete();
			file.createNewFile();
			BufferedWriter bw = new BufferedWriter(new FileWriter(file));
			bw.write("//版本更新时间:" + df.format(new Date())) ;
			List list = readFile(path);
			for (Iterator i = list.iterator(); i.hasNext();) {
				String fileName = dir + i.next();
				logger.info("正在读取文件：" + fileName);
				writeFile(fileName, bw);
			}
			bw.flush();
			bw.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static List readFile(String path) throws Exception {
		List list = new ArrayList();
		DataInputStream in = new DataInputStream(new FileInputStream(path));
		BufferedReader br = new BufferedReader(new InputStreamReader(in));
		String line;
		while ((line = br.readLine()) != null) {
			if (!"".equals(line.trim()) && !line.trim().startsWith("--")) {
				list.add(line);
			}
		}
		br.close();
		return list;
	}

	public static void writeFile(String from, BufferedWriter bw)
			throws Exception {
		DataInputStream in = new DataInputStream(new FileInputStream(from));
		BufferedReader br = new BufferedReader(new InputStreamReader(in));
		String line;
		while ((line = br.readLine()) != null) {
			bw.newLine();
			bw.write(line);
		}
		br.close();
	}
}
