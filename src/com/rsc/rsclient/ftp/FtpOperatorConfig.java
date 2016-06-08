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

/**
 * 
 * @author yang_coldice
 *
 */
public class FtpOperatorConfig {

	private static final String OPERATE_MODE = "operate-mode";
	private static final String ROOT_PATH = "root-path";
	private static final String ENCRYPT_FILE = "encrypt-file";

	private static Map registry;

	private static Logger logger = Logger.getLogger(FtpOperatorConfig.class);

	static {
		FtpOperatorConfig.registry = new HashMap();
		try {
			//标准环境
			FtpOperatorConfig.loadConfig(new URL(ConfigContainer.rootDir + "/WEB-INF/xml/config/ftpoperator.xml"));
			//myeclipse环境
			//FtpOperatorConfig.loadConfig(Thread.currentThread().getContextClassLoader().getResource("xml/config/ftpoperator.xml"));
		} catch (Exception e) {
			logger.debug("Not Found ftpoperator.xml");
			e.printStackTrace();
		}
	}

	private static void loadConfig(URL url) throws Exception {
		logger.debug("load config url:" + url);
		InputStream stream = url.openStream();
		DocumentBuilder builder = DocumentBuilderFactory.newInstance()
				.newDocumentBuilder();
		Document config = builder.parse(stream);
		NodeList uploadConfig = config.getElementsByTagName("ftp");
		if (uploadConfig != null && uploadConfig.getLength() >= 1) {
			Node upload = uploadConfig.item(0);
			NodeList nodeList = upload.getChildNodes();
			for (int i = 0, l = nodeList.getLength(); i < l; i++) {
				Node node = nodeList.item(i);
				String name = node.getNodeName();
				String value = node.getTextContent();
				if (OPERATE_MODE.equals(name)) {
					FtpOperatorConfig.registry.put(OPERATE_MODE, value);
				} else if (ROOT_PATH.equals(name)) {
					FtpOperatorConfig.registry.put(ROOT_PATH, value);
				} else if (ENCRYPT_FILE.equals(name)) {
					FtpOperatorConfig.registry.put(ENCRYPT_FILE, value);
				}
			}
		}
		stream.close();
	}
	
	public static String getOperateMode() {
		return (String) FtpOperatorConfig.registry.get(OPERATE_MODE);
	}
	
	public static String getRootPath() {
		return (String) FtpOperatorConfig.registry.get(ROOT_PATH);
	}
	
	public static String getEncryptFile() {
		return (String) FtpOperatorConfig.registry.get(ENCRYPT_FILE);
	}
}
