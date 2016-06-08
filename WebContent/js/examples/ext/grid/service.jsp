<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("read").addMapParameter("params").addObjectParameter(
					WebKeys.SelRsKey, SelRs.class).addStringParameter(
					WebKeys.CompanyCodeKey).addStringParameter(
					WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
					.setMapReturnValue();
		}

		//¶ÁÈ¡
		public Map read(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			StoreData data = new StoreData(params);
			String code = (String) data.get("node");
			Map map = new HashMap();
			String sql = null;
			String sql2 = null;
			if (code.equals("root")) {
				sql = "SELECT a.acct_code, a.acct_name, a.bottom_flag, rownum rn FROM gl_acct_tree a "
						+ " WHERE company_code = '"
						+ companyCode
						+ "' AND root_flag = 'Y'";
				sql2 = "SELECT count(*) FROM gl_acct_tree a WHERE company_code = '"
						+ companyCode + "' AND root_flag = 'Y'";
			} else {
				sql = "SELECT a.acct_code, a.acct_name, a.bottom_flag, rownum rn FROM gl_acct_tree a "
						+ " WHERE a.company_code = '"
						+ companyCode
						+ "' AND a.acct_code_f = '" + code + "'";
				sql2 = "SELECT count(*) FROM gl_acct_tree a WHERE company_code = '"
						+ companyCode + "' AND a.acct_code_f = '" + code + "'";
			}
			
			System.out.println(sql);
			System.out.println(sql2);
			
			if (sql != null) {
				ResultSet rs = rsSr.getRs(sql);
				List items = new ArrayList();
				while (rs.next()) {
					Map item = new HashMap();
					item.put("code", rs.getString(1));
					item.put("name", rs.getString(2));
					item.put("leaf", Boolean.valueOf("Y".equals(rs.getString(3))));
					items.add(item);
				}
				data.setData(items);
			}
			if (sql2 != null) {
				ResultSet rs = rsSr.getRs(sql2);
				if (rs.next()) {
					data.setTotal(rs.getInt(1));
				}
			}
			return data.getDataMap();
		}

	}%>