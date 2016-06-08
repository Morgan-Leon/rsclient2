<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends ChartService {
	
		//¶ÁÈ¡
		public void read(ChartStoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			Map map = new HashMap() ;
			
			
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
			
		    
		    List categories = new ArrayList() ;
		    List category = new ArrayList() ;
		    
		    map = new HashMap() ;
		    map.put("label", "Jan") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Feb") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Mar") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Apr") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "May") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Jun") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Jul") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Aug") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Sep") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Oct") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Nov") ;
			category.add(map);
		    
		    map = new HashMap() ;
		    map.put("label", "Dec") ;
			category.add(map);
			
			Map mmm = new HashMap() ;
			mmm.put("category", category) ;
			
			categories.add(mmm) ;
			data.setCategories(categories) ;
			
			
	        List dataset = new ArrayList() ;
			
	        
	        List item = new ArrayList();
			List items1 = new ArrayList();
			List items2 = new ArrayList();
			List items3 = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map dataMap = new  HashMap() ;
				
				dataMap.put("v1",rs.getInt(1));				
				dataMap.put("v2",rs.getInt(2));				
				dataMap.put("v3",rs.getInt(3));	
				
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
			
			data.setData(item) ;
			
			
			Map lastMap1 = new HashMap() ;
	        lastMap1.put("seriesname", "Product A Sales") ;
	        lastMap1.put("data", items1) ;
	        dataset.add(lastMap1) ;
	        
			Map lastMap2 = new HashMap() ;
			lastMap2.put("seriesname", "Product B Sales") ;
            lastMap2.put("data", items2) ;
	        dataset.add(lastMap2) ;
			
	        Map lastMap3 = new HashMap() ;
	        lastMap3.put("seriesname", "Total Downloads") ;
            lastMap3.put("parentyaxis", "S") ;
            lastMap3.put("data", items3) ;
	        dataset.add(lastMap3) ;
			
			
	        
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