<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
    
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }
    public class MyService extends StoreService {
        
    	/** 
         * @method ��ѯ����
         * @param {StoreData} data  ���ݹ����Ĳ���
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {List}  ���ؽڵ㼯��
         */
    	public void read(StoreData data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
            String special_class = (String) data.get("special_class");
            String receive_no = (String) data.get("receive_no");
            String receive_date1 = (String) data.get("receive_date1");
            String receive_date2 = (String) data.get("receive_date2");
            String group_id = (String) data.get("group_id");
            String vendor_code = (String) data.get("vendor_code");
            String buyer_id = (String) data.get("buyer_id");
            
            System.out.println("���ڿؼ�:receive_date1:" + receive_date1);
            System.out.println("���ڿؼ�:receive_date2:" + receive_date2);
            
            String condition = " (end_flag<>'Y' OR end_flag is null)  " +
                                "AND NVL(return_flag,'N') = 'N'" +
                                ((special_class!=null)? (" AND special_class='" + special_class + "'"):" AND special_class='M'") + 
                                ((receive_no!=null)? (" AND receive_no='" + receive_no + "'"):"") + 
                                ((receive_date1!=null)? (" AND receive_date >'" + receive_date1 + "'"):"") + 
                                ((receive_date2!=null)? (" AND receive_date <'" + receive_date2 + "'"):"") + 
                                ((group_id!=null)? (" AND group_id='" + group_id + "'"):"") + 
                                ((vendor_code!=null)? (" AND vendor_code='" + vendor_code + "'"):"") + 
                                ((buyer_id!=null)? (" AND buyer_id='" + buyer_id + "'") : "") + 
                                " AND NOT EXISTS( select null from pm_receive_detail" +
                                " WHERE pm_receive_detail.company_code = pm_receive_head.company_code  " +
                                "AND pm_receive_detail.receive_no = pm_receive_head.receive_no " +
                                "AND pm_receive_detail.end_flag = 'Y' )  " +
                                "AND company_code = '" + companyCode + "'" ;
            
            String sql = "SELECT receive_no, "
                       + " vendor_abv, "
                       + " receive_date, "
                       + " type_desc, "
                       + " special_class, "
                       + " return_flag, "
                       + " deliver_abv, "
                       + " receive_amt, "
                       + " invoice_flag, "
                       + " buyer_name, "
                       + " buyer_code, "
                       + " buyer_id, "
                       + " vendor_code, "
                       + " group_id, "
                       + " group_name, "
                       + " deliver_code,"
                       + " bill_type "
                       + " FROM pm_receive_head "
                       + " WHERE " + condition ;
            
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql, sortInfo, start, limit , dbType);
            List items = new ArrayList();
            printLog("read" , sql);
            ResultSet rs = rsSr.getRs(sql);
            while (rs != null && rs.next()) {
                Map map = new HashMap();
                map.put("receive_no", formatString(rs.getString(1)));
                map.put("vendor_abv", formatString(rs.getString(2)));
                map.put("receive_date", formatString(rs.getString(3)));
                map.put("type_desc", formatString(rs.getString(4)));
                map.put("special_class", formatString(rs.getString(5)));
                map.put("return_flag", formatString(rs.getString(6)));
                map.put("deliver_abv", formatString(rs.getString(7)));
                map.put("receive_amt", Double.valueOf(rs.getDouble(8)));
                map.put("invoice_flag", formatString(rs.getString(9)));
                map.put("buyer_name", formatString(rs.getString(10)));
                map.put("buyer_code", formatString(rs.getString(11)));
                map.put("buyer_id", formatString(rs.getString(12)));
                map.put("vendor_code", formatString(rs.getString(13)));
                map.put("group_id", formatString(rs.getString(14)));
                map.put("group_name", formatString(rs.getString(15)));
                map.put("deliver_code", formatString(rs.getString(16)));
                map.put("bill_type", formatString(rs.getString(17)));
                items.add(map);
            }
            data.setData(items);
            
            String sqlSum = "SELECT COUNT(*),sum(receive_amt) "
                + " FROM pm_receive_head "
                + " WHERE " + condition;
            printLog("read" , sqlSum);
            ResultSet rs2 = rsSr.getRs(sqlSum);
            SummaryData summaryData = new SummaryData();
            if (rs2 != null && rs2.next()) {
                data.setTotal(rs2.getInt(1));
                summaryData.setData("receive_amt",SummaryDataType.SUM,rs2.getString(2));
                summaryData.setData("receive_no",SummaryDataType.COUNT,rs2.getString(1));
            }
            data.setSummaryData(summaryData) ;
        }
        
    	/** 
         * @method ɾ������
         * @param {StoreData} data  ���ݹ����Ĳ���
         * @param {List} items ����������
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {List}  ���ؽڵ㼯��
         */
        public void destroy(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
        	rsSr.beginTrans();
            for(int i=0,len=items.size();i<len;i++){
                Map map = (Map)items.get(i) ;
                Iterator it = map.entrySet().iterator();
                String key = "" ;
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                }
                String deletesql = "DELETE FROM pm_receive_head WHERE company_code='" + companyCode
                                 + "' AND receive_no='" + map.get("receive_no") + "'";
                printLog("destroy" , deletesql);
                rsSr.preTrans(deletesql);
            }
            rsSr.doTrans();
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