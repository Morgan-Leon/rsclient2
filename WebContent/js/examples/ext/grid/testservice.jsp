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
			log("read--------------------------------------------------");

			//查询数据
			String pm_flag = (String) data.get("pm_flag");

			String sql = "SELECT item_code as code, item_name as name, plan_price as price FROM inv_master "
					+ " WHERE company_code = '"
					+ companyCode
					+ "' and plan_price IS NOT NULL and pm_flag = '"
					+ pm_flag
					+ "'";
			
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
			
			log(sql);
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("CODE", rs.getString(1));
				map.put("NAME", rs.getString(2));
				map.put("PRICE", new Double(rs.getDouble(3)));

				items.add(map);
			}
			data.setData(items);
		    
			//获取总数
			sql = "SELECT count(*) FROM inv_master "
					+ " WHERE company_code = '" + companyCode
					+ "' and plan_price IS NOT NULL  and pm_flag = '" + pm_flag
					+ "'";
			ResultSet rs2 = rsSr.getRs(sql);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
			
			//合计
			Map summaryData = new HashMap();
			summaryData.put("PRICE", new Double(9999));
		    data.setSummaryData(summaryData);
		}

	}%>