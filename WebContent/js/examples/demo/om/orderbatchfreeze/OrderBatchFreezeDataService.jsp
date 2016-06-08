<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"
%>
<%@include file="../../../pubservice.jsp"%>
    <%!
        public void jspInit() {
            this.service = ServiceFactory.getService(this, MyService.class);
        }
        public class MyService extends StoreService {
            public void registerMethods(MethodMap mm) throws Exception {
                super.registerMethods(mm) ;
                mm.add("batchFreezeRecords").addListParameter("params").addObjectParameter(
                WebKeys.SelRsKey, SelRs.class).addStringParameter(
                WebKeys.CompanyCodeKey).addStringParameter(
                WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
                .setMapReturnValue() ;
                mm.add("batchThowRecords").addListParameter("params").addObjectParameter(
                WebKeys.SelRsKey, SelRs.class).addStringParameter(
                WebKeys.CompanyCodeKey).addStringParameter(
                WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
                .setMapReturnValue() ;
            }
            
            /**
             * @method  batchThowRecords 订单头-批冻结
             * @param {List} items  传递过来的参数,修改的数据
             * @param {StoreData} data  传递过来的参数
             * @param {SelRs} rsSr 封装后的数据库操作对象
             * @param {String} companyCode 公司编码
             * @param {String} userId 登录用户ID
             * @param {String} dbType 数据库类型
             * @return {Map}  返回信息
             */
            public Map batchThowRecords(List items, SelRs rsSr, String companyCode,
            	    String userId, String dbType) throws Exception {
                Map result = new HashMap();
                result.put("success" , Boolean.valueOf("true")) ;
                ResultSet rs = null;
                String userCode = "";
                String userName = "";
                rs=rsSr.getRs("person_code,person_name","edm_staff","company_code='"+companyCode+"' and user_unique_id = '"+userId+"'",1);
                if(rs.next()){
                    userCode=rs.getString(1)==null?"":rs.getString(1);
                    userName=rs.getString(2)==null?"":rs.getString(2);
                }
                rs.close();
                for(int i=0,len=items.size();i<len ;i++){
                    String orderNo =  (String)items.get(i) ;
                    //考虑与订单预收款分配时的并发控制
                    String s = "SELECT COUNT(1)"
                             + " FROM ar_customer_lock t1, om_order_head t2"
                             + " WHERE t1.company_code = t2.company_code"
                             + " AND t1.customer_code = t2.customer_code"
                             + " AND t1.org_code = t2.org_code"
                             + " AND t1.off_code = t2.off_code"
                             + " AND t1.grp_code = t2.grp_code"
                             + " AND t1.company_code = '" + companyCode + "'"
                             + " AND t2.order_no = '" + orderNo + "'" ;
                    int cusCount = rsSr.getRecordNum(s,1);
                    if(cusCount > 0){
                        continue;
                    }
                    String sequence_no="";
                    rs=rsSr.getRs("nvl(max(nvl(sequence_no,0)),0)+10","om_order_history","company_code='"+companyCode+"' ",999) ;
                    if(rs.next()){
                        sequence_no=rs.getString(1);
                    }
                    rs.close();
                    rsSr.beginTrans();
                    try{
                        String insertSql= "INSERT INTO om_order_history"
                                        + " (company_code,"
                                        + " modify_date,"
                                        + " modify_type,"
                                        + " modify_man_id,"
                                        + " modify_man_code,"
                                        + " modify_man,"
                                        + " sequence_no,"
                                        + " order_no,"
                                        + " level_name,"
                                        + " signer_id,"
                                        + " industry_name,"
                                        + " signer_name,"
                                        + " sign_date,"
                                        + " sales_unique_id,"
                                        + " exchange_rate,"
                                        + " attribute_code,"
                                        + " sales_name,"
                                        + " signer,"
                                        + " reason,"
                                        + " channal_name,"
                                        + " kind_desc,"
                                        + " industry_code,"
                                        + " customer_order_no,"
                                        + " region_code,"
                                        + " level_code,"
                                        + " sales_code,"
                                        + " pay_kind,"
                                        + " order_text,"
                                        + " region_name,"
                                        + " attribute_name,"
                                        + " reason_text,"
                                        + " channal_code,"
                                        + " amt,"
                                        + " total_amt,"
                                        + " customer_signer,"
                                        + " tax)"
                                        + " SELECT '" + companyCode + "',"
                                        + " '" + DateUtil.getCurrentDateTime("/") + "',"
                                        + " 'U',"
                                        + " '" + userId + "',"
                                        + " '" + userCode + "',"
                                        + " '" + userName + "',"
                                        + " '" + sequence_no + "',"
                                        + " order_no,"
                                        + " level_name,"
                                        + " signer_id,"
                                        + " industry_name,"
                                        + " signer_name,"
                                        + " sign_date,"
                                        + " sales_unique_id,"
                                        + " exchange_rate,"
                                        + " attribute_code,"
                                        + " sales_name,"
                                        + " signer,"
                                        + " reason,"
                                        + " channal_name,"
                                        + " kind_desc,"
                                        + " industry_code,"
                                        + " customer_order_no,"
                                        + " region_code,"
                                        + " level_code,"
                                        + " sales_code,"
                                        + " pay_kind,"
                                        + " order_text,"
                                        + " region_name,"
                                        + " attribute_name,"
                                        + " reason_text,"
                                        + " channal_code,"
                                        + " amt,"
                                        + " total_amt,"
                                        + " customer_signer,"
                                        + " tax"
                                        + " FROM om_order_head"
                                        + " WHERE company_code = '" + companyCode + "'"
                                        + " AND order_no = '" + orderNo + "'" ;
                        if(!rsSr.update(insertSql)){
                            throw new RuntimeException("订单 "+orderNo+" 批解冻失败!");
                        }
                        else{
                            String execSql = "exec om_freeze_order_sp '"+companyCode+"','"+userId+"','om6f00','"+orderNo+"','N'";
                            System.out.println("批解冻的sql" + execSql);
                            if(!rsSr.update(execSql)) {
                                throw new RuntimeException("订单 "+orderNo+" 批解冻失败!");
                            }
                        }
                        rsSr.commit();
                    }
                    catch(Exception e){
                        result.put("success" , Boolean.valueOf("false")) ;
                        result.put("msg" , "订单 "+orderNo+" 批解冻失败!") ;
                        rsSr.rollback();
                    }
                }
                return result ;
            }
            
             /**
              * @method  batchFreezeRecords 订单头-批解冻
              * @param {List} items  传递过来的参数,修改的数据
              * @param {StoreData} data  传递过来的参数
              * @param {SelRs} rsSr 封装后的数据库操作对象
              * @param {String} companyCode 公司编码
              * @param {String} userId 登录用户ID
              * @param {String} dbType 数据库类型
              * @return {Map}  返回信息
              */ 
            public Map batchFreezeRecords(List items, SelRs rsSr, String companyCode,
            	    String userId, String dbType) throws Exception {
            	
                Map result = new HashMap();
                result.put("success" , Boolean.valueOf("true")) ;
                ResultSet rs = null ;
                String userCode = "";
                String userName = "";
                rs=rsSr.getRs("person_code,person_name","edm_staff","company_code='"+companyCode+"' and user_unique_id = '"+userId+"'",1);
                if(rs.next()){
                    userCode=rs.getString(1)==null?"":rs.getString(1);
                    userName=rs.getString(2)==null?"":rs.getString(2);
                }
                rs.close();
                for(int i=0,len=items.size();i<len ;i++){
                    String orderNo =  (String)items.get(i) ;
                    //考虑与订单预收款分配时的并发控制
                    String s = "SELECT COUNT(1) "
                            + " FROM ar_customer_lock t1, om_order_head t2 "
                            + " WHERE t1.company_code = t2.company_code "
                            + " AND t1.customer_code = t2.customer_code "
                            + " AND t1.org_code = t2.org_code "
                            + " AND t1.off_code = t2.off_code "
                            + " AND t1.grp_code = t2.grp_code "
                            + " AND t1.company_code = '" + companyCode + "' "
                            + " AND t2.order_no = '" + orderNo + "'" ;
                    int cusCount = rsSr.getRecordNum(s,1);
                    if(cusCount > 0){
                        continue;
                    }
                    String sequence_no="";
                    rs=rsSr.getRs("nvl(max(nvl(sequence_no,0)),0)+10","om_order_history","company_code='"+companyCode+"' ",999) ;
                    if(rs.next()){
                        sequence_no=rs.getString(1);
                    }
                    rs.close();
                    rsSr.beginTrans();
                    try{
                        String insertSql= "INSERT INTO om_order_history "
                        	            + " (company_code, "
                        	            + " modify_date, "
                        	            + " modify_type, "
                        	            + " modify_man_id, "
                        	            + " modify_man_code, "
                        	            + " modify_man, "
                        	            + " sequence_no, "
                        	            + " order_no, "
                        	            + " level_name, "
                        	            + " signer_id, "
                        	            + " industry_name, "
                        	            + " signer_name, "
                        	            + " sign_date, "
                        	            + " sales_unique_id, "
                        	            + " exchange_rate, "
                        	            + " attribute_code, "
                        	            + " sales_name, "
                        	            + " signer, "
                        	            + " reason, "
                        	            + " channal_name, "
                        	            + " kind_desc, "
                        	            + " industry_code, "
                        	            + " customer_order_no, "
                        	            + " region_code, "
                        	            + " level_code, "
                        	            + " sales_code, "
                        	            + " pay_kind, "
                        	            + " order_text, "
                        	            + " region_name, "
                        	            + " attribute_name, "
                        	            + " reason_text, "
                        	            + " channal_code, "
                        	            + " amt, "
                        	            + " total_amt, "
                        	            + " customer_signer, "
                        	            + " tax) "
                        	            + " SELECT '" + companyCode + "', "
                        	            + " '" + DateUtil.getCurrentDateTime("/") + "', "
                        	            + " 'U', "
                        	            + " '" + userId + "', "
                        	            + " '" + userCode + "', "
                        	            + " '" + userName + "', "
                        	            + " '" + sequence_no + "', "
                        	            + " order_no, "
                        	            + " level_name, "
                        	            + " signer_id, "
                        	            + " industry_name, "
                        	            + " signer_name, "
                        	            + " sign_date, "
                        	            + " sales_unique_id, "
                        	            + " exchange_rate, "
                        	            + " attribute_code, "
                        	            + " sales_name, "
                        	            + " signer, "
                        	            + " reason, "
                        	            + " channal_name, "
                        	            + " kind_desc, "
                        	            + " industry_code, "
                        	            + " customer_order_no, "
                        	            + " region_code, "
                        	            + " level_code, "
                        	            + " sales_code, "
                        	            + " pay_kind, "
                        	            + " order_text, "
                        	            + " region_name, "
                        	            + " attribute_name, "
                        	            + " reason_text, "
                        	            + " channal_code, "
                        	            + " amt, "
                        	            + " total_amt, "
                        	            + " customer_signer, "
                        	            + " tax "
                        	            + " FROM om_order_head "
                        	            + " WHERE company_code = '"+companyCode+"' AND order_no='"+orderNo+"'";
                        if(!rsSr.update(insertSql)){
                            throw new RuntimeException("订单 "+orderNo+" 批冻结失败!");
                        }
                        else{
                            String execSql = "exec om_freeze_order_sp '"+companyCode+"','"+userId+"','om6f00','"+orderNo+"','Y'";
                            if(!rsSr.update(execSql)) {
                                throw new RuntimeException("订单 "+orderNo+" 批冻结失败!");
                            }
                        }
                        rsSr.commit();
                    }
                    catch(Exception e){
                        result.put("success" , Boolean.valueOf("false")) ;
                        result.put("msg" , "订单 "+orderNo+" 批冻结失败!") ;
                        rsSr.rollback();
                    }
                }
                return result ;
            }
            
            
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
                StringBuffer condition = new StringBuffer("");
                //订单类型
                String headType= (String)data.get("head_type");
                if(headType != null&& headType != "" ){
                    condition.append(" and head_type = '"+ headType +"'");
                }
                //订单号
                String orderNo = (String)data.get("order_no");
                if(orderNo != null&& orderNo != "" ){
                    condition.append(" AND ORDER_NO = '"+ orderNo +"'");
                }
                //客户
                String customerCode = (String)data.get("customer_code");
                if(customerCode != null&& customerCode != "" ){
                    condition.append(" AND CUSTOMER_CODE = '"+ customerCode +"'");
                }
                //销售员
                String salesCode = (String)data.get("sales_code");
                if(salesCode != null&& salesCode != "" ){
                    condition.append(" AND SALES_CODE = '"+ salesCode +"'");
                }
                //组织
                String orgCode = (String)data.get("org_code");
                if(orgCode != null&& orgCode != "" ){
                    condition.append(" AND ORG_CODE = '"+ orgCode +"'");
                }
                //办事处
                String offCode= (String)data.get("off_code");
                if(offCode != null&& offCode != "" ){
                    condition.append(" AND OFF_CODE = '"+ offCode +"'");
                }
                //小组
                String grpCode= (String)data.get("grp_code");
                if(grpCode != null&& grpCode != "" ){
                    condition.append(" AND GRP_CODE = '"+ grpCode +"'");
                }
                //订单状态
                String status= (String)data.get("status");
                if(status != null&& status != "" ){
                    condition.append(" AND STATUS = '"+ status +"'");
                }
                //审核状态
                String auditFlag= (String)data.get("audit_flag");
                if(auditFlag != null&& auditFlag != "" ){
                    condition.append(" AND AUDIT_FLAG = '"+ auditFlag +"'");
                }
                //冻结状态
                String freezeFlag= (String)data.get("freeze_flag");
                if(freezeFlag != null&& freezeFlag != "" ){
                    condition.append(" AND FREEZE_FLAG = '"+ freezeFlag +"'");
                }
                //起始录入日期
                String recordDateStart = (String)data.get("record_date_start");
                if(recordDateStart != null&& recordDateStart != "" ){
                    condition.append(" and record_date >= '" + recordDateStart + "'");
                }
                //终止录入日期
                String recordDateEnd = (String)data.get("record_date_end");
                if(recordDateEnd != null&& recordDateEnd != "" ){
                    condition.append(" and record_date <= '" + recordDateEnd +"'");
                }
                //起始签订日期
                String signDateStart = (String)data.get("sign_date_start");
                if(signDateStart != null&& signDateStart != "" ){
                    condition.append(" and sign_date >= '" + signDateStart + "'");
                }
                //终止签订日期
                String singDateEnd= (String)data.get("sign_date_end");
                if(singDateEnd != null&& singDateEnd != "" ){
                    condition.append(" and sign_date <= '" + singDateEnd +"'");
                }
                String field1 = "decode(status,'N','新增','S','提货','C','结案') as status" ;
                String field2 = "decode(audit_flag,'N','未审核','B','部分通过','P','全部通过','R','驳回') as audit_flag" ;
                String field3 = "decode(freeze_flag,'N','未冻结','Y','冻结') as freeze_flag" ;
                String sql = " SELECT order_no,"
                            + " head_type_name,"
                            + " customer_code,"
                            + " customer_name,"
                            + " sign_date,"
                            + " signer_name,"
                            + " org_name,"
                            + " off_name,"
                            + " grp_name,"
                            + " sales_name, "
                            + field1 + ","
                            + field2 + ","
                            + field3
                            + " FROM om_order_head "
                            + " WHERE company_code = '" + companyCode + "' "
                            + " AND status <> 'C' "
                            + " AND nvl(waste_flag, 'N') = 'N'" ;
                sql += condition.toString();
                String sortInfo = data.getSortInfo();
                Integer start = data.getStart();
                Integer limit = data.getLimit();
                sql = SQLUtil.pagingSql(sql, sortInfo, start, limit ,dbType);
                printLog("read" , sql);
                List items = new ArrayList();
                ResultSet rs = rsSr.getRs(sql);
                while (rs.next() && rs != null) {
                    Map map = new HashMap();
                    map.put("order_no",formatString(rs.getString(1))) ;
                    map.put("head_type_name",formatString(rs.getString(2))) ;
                    map.put("customer_code",formatString(rs.getString(3))) ;
                    map.put("customer_name",formatString(rs.getString(4))) ;
                    map.put("sign_date",formatString(rs.getString(5))) ;
                    map.put("signer_name",formatString(rs.getString(6))) ;
                    map.put("org_name",formatString(rs.getString(7))) ;
                    map.put("off_name",formatString(rs.getString(8))) ;
                    map.put("grp_name",formatString(rs.getString(9))) ;
                    map.put("sales_name",formatString(rs.getString(10))) ;
                    map.put("status",formatString(rs.getString(11))) ;
                    map.put("audit_flag",formatString(rs.getString(12))) ;
                    map.put("freeze_flag",formatString(rs.getString(13))) ;
                    items.add(map);
                }
                data.setData(items);
                String sqlSum = "SELECT COUNT(*) "
                               + " FROM om_order_head "
                               + " WHERE company_code='" + companyCode + "'"
                               + " AND status <> 'C' "
                               + " AND nvl(waste_flag,'N') = 'N'" +  condition.toString();
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
