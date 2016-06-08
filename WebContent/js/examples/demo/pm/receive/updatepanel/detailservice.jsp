<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@page import="com.rsc.rsclient.parse.SuperParser"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		public void registerMethods(MethodMap mm) throws Exception {
            super.registerMethods(mm) ;
            
            //注册 保存头信息方法
            mm.add("doSaveHeadRecord")
                    .addMapParameter("params")
                    .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                    .addStringParameter(WebKeys.CompanyCodeKey)
                    .addStringParameter(WebKeys.UserUniqueIdKey)
                    .addStringParameter(WebKeys.DbType)
                    .setMapReturnValue();
            
            //注册 更新头信息方法
            mm.add("doUpdateHeadRecord")
                    .addMapParameter("params")
                    .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                    .addStringParameter(WebKeys.CompanyCodeKey)
                    .addStringParameter(WebKeys.UserUniqueIdKey)
                    .addStringParameter(WebKeys.DbType)
                    .setMapReturnValue();
            
            //注册 根据接收单号检测行号重复
            mm.add("checkRepeat")
                .addStringParameter("seqNo")
                .addStringParameter("receiveNo")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType)
                .setMapReturnValue();
            
            //注册 检测接收单号重复
            mm.add("checkRepeatReceiveNo")
                .addStringParameter("receiveNo")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType)
                .setMapReturnValue();
            
        }
		
        
		/** 
         * @method 检测接收单号重复
         * @param {String} receiveNo  接收单号
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {Map}  返回信息
         */
        public Map checkRepeatReceiveNo(String receiveNo, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
              String sql = "SELECT count(receive_no) FROM "
                 + " pm_receive_head where company_code='" + companyCode + "'"
                 + " and receive_no='" + receiveNo + "'" ;
              printLog("checkRepeatReceiveNo",sql) ;
              ResultSet rs = rsSr.getRs(sql) ;
              int count = 0 ;
              if(rs != null && rs.next()){
                   count = rs.getInt(1) ;
              }
              Map map = new HashMap();
              if(count > 0){
                  map.put("success" , "false") ;
                  map.put("msg" , "接收单号【" + receiveNo + "】已存在") ;
              } else {
                  map.put("success" , "true") ;
              }
              return map ;
        }
        
		/** 
         * @method 根据接收单号检测行号重复
         * @param {String} seqNo  行号
         * @param {String} receiveNo  接收单号
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {Map}  返回信息
         */
		public Map checkRepeat(String seqNo ,String receiveNo, SelRs rsSr,
                String companyCode, String userId, String dbType)
                throws Exception {
			  String sql = "SELECT seq_no FROM "
                 + " pm_receive_detail where company_code='" + companyCode + "'"
                 + " and receive_no='" + receiveNo + "'"
                 + " and seq_no='" + seqNo + "'";
              printLog("checkRepeat",sql) ;
              ResultSet rs = rsSr.getRs(sql) ;
              int count = 0 ;
              if(rs != null && rs.next()){
                   count = rs.getInt(1) ;
              }
              Map map = new HashMap();
              if(count > 0){
                  map.put("success" , "false") ;
                  map.put("msg" , "行号重复") ;
              } else {
                  map.put("success" , "true") ;
              }
              return map ;
        }
         
         /** 
          * @method 保存头信息方法
          * @param {Map} params  传递过来的参数
          * @param {SelRs} rsSr 封装后的数据库操作对象
          * @param {String} companyCode 公司编码
          * @param {String} userId 登录用户ID
          * @param {String} dbType 数据库类型
          * @return {Map}  返回信息
          */
         public Map doSaveHeadRecord(Map params, SelRs rsSr,
                 String companyCode, String userId, String dbType)
                 throws Exception {
             Map map = new HashMap() ;
             String receiveNo = (String)params.get("receive_no") ;
             String billType = (String)params.get("bill_type") ;
             String specialClass = (String)params.get("special_class") ;
             String groupId = (String)params.get("group_id") ;
             String deliverCode = (String)params.get("deliver_code") ;
             String receiveDate = (String)params.get("receive_date") ;
             String vendorCode = (String)params.get("vendor_code") ;
             String buyerId = (String)params.get("buyer_id") ;
             
             receiveNo = receiveNo == null ? "" : receiveNo ;
             billType = billType == null ? "" : billType ;
             specialClass = specialClass == null ? "" : specialClass ;
             groupId = groupId == null ? "" : groupId ;
             deliverCode = deliverCode == null ? "" : deliverCode ;
             receiveDate = receiveDate == null ? "" : receiveDate ;
             vendorCode = vendorCode == null ? "" : vendorCode ;
             buyerId = buyerId == null ? "" : buyerId ;
             
             String sql = "INSERT INTO pm_receive_head(receive_no,bill_type,special_class,group_id,"
                     + "deliver_code,receive_date,vendor_code,buyer_id,company_code) VALUES('" + receiveNo + "','"
                             + billType + "','" +  specialClass + "','" +  groupId + "','"
                             +  deliverCode + "','" +  receiveDate + "','" +  vendorCode + "','" + buyerId + "','" + companyCode + "')" ;
             printLog("doSaveHeadRecord" , sql);
             
            if(rsSr.update(sql)){
                 map.put("success" , Boolean.valueOf("true")) ;
                 return  map ;
            } else {
                 map.put("success" , Boolean.valueOf("false")) ;
                 map.put("message" , "新增数据失败") ;
                 return map ;
            }
         }
          
          /** 
           * @method 更新头信息方法
           * @param {Map} params  传递过来的参数
           * @param {SelRs} rsSr 封装后的数据库操作对象
           * @param {String} companyCode 公司编码
           * @param {String} userId 登录用户ID
           * @param {String} dbType 数据库类型
           * @return {Map}  返回信息
           */
          public Map doUpdateHeadRecord(Map params, SelRs rsSr,
                  String companyCode, String userId, String dbType)
                  throws Exception {
              Map map = new HashMap() ;
              String receiveNo = (String)params.get("receive_no") ;
              String billType = (String)params.get("bill_type") ;
              String typeDesc = (String)params.get("type_desc") ;
              String specialClass = (String)params.get("special_class") ;
              String groupId = (String)params.get("group_id") ;
              String deliverCode = (String)params.get("deliver_code") ;
              String receiveDate = (String)params.get("receive_date") ;
              String vendorCode = (String)params.get("vendor_code") ;
              String buyerId = (String)params.get("buyer_id") ;
              String vendorAbv = (String)params.get("vendor_abv") ;
              String deliverAbv = (String)params.get("deliver_abv") ;
              
              receiveNo = receiveNo == null ? "" : receiveNo ;
              billType = billType == null ? "" : billType ;
              specialClass = specialClass == null ? "" : specialClass ;
              groupId = groupId == null ? "" : groupId ;
              deliverCode = deliverCode == null ? "" : deliverCode ;
              receiveDate = receiveDate == null ? "" : receiveDate ;
              vendorCode = vendorCode == null ? "" : vendorCode ;
              buyerId = buyerId == null ? "" : buyerId ;
              
              String sql = "UPDATE pm_receive_head "
                           + " SET bill_type = '" + billType + "',"
                           + " type_desc = '" + typeDesc + "',"
                           + " special_class = '" + specialClass + "',"
                           + " group_id = '" + groupId + "',"
                           + " deliver_code = '" + deliverCode + "',"
                           + " receive_date = '" + receiveDate + "',"
                           + " vendor_code = '" + vendorCode + "',"
                           + " vendor_abv = '" + vendorAbv + "',"
                           + " deliver_abv = '" + deliverAbv + "',"
                           + " buyer_id = '" + buyerId + "'"
                         + " WHERE company_code = '" + companyCode + "'"
                         + "    AND receive_no='" + receiveNo + "'" ;
              
              printLog("doUpdateRecord" , sql);
              if(rsSr.update(sql)){
                  map.put("success" , Boolean.valueOf("true")) ;
                  return  map ;
              } else {
                  map.put("success" , Boolean.valueOf("false")) ;
                  map.put("message" , "更新数据失败") ;
                  return map ;
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
				String companyCode, String userId, String dbType)
				throws Exception {
			rsSr.beginTrans() ;
            for(int i=0,len=items.size();i<len;i++){
                StringBuffer key = new StringBuffer() ;
                StringBuffer value = new StringBuffer() ;
                Map map = (Map)items.get(i) ;
                Iterator it = map.entrySet().iterator();
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                    if(!"key".equals(e.getKey())){
                        key.append(e.getKey()).append(",") ;
                        value.append("'").append(e.getValue()).append("',") ;
                    }
                }
                String insertSql = "INSERT INTO pm_receive_detail(" + key.toString()
                    + "company_code) VALUES(" + value.toString() + "'" + companyCode + "')" ;
                printLog("create" , insertSql);
                rsSr.preTrans(insertSql) ;
            }
            rsSr.doTrans();
			
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
			rsSr.beginTrans();
			for(int i=0,len=items.size();i<len ;i++){
				String key = ((Map)items.get(i)).get("key").toString();
				String seqNo = key.substring(0,key.indexOf("-")) ,
                       receiveNo = key.substring(key.indexOf("-") + 1) ;
                
			    String deleteSql = "DELETE FROM pm_receive_detail WHERE company_code='" + companyCode
			         + "' and seq_no='" + seqNo + "' AND receive_no='" + receiveNo + "'" ;
			    printLog("destroy" , deleteSql);
			    rsSr.preTrans(deleteSql) ;
			}
			rsSr.doTrans();
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
            rsSr.beginTrans();
            for(int i=0,len=items.size();i<len;i++){
                StringBuffer value = new StringBuffer() ;
                Map map = (Map)items.get(i) ;
                Iterator it = map.entrySet().iterator();
                String key = "" ;
                String condtion = "";
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                    if("key".equals(e.getKey())){
                    	key = e.getValue().toString() ;
                        String seqNo = key.substring(0,key.indexOf("-")) ,
                               receiveNo = key.substring(key.indexOf("-") + 1) ;
                    	condtion = " WHERE receive_no='" + receiveNo
                    	         + "' AND seq_no='" + seqNo
                    	         + "' and company_code='" + companyCode + "'"  ;
                    } else {
	                    value.append(e.getKey()).append("='").append(e.getValue()).append("', ") ;
                    }
                }
                String updateSql = "UPDATE pm_receive_detail SET " + value.toString().substring(0,value.toString().lastIndexOf(","))
                        + condtion;
                
                printLog("update" , updateSql);
                
                rsSr.preTrans(updateSql) ;
            }
            rsSr.doTrans();
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

			String receiveNo = (String) data.get("receive_no");
			
			receiveNo = (receiveNo == null) ? "" : receiveNo ;
            
			//查询数据
			String sql = "SELECT rs_id,receive_no,seq_no,bill_type,type_desc,special_class,"
			     + "type_class,return_flag,order_no,order_seq_no,free_flag,coop_flag,item_style,"
			     + "item_code,item_name,request_date,pm_unit,pm_unit_name,manufacturer_code," 
			     + "manufacturer_name,manufacturer_abv,receiver_code,receiver_name,receiver_abv,"
			     + "biller_code,biller_name,biller_abv,vendor_code,vendor_name,vendor_abv,"
			     + "receive_date,receive_qty,receive_price,receive_amt,actual_days,second_unit," 
			     + "second_unit_name,second_receive_qty,assist_unit,assist_unit_name,"
			     + "assist_receive_qty,quality_flag,quality_qty,assist_quality_qty,qc_bill_no," 
			     + "stock_qty,assist_stock_qty,receive_note,invoice_flag,invoice_qty," 
			     + "invoice_amt,ontime_flag,record_date,recorder_id,recorder_code,recorder_name,"
			     + "buyer_id,buyer_code,buyer_name,org_id,company_code,group_id,dept_code," 
			     + "group_name,currency_code,currency_name,exchange_rate,tax_code,tax_desc," 
			     + "tax_rate,set_code,set_name,child_qty,end_flag,warehouse_code,warehouse_name," 
			     + "check_finish_flag,qc_create_flag,qc_select_flag,ship_qty,ship_date,check_time," 
			     + "check_man_name,check_man_code,check_man_id,scrap_qty,givein_quality_qty," 
			     + "customer_order_no,customer_name,receive_type,receive_status,check_date," 
			     + "inv_apply_date from pm_receive_detail WHERE company_code='" + companyCode + "'"
	             + " AND receive_no='" + receiveNo + "'";
		    
			String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql, sortInfo, start, limit,dbType);
			
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			printLog("read" , sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("rs_id",formatString(rs.getString(1)));
                map.put("receive_no",formatString(rs.getString(2)));
                map.put("seq_no",Integer.valueOf(rs.getInt(3)));
                map.put("bill_type",formatString(rs.getString(4)));
                map.put("type_desc",formatString(rs.getString(5)));
                map.put("special_class",formatString(rs.getString(6)));
                map.put("type_class",formatString(rs.getString(7)));
                map.put("return_flag",formatString(rs.getString(8)));
                map.put("order_no",formatString(rs.getString(9)));
                map.put("order_seq_no",Double.valueOf(rs.getDouble(10)));
                map.put("free_flag",formatString(rs.getString(11)));
                map.put("coop_flag",formatString(rs.getString(12)));
                map.put("item_style",formatString(rs.getString(13)));
                map.put("item_code",formatString(rs.getString(14)));
                map.put("item_name",formatString(rs.getString(15)));
                map.put("request_date",formatString(rs.getString(16)));
                map.put("pm_unit",formatString(rs.getString(17)));
                map.put("pm_unit_name",formatString(rs.getString(18)));
                map.put("manufacturer_code",formatString(rs.getString(19)));
                map.put("manufacturer_name",formatString(rs.getString(20)));
                map.put("manufacturer_abv",formatString(rs.getString(21)));
                map.put("receiver_code",formatString(rs.getString(22)));
                map.put("receiver_name",formatString(rs.getString(23)));
                map.put("receiver_abv",formatString(rs.getString(24)));
                map.put("biller_code",formatString(rs.getString(25)));
                map.put("biller_name",formatString(rs.getString(26)));
                map.put("biller_abv",formatString(rs.getString(27)));
                map.put("vendor_code",formatString(rs.getString(28)));
                map.put("vendor_name",formatString(rs.getString(29)));
                map.put("vendor_abv",formatString(rs.getString(30)));
                map.put("receive_date",formatString(rs.getString(31)));
                map.put("receive_qty",Integer.valueOf(rs.getInt(32)));
                map.put("receive_price",Integer.valueOf(rs.getInt(33)));
                map.put("receive_amt",Double.valueOf(rs.getDouble(34)));
                map.put("actual_days",Double.valueOf(rs.getDouble(35)));
                map.put("second_unit",formatString(rs.getString(36)));
                map.put("second_unit_name",formatString(rs.getString(37)));
                map.put("second_receive_qty",Double.valueOf(rs.getDouble(38)));
                map.put("assist_unit",formatString(rs.getString(39)));
                map.put("assist_unit_name",formatString(rs.getString(40)));
                map.put("assist_receive_qty",Double.valueOf(rs.getDouble(41)));
                map.put("quality_flag",formatString(rs.getString(42)));
                map.put("quality_qty",Double.valueOf(rs.getDouble(43)));
                map.put("assist_quality_qty",Double.valueOf(rs.getDouble(44)));
                map.put("qc_bill_no",formatString(rs.getString(45)));
                map.put("stock_qty",Integer.valueOf(rs.getInt(46)));
                map.put("assist_stock_qty",Integer.valueOf(rs.getInt(47)));
                map.put("receive_note",formatString(rs.getString(48)));
                map.put("invoice_flag",formatString(rs.getString(49)));
                map.put("invoice_qty",Integer.valueOf(rs.getInt(50)));
                map.put("invoice_amt",Double.valueOf(rs.getDouble(51)));
                map.put("ontime_flag",formatString(rs.getString(52)));
                map.put("record_date",formatString(rs.getString(53)));
                map.put("recorder_id",formatString(rs.getString(54)));
                map.put("recorder_code",formatString(rs.getString(55)));
                map.put("recorder_name",formatString(rs.getString(56)));
                map.put("buyer_id",formatString(rs.getString(57)));
                map.put("buyer_code",formatString(rs.getString(58)));
                map.put("buyer_name",formatString(rs.getString(59)));
                map.put("org_id",formatString(rs.getString(60)));
                map.put("company_code",formatString(rs.getString(61)));
                map.put("group_id",formatString(rs.getString(62)));
                map.put("dept_code",formatString(rs.getString(63)));
                map.put("group_name",formatString(rs.getString(64)));
                map.put("currency_code",formatString(rs.getString(65)));
                map.put("currency_name",formatString(rs.getString(66)));
                map.put("exchange_rate",Integer.valueOf(rs.getInt(67)));
                map.put("tax_code",formatString(rs.getString(68)));
                map.put("tax_desc",formatString(rs.getString(69)));
                map.put("tax_rate",Integer.valueOf(rs.getInt(70)));
                map.put("set_code",formatString(rs.getString(71)));
                map.put("set_name",formatString(rs.getString(72)));
                map.put("child_qty",Integer.valueOf(rs.getInt(73)));
                map.put("end_flag",formatString(rs.getString(74)));
                map.put("warehouse_code",formatString(rs.getString(75)));
                map.put("warehouse_name",formatString(rs.getString(76)));
                map.put("check_finish_flag",formatString(rs.getString(77)));
                map.put("qc_create_flag",formatString(rs.getString(78)));
                map.put("qc_select_flag",formatString(rs.getString(79)));
                map.put("ship_qty",Integer.valueOf(rs.getInt(80)));
                map.put("ship_date",formatString(rs.getString(81)));
                map.put("check_time",formatString(rs.getString(82)));
                map.put("check_man_name",formatString(rs.getString(83)));
                map.put("check_man_code",formatString(rs.getString(84)));
                map.put("check_man_id",formatString(rs.getString(85)));
                map.put("scrap_qty",Integer.valueOf(rs.getInt(86)));
                map.put("givein_quality_qty",Integer.valueOf(rs.getInt(87)));
                map.put("customer_order_no",formatString(rs.getString(88)));
                map.put("customer_name",formatString(rs.getString(89)));
                map.put("receive_type",formatString(rs.getString(90)));
                map.put("receive_status",formatString(rs.getString(91)));
                map.put("check_date",formatString(rs.getString(92)));
                map.put("inv_apply_date",formatString(rs.getString(93)));
				map.put("key" ,Integer.valueOf(rs.getInt(3)) + "-" + formatString(rs.getString(2)));
				items.add(map);
			}
			
			data.setData(items);
            
			
			String sqlSum = "SELECT COUNT(*),sum(receive_qty) FROM pm_receive_detail WHERE company_code='" + companyCode + "'"
			   + " AND receive_no='" + receiveNo + "'";
			
			SummaryData sd = new SummaryData();
			printLog("read" , sqlSum);
			ResultSet rs2 = rsSr.getRs(sqlSum);
            if (rs2 != null && rs2.next()) {
                data.setTotal(rs2.getInt(1));
                sd.setData("receive_qty",SummaryDataType.SUM,rs2.getString(2)) ;
            }
            
            data.setSummaryData(sd) ;
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