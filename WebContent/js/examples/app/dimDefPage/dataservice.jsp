<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("getSubDimMember").addStringParameter("dimId")
					.addStringParameter("dimType").addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setListReturnValue();
            

			mm.add("getDimMembers").addStringParameter("dimId")
					.addStringParameter("dimType").addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setListReturnValue();
            

			mm.add("getDimTypes").addObjectParameter(WebKeys.SelRsKey,
					SelRs.class).addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.setListReturnValue();

			mm.add("getTableNameFromDimId").addStringParameter("dimId")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.setStringReturnValue();
            
            mm.add("generateDim").addStringParameter("dimType")
                .addObjectParameter(
                    WebKeys.SelRsKey, SelRs.class).addStringParameter(
                    WebKeys.CompanyCodeKey).setBooleanReturnValue();
            

    		mm.add("read").addStringParameter("dimType")
                .addStringParameter("dimId")
                .addStringParameter("dimDesc")
                .addObjectParameter(
    				WebKeys.SelRsKey, SelRs.class).addStringParameter(
    				WebKeys.CompanyCodeKey).addStringParameter(
    				WebKeys.UserUniqueIdKey).setListReturnValue();
            
            mm.add("addSubMember").addStringParameter("pId")
                .addStringParameter("plevel")
                .addStringParameter("identifier")
                .addStringParameter("desc")
                .addListParameter("dimAttributes")
                .addObjectParameter(
                        WebKeys.SelRsKey, SelRs.class).addStringParameter(
                        WebKeys.CompanyCodeKey).addStringParameter(
                        WebKeys.UserUniqueIdKey).setBooleanReturnValue();
            
            mm.add("searchByAttributes").addStringParameter("desc")
                .addListParameter("dimAttributes")
                .addObjectParameter(
                        WebKeys.SelRsKey, SelRs.class).addStringParameter(
                        WebKeys.CompanyCodeKey).addStringParameter(
                        WebKeys.UserUniqueIdKey).setListReturnValue();
		}

        public List getSubDimMember(String id, String type, SelRs rsSr,
                String companyCode, String userId) throws Exception {
            
            log("id:" + id);
            log("type:" + type);
            
            
            if (type.equals("root")) {
                return this.getDimTypes(rsSr, companyCode, userId);
            } else {
                return this.getDimMembers(id, type, rsSr, companyCode,
                        userId);
            }
        }

        private List getDimTypes(SelRs rsSr, String companyCode, String userId)
                throws Exception {
            
            String sqlDimTypes = "select '1' as dimId, a.dim_id as dimType, a.dim_name "
                    + " from opa_dimension_def a "
                    + " where a.company_code = '"
                    + companyCode
                    + "' order by a.dim_id";
            log(sqlDimTypes);
            List<Map> list = new ArrayList<Map>();
            ResultSet rsDimTypes = rsSr.getRs(sqlDimTypes);
            while (rsDimTypes.next()) {
                Map<String,String> map = new HashMap<String,String>();
                map.put("dimId", rsDimTypes.getString(1));
                map.put("dimType", rsDimTypes.getString(2));
                map.put("text", rsDimTypes.getString(3));
                map.put("path","");
                map.put("level","0");
                list.add(map);
            }
            int lsize = list.size();
            for( int i=0; i < lsize; i++){
                Map map = list.get(i);
                String tableName = this.getTableNameFromDimId((String)map.get("dimType"), rsSr, companyCode);
                
                String sqlIsFinal = "SELECT COUNT(ttda.id) FROM " + tableName 
                + " ttda, (select * from "+ tableName 
                + " where id=1 and company_code = '" + companyCode + "') ttd"
                + " WHERE ttda.company_code = ttd.company_code"
                + " AND ttda.id != ttd.id"
                + " AND ttda.level_no = ttd.level_no + 1"
                + " AND nvl(nvl(ttd.level_1, ttda.level_1), ttd.ROWID) = nvl(ttda.level_1, ttd.ROWID)"
                + " AND nvl(nvl(ttd.level_2, ttda.level_2), ttd.ROWID) = nvl(ttda.level_2, ttd.ROWID)"
                + " AND nvl(nvl(ttd.level_3, ttda.level_3), ttd.ROWID) = nvl(ttda.level_3, ttd.ROWID)"
                + " AND nvl(nvl(ttd.level_4, ttda.level_4), ttd.ROWID) = nvl(ttda.level_4, ttd.ROWID)"
                + " AND nvl(nvl(ttd.level_5, ttda.level_5), ttd.ROWID) = nvl(ttda.level_5, ttd.ROWID)";
                
               
                
                ResultSet rsIsFinal = rsSr.getRs(sqlIsFinal);
                int subMember = 0;
                if(rsIsFinal.next()){
                    subMember = Integer.parseInt(rsIsFinal.getString(1));
                }
                if(subMember > 0){
                    map.put("leaf", Boolean.valueOf(false));
                } else{
                    map.put("leaf", Boolean.valueOf(true));   
                }
                
                list.set(i,map);
            }
            return list;
        }
        
		public List getDimMembers(String id, String type, SelRs rsSr,
				String companyCode, String userId) throws Exception {
            
			String tableName = this.getTableNameFromDimId(type, rsSr, companyCode);
            
            List<Map> list = new ArrayList<Map>();
            String sqlDimMembers = "select a.id, a.dim_desc, a.level_no, a.level_1 as level_1, a.level_2 as level_2, a.level_3 as level_3, a.level_4 as level_4, a.level_5 as level_5 from "+ tableName 
                + " a, (SELECT * FROM " +tableName 
                + " where id="+id+" and company_code='"+companyCode+"') b"
                + " WHERE a.company_code = b.company_code AND a.id != b.id " 
                + " AND a.level_no = b.level_no + 1"
                + " AND nvl(nvl(b.level_1, a.level_1), b.ROWID) = nvl(a.level_1, b.ROWID)"
                + " AND nvl(nvl(b.level_2, a.level_2), b.ROWID) = nvl(a.level_2, b.ROWID)"
                + " AND nvl(nvl(b.level_3, a.level_3), b.ROWID) = nvl(a.level_3, b.ROWID)"
                + " AND nvl(nvl(b.level_4, a.level_4), b.ROWID) = nvl(a.level_4, b.ROWID)"
                + " AND nvl(nvl(b.level_5, a.level_5), b.ROWID) = nvl(a.level_5, b.ROWID)";
            
            ResultSet rs = rsSr.getRs(sqlDimMembers);
            while(rs.next()){
				Map map = new HashMap();
				map.put("dimId", rs.getString(1));
				map.put("dimType", type);
				map.put("text", rs.getString(2));
                map.put("level",rs.getString(3));
				StringBuffer path = new StringBuffer();
	            for(int l=1;l<6;l++){
	              String lv = rs.getString("level_" + l);
	              if(lv!=null) path.append("/" + lv);
	              else break;
	            }
                map.put("path",path.toString());
                list.add(map);
            }
            int lsize = list.size();
            for(int i = 0; i < lsize; i++ ){
                Map map = list.get(i);
                String dimid = (String)map.get("dimId");
				String sqlIsFinal = "SELECT COUNT(ttda.id) FROM " + tableName 
                    + " ttda, (select * from "+ tableName 
                    + " where id=" + dimid + " and company_code = '" + companyCode + "') ttd"
                    + " WHERE ttda.company_code = ttd.company_code"
                    + " AND ttda.id != ttd.id"
                    + " AND ttda.level_no = ttd.level_no + 1"
                    + " AND nvl(nvl(ttd.level_1, ttda.level_1), ttd.ROWID) = nvl(ttda.level_1, ttd.ROWID)"
                    + " AND nvl(nvl(ttd.level_2, ttda.level_2), ttd.ROWID) = nvl(ttda.level_2, ttd.ROWID)"
                    + " AND nvl(nvl(ttd.level_3, ttda.level_3), ttd.ROWID) = nvl(ttda.level_3, ttd.ROWID)"
                    + " AND nvl(nvl(ttd.level_4, ttda.level_4), ttd.ROWID) = nvl(ttda.level_4, ttd.ROWID)"
                    + " AND nvl(nvl(ttd.level_5, ttda.level_5), ttd.ROWID) = nvl(ttda.level_5, ttd.ROWID)";

	            
                ResultSet rsIsFinal = rsSr.getRs(sqlIsFinal);
                
                int subMember = 0;
                if(rsIsFinal.next()){
                    subMember = Integer.parseInt(rsIsFinal.getString(1));
                }
                if(subMember > 0){
				    map.put("leaf", Boolean.valueOf(false));
                } else{
                	map.put("leaf", Boolean.valueOf(true));   
                }
                
                
                
                list.set(i,map);
            }
    		rs.close();
			return list;
		}

		private String getTableNameFromDimId(String dimId, SelRs rsSr,
				String companyCode) throws Exception {

			/**
			 * 查询dim_code
			 */
			String sql4DimCode = "select dim_code from opa_dimension_def where company_code = '"
					+ companyCode + "' and dim_id = " + dimId;

			ResultSet rs4DimCode = rsSr.getRs(sql4DimCode);
			rs4DimCode.next();
			String dim_code = (String) rs4DimCode.getString(1);
			rs4DimCode.next();
			dim_code = dim_code == null ? "" : dim_code;

			/**
			 * 查询table_name
			 */
			String sqlForTableName = "select opa_name_mgr.get_pub_dim_table('"
					+ dim_code + "') from dual";
			ResultSet rsTableName = rsSr.getRs(sqlForTableName);
			rsTableName.next();
			String table_name = rsTableName.getString(1);
			rsTableName.close();
			table_name = table_name == null ? "" : table_name;
			return table_name;
		}
        
        public Boolean generateDim(String dimType, SelRs rsSr, String companyCode){
        	String sp = "EXEC opa_def.generate_dimension(  pi_company_code => '"+companyCode+"' , pi_dim_id => "+dimType+")";
            System.out.println("执行存储过程 -----> "+sp);
            if (!rsSr.callSp(sp)){
              return false;
            }else{
             return true;
            }
        }
        
        public List read(String dimType, String dimId, String dimDesc, SelRs rsSr, String companyCode, String userId
    			) throws Exception{
    		
    		String sql = "select dim_desc , id , level_no , attribute_1 ," 
                + " attribute_2 , attribute_3 , attribute_4 , attribute_5 " 
                + "from opa_time_dimension "
                + " WHERE company_code = '"
				+ companyCode
				+ "' and dim_desc like '" + dimDesc + "%' order by id";
            
            System.out.println("searchsql:---------"+sql);
            
            List<Map> items = new ArrayList<Map>();
            ResultSet rs = rsSr.getRs(sql);
                while (rs.next()) {
                    Map map = new HashMap();
                    map.put("desc", rs.getString(1));
                    map.put("level", rs.getString(3));
                    map.put("id", rs.getString(2));
                    map.put("1", rs.getString(4));
                    map.put("2", rs.getString(5));
                    map.put("3", rs.getString(6));
                    map.put("4", rs.getString(7));
                    map.put("5", rs.getString(8));
                    items.add(map);
                }
                int itemNum = items.size();
                for(int i = 0; i < itemNum; i++){
                	Map map = items.get(i);
                    int level_no = Integer.parseInt(map.get("level").toString());
                    
                    String id = (String)map.get("id");
                	
                    /**
                     * 查询 path 
                     */
                    String path = "";
                    String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
                    if (level_no >= 1) {
                      StringBuffer sb = new StringBuffer();
                      for (int j = 1; j < level_no; j++) {
                        sb.append("level_" + j + ", ");
                      }
                      sb.append("level_" + level_no + " ");
                      String sql4Path = "select " + sb.toString() + " from opa_time_dimension"
                          + " where company_code = '"
                          + companyCode + "' and id = " + id;
                      
                      
                      ResultSet rs4Path = rsSr.getRs(sql4Path);
                      StringBuffer sb4Path = new StringBuffer("/");
                      rs4Path.next();
                      for (int k = 1; k < level_no; k++) {
                        String temp4Path = (String) rs4Path.getString(k);
                        temp4Path = temp4Path == null ? "" : temp4Path + "/";
                        sb4Path.append(temp4Path);
                      }
                      level_no_value = (String) rs4Path.getString(level_no);
                      sb4Path.append(level_no_value);
                      path = sb4Path.toString();
                      rs4Path.close();
                    }
                    map.put("path",path);
                    
                    System.out.println("path-------:"+path);
                    
                    /**
                     * 查询 is_final 
                     */
                    boolean is_final = true;
                    String sql4IsFinal = "";
                    if (level_no >= 1) {
                      StringBuffer sb = new StringBuffer();
                      String[] pathArray = path.split("/");
                      for (int j = 1; j <= level_no; j++) {
                        sb.append(" level_" + j + " = '" + pathArray[j]
                            + "' and");
                      }
                      sql4IsFinal = "select nvl(count(id),0) from opa_time_dimension"
                          + " where level_no = "
                          + (level_no + 1)
                          + " and company_code = '"
                          + companyCode
                          + "'"
                          + " and "
                          + ((sb.toString().endsWith("and")) ? (sb.toString()
                              .substring(0, sb.toString().length() - 3))
                              : sb.toString());
                    } else {
                      sql4IsFinal = "select nvl(count(id),0) from opa_time_dimension"
                          + " where level_no = " + (level_no + 1)
                          + " and company_code = '" + companyCode + "'";
                    }
                    
                    ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
                    rs4IsFinal.next();
                    int countId = rs4IsFinal.getInt(1);
                    rs4IsFinal.close();
                    if (countId > 0) {
                      is_final = false;
                    }
                    map.put("final", is_final);
                    items.set(i,map);
                }
            return items;
        }
        
        public Boolean addSubMember(String pId, String plevel, String identifier, 
                String desc, List dimAttributes, SelRs rsSr, String companyCode, 
                String userId) throws Exception{
            
            boolean isInsert = false;
            String sqlIsInsert = "select count(*) "
                                     +" from (select * from opa_time_dimension  "
                                     +"       where company_code = '"+companyCode+"' "
                                     +"         and id = "+pId+") a, "
                                     +"     (select * from opa_time_dimension where company_code = '"+companyCode+"') b "
                                     +" where (a.level_no + 1) = b.level_no  "
                                     +"   and opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
                                     +"   and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
                                     +"   and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
                                     +"   and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
                                     +"   and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5) "
                                     +"   and b.level_"+Integer.toString((Integer.parseInt(plevel)+1))+" = '"+identifier+"'";
                
            ResultSet rsIsInsert = rsSr.getRs(sqlIsInsert);
            if(rsIsInsert != null && rsIsInsert.next()){
                int count = rsIsInsert.getInt(1);
                if(count!=0){
                    isInsert = true;
                }
            }
            rsIsInsert.close();
            if(isInsert){
                System.out.println("同一级别下不能包含同样表示的维成员");
                return false;
            }
            StringBuffer sb4Level = new StringBuffer();
            for(int i = 1 ;i <=5 ; i++){
                if((Integer.parseInt(plevel)+1) == i){
                    sb4Level.append(" , '"+identifier+"' ");
                }else{
                    sb4Level.append(" , level_"+i);
                }
            }
            
            int id = 0 ;
            String sql4MaxId = "select (max(id)+1) from opa_time_dimension where company_code = '"+companyCode+"'";
            ResultSet rs4MaxId = rsSr.getRs(sql4MaxId);
            if(rs4MaxId.next()){
                id = rs4MaxId.getInt(1);
            }
            rs4MaxId.close();
            
            Object[] attributes = dimAttributes.toArray();
            
            String sql4AddDimMember = "insert into opa_time_dimension (company_code,id,level_1,level_2,level_3,level_4,level_5,dim_desc,level_no,attribute_1,attribute_2,attribute_3,attribute_4,attribute_5,dim_path_desc) "
                +"  select company_code , "+id+" "
                +sb4Level.toString()+" , '"+desc
                +"' , (level_no + 1) ,"+(attributes[0]==null?"' '":"'"+(String)attributes[0]+"'")
                +" , "+(attributes[1]==null?"' '":"'"+(String)attributes[1]+"'")+" , "
                +(attributes[2]==null?"' '":"'"+(String)attributes[2]+"'")+" , "
                +(attributes[3]==null?"' '":"'"+(String)attributes[3]+"'")
                +" , "+(attributes[4]==null?"' '":"'"+(String)attributes[4]+"'") +", dim_path_desc||'/"
                +desc+"'"
                +" from  opa_time_dimension  where company_code = '"+companyCode+"' and id = " + pId ;
               try{
                rsSr.beginTrans();
                rsSr.preTrans(sql4AddDimMember);
                rsSr.doTrans();
                return true;
               }catch(Exception e){
                return false;   
               }
           
        }
        

        
        public List searchByAttributes(String desc, List dimAttributes, SelRs rsSr, String companyCode, 
                String userId) throws Exception{
            
        	Object[] attributes = dimAttributes.toArray(); 
        	StringBuffer sqlattributes = new StringBuffer();
            for(int i = 0; i< attributes.length; i++){
               if(((String)attributes[i]).length()>0){
            	   sqlattributes.append("and attribute_" + Integer.toString(i+1)
            	              + " like '" + attributes[i] + "%' ");
               }
            }
            
            String sql = "select dim_desc , id , level_no , attribute_1 ," 
                + " attribute_2 , attribute_3 , attribute_4 , attribute_5 " 
                + "from opa_time_dimension "
                + " WHERE company_code = '"
                + companyCode
                + "' and dim_desc like '" + desc + "%' "
                + sqlattributes.toString() 
                + " order by id";
            
            System.out.println("searchsql:---------"+sql);
            
            List<Map> items = new ArrayList<Map>();
            ResultSet rs = rsSr.getRs(sql);
                while (rs.next()) {
                    Map map = new HashMap();
                    map.put("desc", rs.getString(1));
                    map.put("level", rs.getString(3));
                    map.put("id", rs.getString(2));
                    map.put("1", rs.getString(4));
                    map.put("2", rs.getString(5));
                    map.put("3", rs.getString(6));
                    map.put("4", rs.getString(7));
                    map.put("5", rs.getString(8));
                    items.add(map);
                }
                int itemNum = items.size();
                for(int i = 0; i < itemNum; i++){
                	Map map = items.get(i);
                    int level_no = Integer.parseInt(map.get("level").toString());
                    
                    String id = (String)map.get("id");
                	
                    /**
                     * 查询 path 
                     */
                    String path = "";
                    String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
                    if (level_no >= 1) {
                      StringBuffer sb = new StringBuffer();
                      for (int j = 1; j < level_no; j++) {
                        sb.append("level_" + j + ", ");
                      }
                      sb.append("level_" + level_no + " ");
                      String sql4Path = "select " + sb.toString() + " from opa_time_dimension"
                          + " where company_code = '"
                          + companyCode + "' and id = " + id;
                      
                      
                      ResultSet rs4Path = rsSr.getRs(sql4Path);
                      StringBuffer sb4Path = new StringBuffer("/");
                      rs4Path.next();
                      for (int k = 1; k < level_no; k++) {
                        String temp4Path = (String) rs4Path.getString(k);
                        temp4Path = temp4Path == null ? "" : temp4Path + "/";
                        sb4Path.append(temp4Path);
                      }
                      level_no_value = (String) rs4Path.getString(level_no);
                      sb4Path.append(level_no_value);
                      path = sb4Path.toString();
                      rs4Path.close();
                    }
                    map.put("path",path);
                    
                    System.out.println("path-------:"+path);
                    
                    /**
                     * 查询 is_final 
                     */
                    boolean is_final = true;
                    String sql4IsFinal = "";
                    if (level_no >= 1) {
                      StringBuffer sb = new StringBuffer();
                      String[] pathArray = path.split("/");
                      for (int j = 1; j <= level_no; j++) {
                        sb.append(" level_" + j + " = '" + pathArray[j]
                            + "' and");
                      }
                      sql4IsFinal = "select nvl(count(id),0) from opa_time_dimension"
                          + " where level_no = "
                          + (level_no + 1)
                          + " and company_code = '"
                          + companyCode
                          + "'"
                          + " and "
                          + ((sb.toString().endsWith("and")) ? (sb.toString()
                              .substring(0, sb.toString().length() - 3))
                              : sb.toString());
                    } else {
                      sql4IsFinal = "select nvl(count(id),0) from opa_time_dimension"
                          + " where level_no = " + (level_no + 1)
                          + " and company_code = '" + companyCode + "'";
                    }
                    
                    ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
                    rs4IsFinal.next();
                    int countId = rs4IsFinal.getInt(1);
                    rs4IsFinal.close();
                    if (countId > 0) {
                      is_final = false;
                    }
                    map.put("final", is_final);
                    items.set(i,map);
                }
            return items;
           
        }
        
    }%>