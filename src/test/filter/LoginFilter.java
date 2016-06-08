package test.filter;

import java.beans.Beans;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.rsc.mainframe.control.web.CustomerWebImpl;
import com.rsc.mainframe.control.web.ModelManager;
import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.parse.JSONParser;

public class LoginFilter implements Filter {

	private static Logger logger = Logger.getLogger(JSONParser.class);

	FilterConfig config;

	String requestEncoding, responseEncoding;

	String companyCode, userId, dbType;

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding(requestEncoding);
		response.setCharacterEncoding(responseEncoding);
		try {
			String uri = ((HttpServletRequest) request).getRequestURI();
			logger.debug("URI:" + uri);

			// 设置登录信息
			HttpSession session = ((HttpServletRequest) request).getSession();
			ModelManager modelManager = (ModelManager) Beans.instantiate(
					getClass().getClassLoader(),
					"com.rsc.mainframe.control.web.ModelManager");
			modelManager.init((ServletContext) this.config, session);
			CustomerWebImpl customer = modelManager.getCustomerWebImpl();

			customer.setCompanyCode(companyCode);
			customer.setUserUniqueId(userId);
			customer.setDbType(dbType);
			customer.setLoggedIn(true);
			session.setAttribute(WebKeys.ModelManagerKey, modelManager);

			// 如果访问的是JSP的，设置公司号，用户ID等信息。ervlet等的访问不需要设置。
			if (uri != null && uri.endsWith(".jsp")) {
				request.setAttribute(WebKeys.CompanyCodeKey, companyCode);
				request.setAttribute(WebKeys.UserUniqueIdKey, userId);
				request.setAttribute(WebKeys.SelRsKey, new SelRs("", "sys"));
				request.setAttribute(WebKeys.DbType, dbType);
			}
		} catch (Exception exc) {
			throw new ServletException(
					"Cannot create bean of class ModelManager");
		}
		chain.doFilter(request, response);
	}

	public void init(FilterConfig config) throws ServletException {
		config = config;
		requestEncoding = config.getInitParameter("requestEncoding");
		responseEncoding = config.getInitParameter("responseEncoding");
		companyCode = config.getInitParameter("companyCode");
		userId = config.getInitParameter("userId");
		dbType = config.getInitParameter("dbType");
	}

}
