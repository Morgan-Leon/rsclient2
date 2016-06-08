package com.rsc.rsclient.servlet;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class ServiceJsp extends ServiceValidate {

	private static final long serialVersionUID = 1L;

	private static Logger logger = Logger.getLogger(ServiceServlet.class);

	class URLTemplate {

		private String template;

		private String regex = "(\\{{1}?)\\S*(\\}{1}?)";

		int start = 0;

		int end = 0;
		
		private Map urlPool = Collections.synchronizedMap(new HashMap());

		public URLTemplate(String template) {
			this.template = template;
			Matcher m = Pattern.compile(this.regex).matcher(template);
			if (m.find()) {
				String temp = m.group();
				String regex2 = "(\\[{1}?)((-?)\\d+)?,?((-?)\\d+)?(\\]{1}?)";
				Matcher m2 = Pattern.compile(regex2).matcher(temp);
				if (m2.find()) {
					temp = m2.group();
					if (temp.startsWith("[")) {
						temp = temp.substring(1);
					}
					if (temp.endsWith("]")) {
						temp = (String) temp.substring(0, temp.length() - 1);
					}
					String[] se = temp.split(",");
					if (se != null) {
						if (se.length >= 1 && !"".equals(se[0])) {
							this.start = Integer.parseInt(se[0]);
						}
						if (se.length >= 2 && !"".equals(se[1])) {
							this.end = Integer.parseInt(se[1]);
						}
					}
				}
			}
		}
		
		public String format(String str) {
			if(this.urlPool.containsKey(str)){
				return (String)this.urlPool.get(str);
			};
			int s = 0, e = 0;
			String str2 = new String(str);
			int len = str2.length();
			if (this.start < 0) {
				s = len + this.start;
			} else {
				s = this.start;
			}
			if (this.end < 0) {
				e = len + this.end;
			} else if (this.end == 0) {
				e = len;
			} else {
				e = this.end;
			}
			if (s < e && s < len && e < len) {
				str2 = str2.substring(s, e);
			}
			String temp = new String(this.template).replaceAll(this.regex, str2);
			this.urlPool.put(str, temp);
			return temp;
		}
	}

	private ServletConfig config;

	private URLTemplate template;

	public void init(ServletConfig config) {
		try {
			super.init(config);
		} catch (ServletException e) {
			e.printStackTrace();
		}
		this.config = config;

		// 构建URLTemplate
		String temp = config.getInitParameter("URLTemplate");
		if (temp != null && !"".equals(temp)) {
			this.template = new URLTemplate(temp);
		}
	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			if (this.validate(req)) {
				String uri = ((HttpServletRequest) req).getRequestURI();
				if (this.template != null) {
		 			uri = this.template.format(uri);
					logger.debug("URI:" + uri);
					this.config.getServletContext().getRequestDispatcher(uri)
							.forward(req, resp);
				} else {
					throw new RuntimeException("URI配置错误");
				}
			} else {
				throw new RuntimeException("用户已掉线");
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
			resp.sendError(500, e.getMessage());
		}
	}

}
