package com.rsc.rsclient.servlet;

import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.http.ContentType;
import com.rsc.rsclient.parse.SuperParser;

public class UserInfoServlet extends ServiceServlet {

	private Map userInfoPool = Collections.synchronizedMap(new HashMap());

	public void doService(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String companyCode = (String) request
				.getAttribute(WebKeys.CompanyCodeKey);
		String userId = (String) request.getAttribute(WebKeys.UserUniqueIdKey);
		String key = "COMPANYCODE:" + companyCode + "USERID:" + userId;
		String userInfo = null;
		if (this.userInfoPool.containsKey(key)) {
			userInfo = (String) this.userInfoPool.get(key);
		} else {
			SelRs rsSr = (SelRs) request.getAttribute(WebKeys.SelRsKey);
			userInfo = this.getUserInfo(rsSr, companyCode, userId);
			this.userInfoPool.put(key, userInfo);
		}
		String accept = "js";
		response.setContentType(ContentType.get(accept) + "; charset=" + ContentType.getEncoding());
		PrintWriter writer = response.getWriter();
		writer.write(userInfo != null ? userInfo : "");
		writer.flush();
		writer.close();
	}

	public String getUserInfo(SelRs rsSr, String companyCode, String userId)
			throws Exception {
		Map map = new HashMap();
		map.put("COMPANYCODE", companyCode);
		map.put("USERID", userId);

		String sql = "select e.account_name, e.country, e.city, e.telephone, e.fax, e.postcode, e.office_address, e.mail, "
				+ " e.dept_code, e.dept_name, e.qq_id , s.company_name , e.account_id from edm_address e , sys_company s where e.company_code = '"
				+ companyCode + "' and e.user_unique_id = '" + userId + "' and e.company_code=s.company_code";

		ResultSet rs = rsSr.getRs(sql);
		if (rs != null && rs.next()) {
			String userName = rs.getString(1);
			if (userName != null && !"".equals(userName)) {
				map.put("USERNAME", userName);
			}
			String country = rs.getString(2);
			if (country != null && !"".equals(country)) {
				map.put("COUNTRY", country);
			}
			String city = rs.getString(3);
			if (city != null && !"".equals(city)) {
				map.put("CITY", city);
			}
			String telephone = rs.getString(4);
			if (telephone != null && !"".equals(telephone)) {
				map.put("TELEPHONE", telephone);
			}
			String fax = rs.getString(5);
			if (fax != null && !"".equals(fax)) {
				map.put("FAX", fax);
			}
			String postCode = rs.getString(6);
			if (postCode != null && !"".equals(postCode)) {
				map.put("POSTCODE", postCode);
			}
			String officeAddress = rs.getString(7);
			if (officeAddress != null && !"".equals(officeAddress)) {
				map.put("OFFICEADDRESS", officeAddress);
			}
			String mail = rs.getString(8);
			if (mail != null && !"".equals(mail)) {
				map.put("MAIL", mail);
			}
			String deptCode = rs.getString(9);
			if (deptCode != null && !"".equals(deptCode)) {
				map.put("DEPTCODE", deptCode);
			}
			String deptName = rs.getString(10);
			if (deptName != null && !"".equals(deptName)) {
				map.put("DEPTNAME", deptName);
			}
			String qq = rs.getString(11);
			if (qq != null && !"".equals(qq)) {
				map.put("QQ", qq);
			}
			
			String companyName = rs.getString(12);
			if (companyName != null && !"".equals(companyName)) {
				map.put("COMPANYNAME", companyName);
			}
			
			String userCode = rs.getString(13);
			if (userCode != null && !"".equals(userCode)) {
				map.put("USERCODE", userCode);
			}
		}
		
		String json = "USERINFO=" + SuperParser.unmarshal("json", map);
		return json;
	}

}
