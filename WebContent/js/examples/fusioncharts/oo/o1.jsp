<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType) throws Exception {
			
			for(int i=0;i<items.size();i++){
				Map map = (Map)items.get(i) ;
				String keyValue = map.remove("month").toString() ;
				Iterator iter = map.entrySet().iterator();
				
				StringBuffer buf = new StringBuffer() ;
				
				while (iter.hasNext()) {  
				          Map.Entry e = (Map.Entry) iter.next();  
				          buf.append(e.getKey() + "=" + e.getValue() + ",") ;
				} 
				String modify = buf.substring(0,buf.lastIndexOf(",")) ;
				String sql = "update test_chart set " + modify + " where month='" + keyValue + "'"  ;
				rsSr.update(sql) ;
			}
		}
		
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType) throws Exception {
			
		}  
		
		
		
		//¶ÁÈ¡
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			String sql = "select v1,v2,v3,month from test_chart" ;
			
			String sortInfo = data.getSortInfo();

			
			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);

			List item = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map dataMap = new  HashMap() ;
				dataMap.put("v1",rs.getString(1));				
				dataMap.put("v2",rs.getString(2));				
				dataMap.put("v3",rs.getString(3));	
				dataMap.put("month",rs.getString(4));	
				
				item.add(dataMap);
				
			}
			data.setData(item) ;
			
		}
	}%>