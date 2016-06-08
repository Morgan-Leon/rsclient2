package com.test;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import org.apache.log4j.Logger;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import com.rsc.rsclient.exception.ParserException;

public class Test {

	private static Logger logger = Logger.getLogger(Test.class);

	static {
		try {
			Test.loadConfig(Thread.currentThread().getContextClassLoader()
					.getResource("com/rsc/rsclient/resource/mime-config.xml"));

		} catch (ParserException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 加载配置文件并注册Parser
	 * 
	 * @param url
	 *            文件UIL
	 * @throws ParserException
	 * @throws JDOMException
	 */
	private static void loadConfig(URL url) throws ParserException,
			JDOMException {
		logger.debug("load config url:" + url);
		try {
			SAXBuilder builder = new SAXBuilder();
			Document doc = builder.build(url);
			Element root = doc.getRootElement();
			logger.debug(root.getName());
			List mimemaps = root.getChildren();
			for (int i = 0, l = mimemaps.size(); i < l; i++) {
				Element mimes = (Element) mimemaps.get(i);
				List nodeList = mimes.getChildren();
				String extension = null, mimeType = null;
				for (int j = 0, k = nodeList.size(); j < k; j++) {
					Element node = (Element) nodeList.get(j);
					String name = node.getName();
					if ("extension".equals(name.toLowerCase())) {
						extension = node.getText();
					} else if ("mime-type".equals(name.toLowerCase())) {
						mimeType = node.getText();
					}
				}
				if (extension != null && mimeType != null) {
					logger.debug(extension + ":" + mimeType);
					// ContentType.registry.put(extension.toUpperCase(),
					// mimeType);
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			throw new ParserException("Cannot open stream from given url:"
					+ url.toExternalForm());
		}
	}

	public static void main(String[] args) {
		System.out.println(Test.class);
	}

}
