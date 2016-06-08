<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		//新增
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}

		//删除
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}

		//修改
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}
	
		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			//查询数据
			String code = (String) data.get("code");
			String type = (String) data.get("type");
			
			String sql = null;
			String sql2 = null;
			if (code.equals("root")) {
				sql = "select 'type_root' as acct_code, a.type_code, a.type_name "
					+ " from gl_acct_gl_type a "
					+ " where a.company_code = '"
					+ companyCode + "' order by a.type_code";
				sql2 = "select count(*) "
					+ " from gl_acct_gl_type a "
					+ " where a.company_code = '"
					+ companyCode + "' order by a.type_code";
			} else {
				if (code.equals(type)) {
					sql = " SELECT t.acct_code, t.acct_type, t.acct_name, t.bottom_flag "
						+ " FROM gl_acct_tree t "
						+ " WHERE t.company_code = '"
						+ companyCode
						+ "' "
						+ "  AND t.acct_type = '"
						+ type
						+ "' " + "  AND t.root_flag = 'Y'";
					sql2 = " SELECT count(*) "
						+ " FROM gl_acct_tree t "
						+ " WHERE t.company_code = '"
						+ companyCode
						+ "' "
						+ "  AND t.acct_type = '"
						+ type
						+ "' " + "  AND t.root_flag = 'Y'";
				} else {
					sql = "SELECT t.acct_code, t.acct_type, t.acct_name, t.bottom_flag "
						+ " FROM gl_acct_tree t "
						+ " WHERE t.company_code = '"
						+ companyCode
						+ "' "
						+ "   AND t.acct_code_f = '"
						+ code
						+ "' " + "   AND t.acct_type = '" + type + "'";
					sql2 = "SELECT count(*) "
						+ " FROM gl_acct_tree t "
						+ " WHERE t.company_code = '"
						+ companyCode
						+ "' "
						+ "   AND t.acct_code_f = '"
						+ code
						+ "' " + "   AND t.acct_type = '" + type + "'";
				}
			}
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);

			log(sql);
			
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("acct_code", rs.getString(1));
				map.put("acct_type", rs.getString(2));
				map.put("acct_name", rs.getString(3));
				map.put("leaf", Boolean.valueOf("Y".equals(rs.getString(4))));
				
				items.add(map);
			}
			data.setData(items);

			//获取总数
			ResultSet rs2 = rsSr.getRs(sql2);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}

	}%>