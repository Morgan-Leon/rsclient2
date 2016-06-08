<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
	    
		//新增
        public void create(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
            log("create--------------------------------------------------");
            for (Iterator i = items.iterator(); i.hasNext();) {
            	log(""+i.next());
            }
        }

        //删除
        public void destroy(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
            log("destroy--------------------------------------------------");
            for (Iterator i = items.iterator(); i.hasNext();) {
            	log(""+i.next());
            }
        }

        //修改
        public void update(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
            log("update--------------------------------------------------");
            for (Iterator i = items.iterator(); i.hasNext();) {
                log(""+i.next());
            }
        }


		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
			
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
		}

	}%>