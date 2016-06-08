<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		//新增
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}

		//删除
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
           
            StringBuffer sb4Condication = new StringBuffer("");
            Iterator iter4DimMember = items.iterator();

		    while(iter4DimMember.hasNext()){
		       Map temp = (Map)iter4DimMember.next();
		       sb4Condication.append(" , " + ((String)temp.get("id")).trim());
		    }
            String str4Condicaton = sb4Condication.toString().trim().startsWith(",")?sb4Condication.toString().trim().substring(1):sb4Condication.toString().trim();
            
            String sqldelete = "delete "
                +"from opa_time_dimension "
                +"where id in(  "
                +"  select b.id  "
                +"  from (select *  "
                +"           from opa_time_dimension "
                +"          where company_code = '"+companyCode+"' "
                +"            and id in ("+str4Condicaton+")) a, "
                +"        (select * from opa_time_dimension where company_code = '"+companyCode+"') b "
                +"  where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
                +"    and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
                +"    and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
                +"    and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
                +"    and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5) "
                +") ";
            
            System.out.println("sqldelete:------"+sqldelete);
            
            rsSr.beginTrans();
            rsSr.preTrans(sqldelete);
            rsSr.doTrans();
		}

		//修改
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			Iterator iter4DimMember = items.iterator();
            String sqlupdate = "update opa_time_dimension set ";
            String id = "";
		    while(iter4DimMember.hasNext()){
		       Map temp = (Map)iter4DimMember.next();
		       Iterator iter = temp.entrySet().iterator(); 
		       while (iter.hasNext()) { 
		           Map.Entry entry = (Map.Entry) iter.next();
		           if(((String)entry.getKey()).equals("id")){
                          id = (String)entry.getValue();
		           } else if(!((String)entry.getKey()).equals("identifier") && !((String)entry.getKey()).equals("path")){
                       sqlupdate += (String)entry.getKey()+ "= '" +(String)entry.getValue()+"',";
                   }
		       } 
		    }
		    sqlupdate= sqlupdate.substring(0,sqlupdate.length()-1);

            sqlupdate += " where id = " +id + " and company_code = '"+companyCode+"'";
            
            try{
                rsSr.beginTrans();
                rsSr.preTrans(sqlupdate);
                rsSr.doTrans();
                System.out.println("更新成功");
                String sp = "EXEC opa_def.update_dimension_path_desc(  pi_company_code => '"+companyCode+"' , pi_dim_code => 'time')";
                if (rsSr.callSp(sp)){
                    System.out.println("执行存储过程成功"+sp);
                }
            } catch(Exception e){
                System.out.println("更新失败");
            }
       
		}
	
		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			//查询数据
			String code = (String) data.get("dimId");
			String level = (String) data.get("level");
			String sql = "select a.dim_desc, a.level_"+Integer.toString((Integer.parseInt(level)+1))
                + " as identifier, a.attribute_1, a.attribute_2, a.attribute_3, a.attribute_4, a.attribute_5, a.id,"
                + " a.level_1 as level_1, a.level_2 as level_2, a.level_3 as level_3, a.level_4 as level_4, a.level_5 as level_5"
                + " from opa_time_dimension a, (SELECT * FROM opa_time_dimension where id="
                + code + " and company_code='" + companyCode + "') b"
                + " WHERE a.company_code = b.company_code AND a.id != b.id " 
                + " AND a.level_no = b.level_no + 1"
                + " AND nvl(nvl(b.level_1, a.level_1), b.ROWID) = nvl(a.level_1, b.ROWID)"
                + " AND nvl(nvl(b.level_2, a.level_2), b.ROWID) = nvl(a.level_2, b.ROWID)"
                + " AND nvl(nvl(b.level_3, a.level_3), b.ROWID) = nvl(a.level_3, b.ROWID)"
                + " AND nvl(nvl(b.level_4, a.level_4), b.ROWID) = nvl(a.level_4, b.ROWID)"
                + " AND nvl(nvl(b.level_5, a.level_5), b.ROWID) = nvl(a.level_5, b.ROWID)";
			
            String sqlSum = "select count(*) from opa_time_dimension a, (SELECT * FROM opa_time_dimension where id="
            + code + " and company_code='" + companyCode + "') b"
            + " WHERE a.company_code = b.company_code AND a.id != b.id " 
            + " AND a.level_no = b.level_no + 1"
            + " AND nvl(nvl(b.level_1, a.level_1), b.ROWID) = nvl(a.level_1, b.ROWID)"
            + " AND nvl(nvl(b.level_2, a.level_2), b.ROWID) = nvl(a.level_2, b.ROWID)"
            + " AND nvl(nvl(b.level_3, a.level_3), b.ROWID) = nvl(a.level_3, b.ROWID)"
            + " AND nvl(nvl(b.level_4, a.level_4), b.ROWID) = nvl(a.level_4, b.ROWID)"
            + " AND nvl(nvl(b.level_5, a.level_5), b.ROWID) = nvl(a.level_5, b.ROWID)";

            
            
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
            System.out.println("sql:"+sqlSum);
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
            Vector vct4DimMember = rsSr.getRsVct(rs, false);
            Iterator iter4DimMember = vct4DimMember.iterator();
			while (iter4DimMember.hasNext()) {
                String[] record = (String[]) iter4DimMember.next();
				Map map = new HashMap();
				map.put("identifier", record[1]);
				map.put("dim_desc", record[0]);
				map.put("attribute_1", record[2]);
                map.put("attribute_2", record[3]);
                map.put("attribute_3", record[4]);
                map.put("attribute_4", record[5]);
                map.put("attribute_5", record[6]);
                StringBuffer path = new StringBuffer();
                map.put("id", record[7]);
	            for(int l=1;l<6;l++){
	              String lv = record[7+l];
	              if(lv!=null) path.append("/" + lv);
	              else break;
	            }
                map.put("path",path.toString());
				items.add(map);
			}
			data.setData(items);

			//获取总数
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}

	}%>