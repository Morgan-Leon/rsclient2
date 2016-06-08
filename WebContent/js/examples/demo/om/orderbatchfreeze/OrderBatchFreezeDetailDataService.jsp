<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
        
    	/** 
         * @method 查询数据
         * @param {StoreData} data  传递过来的参数
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         */
        public void read(StoreData data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
            String orderNo = (String)data.get("orderNo");
            String sql = "SELECT seq_no, "
                        + " detail_type_name, "
                        + " item_code, "
                        + " item_name, "
                        + " item_abv, "
                        + " required_qty, "
                        + " finish_date, "
                        + " ship_date, "
                        + " audit_flag, "
                        + " status, "
                        + " om_class, "
                        + " om_class_name, "
                        + " price, "
                        + " check_price, "
                        + " notax_price, "
                        + " basic_price, "
                        + " tax_code, "
                        + " tax_rate, "
                        + " tax, "
                        + " amt, "
                        + " total_amt, "
                        + " standard_total_amt, "
                        + " discount_rate, "
                        + " exchange_rate, "
                        + " ship_customer, "
                        + " ship_customer_name, "
                        + " ship_customer_abv, "
                        + " pay_customer, "
                        + " pay_customer_name, "
                        + " pay_customer_abv, "
                        + " receive_code, "
                        + " receive_name, "
                        + " deliver_code, "
                        + " deliver_name, "
                        + " warehouse_code, "
                        + " warehouse_name, "
                        + " remark, "
                        + " mds_flag, "
                        + " set_code, "
                        + " set_name, "
                        + " child_qty, "
                        + " close_man_name, "
                        + " modify_man_name, "
                        + " modify_date, "
                        + " modify_reason "
                        + " FROM om_order_detail "
                        + " WHERE company_code = '" + companyCode + "' "
                        + " AND order_no = '" + orderNo + "' "
                        + " AND status <> 'C' "
                        + " AND nvl(waste_flag, 'N') = 'N'";
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql, sortInfo , start, limit ,dbType);
            List items = new ArrayList();
            printLog("read" , sql);
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                map.put("seq_no", formatString(rs.getString(1)));
                map.put("detail_type_name", formatString(rs.getString(2)));
                map.put("item_code", formatString(rs.getString(3)));
                map.put("item_name", formatString(rs.getString(4)));
                map.put("item_abv", formatString(rs.getString(5)));
                
                map.put("required_qty", formatString(rs.getString(6)));
                map.put("finish_date", formatString(rs.getString(7)));
                map.put("ship_date", formatString(rs.getString(8)));
                map.put("audit_flag", formatString(rs.getString(9)));
                map.put("status", formatString(rs.getString(10)));
                
                map.put("om_class", formatString(rs.getString(11)));
                map.put("om_class_name", formatString(rs.getString(12)));
                map.put("price", formatString(rs.getString(13)));
                map.put("check_price", formatString(rs.getString(14)));
                map.put("notax_price", formatString(rs.getString(15)));
                
                map.put("basic_price", formatString(rs.getString(16)));
                map.put("tax_code", formatString(rs.getString(17)));
                map.put("tax_rate", formatString(rs.getString(18)));
                map.put("tax", formatString(rs.getString(19)));
                map.put("amt", formatString(rs.getString(20)));
                
                map.put("total_amt", formatString(rs.getString(21)));
                map.put("standard_total_amt", formatString(rs.getString(22)));
                map.put("discount_rate", formatString(rs.getString(23)));
                map.put("exchange_rate", formatString(rs.getString(24)));
                map.put("ship_customer", formatString(rs.getString(25)));
                
                map.put("ship_customer_name", formatString(rs.getString(26)));
                map.put("ship_customer_abv", formatString(rs.getString(27)));
                map.put("pay_customer", formatString(rs.getString(28)));
                map.put("pay_customer_name", formatString(rs.getString(29)));
                map.put("pay_customer_abv", formatString(rs.getString(30)));
                
                map.put("receive_code", formatString(rs.getString(31)));
                map.put("receive_name", formatString(rs.getString(32)));
                map.put("deliver_code", formatString(rs.getString(33)));
                map.put("deliver_name", formatString(rs.getString(34)));
                map.put("warehouse_code", formatString(rs.getString(35)));
                
                map.put("warehouse_name", formatString(rs.getString(36)));
                map.put("remark", formatString(rs.getString(37)));
                map.put("mds_flag", formatString(rs.getString(38)));
                map.put("set_code", formatString(rs.getString(39)));
                map.put("set_name", formatString(rs.getString(40)));
                
                map.put("child_qty", formatString(rs.getString(41)));
                map.put("close_man_name", formatString(rs.getString(42)));
                map.put("modify_man_name", formatString(rs.getString(43)));
                map.put("modify_date", formatString(rs.getString(44)));
                map.put("modify_reason", formatString(rs.getString(45)));
                
                items.add(map);
            }
            data.setData(items);
            String sqlSum = "SELECT COUNT(*) "
            	           + " FROM om_order_detail"
            	           + " WHERE company_code = '" + companyCode + "'"
            	           + " AND order_no = '" + orderNo + "'"
            	           + " AND status <> 'C'"
            	           + " AND nvl(waste_flag, 'N') = 'N'";
            ResultSet rs2 = rsSr.getRs(sqlSum);
            printLog("read" , sqlSum);
            if (rs2 != null && rs2.next()) {
                data.setTotal(rs2.getInt(1));
            }
        }
        
        /** 
         * @method printLog 打印日志的方法
         * @param {String} methodName  所在的方法名
         * @param {String} log 输出的日志
         */
        private void printLog(String methodName , String log) {
             System.out.println("\n当前执行的方法:【 " + methodName + " 】,日志::: " + log + "\n");   
        }
        
        /** 
         * @method formatString 将数据库中查询出来的空值转换为空字符串
         * @param {String} value
         * @return {String}  返回信息
         */  
        private String formatString(String value){
             if(value == null || "null".equals(value) || "undefined".equals(value)){
                 value = "" ;
             }
             return value ;
        }
        
    }%>