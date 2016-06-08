<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("getSubAccounts").addStringParameter("code")
					.addStringParameter("type").addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setListReturnValue();

			mm.add("getSubAccountsPaging").addStringParameter("code")
					.addStringParameter("type").addIntegerParameter("limit")
					.addIntegerParameter("start").addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setMapReturnValue();

			mm.add("getSubAccountsPaging2").addStringParameter("code")
					.addIntegerParameter("limit").addIntegerParameter("start")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.setMapReturnValue();

			mm.add("search").addStringParameter("keyWord").addObjectParameter(
					WebKeys.SelRsKey, SelRs.class).addStringParameter(
					WebKeys.CompanyCodeKey).addStringParameter(
					WebKeys.UserUniqueIdKey).setListReturnValue();
		}

		public List getSubAccounts(String code, String type, SelRs rsSr,
				String companyCode, String userId) throws Exception {
			log("code:" + code + " type:" + type);
			if (code.equals("root")) {
				return this.getGlAccountTypes(rsSr, companyCode, userId);
			} else {
				if (code.equals(type)) {
					return this
							.getBaseAccounts(type, rsSr, companyCode, userId);
				} else {
					return this.getRealSubAccounts(code, type, rsSr,
							companyCode, userId);
				}
			}
		}

		private List getGlAccountTypes(SelRs rsSr, String companyCode,
				String userId) throws Exception {
			String sql = "select a.type_code as acct_code, a.type_code, a.type_name "
					+ " from gl_acct_gl_type a "
					+ " where a.company_code = '"
					+ companyCode + "' order by a.type_code";
			log(sql);
			List list = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("type", rs.getString(2));
				map.put("text", rs.getString(3));
				map.put("leaf", Boolean.valueOf(false));

				list.add(map);
			}
			return list;
		}

		private List getBaseAccounts(String type, SelRs rsSr,
				String companyCode, String userId) throws Exception {
			String sql = " SELECT t.acct_code, t.acct_name, t.acct_type, t.bottom_flag "
					+ " FROM gl_acct_tree t "
					+ " WHERE t.company_code = '"
					+ companyCode
					+ "' "
					+ "  AND t.acct_type = '"
					+ type
					+ "' " + "  AND t.root_flag = 'Y'";
			log(sql);
			List list = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("text", rs.getString(2));
				map.put("type", rs.getString(3));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(4))));

				list.add(map);
			}
			return list;
		}

		private List getRealSubAccounts(String code, String type, SelRs rsSr,
				String companyCode, String userId) throws Exception {
			String sql = "SELECT t.acct_code, t.acct_type, t.acct_name, t.bottom_flag "
					+ " FROM gl_acct_tree t "
					+ " WHERE t.company_code = '"
					+ companyCode
					+ "' "
					+ "   AND t.acct_code_f = '"
					+ code
					+ "' " + "   AND t.acct_type = '" + type + "'";
			log(sql);
			List list = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("type", rs.getString(2));
				map.put("text", rs.getString(3));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(4))));

				list.add(map);
			}
			return list;
		}

		//分页树查询
		public Map getSubAccountsPaging(String code, String type, int limit,
				int start, SelRs rsSr, String companyCode, String userId)
				throws Exception {
			log("code:" + code + " type:" + type + " limit:" + limit
					+ " start:" + start);
			Map map = new HashMap();
			int childTotal = 0;
			List list = null;
			if (code.equals("root")) {
				list = this.getGlAccountTypes(rsSr, companyCode, userId);
				childTotal = list.size();
			} else {
				if (code.equals(type)) {
					list = this.getBaseAccounts(type, limit, start, rsSr,
							companyCode, userId);
					childTotal = this.getBaseAccountsCount(type, rsSr,
							companyCode, userId);
				} else {
					list = this.getRealSubAccounts(code, type, limit, start,
							rsSr, companyCode, userId);
					childTotal = this.getRealSubAccountsCount(code, type, rsSr,
							companyCode, userId);
				}
			}
			if (list != null) {
				map.put("nodes", list);
			}
			map.put("childTotal", new Integer(childTotal));
			return map;
		}

		private List getBaseAccounts(String type, int limit, int start,
				SelRs rsSr, String companyCode, String userId) throws Exception {
			String sql = "SELECT *FROM (SELECT t.acct_code, t.acct_name, t.acct_type, t.bottom_flag, rownum AS rn"
					+ " FROM gl_acct_tree t "
					+ " WHERE t.company_code = '"
					+ companyCode
					+ "' "
					+ "  AND t.acct_type = '"
					+ type
					+ "' "
					+ "  AND t.root_flag = 'Y') b WHERE b.rn > "
					+ start
					+ " AND rownum <= " + limit;
			log(sql);
			List list = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("text", rs.getString(2));
				map.put("type", rs.getString(3));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(4))));

				list.add(map);
			}
			return list;
		}

		public int getBaseAccountsCount(String type, SelRs rsSr,
				String companyCode, String userId) throws Exception {
			String sql = "SELECT count(*) FROM gl_acct_tree t "
					+ " WHERE t.company_code = '" + companyCode + "' "
					+ "  AND t.acct_type = '" + type + "' "
					+ "  AND t.root_flag = 'Y'";
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				return rs.getInt(1);
			} else {
				return 0;
			}
		}

		private List getRealSubAccounts(String code, String type, int limit,
				int start, SelRs rsSr, String companyCode, String userId)
				throws Exception {
			String sql = "SELECT *FROM (SELECT t.acct_code, t.acct_type, t.acct_name, t.bottom_flag, rownum AS rn "
					+ " FROM gl_acct_tree t "
					+ " WHERE t.company_code = '"
					+ companyCode
					+ "' "
					+ "   AND t.acct_code_f = '"
					+ code
					+ "' "
					+ "   AND t.acct_type = '"
					+ type
					+ "') b WHERE b.rn > " + start + " AND rownum <= " + limit;
			log(sql);
			List list = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("type", rs.getString(2));
				map.put("text", rs.getString(3));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(4))));

				list.add(map);
			}
			return list;
		}

		private int getRealSubAccountsCount(String code, String type,
				SelRs rsSr, String companyCode, String userId) throws Exception {
			String sql = "SELECT count(*) FROM gl_acct_tree t "
					+ " WHERE t.company_code = '" + companyCode + "' "
					+ " AND t.acct_code_f = '" + code + "' "
					+ " AND t.acct_type = '" + type + "'";
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				return rs.getInt(1);
			} else {
				return 0;
			}
		}

		//分页查询
		public Map getSubAccountsPaging2(String code, int limit, int start,
				SelRs rsSr, String companyCode, String userId) throws Exception {
			log("code:" + code + " limit:" + limit + " start:" + start);
			Map map = new HashMap();
			String sql = null;
			String sql2 = null;
			if (code.equals("root")) {
				sql = "SELECT b.acct_code, b.acct_name, b.bottom_flag "
						+ "  FROM (SELECT a.acct_code, a.acct_name, a.bottom_flag, rownum rn "
						+ "           FROM gl_acct_tree a "
						+ "          WHERE company_code = '" + companyCode
						+ "' " + "            AND root_flag = 'Y') b "
						+ " WHERE b.rn > " + start + "   AND rownum <= "
						+ limit;
				sql2 = "SELECT count(*) FROM gl_acct_tree a WHERE company_code = '"
						+ companyCode + "' AND root_flag = 'Y'";
			} else {
				sql = "SELECT b.acct_code, b.acct_name, b.bottom_flag "
						+ "  FROM (SELECT a.acct_code, a.acct_name, a.bottom_flag, rownum rn "
						+ "           FROM gl_acct_tree a "
						+ "          WHERE a.company_code = '" + companyCode
						+ "' " + "            AND a.acct_code_f = '" + code
						+ "') b " + " WHERE b.rn > " + start
						+ "   AND rownum <= " + limit;
				sql2 = "SELECT count(*) FROM gl_acct_tree a WHERE company_code = '"
						+ companyCode + "' AND a.acct_code_f = '" + code + "'";
			}
			if (sql != null) {
				map.put("nodes", this.getSubAccountBySql(sql, rsSr));
			}
			if (sql2 != null) {
				map.put("childTotal", new Integer(this.getSubAccountCountBySql(
						sql2, rsSr)));
			}
			return map;
		}

		private List getSubAccountBySql(String sql, SelRs rsSr)
				throws Exception {
			ResultSet rs = rsSr.getRs(sql);
			List list = new ArrayList();
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("code", rs.getString(1));
				map.put("text", rs.getString(2));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(3))));

				list.add(map);
			}
			return list;
		}

		private int getSubAccountCountBySql(String sql, SelRs rsSr)
				throws Exception {
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				return rs.getInt(1);
			} else {
				return 0;
			}
		}

		/**
		 * 查询
		 */
		public List search(String kw, SelRs rsSr, String companyCode,
				String userId) throws Exception {
            List list = new ArrayList();
            log("关键字:" + kw);
            if(kw == null || "".equals(kw)){
                return list;
            }else {
                String sql = "select '/root/' || a.acct_type || SYS_CONNECT_BY_PATH(a.acct_code_f, '/') || '/' || a.acct_code path "
                    + "    from gl_acct_tree a "
                    + "   where a.company_code = '" + companyCode + "'"
                    + "    start with (a.acct_code in "
                    + "            (select distinct b.acct_code "
                    + "                from gl_acct_tree b "
                    + "             where b.company_code = '" + companyCode + "' "
                    + "                and (b.acct_code like '" + kw + "%' or b.acct_name like '" + kw + "%')))"
                    + "  connect by (prior a.acct_code = a.acct_code_f) "
                    + "         and (prior a.company_code = a.company_code)";
                log(sql);
                ResultSet rs = rsSr.getRs(sql);
                while(rs != null && rs.next()){
                    list.add(rs.getString(1));
                }
			    return list;
            }
		}
	}%>