package com.rsc.rsclient.servlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.rsc.mainframe.control.web.CustomerWebImpl;
import com.rsc.mainframe.control.web.ModelManager;
import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.JSPDBAccessor;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.exception.ServiceException;

/**
 * �̳���{@link javax.servlet.http.HttpServlet}����װ�˶��û���¼��Ϣ����֤�������
 * ��û�е�¼������ʾ�û��ѵ��ߡ����󷽷�
 * {@link ServiceValidate#doService(HttpServletRequest, HttpServletResponse)}
 * �����˴����û�����Ľӿڣ��ó������������ {@link StateServlet}��{@link GeneralselServlet}��
 * 
 * @author changhu
 */
public abstract class ServiceValidate extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	/**
	 * ��֤�û���¼��Ϣ��
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public final boolean validate(HttpServletRequest request) throws Exception {
		HttpSession session = ((HttpServletRequest) request).getSession();
		ModelManager mm = (ModelManager) session
				.getAttribute(WebKeys.ModelManagerKey);
		if (mm != null) {
			CustomerWebImpl cu = (CustomerWebImpl) mm.getCustomerWebImpl();
			if (cu.isLoggedIn()) {
				request.setAttribute(WebKeys.CompanyCodeKey, cu
						.getCompanyCode());
				request.setAttribute(WebKeys.UserUniqueIdKey, cu
						.getUserUniqueId());
				request.setAttribute(WebKeys.UsercodeKey, cu.getUserCode());
				request.setAttribute("userName", cu.getUserName()); // �û���
				request.setAttribute(WebKeys.DbType, cu.getDbType());
				String sessionCode = cu.getSessionCode();
				request.setAttribute(WebKeys.SessionCodeKey, sessionCode);
				SelRs rsSr = JSPDBAccessor.getSelRs(request, sessionCode,
						"sys", "sys");
				request.setAttribute(WebKeys.SelRsKey, rsSr);
				return true;
			} else {
				throw new ServiceException("offline");
			}
		} else {
			throw new ServiceException("ModelManager is null " + mm);
		}
	}
}
