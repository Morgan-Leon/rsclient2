package test.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class RsDocEncodingFilter implements Filter {

	private String requestEncoding, responseEncoding;

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding(requestEncoding);
		response.setCharacterEncoding(responseEncoding);
		chain.doFilter(request, response);
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		requestEncoding = filterConfig.getInitParameter("requestEncoding");
		if (requestEncoding == null) {
			requestEncoding = "UTF-8";
		}
		responseEncoding = filterConfig.getInitParameter("responseEncoding");
		if (responseEncoding == null) {
			responseEncoding = "UTF-8";
		}
	}

	public void destroy() {

	}
}
