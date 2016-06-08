<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		//新增
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			System.out.println("create");
		}

		//删除
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {

			System.out.println("destroy");
            StringBuffer sb4Condication = new StringBuffer("");
            Iterator iter4DimMember = items.iterator();

		    while(iter4DimMember.hasNext()){
		       Map temp = (Map)iter4DimMember.next();
		       sb4Condication.append(" , '" + ((String)temp.get("receive_no")).trim() + "'");
		    }

            String str4Condicaton = sb4Condication.toString().trim().startsWith(",")?sb4Condication.toString().trim().substring(1):sb4Condication.toString().trim();
            
            String sqldelete = "delete "
                +"from pm_receive_head "
                +"where company_code = '"+companyCode+"' "
                +" and receive_no in ("+str4Condicaton+")";
            
            
            rsSr.beginTrans();
            rsSr.preTrans(sqldelete);
            rsSr.doTrans();
            
            String sqldelete2 = "delete from pm_receive_detail where company_code='"
                +companyCode+"' "
                +" and receive_no in ("+str4Condicaton+")";

            rsSr.beginTrans();
            rsSr.preTrans(sqldelete2);
            rsSr.doTrans();
		}

		//修改
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
       
		}
	
		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {

			String special_class = (String) data.get("special_class");
			String receive_no = (String) data.get("receive_no");
            String receive_date1 = (String) data.get("receive_date1");
            String receive_date2 = (String) data.get("receive_date2");
            String group_id = (String) data.get("group_id");
            String vendor_code = (String) data.get("vendor_code");
            String buyer_id = (String) data.get("buyer_id");
            
            
			//查询数据
			String sql = "select receive_no, vendor_abv, receive_date," 
                + " type_desc, buyer_name, receive_amt, vendor_code, special_class, buyer_id, group_id, deliver_code, bill_type" 
                + " from pm_receive_head where company_code='" + companyCode + "'" 
                + ((special_class!=null)? (" and special_class='" + special_class + "'"):"")
                + ((receive_no!=null)? (" and receive_no='" + receive_no + "'"):"")
                + ((receive_date1!=null)? (" and receive_date1>'" + receive_date1 + "'"):"")
                + ((receive_date2!=null)? (" and receive_date2<'" + receive_date2 + "'"):"")
                + ((group_id!=null)? (" and group_id='" + group_id + "'"):"")
                + ((vendor_code!=null)? (" and vendor_code='" + vendor_code + "'"):"")
                + ((buyer_id!=null)? (" and buyer_id='" + buyer_id + "'"):"");
            
			
            String sqlSum = "select count(*) from pm_receive_head where company_code='" 
                + companyCode + "'"
                + ((special_class!=null)? (" and special_class='" + special_class + "'"):"")
                + ((receive_no!=null)? (" and receive_no='" + receive_no + "'"):"")
                + ((receive_date1!=null)? (" and receive_date1>'" + receive_date1 + "'"):"")
                + ((receive_date2!=null)? (" and receive_date2<'" + receive_date2 + "'"):"")
                + ((group_id!=null)? (" and group_id='" + group_id + "'"):"")
                + ((vendor_code!=null)? (" and vendor_code='" + vendor_code + "'"):"")
                + ((buyer_id!=null)? (" and buyer_id='" + buyer_id + "'"):"");
            
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("receive_no", rs.getString(1));
				map.put("vendor_abv", rs.getString(2));
				map.put("receive_date", rs.getString(3));
                map.put("type_desc", rs.getString(4));
                map.put("buyer_name", rs.getString(5));
                map.put("receive_amt", rs.getString(6));
                map.put("vendor_code", rs.getString(7));
                map.put("special_class", rs.getString(8));
                map.put("buyer_id", rs.getString(9));
                map.put("group_id", rs.getString(10));
                map.put("deliver_code", rs.getString(11));
                map.put("bill_type", rs.getString(12));

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