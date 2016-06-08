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
            
            log("------------------------------------------执行了read方法---------------------------------");
            //查询数据
            String sql = "SELECT warehouse_code,warehouse_name,qty FROM inv_bill";
            
            String sqlSum = "select count(*) from inv_bill "  ;
            
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

            int count = 0 ;
            //获取总数
            ResultSet rs2 = rsSr.getRs(sqlSum);
            if (rs2 != null && rs2.next()) {
                count = rs2.getInt(1) ;
                data.setTotal(count);
            }
        }
    }%>