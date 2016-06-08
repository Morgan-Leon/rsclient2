<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		public void registerMethods(MethodMap mm) throws Exception {
			super.registerMethods(mm);
			mm.add("callSp").setBooleanReturnValue();
		}
		
		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			log("read--------------------------------------------------");

			//查询数据
			String pm_flag = (String) data.get("pm_flag");

			String sql = "SELECT item_code as code, item_name as name, plan_price as price "
					+ " FROM inv_master "
					+ " WHERE company_code = '"
					+ companyCode
					+ "' and plan_price IS NOT NULL  and pm_flag = '"
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
				map.put("code", rs.getString(1));
				map.put("name", rs.getString(2));
				map.put("price", new Double(rs.getDouble(3)));

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
		}
		
		public boolean callSp(){
			System.out.println("调用后台SP");
			return true;
		}
		
	}%>