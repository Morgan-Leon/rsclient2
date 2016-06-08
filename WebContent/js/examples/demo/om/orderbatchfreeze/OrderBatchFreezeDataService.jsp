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
             * @method  batchThowRecords ����ͷ-������
             * @param {List} items  ���ݹ����Ĳ���,�޸ĵ�����
             * @param {StoreData} data  ���ݹ����Ĳ���
             * @param {SelRs} rsSr ��װ������ݿ��������
             * @param {String} companyCode ��˾����
             * @param {String} userId ��¼�û�ID
             * @param {String} dbType ���ݿ�����
             * @return {Map}  ������Ϣ
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
                    //�����붩��Ԥ�տ����ʱ�Ĳ�������
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
                            throw new RuntimeException("���� "+orderNo+" ���ⶳʧ��!");
                        }
                        else{
                            String execSql = "exec om_freeze_order_sp '"+companyCode+"','"+userId+"','om6f00','"+orderNo+"','N'";
                            System.out.println("���ⶳ��sql" + execSql);
                            if(!rsSr.update(execSql)) {
                                throw new RuntimeException("���� "+orderNo+" ���ⶳʧ��!");
                            }
                        }
                        rsSr.commit();
                    }
                    catch(Exception e){
                        result.put("success" , Boolean.valueOf("false")) ;
                        result.put("msg" , "���� "+orderNo+" ���ⶳʧ��!") ;
                        rsSr.rollback();
                    }
                }
                return result ;
            }
            
             /**
              * @method  batchFreezeRecords ����ͷ-���ⶳ
              * @param {List} items  ���ݹ����Ĳ���,�޸ĵ�����
              * @param {StoreData} data  ���ݹ����Ĳ���
              * @param {SelRs} rsSr ��װ������ݿ��������
              * @param {String} companyCode ��˾����
              * @param {String} userId ��¼�û�ID
              * @param {String} dbType ���ݿ�����
              * @return {Map}  ������Ϣ
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
                    //�����붩��Ԥ�տ����ʱ�Ĳ�������
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
                            throw new RuntimeException("���� "+orderNo+" ������ʧ��!");
                        }
                        else{
                            String execSql = "exec om_freeze_order_sp '"+companyCode+"','"+userId+"','om6f00','"+orderNo+"','Y'";
                            if(!rsSr.update(execSql)) {
                                throw new RuntimeException("���� "+orderNo+" ������ʧ��!");
                            }
                        }
                        rsSr.commit();
                    }
                    catch(Exception e){
                        result.put("success" , Boolean.valueOf("false")) ;
                        result.put("msg" , "���� "+orderNo+" ������ʧ��!") ;
                        rsSr.rollback();
                    }
                }
                return result ;
            }
            
            
            /** 
             * @method ��ѯ����
             * @param {StoreData} data  ���ݹ����Ĳ���
             * @param {SelRs} rsSr ��װ������ݿ��������
             * @param {String} companyCode ��˾����
             * @param {String} userId ��¼�û�ID
             * @param {String} dbType ���ݿ�����
             */
            public void read(StoreData data, SelRs rsSr, String companyCode,
            	    String userId, String dbType) throws Exception {
                StringBuffer condition = new StringBuffer("");
                //��������
                String headType= (String)data.get("head_type");
                if(headType != null&& headType != "" ){
                    condition.append(" and head_type = '"+ headType +"'");
                }
                //������
                String orderNo = (String)data.get("order_no");
                if(orderNo != null&& orderNo != "" ){
                    condition.append(" AND ORDER_NO = '"+ orderNo +"'");
                }
                //�ͻ�
                String customerCode = (String)data.get("customer_code");
                if(customerCode != null&& customerCode != "" ){
                    condition.append(" AND CUSTOMER_CODE = '"+ customerCode +"'");
                }
                //����Ա
                String salesCode = (String)data.get("sales_code");
                if(salesCode != null&& salesCode != "" ){
                    condition.append(" AND SALES_CODE = '"+ salesCode +"'");
                }
                //��֯
                String orgCode = (String)data.get("org_code");
                if(orgCode != null&& orgCode != "" ){
                    condition.append(" AND ORG_CODE = '"+ orgCode +"'");
                }
                //���´�
                String offCode= (String)data.get("off_code");
                if(offCode != null&& offCode != "" ){
                    condition.append(" AND OFF_CODE = '"+ offCode +"'");
                }
                //С��
                String grpCode= (String)data.get("grp_code");
                if(grpCode != null&& grpCode != "" ){
                    condition.append(" AND GRP_CODE = '"+ grpCode +"'");
                }
                //����״̬
                String status= (String)data.get("status");
                if(status != null&& status != "" ){
                    condition.append(" AND STATUS = '"+ status +"'");
                }
                //���״̬
                String auditFlag= (String)data.get("audit_flag");
                if(auditFlag != null&& auditFlag != "" ){
                    condition.append(" AND AUDIT_FLAG = '"+ auditFlag +"'");
                }
                //����״̬
                String freezeFlag= (String)data.get("freeze_flag");
                if(freezeFlag != null&& freezeFlag != "" ){
                    condition.append(" AND FREEZE_FLAG = '"+ freezeFlag +"'");
                }
                //��ʼ¼������
                String recordDateStart = (String)data.get("record_date_start");
                if(recordDateStart != null&& recordDateStart != "" ){
                    condition.append(" and record_date >= '" + recordDateStart + "'");
                }
                //��ֹ¼������
                String recordDateEnd = (String)data.get("record_date_end");
                if(recordDateEnd != null&& recordDateEnd != "" ){
                    condition.append(" and record_date <= '" + recordDateEnd +"'");
                }
                //��ʼǩ������
                String signDateStart = (String)data.get("sign_date_start");
                if(signDateStart != null&& signDateStart != "" ){
                    condition.append(" and sign_date >= '" + signDateStart + "'");
                }
                //��ֹǩ������
                String singDateEnd= (String)data.get("sign_date_end");
                if(singDateEnd != null&& singDateEnd != "" ){
                    condition.append(" and sign_date <= '" + singDateEnd +"'");
                }
                String field1 = "decode(status,'N','����','S','���','C','�᰸') as status" ;
                String field2 = "decode(audit_flag,'N','δ���','B','����ͨ��','P','ȫ��ͨ��','R','����') as audit_flag" ;
                String field3 = "decode(freeze_flag,'N','δ����','Y','����') as freeze_flag" ;
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
         * @method printLog ��ӡ��־�ķ���
         * @param {String} methodName  ���ڵķ�����
         * @param {String} log �������־
         */
        private void printLog(String methodName , String log) {
             System.out.println("\n��ǰִ�еķ���:�� " + methodName + " ��,��־::: " + log + "\n");   
        }
        
        /** 
         * @method formatString �����ݿ��в�ѯ�����Ŀ�ֵת��Ϊ���ַ���
         * @param {String} value
         * @return {String}  ������Ϣ
         */  
        private String formatString(String value){
             if(value == null || "null".equals(value) || "undefined".equals(value)){
                 value = "" ;
             }
             return value ;
        }
    }%>
