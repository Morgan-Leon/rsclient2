<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
    	
    	public void registerMethods(MethodMap mm) throws Exception{
    	    super.registerMethods(mm) ;
    	    //注册 检测主键是否重复的方法
    	    mm.add("checkKeyRepeat")
                .addStringParameter("itemCode")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType)
                .setMapReturnValue();
          
    	    //注册 检测更新记录的方法(包括修改和新增)
            mm.add("updateRecord")
              .addStringParameter("item_code")
              .addMapParameter("data")
              .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
              .addStringParameter(WebKeys.CompanyCodeKey)
              .addStringParameter(WebKeys.UserUniqueIdKey)
              .addStringParameter(WebKeys.DbType)
              .setBooleanReturnValue() ;
                    
    	}
        
    	/** 
         * @method 更新记录
         * @param {String} item_code  仓库编码
         * @param {Map} data  修改的数据
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
        public boolean updateRecord(String item_code,Map data, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception{
        	String sql = "SELECT count(*) FROM INV_MASTER WHERE company_code ='" + companyCode  + "' AND item_code = '" + item_code + "'";
        	printLog("updateRecord" , sql);
        	ResultSet rs = rsSr.getRs(sql);
            Map map = new HashMap() ;
            map.putAll((Map)data.get("commonDataValue")) ;
            map.putAll((Map)data.get("warehouseDataValue")) ;
            map.putAll((Map)data.get("productPlanValue")) ;
            map.putAll((Map)data.get("financialValue")) ;
            map.putAll((Map)data.get("otherValue")) ;
            map.remove("company_name");
        	rs.next() ;
        	if(rs.getInt(1) > 0){//说明是要更新
        		return modifyRecord(map,rsSr,companyCode,userId,dbType);
        	} else {
       		    return insertRecord(map,rsSr,companyCode,userId,dbType);
        	}
        }
        
        /** 
         * @method 修改记录
         * @param {Map} data  修改的数据集合
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
        private boolean modifyRecord(Map map, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
        	try {
        		StringBuffer value = new StringBuffer() ;
                Iterator it = map.entrySet().iterator();
                while (it.hasNext()) {  
                    Map.Entry e = (Map.Entry) it.next();
                    String realValue = "" ;
                    if("true".equals(e.getValue())){
                        realValue = "Y" ;
                    } else if("false".equals(e.getValue())){
                        realValue = "N" ;
                    } else {
                        realValue = e.getValue().toString() ;
                    }
                    value.append(e.getKey()).append("='").append(realValue).append("', ") ;
                }
                String updateSql = "update INV_MASTER set " + value.toString().substring(0,value.toString().lastIndexOf(","))
                        + " where  company_code='" + companyCode + "' and item_code='" + map.get("item_code") + "'";
                printLog("modifyRecord" , updateSql);
                rsSr.update(updateSql) ;
                return true ;
        	}catch (Exception e){
	       		return false ;
        	}
        }
          
        /** 
         * @method 新增记录
         * @param {Map} data  修改的数据集合
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
        private boolean insertRecord(Map map, SelRs rsSr, String companyCode,
                String userId, String dbType) throws Exception {
        	try {
        		StringBuffer key = new StringBuffer() ;
                StringBuffer value = new StringBuffer() ;
                
                String sql = "select account_name from edm_address where company_code = '"
                    + companyCode + "' and user_unique_id = '" + userId + "'";
                String userName = "" ;
                printLog("insertRecord" , sql);
                ResultSet rs = rsSr.getRs(sql);
                if (rs != null && rs.next()) {
                    userName = rs.getString(1);
                }
                map.put("input_id",userId) ;
                map.put("input_man",userId) ;
                map.put("input_name",userName) ;
                
                Iterator it = map.entrySet().iterator();
                while (it.hasNext()) {
                    Map.Entry e = (Map.Entry) it.next();
                    key.append(e.getKey()).append(",") ;
                    String realValue = "" ;
                    if("true".equals(e.getValue())){
                        realValue = "Y" ;
                    } else if("false".equals(e.getValue())){
                        realValue = "N" ;
                    } else {
                        realValue = e.getValue().toString() ;
                    }
                    value.append("'").append(realValue).append("',") ;
                }
                String insertSql = "insert into INV_MASTER(" + key.toString().substring(0,key.toString().lastIndexOf(","))
                        + ") values(" + value.toString().substring(0,value.toString().lastIndexOf(",")) + ")" ;
                
                printLog("insertRecord" , insertSql);
            	return rsSr.update(insertSql) ;    
        	} catch (Exception e) {
        		return false ;
        	}
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
        	
			String query_item_code = (String) data.get("query_item_code");
			String query_item_name = (String) data.get("query_item_name");
			String query_drawing_no = (String) data.get("query_drawing_no");
			String query_memory_code = (String) data.get("query_memory_code");
			String query_item_abv = (String) data.get("query_item_abv");
			String query_item_model = (String) data.get("query_item_model");
			String query_special_class = (String) data.get("query_special_class");
			String query_lot_policy = (String) data.get("query_lot_policy");
			String query_pseudo_flag = (String) data.get("query_pseudo_flag");
			String query_mrp_flag = (String) data.get("query_mrp_flag");
			String query_routing_flag = (String) data.get("query_routing_flag");

        	
            String sql = "SELECT company_code,org_id,item_code,item_name,item_abv,item_norm,item_model,gb_code,drawing_no, "
            	+ "refer_code,memory_code,normal_class,group_code,feature_code,om_class,inv_class,pm_class,qc_class,gl_class,"
            	+ "sv_class,tool_class,pm_flag,om_flag,inv_flag,qc_flag,special_class,em_no,warehouse_code,bin_code,location_code,"
            	+ "lot_flag,stock_unit,bi_unit_flag,second_unit,assist_unit,pm_unit,om_unit,pm_stock_rate,om_stock_rate,"
            	+ "stock2_rate,unique_flag,safety_stock,max_stock,min_stock,tolerance,price_sys,abc_class,stock_days,on_hand_qty,"
            	+ "on_hand_amt,norm_price,allocation_qty,inspection_qty,scrap_qty,cycle_count,cost_flag,plan_price,standard_cost,"
            	+ "actual_cost,tax_code,tax_desc,tax_rate,net_weight,net_unit,gross_weight,gross_unit,var_code,byproduct_flag,"
            	+ "acct_no,acct_no1,acct_material,acct_pur,acct_var,acct_income,mrp_flag,lot_policy,lot_qty,round_times,"
            	+ "dept_code,scrap_rate,product_flag,phantom_flag,item_list_flag,mp_flag,mps_flag,planner_code,lot_merge_flag,"
            	+ "pseudo_flag,lead_time_flag,lead_time,lead_days,norm_batch,plan_constant,lot_days,order_point,order_qty,"
            	+ "onhand_flag,stock_ok_qty,low_level_code,pac_flag,routing_no,routing_flag,coop_flag,limit_flag,key_part_flag,"
            	+ "bom_flag,material_flag,create_flag,input_date,input_id,input_man,input_name,new_flag,valid_flag,material_man,"
            	+ "key_class,item_volume,volume_unit,item_square,square_unit,set_flag,kb_flag,rs_char1,rs_char2,"
            	+ "rs_char3,rs_int1,rs_int2,rs_int3,rs_float1,rs_float2,rs_float3,csm_flag,qc_trace_type,gl_mp_flag,"
            	+ "straight_send_flag,jit_unstock_qty,pick_round_times,grp_pm_flag,self_pm_flag,admeasure_flag,dispense_flag,"
            	+ "update_flag,repair_flag,repair_period,new_old_flag,repair_op_flag,new_rate,lead_time_check,repair_list_code,"
            	+ "life_period,unit_weight,unit_weight_unit,pdm_material_flag,check_dept_code,parent_abv,note1,coop_db_flag,"
            	+ "pac_trace_flag,customer_search_flag,bs_flag,fap_resource,op_diff_flag,lot_merge_mp FROM inv_master "
                + " WHERE company_code='" + companyCode + "'" 
                + ((query_item_code!=null)? (" AND item_code LIKE '" + query_item_code + "%'"):"")              
                + ((query_item_name!=null)? (" AND item_name LIKE '" + query_item_name + "%'"):"")                 
                + ((query_drawing_no!=null)? (" AND drawing_no LIKE '" + query_drawing_no + "%'"):"")                 
                + ((query_memory_code!=null)? (" AND memory_code LIKE '" + query_memory_code + "%'"):"")                 
                + ((query_item_abv!=null)? (" AND item_abv LIKE '" + query_item_abv + "%'"):"")                 
                + ((query_item_model!=null)? (" AND item_model LIKE '" + query_item_model + "%'"):"")                 
                + ((query_special_class!=null)? (" AND special_class LIKE '" + query_special_class + "%'"):"")                 
                + ((query_lot_policy!=null)? (" AND lot_policy LIKE '" + query_lot_policy + "%'"):"")                 
                + ((query_pseudo_flag!=null)? (" AND pseudo_flag LIKE '" + query_pseudo_flag + "%'"):"")                
                + ((query_mrp_flag!=null)? (" AND mrp_flag LIKE '" + query_mrp_flag + "%'"):"")                 
                + ((query_routing_flag!=null)? (" AND routing_flag LIKE '" + query_routing_flag + "%'"):"") ;                 
            
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql,sortInfo,start, limit ,dbType);
            List items = new ArrayList();
            printLog("read" , sql);
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                
                map.put("company_code",formatString(rs.getString(1)));
                map.put("org_id",formatString(rs.getString(2)));
                map.put("item_code",formatString(rs.getString(3)));
                map.put("item_name",formatString(rs.getString(4)));
                map.put("item_abv",formatString(rs.getString(5)));
                map.put("item_norm",formatString(rs.getString(6)));
                map.put("item_model",formatString(rs.getString(7)));
                map.put("gb_code",formatString(rs.getString(8)));
                map.put("drawing_no",formatString(rs.getString(9)));
                map.put("refer_code",formatString(rs.getString(10)));
                map.put("memory_code",formatString(rs.getString(11)));
                map.put("normal_class",formatString(rs.getString(12)));
                map.put("group_code",formatString(rs.getString(13)));
                map.put("feature_code",formatString(rs.getString(14)));
                map.put("om_class",formatString(rs.getString(15)));
                map.put("inv_class",formatString(rs.getString(16)));
                map.put("pm_class",formatString(rs.getString(17)));
                map.put("qc_class",formatString(rs.getString(18)));
                map.put("gl_class",formatString(rs.getString(19)));
                map.put("sv_class",formatString(rs.getString(20)));
                map.put("tool_class",formatString(rs.getString(21)));
                map.put("pm_flag",formatString(rs.getString(22)));
                map.put("om_flag",formatString(rs.getString(23)));
                map.put("inv_flag",formatString(rs.getString(24)));
                map.put("qc_flag",formatString(rs.getString(25)));
                map.put("special_class",formatString(rs.getString(26)));
                map.put("em_no",formatString(rs.getString(27)));
                map.put("warehouse_code",formatString(rs.getString(28)));
                map.put("bin_code",formatString(rs.getString(29)));
                map.put("location_code",formatString(rs.getString(30)));
                map.put("lot_flag",formatString(rs.getString(31)));
                map.put("stock_unit",formatString(rs.getString(32)));
                map.put("bi_unit_flag",formatString(rs.getString(33)));
                map.put("second_unit",formatString(rs.getString(34)));
                map.put("assist_unit",formatString(rs.getString(35)));
                map.put("pm_unit",formatString(rs.getString(36)));
                map.put("om_unit",formatString(rs.getString(37)));
                map.put("pm_stock_rate",Integer.valueOf(rs.getInt(38)));
                map.put("om_stock_rate",Integer.valueOf(rs.getInt(39)));
                map.put("stock2_rate",Integer.valueOf(rs.getInt(40)));
                map.put("unique_flag",formatString(rs.getString(41)));
                map.put("safety_stock",Integer.valueOf(rs.getInt(42)));
                map.put("max_stock",Integer.valueOf(rs.getInt(43)));
                map.put("min_stock",Integer.valueOf(rs.getInt(44)));
                map.put("tolerance",Double.valueOf(rs.getDouble(45)));
                map.put("price_sys",formatString(rs.getString(46)));
                map.put("abc_class",formatString(rs.getString(47)));
                map.put("stock_days",Integer.valueOf(rs.getInt(48)));
                map.put("on_hand_qty",Double.valueOf(rs.getDouble(49)));
                map.put("on_hand_amt",Double.valueOf(rs.getDouble(50)));
                map.put("norm_price",Integer.valueOf(rs.getInt(51)));
                map.put("allocation_qty",Double.valueOf(rs.getDouble(52)));
                map.put("inspection_qty",Integer.valueOf(rs.getInt(53)));
                map.put("scrap_qty",Integer.valueOf(rs.getInt(54)));
                map.put("cycle_count",Integer.valueOf(rs.getInt(55)));
                map.put("cost_flag",formatString(rs.getString(56)));
                map.put("plan_price",Integer.valueOf(rs.getInt(57)));
                map.put("standard_cost",Integer.valueOf(rs.getInt(58)));
                map.put("actual_cost",Integer.valueOf(rs.getInt(59)));
                map.put("tax_code",formatString(rs.getString(60)));
                map.put("tax_desc",formatString(rs.getString(61)));
                map.put("tax_rate",Integer.valueOf(rs.getInt(62)));
                map.put("net_weight",Double.valueOf(rs.getDouble(63)));
                map.put("net_unit",formatString(rs.getString(64)));
                map.put("gross_weight",Integer.valueOf(rs.getInt(65)));
                map.put("gross_unit",formatString(rs.getString(66)));
                map.put("var_code",formatString(rs.getString(67)));
                map.put("byproduct_flag",formatString(rs.getString(68)));
                map.put("acct_no",formatString(rs.getString(69)));
                map.put("acct_no1",formatString(rs.getString(70)));
                map.put("acct_material",formatString(rs.getString(71)));
                map.put("acct_pur",formatString(rs.getString(72)));
                map.put("acct_var",formatString(rs.getString(73)));
                map.put("acct_income",formatString(rs.getString(74)));
                map.put("mrp_flag",formatString(rs.getString(75)));
                map.put("lot_policy",formatString(rs.getString(76)));
                map.put("lot_qty",Integer.valueOf(rs.getInt(77)));
                map.put("round_times",Integer.valueOf(rs.getInt(78)));
                map.put("dept_code",formatString(rs.getString(79)));
                map.put("scrap_rate",Integer.valueOf(rs.getInt(80)));
                map.put("product_flag",formatString(rs.getString(81)));
                map.put("phantom_flag",formatString(rs.getString(82)));
                map.put("item_list_flag",formatString(rs.getString(83)));
                map.put("mp_flag",formatString(rs.getString(84)));
                map.put("mps_flag",formatString(rs.getString(85)));
                map.put("planner_code",formatString(rs.getString(86)));
                map.put("lot_merge_flag",formatString(rs.getString(87)));
                map.put("pseudo_flag",formatString(rs.getString(88)));
                map.put("lead_time_flag",formatString(rs.getString(89)));
                map.put("lead_time",Integer.valueOf(rs.getInt(90)));
                map.put("lead_days",Integer.valueOf(rs.getInt(91)));
                map.put("norm_batch",Integer.valueOf(rs.getInt(92)));
                map.put("plan_constant",Integer.valueOf(rs.getInt(93)));
                map.put("lot_days",Integer.valueOf(rs.getInt(94)));
                map.put("order_point",Integer.valueOf(rs.getInt(95)));
                map.put("order_qty",Integer.valueOf(rs.getInt(96)));
                map.put("onhand_flag",formatString(rs.getString(97)));
                map.put("stock_ok_qty",Integer.valueOf(rs.getInt(98)));
                map.put("low_level_code",Integer.valueOf(rs.getInt(99)));
                map.put("pac_flag",formatString(rs.getString(100)));
                map.put("routing_no",formatString(rs.getString(101)));
                map.put("routing_flag",formatString(rs.getString(102)));
                map.put("coop_flag",formatString(rs.getString(103)));
                map.put("limit_flag",formatString(rs.getString(104)));
                map.put("key_part_flag",formatString(rs.getString(105)));
                map.put("bom_flag",formatString(rs.getString(106)));
                map.put("material_flag",formatString(rs.getString(107)));
                map.put("create_flag",formatString(rs.getString(108)));
                map.put("input_date",formatString(rs.getString(109)));
                map.put("input_id",formatString(rs.getString(110)));
                map.put("input_man",formatString(rs.getString(111)));
                map.put("input_name",formatString(rs.getString(112)));
                map.put("new_flag",formatString(rs.getString(113)));
                map.put("valid_flag",formatString(rs.getString(114)));
                map.put("material_man",formatString(rs.getString(115)));
                map.put("key_class",formatString(rs.getString(116)));
                map.put("item_volume",Integer.valueOf(rs.getInt(117)));
                map.put("volume_unit",formatString(rs.getString(118)));
                map.put("item_square",Integer.valueOf(rs.getInt(119)));
                map.put("square_unit",formatString(rs.getString(120)));
                map.put("set_flag",formatString(rs.getString(121)));
                map.put("kb_flag",formatString(rs.getString(122)));
                map.put("rs_char1",formatString(rs.getString(123)));
                map.put("rs_char2",formatString(rs.getString(124)));
                map.put("rs_char3",formatString(rs.getString(125)));
                map.put("rs_int1",Integer.valueOf(rs.getInt(126)));
                map.put("rs_int2",Integer.valueOf(rs.getInt(127)));
                map.put("rs_int3",Integer.valueOf(rs.getInt(128)));
                map.put("rs_float1",Integer.valueOf(rs.getInt(129)));
                map.put("rs_float2",Integer.valueOf(rs.getInt(130)));
                map.put("rs_float3",Integer.valueOf(rs.getInt(131)));
                map.put("csm_flag",formatString(rs.getString(132)));
                map.put("qc_trace_type",formatString(rs.getString(133)));
                map.put("gl_mp_flag",formatString(rs.getString(134)));
                map.put("straight_send_flag",formatString(rs.getString(135)));
                map.put("jit_unstock_qty",Integer.valueOf(rs.getInt(136)));
                map.put("pick_round_times",Double.valueOf(rs.getDouble(137)));
                map.put("grp_pm_flag",formatString(rs.getString(138)));
                map.put("self_pm_flag",formatString(rs.getString(139)));
                map.put("admeasure_flag",formatString(rs.getString(140)));
                map.put("dispense_flag",formatString(rs.getString(141)));
                map.put("update_flag",formatString(rs.getString(142)));
                map.put("repair_flag",formatString(rs.getString(143)));
                map.put("repair_period",Double.valueOf(rs.getDouble(144)));
                map.put("new_old_flag",formatString(rs.getString(145)));
                map.put("repair_op_flag",formatString(rs.getString(146)));
                map.put("new_rate",Integer.valueOf(rs.getInt(147)));
                map.put("lead_time_check",Double.valueOf(rs.getDouble(148)));
                map.put("repair_list_code",formatString(rs.getString(149)));
                map.put("life_period",Integer.valueOf(rs.getInt(150)));
                map.put("unit_weight",Integer.valueOf(rs.getInt(151)));
                map.put("unit_weight_unit",formatString(rs.getString(152)));
                map.put("pdm_material_flag",formatString(rs.getString(153)));
                map.put("check_dept_code",formatString(rs.getString(154)));
                map.put("parent_abv",formatString(rs.getString(155)));
                map.put("note1",formatString(rs.getString(156)));
                map.put("coop_db_flag",formatString(rs.getString(157)));
                map.put("pac_trace_flag",formatString(rs.getString(158)));
                map.put("customer_search_flag",formatString(rs.getString(159)));
                map.put("bs_flag",formatString(rs.getString(160)));
                map.put("fap_resource",formatString(rs.getString(161)));
                map.put("op_diff_flag",formatString(rs.getString(162)));
                map.put("lot_merge_mp",formatString(rs.getString(163)));
                items.add(map);
            }
            
            data.setData(items);
            
            String sqlSum = "SELECT COUNT(1) FROM inv_master  WHERE company_code='" + companyCode + "'"
			            + ((query_item_code!=null)? (" AND item_code LIKE '" + query_item_code + "%'"):"")              
			            + ((query_item_name!=null)? (" AND item_name LIKE '" + query_item_name + "%'"):"")                 
			            + ((query_drawing_no!=null)? (" AND drawing_no LIKE '" + query_drawing_no + "%'"):"")                 
			            + ((query_memory_code!=null)? (" AND memory_code LIKE '" + query_memory_code + "%'"):"")                 
			            + ((query_item_abv!=null)? (" AND item_abv LIKE '" + query_item_abv + "%'"):"")                 
			            + ((query_item_model!=null)? (" AND item_model LIKE '" + query_item_model + "%'"):"")                 
			            + ((query_special_class!=null)? (" AND special_class LIKE '" + query_special_class + "%'"):"")                 
			            + ((query_lot_policy!=null)? (" AND lot_policy LIKE '" + query_lot_policy + "%'"):"")                 
			            + ((query_pseudo_flag!=null)? (" AND pseudo_flag LIKE '" + query_pseudo_flag + "%'"):"")                
			            + ((query_mrp_flag!=null)? (" AND mrp_flag LIKE '" + query_mrp_flag + "%'"):"")                 
			            + ((query_routing_flag!=null)? (" AND routing_flag LIKE '" + query_routing_flag + "%'"):"") ;
            printLog("read" , sqlSum);
			//获取总数
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
			    data.setTotal(rs2.getInt(1));
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
            rsSr.beginTrans();
            for(int i=0,len=items.size();i<len;i++){
            	Map map = (Map)items.get(i) ;
            	Iterator it = map.entrySet().iterator();
	       		String key = "" ;
	       		while (it.hasNext()) {  
	       			Map.Entry e = (Map.Entry) it.next();
	       		}
            	String deletesql = "delete from INV_MASTER where company_code='" + companyCode
                                 + "' and item_code='" + map.get("item_code") + "'";
            	printLog("destroy" , deletesql);
                rsSr.preTrans(deletesql);
            }
            rsSr.doTrans();
            
        }
        
        
        /** 
         * @method 检测是否重复
         * @param {String} warehouseCode  传递过来的参数
         * @param {String} actionType 操作的类型
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {Map}  返回信息
         */
        public Map checkKeyRepeat(String itemCode, SelRs rsSr,
                String companyCode, String userId, String dbType) throws Exception {
        	 String sql = "SELECT count(*) FROM INV_MASTER WHERE company_code ='" + companyCode  + "' AND item_code = '" + itemCode + "'";
            printLog("checkKeyRepeat" , sql);
            ResultSet rs = rsSr.getRs(sql) ;
            int count = 0 ;
            if(rs != null && rs.next()){
                 count = rs.getInt(1) ;
            }
            Map map = new HashMap();
            if(count > 0){
                map.put("success" , "false") ;
                map.put("msg" , "物料编码重复") ;
            } else {
                map.put("success" , "true") ;
            }
            return map ;
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