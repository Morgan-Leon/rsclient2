<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
    	
    	public void registerMethods(MethodMap mm) throws Exception {
            super.registerMethods(mm) ;
            //ע�� ��ȡ�ڵ� ����
            mm.add("getSubMaterials")
                    .addStringParameter("code")
                    .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                    .addStringParameter(WebKeys.CompanyCodeKey)
                    .addStringParameter(WebKeys.UserUniqueIdKey)
                    .setListReturnValue();
            //ע�� ��ȡ�ڵ� ����
            mm.add("getParentInfo")
                    .addStringParameter("code")
                    .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                    .addStringParameter(WebKeys.CompanyCodeKey)
                    .addStringParameter(WebKeys.UserUniqueIdKey)
                    .setMapReturnValue();
            
            //ע�� ��������Ƿ��ظ��ķ���
            mm.add("checkKeyRepeat")
                .addStringParameter("parentCode")
                .addStringParameter("code")
                .addStringParameter("date")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType)
                .setMapReturnValue();
         }
    	 
    	 /** 
          * @method ��ȡ�ڵ�
          * @param {code} code  �������
          * @param {SelRs} rsSr ��װ������ݿ��������
          * @param {String} companyCode ��˾����
          * @param {String} userId ��¼�û�ID
          * @param {String} dbType ���ݿ�����
          * @return {List}  ���ؽڵ㼯��
          */
    	 public List getSubMaterials(String code, SelRs rsSr,
                 String companyCode, String userId) throws Exception{
             List item = new ArrayList() ;
             String parentCode = code == null ? "" : code ;
             String sql="SELECT EB.CHILD_CODE,"
                     + " EB.CHILD_NAME,"
                     + " EB.MP_FLAG,"
                     + " DECODE((SELECT COUNT(1)"
                     + " FROM EDM_BOM B"
                     + " WHERE B.COMPANY_CODE = EB.COMPANY_CODE"
                     + " AND B.PARENT_CODE = EB.CHILD_CODE),"
                     + " 0,"
                     + " 'N',"
                     + " 'Y'),"
                     + " EB.CHILD_QTY"
                     + " FROM EDM_BOM EB"
                     + " WHERE COMPANY_CODE = '" + companyCode + "'"
                     + " AND PARENT_CODE = '" + parentCode + "'"
                     + " ORDER BY EB.CHILD_CODE";
             printLog("getSubMaterials" , sql);
             ResultSet rs = rsSr.getRs(sql);
             while(rs != null && rs.next()){
                 Map map = new HashMap();
                 map.put("code",formatString(rs.getString(1))) ;
                 map.put("name",formatString(rs.getString(2))) ;
                 map.put("text",formatString(rs.getString(2))) ;
                 map.put("mpFlag",formatString(rs.getString(3))) ;
                 map.put("final",new Boolean("N".equals(rs.getString(4)))) ;
                 map.put("leaf",new Boolean("N".equals(rs.getString(4)))) ;
                 map.put("child_qty",formatString(rs.getString(5)));
                 item.add(map) ;
             }
             return item ;
         }
          
          /** 
           * @method ��ȡ���ڵ�
           * @param {code} code  �������
           * @param {SelRs} rsSr ��װ������ݿ��������
           * @param {String} companyCode ��˾����
           * @param {String} userId ��¼�û�ID
           * @param {String} dbType ���ݿ�����
           * @return {List}  ���ؽڵ㼯��
           */
    	 public Map getParentInfo(String code,SelRs rsSr, String companyCode,
                 String userId) throws Exception{
    		 String sql = "SELECT DISTINCT item_code,"
    			        + " item_name,"
    			        + " unit_name,"
    			        + " lead_time "
    			         + " FROM inv_master a, edm_unit b "
    			        + " WHERE a.stock_unit = b.unit_code(+) "
    			          + " AND item_code = '" + code + "'" ;
             Map map = new HashMap();
             printLog("getParentInfo" , sql);
    		 ResultSet rs = rsSr.getRs(sql);
             if(rs != null && rs.next()){
            	 map.put("item_code" , formatString(rs.getString(1)));
            	 map.put("item_name" , formatString(rs.getString(2)));
            	 map.put("unit_name" , formatString(rs.getString(3)));
            	 map.put("lead_time" , formatString(rs.getString(4)));
             } else {
            	 map.put("item_code" , "");
                 map.put("item_name" , "");
                 map.put("unit_name" , "");
                 map.put("lead_time" , "");
             }
    		 return map ;
    	 }
    	 
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
        	String parentCode = (String)data.get("code");
        	String sql = "SELECT child_code, "
                    	       + " child_name, "
                    	       + " mp_flag, "
                    	       + " child_qty, "
                    	       + " scrap_rate, "
                    	       + " start_use_date, "
                    	       + " end_use_date, "
                    	       + " move_days, "
                    	       + " replace_flag, "
                    	       + " child_model, "
                    	       + " child_norm, "
                    	       + " note1, "
                    	       + " input_man_code, "
                    	       + " input_man_name, "
                    	       + " input_time, "
                    	       + " pick_flag, "
                    	       + " parent_code "
            	       + " FROM edm_bom "
            	       + " WHERE company_code='" + companyCode + "'" 
            		   + (parentCode == null ? "" : " and parent_code='" + parentCode + "'");
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql,sortInfo, start, limit ,dbType);
        	printLog("read" , sql);
            List items = new ArrayList();
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                map.put("child_code" , formatString(rs.getString(1)));
                map.put("child_name" , formatString(rs.getString(2)));
                map.put("mp_flag" , formatString(rs.getString(3)));
                map.put("child_qty" , formatString(rs.getString(4)));
                map.put("scrap_rate" , formatString(rs.getString(5)));
                map.put("start_use_date" , formatString(rs.getString(6)));
                map.put("end_use_date" , formatString(rs.getString(7)));
                map.put("move_days" , formatString(rs.getString(8)));
                map.put("replace_flag" , formatString(rs.getString(9)));
                map.put("child_model" , formatString(rs.getString(10)));
                map.put("child_norm" , formatString(rs.getString(11)));
                map.put("note1" , formatString(rs.getString(12)));
                map.put("input_man_code" , formatString(rs.getString(13)));
                map.put("input_man_name" , formatString(rs.getString(14)));
                map.put("input_time" , formatString(rs.getString(15)));
                map.put("pick_flag", formatString(rs.getString(16)));
                map.put("parent_code", formatString(rs.getString(17)));
                items.add(map);
            }
            data.setData(items);
            String sqlSum = "SELECT COUNT(*) FROM edm_bom  WHERE company_code='" + companyCode + "'" 
                             + (parentCode == null ? "" : " AND parent_code='" + parentCode + "'");
			//��ȡ����
			ResultSet rs2 = rsSr.getRs(sqlSum);
			printLog("read" , sqlSum);
			if (rs2 != null && rs2.next()) {
			    data.setTotal(rs2.getInt(1));
			}
        }
        
        /** 
         * @method ��������
         * @param {StoreData} data  ���ݹ����Ĳ���
         * @param {List} items ����������
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {List}  ���ؽڵ㼯��
         */
        public void create(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType) throws Exception {
            rsSr.beginTrans() ;
                for(int i=0,len=items.size();i<len;i++){
                StringBuffer key = new StringBuffer() ;
                StringBuffer value = new StringBuffer() ;
                Map map = (Map)items.get(i) ;
                Iterator it = map.entrySet().iterator();
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                    key.append(e.getKey()).append(",") ;
                    value.append("'").append(e.getValue()).append("',") ;
                }
                String parentCode = (String)map.get("parent_code") ;
                String childCode = (String)map.get("child_code") ;
                validateCode(parentCode , childCode , rsSr , companyCode , userId , dbType);
                String insertSql = "INSERT INTO edm_bom(" + key.toString()
                    + "company_code) VALUES(" + value.toString() + "'" + companyCode + "')" ;
                printLog("create" , insertSql);
                rsSr.preTrans(insertSql) ;
            }
            rsSr.doTrans();
        }
        
         /** 
          * @method ��������
          * @param {StoreData} data  ���ݹ����Ĳ���
          * @param {List} items ����������
          * @param {SelRs} rsSr ��װ������ݿ��������
          * @param {String} companyCode ��˾����
          * @param {String} userId ��¼�û�ID
          * @param {String} dbType ���ݿ�����
          * @return {List}  ���ؽڵ㼯��
          */
        public void update(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
            rsSr.beginTrans();
            for(int i=0,len=items.size();i<len;i++){
                StringBuffer value = new StringBuffer() ;
                Map map = (Map)items.get(i) ;
                Iterator it = map.entrySet().iterator();
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                    value.append(e.getKey()).append("='").append(e.getValue()).append("', ") ;
                }
                String updateSql = "UPDATE edm_bom set " + value.toString().substring(0,value.toString().lastIndexOf(","))
                        + "WHERE  company_code='" + companyCode + "' AND child_code='" + map.get("child_code") + "'";
                printLog("update" , updateSql);
                rsSr.preTrans(updateSql) ;
            }
            rsSr.doTrans();
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
            	String deletesql = "DELETE FROM edm_bom WHERE company_code='" + companyCode
                                 + "' AND child_code='" + map.get("child_code") + "'";
            	printLog("destroy" , deletesql);
                rsSr.preTrans(deletesql);
            }
            rsSr.doTrans();
        }
        
       /** 
        * @method �����Ƿ�������
        * @param {String} parentItemCode  �������
        * @param {String} childItemCode  �������
        * @param {SelRs} rsSr ��װ������ݿ��������
        * @param {String} companyCode ��˾����
        * @param {String} userId ��¼�û�ID
        * @param {String} dbType ���ݿ�����
        * @return {List}  ���ؽڵ㼯��
        */
        private void validateCode(String parentItemCode ,String childItemCode , SelRs rsSr,
                String companyCode, String userId, String dbType) throws Exception {
            String sql = "SELECT COUNT(item_code) "
                        + " FROM inv_master "
                       + " WHERE company_code = '" + companyCode + "' "
                         + " AND item_code = '" + parentItemCode + "'"
                         + " AND mp_flag = 'M'"
                         + " AND (special_class = 'M' OR special_class = 'T' OR special_class = 'K')" ; 
            ResultSet rs = rsSr.getRs(sql);
            int count = 0 ;
            if(rs != null && rs.next()){
                 count = rs.getInt(1) ;
            }
            if(count == 0){
                throw new RuntimeException("������벻���ڻ������ϲ������Ƽ���");
            }
            sql = "SELECT COUNT(item_code) "
                  + " FROM inv_master "
                  + " WHERE company_code = '" + companyCode + "' "
                  + " AND item_code = '" + childItemCode + "' "
                  + " AND product_flag = 'N' "
                  + " AND (special_class = 'M' OR special_class = 'T' OR special_class = 'K')" ;
            printLog("create" , sql);
            rs = rsSr.getRs(sql);
            count = 0 ;
            if(rs != null && rs.next()){
                 count = rs.getInt(1) ;
            }
            if(count == 0){
                throw new RuntimeException("��������Ŀ���벻���ڻ򲻷���������");
            }
        }
        
        /** 
         * @method ����Ƿ��ظ�
         * @param {String} warehouseCode  ���ݹ����Ĳ���
         * @param {String} actionType ����������
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {Map}  ������Ϣ
         */
        public Map checkKeyRepeat(String parentCode ,String code , String date , SelRs rsSr,
                String companyCode, String userId, String dbType) throws Exception {
            String sql = "SELECT COUNT(*) "
                        + " FROM edm_bom "
            	       + " WHERE company_code = '" + companyCode + "' "
            	         + " AND parent_code = '"+ parentCode + "' "
            	         + " AND child_code = '" + code + "'";
            printLog("checkKeyRepeat" , sql);
            ResultSet rs = rsSr.getRs(sql) ;
            int count = 0 ;
            if(rs != null && rs.next()){
                 count = rs.getInt(1) ;
            }
            Map map = new HashMap();
            if(count > 0){
                map.put("success" , "false") ;
                map.put("msg" , "����[" + code + "]�ظ�") ;
            } else {
                map.put("success" , "true") ;
            }
            return map ;
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