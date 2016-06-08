<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }
    public class MyService extends StoreService {
    	
    	public void registerMethods(MethodMap mm) throws Exception {
            super.registerMethods(mm) ; //先调用其父类方法完成底层方法的注册
            //注册 检测主键是否重复的方法
            mm.add("validate")
                .addMapParameter("params")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType)
                .setMapReturnValue();
        }
        
    	/** 
         * @method 查询数据
         * @param {StoreData} data  传递过来的参数
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
        public void read(StoreData data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
             
			String warehouseCode = (String) data.get("WAREHOUSE_CODE");
			String warehouseName = (String) data.get("WAREHOUSE_NAME");
            String managementFlag = (String) data.get("MANAGEMENT_FLAG");
            String totalQtyFlag = (String) data.get("TOTAL_QTY_FLAG");
            
            StringBuffer conditions = new StringBuffer();
            
            conditions.append(createQueryCondition(warehouseCode , "warehouse_code")) ;
            conditions.append(createQueryCondition(warehouseName , "warehouse_name")) ;
            conditions.append(createQueryCondition(managementFlag , "management_flag")) ;
            conditions.append(createQueryCondition(totalQtyFlag , "total_qty_flag")) ;
            
            String sql = "SELECT company_code, "
                       + " company_name, "
                       + " warehouse_code, "
                       + " warehouse_name, "
                       + " warehouse_addr, "
                       + " num_of_kind, "
                       + " management_flag, "
                       + " warehouse_amt, "
                       + " price_sys, "
                       + " plan_amt, "
                       + " changeover_date, "
                       + " now_period, "
                       + " org_id, "
                       + " total_qty_flag, "
                       + " negative_qty_flag, "
                       + " single_flag, "
                       + " check_bill_flag, "
                       + " purchase_dept_code, "
                       + " purchase_dept_name, "
                       + " book_id, "
                       + " book_no, "
                       + " book_name, "
                       + " ma_flag, "
                       + " month_close_flag, "
                       + " mp_flag, "
                       + " suspense_flag, "
                       + " voucher_flag, "
                       + " ltk_flag, "
                       + " set_code, "
                       + " set_name "
                       + " FROM inv_warehouse_def "
                       + " WHERE company_code='" + companyCode + "'"
                       + conditions.toString();
            
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            
            sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
            List items = new ArrayList();
            printLog("read" , sql);
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                map.put("COMPANY_CODE",formatString(rs.getString(1)));
                map.put("COMPANY_NAME",formatString(rs.getString(2)));
                map.put("WAREHOUSE_CODE",formatString(rs.getString(3)));
                map.put("WAREHOUSE_NAME",formatString(rs.getString(4)));
                map.put("WAREHOUSE_ADDR",formatString(rs.getString(5)));
                map.put("NUM_OF_KIND",Integer.valueOf(rs.getInt(6)));
                map.put("MANAGEMENT_FLAG",formatString(rs.getString(7)));
                map.put("PRICE_SYS",formatString(rs.getString(9)));
                map.put("CHANGEOVER_DATE",formatString(rs.getString(11)));
                map.put("NOW_PERIOD",formatString(rs.getString(12)));
                map.put("ORG_ID",formatString(rs.getString(13)));
                map.put("TOTAL_QTY_FLAG",formatString(rs.getString(14)));
                map.put("NEGATIVE_QTY_FLAG",formatString(rs.getString(15)));
                map.put("SINGLE_FLAG",formatString(rs.getString(16)));
                map.put("CHECK_BILL_FLAG",formatString(rs.getString(17)));
                map.put("PURCHASE_DEPT_CODE",formatString(rs.getString(18)));
                map.put("PURCHASE_DEPT_NAME",formatString(rs.getString(19)));
                map.put("BOOK_ID",formatString(rs.getString(20)));
                map.put("BOOK_NO",formatString(rs.getString(21)));
                map.put("BOOK_NAME",formatString(rs.getString(22)));
                map.put("MA_FLAG",formatString(rs.getString(23)));
                map.put("MONTH_CLOSE_FLAG",formatString(rs.getString(24)));
                map.put("MP_FLAG",formatString(rs.getString(25)));
                map.put("SUSPENSE_FLAG",formatString(rs.getString(26)));
                map.put("VOUCHER_FLAG",formatString(rs.getString(27)));
                map.put("LTK_FLAG",formatString(rs.getString(28)));
                map.put("SET_CODE",formatString(rs.getString(29)));
                map.put("SET_NAME",formatString(rs.getString(30)));
                items.add(map);
            }
            data.setData(items);
            String sqlSum = "SELECT count(*) FROM inv_warehouse_def  WHERE company_code='" + companyCode + "'"
                             + conditions.toString(); 
            printLog("read" , sqlSum);
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
			    data.setTotal(rs2.getInt(1));
			}
        }
         
         /** 
          * @method 新增数据
          * @param {StoreData} data  传递过来的参数
          * @param {List} items 操作的类型
          * @param {SelRs} rsSr 封装后的数据库操作对象
          * @param {String} companyCode 公司编码
          * @param {String} userId 登录用户ID
          * @param {String} dbType 数据库类型
          * @return {List}  返回节点集合
          */
         public void create(StoreData data, List items, SelRs rsSr,
                 String companyCode, String userId, String dbType) throws Exception {
        	 try{
        	     rsSr.beginTrans();
	          	 for(int i=0,len=items.size();i<len;i++){
		             StringBuffer key = new StringBuffer() ;
		             StringBuffer value = new StringBuffer() ;
		             Map map = (Map)items.get(i) ;
		             Iterator it = map.entrySet().iterator();
		             while (it.hasNext()) {  
		                 Map.Entry e = (Map.Entry) it.next();
		                 String field = e.getKey().toString() ;
		                 key.append(field).append(",") ;
		                 value.append("'").append(e.getValue()).append("',") ;
		             }
		             String insertSql = "INSERT INTO inv_warehouse_def(" + key.toString()
		                 + "company_code) VALUES(" + value.toString() + "'" + companyCode + "')" ;
		             printLog("create" , insertSql);
		             rsSr.preTrans(insertSql) ;
	          	 }
	          	 rsSr.doTrans();
        		 data.setSuccess();
  	             data.setMessage("新增成功！");
        	 }catch(Exception e){
  	             data.setFailure();
  		       	 throw new RuntimeException("新增失败!");
        	 }
         }
         
         /** 
          * @method 更新数据
          * @param {StoreData} data  传递过来的参数
          * @param {List} items 操作的类型
          * @param {SelRs} rsSr 封装后的数据库操作对象
          * @param {String} companyCode 公司编码
          * @param {String} userId 登录用户ID
          * @param {String} dbType 数据库类型
          * @return {List}  返回节点集合
          */
        public void update(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
        	try{
        		int k = 10/0;
	        	rsSr.beginTrans();
	        	for(int i=0,len=items.size();i<len;i++){
		        	StringBuffer value = new StringBuffer() ;
		       		Map map = (Map)items.get(i) ;
		       		Iterator it = map.entrySet().iterator();
		       		while (it.hasNext()) {  
		       			Map.Entry e = (Map.Entry) it.next();
		           		value.append(e.getKey()).append("='").append(e.getValue()).append("', ") ;
		       		}
		       		String updateSql = "UPDATE inv_warehouse_def"
		       		                 + " SET "
		       		                 + value.toString().substring(0,value.toString().lastIndexOf(","))
		       				         + " WHERE "
	                                 + " company_code='" + companyCode + "'"
	                                 + " AND warehouse_code='" + map.get("WAREHOUSE_CODE") + "'" ;
		       		printLog("update" , updateSql);
	           		rsSr.preTrans(updateSql) ;
	        	}
				rsSr.doTrans();
				data.setSuccess();
	            data.setMessage("修改成功！");
        	} catch(Exception e){
        		data.setFailure();
	            throw new RuntimeException("修改失败!");
        	}
        }
        
      /** 
       * @method 删除数据
       * @param {StoreData} data  传递过来的参数
       * @param {List} items 操作的类型
       * @param {SelRs} rsSr 封装后的数据库操作对象
       * @param {String} companyCode 公司编码
       * @param {String} userId 登录用户ID
       * @param {String} dbType 数据库类型
       * @return {List}  返回节点集合
       */
        public void destroy(StoreData data, List items, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
    	    try{
	            rsSr.beginTrans();
	            for(int i=0,len=items.size();i<len;i++){
	            	Map map = (Map)items.get(i) ;
	            	String deletesql = "DELETE FROM inv_warehouse_def "
	            		             + " WHERE company_code='" + companyCode + "'"
	                                 + " AND warehouse_code='" + formatString(map.get("WAREHOUSE_CODE")) + "'";
	            	printLog("destroy" , deletesql);
	                rsSr.preTrans(deletesql);
	            }
	            rsSr.doTrans();
	            data.setSuccess();
	            data.setMessage("删除成功！");
    	    } catch(Exception e){
    	    	data.setFailure();
	            throw new RuntimeException("删除失败!");
    	    }
        }
       
       /** 
        * @method 检测是否重复
        * @param {String} params  前台传递过来的参数
        * @param {SelRs} rsSr 封装后的数据库操作对象
        * @param {String} companyCode 公司编码
        * @param {String} userId 登录用户ID
        * @param {String} dbType 数据库类型
        * @return {Map}  返回信息
        */
       public Map validate(Map params , SelRs rsSr,
               String companyCode, String userId, String dbType) throws Exception {
           String warehouseCode = (String)params.get("WAREHOUSE_CODE");
           String sql = "SELECT COUNT(*) "
        	          + " FROM inv_warehouse_def "
        	          + " WHERE company_code='" + companyCode + "'"
        	          + " AND warehouse_code = '" + warehouseCode + "'";
           printLog("validate" , sql);
           ResultSet rs = rsSr.getRs(sql) ;
           int count = 0 ;
           if(rs != null && rs.next()){
        	    count = rs.getInt(1) ;
           }
           Map map = new HashMap();
           if(count > 0){
               map.put("success" , "false") ;
               map.put("msg" , "仓库编码重复") ;
           } else {
        	   map.put("success" , "true") ;
           }
           return map ;
       }
       
       private String createQueryCondition(String value , String field){
    	   return ((value!=null)? (" AND " + field + " like '%" + formatString(value) + "%'"):"") ;
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
        * @method formatString 将数据进行两头去空处理
        * @param {String} value
        * @return {String}  返回信息
        */  
       private String formatString(Object v){
        	String value = (String)v ;
            if(value == null || "null".equals(value) || "undefined".equals(value)){
                value = "" ;
            }
            return value.trim() ;
       }
        
    }%>