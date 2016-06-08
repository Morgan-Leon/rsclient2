package com.rsc.rsclient.ftp;

import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.rsc.mainframe.util.ConfigContainer;

public class FtpConfig {
	private static final String FILE_TEMP_PATH = "local-upload-temp-docu-path";
	private static final String FILE_PATH = "ftp-file-path";
	private static final String FILE_FTP_HOST = "ftp-host";
	private static final String FILE_FTP_PORT = "ftp-port";
	private static final String FILE_FTP_USER = "ftp-user";
	private static final String FILE_FTP_PASS = "ftp-pass";
	private static final String FILE_FTP_MODE = "ftp-mode";
	private static final String FILE_FTP_CONN_MODE = "ftp-conn-mode";
	private static final String FILE_FTP_PATH = "local_path";

	private static Map registry;

	private static Logger logger = Logger.getLogger(FtpConfig.class);

	static {
		FtpConfig.registry = new HashMap();
		try {
			//标准环境
			FtpConfig.loadConfig(new URL(ConfigContainer.rootDir + "/WEB-INF/xml/config/upload.xml"));
			//myeclipse环境
			//FtpConfig.loadConfig(Thread.currentThread().getContextClassLoader().getResource("xml/config/upload.xml"));
		} catch (Exception e) {
			logger.debug("Not Found upload.xml") ;
			e.printStackTrace();
		}
	}

	private static void loadConfig(URL url) throws Exception {
		logger.debug("load config url:" + url);
		InputStream stream = url.openStream();
		DocumentBuilder builder = DocumentBuilderFactory.newInstance()
				.newDocumentBuilder();
		Document config = builder.parse(stream);
		NodeList uploadConfig = config.getElementsByTagName("upload");
		if (uploadConfig != null && uploadConfig.getLength() >= 1) {
			Node upload = uploadConfig.item(0);
			NodeList nodeList = upload.getChildNodes();
			for (int i = 0, l = nodeList.getLength(); i < l; i++) {
				Node node = nodeList.item(i);
				String name = node.getNodeName();
				String value = node.getTextContent();
				if (FILE_TEMP_PATH.equals(name)) {
					FtpConfig.registry.put(FILE_TEMP_PATH, value);
				} else if (FILE_PATH.equals(name)) {
					FtpConfig.registry.put(FILE_PATH, value);
				} else if (FILE_FTP_HOST.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_HOST, value);
				} else if (FILE_FTP_PORT.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_PORT, value);
				} else if (FILE_FTP_USER.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_USER, value);
				} else if (FILE_FTP_PASS.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_PASS, value);
				} else if (FILE_FTP_MODE.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_MODE, value);
				} else if (FILE_FTP_CONN_MODE.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_CONN_MODE, value);
				} else if (FILE_FTP_PATH.equals(name)) {
					FtpConfig.registry.put(FILE_FTP_PATH, value);
				}
			}
		}
		stream.close();
	}

	public static String getTempPath() {
		return (String) FtpConfig.registry.get(FILE_TEMP_PATH);
	}

	public static String getPath() {
		return (String) FtpConfig.registry.get(FILE_PATH);
	}

	public static String getFTPHost() {
		return (String) FtpConfig.registry.get(FILE_FTP_HOST);
	}

	public static int getFTPPort() {
		return Integer.parseInt((String) FtpConfig.registry.get(FILE_FTP_PORT));
		/*return new Integer((String) FtpConfig.registry.get(FILE_FTP_PORT));*/
	}

	public static String getFTPUser() {
		return (String) FtpConfig.registry.get(FILE_FTP_USER);
	}

	public static String getFTPPass() {
		return (String) FtpConfig.registry.get(FILE_FTP_PASS);
	}

	public static String getFTPMode() {
		return (String) FtpConfig.registry.get(FILE_FTP_MODE);
	}

	public static String getFTPConnMode() {
		return (String) FtpConfig.registry.get(FILE_FTP_CONN_MODE);
	}

	public static String getLocalPath() {
		return (String) FtpConfig.registry.get(FILE_FTP_PATH);
	}
}
