<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends ChartService {
		
		
		public void update(ChartStoreData data, List items, SelRs rsSr,
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
		
		public void create(ChartStoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType) throws Exception {
		};    
		
		
		
		//¶ÁÈ¡
		public void read(ChartStoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			
			String sql = "select * from test_chart" ;
			String sqlnum = "select count(1) from test_chart" ;
			
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
			
			
			ChartConfig cc = new ChartConfig() ;
			cc.setCaption("Product Sales & Downloads") ;
			cc.setShowvalues("0") ;
			cc.getChartMap().put("pyaxisname","Sales") ;
			cc.getChartMap().put("syaxisname","Total Downloads") ;
			
			data.setChart(cc.getChartMap()) ;
		    
		   
		    List category = new ArrayList() ;
		    
	        List dataset = new ArrayList() ;
	        
	        List item = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				
				Map map = new HashMap() ;
				map.put("label", rs.getString(4)) ;
				category.add(map);
				
				Map dataMap = new  HashMap() ;
				dataMap.put("v1",rs.getInt(1));				
				dataMap.put("v2",rs.getInt(2));				
				dataMap.put("v3",rs.getInt(3));	
				dataMap.put("month",rs.getString(4));	
				
				item.add(dataMap);
				
				/*
				Map map1 = new HashMap();
				Map map2 = new HashMap();
				Map map3 = new HashMap();
				
				map1.put("value",rs.getInt(1));				
				map2.put("value",rs.getInt(1));				
				map3.put("value",rs.getInt(1));	

				items1.add(map1);
				items2.add(map2);
				items3.add(map3);
				*/
			}
			Map mmm = new HashMap() ;
			mmm.put("category", category) ;
			
			List categories = new ArrayList() ;
			categories.add(mmm) ;
			data.setCategories(categories) ;
			
			
			data.setData(item) ;
			
			
			
	        
			data.setDataset(dataset) ;
            
            Map trendlines = new HashMap() ;
            List line = new ArrayList() ;
            
            Map mm = new HashMap() ;
            mm.put("startvalue", "500") ;
            mm.put("color", "91C728") ;
            mm.put("displayvalue", "Target") ;
            line.add(mm) ;
            trendlines.put("line", line) ;
			
			data.setTrendlines(trendlines) ;
	        
			
		}
	}%>