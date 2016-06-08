<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("readItems").addMapParameter("params")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType)
					.setMapReturnValue();
		}

		public Map readItems(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			log("readItems -------------------------------------------------- ");
			StoreData storeData = new StoreData(params);
			List data = new ArrayList();			
			String pm_flag = (String)storeData.get("pm_flag");
			String sql = "SELECT item_code as code, item_name as name, plan_price as price "
					+ " FROM inv_master "
					+ " WHERE company_code = '"
					+ companyCode
					+ "' and plan_price IS NOT NULL  and pm_flag = '"
					+ pm_flag
					+ "' and rownum < 10";
			
			String sortInfo = storeData.getSortInfo();

			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			while(rs.next()){
				Map item = new HashMap();
				item.put("code", rs.getString(1));
				item.put("name", rs.getString(2));
				item.put("price", new Double(rs.getDouble(3)));
				data.add(item);
			}
			storeData.setData(data);
		    			
			return storeData.getDataMap();
		}
	}%>