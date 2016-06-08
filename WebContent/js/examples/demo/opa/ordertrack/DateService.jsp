<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
        
    	private String parentCode = "" ;
        
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
            
        	log("\n初始化数据:" + data.getDataMap().toString());
        	log("\n初始化数据:" + data.getMetaData().getDataMap().toString());
            
        	Integer start = data.getStart();
            Integer limit = data.getLimit();
            
        	String node = (String) data.get("node");

        	StringBuffer conditions = new StringBuffer() ;
            conditions.append(" company_code = '"+ companyCode + "' and user_unique_id = '"+ userId +"' ") ;
            conditions.append(getCondition(data));
            String orderNo = (String)data.get("order_no");
            orderNo = orderNo == null ? "" : orderNo ;
            if(!"".equals(orderNo)){
                conditions.append(" AND CUSTOMER_ORDER_NO = '" + orderNo + "' ") ;
            }
            String workNo = (String)data.get("work_no");
            workNo = workNo == null ? "" : workNo ;
            if(!"".equals(workNo)){
                conditions.append(" AND WORK_NO = '" + workNo + "' ") ;
            }
            
            String customerSearchFlag  = (String)data.get("customer_search_flag");
            customerSearchFlag = customerSearchFlag == null ? "":customerSearchFlag;
            //物料编码
            String itemCodeSP  = (String)data.get("item_code") ;
            if(itemCodeSP != null  && itemCodeSP != "" ){
                if(itemCodeSP.indexOf(",") != -1){
                    String[] str = itemCodeSP.split(",");
                    String con = "";
                    for(int i = 0;i<str.length;i++){
                       if(i == 0){
                           con += "''"+ str[i] +"''";
                       }
                       else{
                           con += ", ''"+ str[i] +"''";
                       }
                    }
                    itemCodeSP = con;
                }else{
                	itemCodeSP = "''"+itemCodeSP+"''";
                }
            }
            
            //部门编码
            String deptCode  = (String)data.get("dept_code");
            deptCode = deptCode == null?"":deptCode;
            
            //执行阶段
            String sysFlag  = (String)data.get("sys_flag");
            sysFlag = sysFlag == null?"":sysFlag;
            
            //起始计划开工日期
            String planStartDateBegin  = (String)data.get("plan_start_date_end");
            planStartDateBegin = planStartDateBegin == null?"":planStartDateBegin;
            
            //终止计划开工日期
            String planStartDateEnd  = (String)data.get("plan_start_date_end");
            planStartDateEnd =planStartDateEnd == null?"":planStartDateEnd;
            
            //起始计划完工日期
            String planEndDateBegin  = (String)data.get("plan_end_date_begin");
            planEndDateBegin = planEndDateBegin == null?"":planEndDateBegin;
            
            //终止计划完工日期
            String planEndDateEnd  = (String)data.get("plan_end_date_end");
            planEndDateEnd = planEndDateEnd == null?"":planEndDateEnd;
            
            //起始实际开工日期
            String actualStartDateBegin  = (String)data.get("actual_start_date_begin");
            actualStartDateBegin = actualStartDateBegin == null?"":actualStartDateBegin;
            
            //终止实际开工日期
            String actualStartDateEnd  = (String)data.get("actual_start_date_end");
            actualStartDateEnd = actualStartDateEnd == null?"":actualStartDateEnd;
            
            //起始实际完工日期
            String actualEndDateBegin  = (String)data.get("actual_end_date_begin");
            actualEndDateBegin = actualEndDateBegin == null?"":actualEndDateBegin;
            
            //终止实际完工日期
            String actualEndDateEnd  = (String)data.get("actual_end_date_end");
            actualEndDateEnd = actualEndDateEnd == null?"":actualEndDateEnd;
            
            //自制/采购
            String mpFlag  = (String)data.get("mp_flag");
            mpFlag = mpFlag == null?"":mpFlag;
            
            //拖期标记
            String delayFlag  = (String)data.get("delay_flag");
            delayFlag = delayFlag == null?"":delayFlag;
            
            //外协标记
            String coopFlag  = (String)data.get("coop_flag");
            coopFlag = coopFlag == null?"":coopFlag;
            
            //带料标记
            String coopDbFlag  = (String)data.get("coop_db_flag");
            coopDbFlag = coopDbFlag == null?"":coopDbFlag;
            
            String SpCondition = conditions.toString().replaceAll("'","''");
             //最小拖期天数
            String minDays  = (String)data.get("minDays") == null?"0":(String)data.get("minDays");
              //最大拖期天数
            String maxDays  = (String)data.get("maxDays")== null?"0":(String)data.get("maxDays");
            String itemCode = "root".equals(node) ? "" : node ;
            String sp = "";
        	if( "root".equals(node)){//点击查询时
	              if("".equals(getCondition(data)) && "0".equals(minDays) && "0".equals(maxDays)){//查询头只选择预测订单号或者工作令号时
	            	  sp = "exec opa_production_process_1_sp '" + companyCode + "','" + userId + "','Y','" + orderNo + "','" + workNo + "'," + minDays + "," + maxDays+",'opa7400'";
	              } else {   //查询头选择了预测订单号、工作令号之外的查询条件时
	                  sp = "exec opa_production_process_3_sp '" + companyCode + "','" + userId + "','Y','" + orderNo + "','" + workNo + "','"
	                               + customerSearchFlag + "','" + itemCode + "','" +  deptCode + "','" + sysFlag +"','"
	                               + planStartDateBegin + "','" + planStartDateEnd + "','" + planEndDateBegin + "','" + planEndDateEnd + "','"
	                               + actualStartDateBegin + "','" + actualStartDateEnd + "','" + actualEndDateBegin + "','" + actualEndDateEnd + "','"
	                               + mpFlag + "','" + delayFlag + "','" + coopFlag + "','" + coopDbFlag + "'," +minDays + "," + maxDays+",'opa7400'";
	              }
	        }else{//选择某个非叶子节点进行展开时
        		 log("选择某个非叶子节点进行展开时");
	             sp = "exec opa_production_process_2_sp '" + companyCode + "','" + userId + "','Y','" + orderNo + "','" + workNo + "','"+ itemCode + "'," + minDays + "," + maxDays+",'opa7400'";
	        }
			if(!parentCode.equals(itemCode)||"root".equals(node)){
				printLog("read" , sp);
			    if (!rsSr.callSp(sp)){
			        throw new Exception("存储过程执行失败!");
			    }
			}
			parentCode = itemCode ;
			String orderBy = " ORDER BY item_code,ORDER_NO nulls first,DELAY_FLAG";
	        String selectFields = " ITEM_NAME, ITEM_NORM, ITEM_MODEL, LEVEL_CODE, SYS_FLAG, ORDER_NO, DELAY_FLAG, DELAY_DAYS,"
	                             + " PLAN_QTY, RELEASE_QTY, START_QTY, FINISH_QTY, SCRAP_QTY, ISSUE_QTY, PLAN_START_DATE, PLAN_END_DATE,"
	                             + " ACTUAL_START_DATE, ACTUAL_END_DATE, DEPT_CODE, DEPT_NAME, ORDER_STATUS, MP_FLAG, KEY_PART_FLAG,"
	                             + " COOP_FLAG, COOP_DB_FLAG, LEAF_FLAG, ORDER_NO_1, SEQ_NO ,ITEM_CODE";
	        String tableName = " opa_production_process_query ";
            String s = " SELECT COUNT(*) FROM " + tableName + " WHERE " + " company_code = '"+ companyCode + "' and user_unique_id = '"+ userId +"' and prog_code = 'opa7400'" + orderBy ;
            printLog("read" , s);
            int total = rsSr.getRecordNum(s, limit.intValue());
	        if(total == 0){
	            return ;
	        }
	        String taname = "(SELECT * FROM (SELECT selrs_table.*, rownum AS my_rownum"+
        	        " FROM (SELECT ITEM_CODE, ITEM_NAME, ITEM_NORM, ITEM_MODEL, LEVEL_CODE, SYS_FLAG, ORDER_NO,"+
        	        "  DELAY_FLAG, DELAY_DAYS, PLAN_QTY, RELEASE_QTY, START_QTY, FINISH_QTY, SCRAP_QTY,"+
        	        " ISSUE_QTY, PLAN_START_DATE, PLAN_END_DATE, ACTUAL_START_DATE, ACTUAL_END_DATE,"+
        	        "  DEPT_CODE, DEPT_NAME, ORDER_STATUS, MP_FLAG, KEY_PART_FLAG, COOP_FLAG,"+
        	        " COOP_DB_FLAG, LEAF_FLAG, ORDER_NO_1, SEQ_NO"
        	        +" FROM opa_production_process_query"+
        	        " WHERE company_code = '"+ companyCode + "' and user_unique_id = '"+ userId +"' and nvl(sum_flag,'N')='Y' and prog_code = 'opa7400' "+orderBy+") selrs_table"+
        	        " WHERE rownum <= "+ (start.intValue() + limit.intValue()) +") WHERE my_rownum > "+start+")" ;
	        String sql = "select " + selectFields + " from " +  taname + orderBy ;
            String sql2 = "select " + selectFields + " from " + tableName + "where company_code = '"+ companyCode + "' and nvl(sum_flag,'N')='Y' and user_unique_id = '"+ userId +"'  and prog_code = 'opa7400'" + orderBy ;
	        sql = SQLUtil.pagingSql(sql,"", start, limit ,dbType);
	        sql2 = SQLUtil.pagingSql(sql2,"" , start, limit,dbType);
	        ResultSet rs = null ;
	        List items = new ArrayList();
	        if("root".equals(node)){
	        	printLog("read sql1" , sql);
		        rs = rsSr.getRs(sql);
	        } else {
	        	printLog("read sql2" , sql2);
		        rs = rsSr.getRs(sql2);
	        }
	        printLog("read","3333333333333333333333333");
	        while (rs.next() && rs != null) {
	            Map map = new HashMap();
	            map.put("leaf" , Boolean.valueOf("Y".equals(rs.getString(26)))) ;
	            map.put("hideicon", Boolean.valueOf(true));
	            map.put("item_code", formatString(rs.getString(29)));
	            map.put("item_name", formatString(rs.getString(1)));
	            map.put("item_norm", formatString(rs.getString(2)));
	            map.put("item_model", formatString(rs.getString(3)));
	            map.put("level_code", formatString(rs.getString(4)));
	            map.put("sys_flag", formatString(rs.getString(5)));
	            map.put("order_no", formatString(rs.getString(6)));
	            map.put("delay_flag", formatString(rs.getString(7)));
	            map.put("delay_days", Integer.valueOf(rs.getInt(8)));
	            map.put("plan_qty", Integer.valueOf(rs.getInt(9)));
	            map.put("release_qty", Integer.valueOf(rs.getInt(10)));
	            map.put("start_qty", Integer.valueOf(rs.getInt(11)));
	            map.put("finish_qty", Integer.valueOf(rs.getInt(12)));
	            map.put("scrap_qty", Integer.valueOf(rs.getInt(13)));
	            map.put("issue_qty", Integer.valueOf(rs.getInt(14)));
	            map.put("plan_begin_date", formatString(rs.getString(15)));
	            map.put("plan_end_date", formatString(rs.getString(16)));
	            map.put("actual_begin_date", formatString(rs.getString(17)));
	            map.put("actual_end_date", formatString(rs.getString(18)));
	            map.put("dept_code", formatString(rs.getString(19)));
	            map.put("dept_name", formatString(rs.getString(20)));
	            map.put("order_status", formatString(rs.getString(21)));
	            map.put("mp_flag", formatString(rs.getString(22)));
	            map.put("key_part_flag", formatString(rs.getString(23)));
	            map.put("coop_flag", formatString(rs.getString(24)));
	            map.put("coop_db_flag", formatString(rs.getString(25)));
	            map.put("order_no_q", formatString(rs.getString(27)));
	            map.put("seq_no_q", formatString(rs.getString(28)));
	            items.add(map) ;
	        }
	        data.setData(items) ;
	        data.setTotal(total) ; 
        }
        
        //处理查询头查询条件
        private String getCondition(StoreData data){
            StringBuffer condition = new StringBuffer("");
            //订单跟踪标记
            String CUSTOMER_SEARCH_FLAG  = (String)data.get("CUSTOMER_SEARCH_FLAG");
            if(CUSTOMER_SEARCH_FLAG != null  && CUSTOMER_SEARCH_FLAG != "" ){
                CUSTOMER_SEARCH_FLAG = "true" == CUSTOMER_SEARCH_FLAG?"Y":"N";
                condition.append(" AND EXISTS(SELECT COUNT(*) FROM inv_master WHERE inv_master.item_code = opa_production_process_query.item_code and CUSTOMER_SEARCH_FLAG = '" + CUSTOMER_SEARCH_FLAG + "') ");
            }
            //物料编码
            String ITEM_CODE  = (String)data.get("ITEM_CODE");
            if(ITEM_CODE != null  && ITEM_CODE != "" ){
                if(ITEM_CODE.indexOf(",") != -1){
                    String[] str = ITEM_CODE.split(",");
                    String con = "";
                    for(int i = 0;i<str.length;i++){
                       if(i == 0){
                           con += "'"+ str[i] +"'";
                       }
                       else{
                           con += ", '"+ str[i] +"'";
                       }
                    }
                    condition.append(" AND ITEM_CODE IN(" + con + ")");
                }
                else{
                    condition.append(" AND ITEM_CODE IN('" + ITEM_CODE + "')");
                }
            }
            //部门编码
            String DEPT_CODE  = (String)data.get("DEPT_CODE");
            if(DEPT_CODE != null  && DEPT_CODE != "" ){
                condition.append(" AND DEPT_CODE = '" + DEPT_CODE + "' ");
            }
            //执行阶段
            String SYS_FLAG  = (String)data.get("SYS_FLAG");
            if(SYS_FLAG != null  && SYS_FLAG != "" ){
                condition.append(" AND SYS_FLAG = '" + SYS_FLAG + "' ");
            }
            //起始计划开工日期
            String plan_start_date_begin  = (String)data.get("plan_start_date_begin");
            if(plan_start_date_begin != null  && plan_start_date_begin != "" ){
                condition.append(" AND PLAN_START_DATE >= '" + plan_start_date_begin + "' ");
            }
            //终止计划开工日期
            String plan_start_date_end  = (String)data.get("plan_start_date_end");
            if(plan_start_date_end != null  && plan_start_date_end != "" ){
                condition.append(" AND PLAN_START_DATE <= '" + plan_start_date_end + "' ");
            }
            //起始计划完工日期
            String plan_end_date_begin  = (String)data.get("plan_end_date_begin");
            if(plan_end_date_begin != null  && plan_end_date_begin != "" ){
                condition.append(" AND PLAN_END_DATE >= '" + plan_end_date_begin + "' ");
            }
            //终止计划完工日期
            String plan_end_date_end  = (String)data.get("plan_end_date_end");
            if(plan_end_date_end != null  && plan_end_date_end != "" ){
                condition.append(" AND PLAN_END_DATE <= '" + plan_end_date_end + "' ");
            }
            //起始实际开工日期
            String actual_start_date_begin  = (String)data.get("actual_start_date_begin");
            if(actual_start_date_begin != null  && actual_start_date_begin != "" ){
                condition.append(" AND ACTUAL_START_DATE >= '" + actual_start_date_begin + "' ");
            }
            //终止实际开工日期
            String actual_start_date_end  = (String)data.get("actual_start_date_end");
            if(actual_start_date_end != null  && actual_start_date_end != "" ){
                condition.append(" AND ACTUAL_START_DATE <= '" + actual_start_date_end + "' ");
            }
            //起始实际完工日期
            String actual_end_date_begin  = (String)data.get("actual_end_date_begin");
            if(actual_end_date_begin != null  && actual_end_date_begin != "" ){
                condition.append(" AND ACTUAL_END_DATE >= '" + actual_end_date_begin + "' ");
            }
            //终止实际完工日期
            String actual_end_date_end  = (String)data.get("actual_end_date_end");
            if(actual_end_date_end != null  && actual_end_date_end != "" ){
                condition.append(" AND ACTUAL_END_DATE <= '" + actual_end_date_end + "' ");
            }
            //自制/采购
            String MP_FLAG  = (String)data.get("MP_FLAG");
            if(MP_FLAG != null  && MP_FLAG != "" ){
                condition.append(" AND MP_FLAG = '" + MP_FLAG + "' ");
            }
            //关键件标记
            /*String KEY_PART_FLAG  = (String)data.get("KEY_PART_FLAG");
            if(KEY_PART_FLAG != null  && KEY_PART_FLAG != "" ){
                KEY_PART_FLAG = "true" == KEY_PART_FLAG?"Y":"N";
                condition.append(" AND KEY_PART_FLAG = '" + KEY_PART_FLAG + "' ");
            }*/
            //拖期标记
            String DELAY_FLAG  = (String)data.get("DELAY_FLAG");
            if(DELAY_FLAG != null  && DELAY_FLAG != "" ){
                condition.append(" AND DELAY_FLAG = '" + DELAY_FLAG + "' ");
            }
            //外协标记
            String COOP_FLAG  = (String)data.get("COOP_FLAG");
            if(COOP_FLAG != null  && COOP_FLAG != "" ){
                condition.append(" AND COOP_FLAG = '" + COOP_FLAG + "' ");
            }
            //带料标记
            String COOP_DB_FLAG  = (String)data.get("COOP_DB_FLAG");
            if(COOP_DB_FLAG != null && COOP_DB_FLAG != "" ){
                condition.append(" AND COOP_DB_FLAG = '" + COOP_DB_FLAG + "' ");
            }
            
            return condition.toString();
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