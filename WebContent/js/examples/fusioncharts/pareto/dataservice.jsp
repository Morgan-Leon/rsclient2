<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends ChartService {
	
		//读取
		public void read(ChartStoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
            
            log("------------------------------------------执行了read方法---------------------------------");
			//查询数据
			String sql = "select v2 from test_export";
            
            String sqlSum = "select count(1) from test_export"  ;
            
			String sortInfo = data.getSortInfo();
			

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
			
			ChartConfig cc = new ChartConfig() ;
			cc.setCaption("test title") ;
			
			data.setChart(cc.getChartMap()) ;
			
			List items = new ArrayList();
			/* ResultSet rs = rsSr.getRs(sql);
			int i=0;
			while (rs != null && rs.next()) {
			    i++ ;
				Map map = new HashMap();
				map.put("label","k"+i%3);				
				map.put("value",rs.getString(1));				
				// map.put("v2_sum",rs.getString(1));				
				//map.put("v2_average",rs.getString(1) ;
				//items.add(map);
			}  */
			
			Map map = new HashMap() ;
			
			map.put("label","GUI") ;
			map.put("value","205") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Functional") ;
			map.put("value","165") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Navigation") ;
			map.put("value","85") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Cross Platform") ;
			map.put("value","62") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Hardware") ;
			map.put("value","73") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Runtime") ;
			map.put("value","131") ;
			items.add(map) ; 
			
			map = new HashMap() ;
			map.put("label","Load Condition") ;
			map.put("value","109") ;
			items.add(map) ; 
			
			data.setData(items);

			int count = 0 ;
			//获取总数
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				count = rs2.getInt(1) ;
				data.setTotal(count);
			}
		}
	}%>