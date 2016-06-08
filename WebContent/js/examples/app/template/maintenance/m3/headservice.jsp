<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>

<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="com.rsc.rsclient.*"%>

<%@ page import="com.rsc.rs.pub.dbUtil.*"%>
<%@ page import="com.rsc.rs.pub.util.*"%>
<%@ page import="com.rsc.rs.pub.util.functions.*"%>


<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
	    this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("getHead").addStringParameter("record_no")
					.addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setMapReturnValue();
		}

		//·ÖÒ³Ê÷²éÑ¯
		public Map getHead(String receive_no, SelRs rsSr, 
                String companyCode, String userId)throws Exception {
			String sql = "select receive_no, vendor_abv, receive_date," 
                + " type_desc, buyer_name, receive_amt, vendor_code, special_class, buyer_code, group_id" 
                + " from pm_receive_head where company_code='" + companyCode + "'" 
                + " and receive_no='" + receive_no + "'";
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
            Map map = new HashMap();
			while (rs != null && rs.next()) {
				map.put("receive_no", rs.getString(1));
				map.put("vendor_abv", rs.getString(2));
				map.put("receive_date", rs.getString(3));
                map.put("type_desc", rs.getString(4));
                map.put("buyer_name", rs.getString(5));
                map.put("receive_amt", rs.getString(6));
                map.put("vendor_code", rs.getString(7));
                map.put("special_class", rs.getString(8));
                map.put("buyer_code", rs.getString(9));
                map.put("group_id", rs.getString(10));
			}
            return map;
		}
	}%>