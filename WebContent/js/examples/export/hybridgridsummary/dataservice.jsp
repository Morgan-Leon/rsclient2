<%@ page language="java" contentType="text/html; charset=GBk"
    pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
        
        //读取
        public void read(StoreData data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
            
            //查询数据
            String sql = "SELECT warehouse_code,warehouse_name,qty FROM inv_bill";
            
            String sqlSum = "select count(*) , count(qty) , sum(qty) , max(qty), min(qty), avg(qty) from inv_bill"  ;
            
            String sortInfo = data.getSortInfo();

            Integer start = data.getStart();
            Integer limit = data.getLimit();
            log(sql);
            sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
            List items = new ArrayList();
            ResultSet rs = rsSr.getRs(sql);
            while (rs != null && rs.next()) {
                Map map = new HashMap();
                map.put("warehouse_code",("null".equals(rs.getString(1)) || rs.getString(1) == null)  ? "" : rs.getString(1));
                map.put("warehouse_name",("null".equals(rs.getString(2)) || rs.getString(2) == null)  ? "" : rs.getString(2));          
                map.put("qty",Double.valueOf(rs.getString(3)));             
                items.add(map);
            }
            
            data.setData(items);
            SummaryData summaryData = new SummaryData();
            ResultSet rs2 = rsSr.getRs(sqlSum);
            if (rs2 != null && rs2.next()) {
                data.setTotal(rs2.getInt(1));
                summaryData.setData("qty",SummaryDataType.COUNT,rs2.getString(2));
                summaryData.setData("qty",SummaryDataType.SUM,rs2.getString(3));
                summaryData.setData("qty",SummaryDataType.MAX,rs2.getString(4));
                summaryData.setData("qty",SummaryDataType.MIN,rs2.getString(5));
                summaryData.setData("qty",SummaryDataType.AVERAGE,rs2.getString(6));
            }
            log(summaryData.toString());
            data.setSummaryData(summaryData) ;
        }
    }%>