<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType) throws Exception {
			log("--->" +  data.toString());
			log("--->" +  items.toString());
		}
		
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType) throws Exception {
			Map map = (Map)items.get(0) ;
			String sql = "update test_chart set v1=" + map.get("v1") + " , v2=" + map.get("v2") + " , v3=" + map.get("v3") + " where month='" + map.get("month") + "'"  ;
			log("update_sql-->" + sql) ;
			rsSr.update(sql) ;
		};    
		
		
		//¶ÁÈ¡
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			
			String sql = "select * from test_chart" ;
			String sqlnum = "select count(1) from test_chart" ;
			
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
			
			
	        
	        List item = new ArrayList();
	        
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				
				Map dataMap = new  HashMap() ;
				dataMap.put("v1",rs.getInt(1));				
				dataMap.put("v2",rs.getInt(2));				
				dataMap.put("v3",rs.getInt(3));	
				dataMap.put("month",rs.getString(4));	
				
				item.add(dataMap);
			}
			
			data.setData(item) ;
			
		}
	}%>