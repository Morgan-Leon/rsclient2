<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		//新增
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			System.out.println("这是新增方法") ;
		}
		
		//删除
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			log("执行了删除方法") ;
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
            
            log("------------------------------------------执行了read方法---------------------------------");
			//查询数据
			String sql = "select RS_ID,WAREHOUSE_CODE,WAREHOUSE_NAME,BILL_NO,BILL_DATE,ACTIVE_CODE,"
			+ "ACTIVE_ABV,IO_FLAG,OTHER_FLAG,OM_ORDER,PM_ORDER,SHOP_ORDER,DEPT_CODE,DEPT_ABV,VENDOR_CODE,"
			+ "VENDOR_ABV,CUSTOMER_CODE ,CUSTOMER_ABV,WAREHOUSE_MAN,WAREHOUSE_MAN_CODE,WAREHOUSE_MAN_NAME,USE_CODE,USE_DESC,"
			+ "OPERATOR,OPERATOR_CODE,OPERATOR_NAME,OPERATOR_DEPT,OPERATOR_DEPT_NAME,CHECK_FLAG,CHECK_DATE,CHECK_MAN,"
			+ "CHECK_MAN_NAME,QC_NO,POST_MAN,POST_MAN_NAME,POST_DATE,RECORD_MAN,RECORD_MAN_NAME,RECORD_DATE,RECORD_TIME,"
			+ "REMARK,COMPANY_NO,VOUCHER_PERIOD,VOUCHER_DATE,VOUCHER_FLAG,VOUCHER_NO,VOUCHER_ON_TIME,VOUCHER_TYPE"
                + " from inv_bill join test_export on 1=1 where rownum < 50000"
             +  " ";
            
            String sqlSum = "select count(*) from inv_bill join test_export on 1=1 where rownum < 50000"  ;
            
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("RS_ID",rs.getString(1));
				map.put("WAREHOUSE_CODE",rs.getString(2));
				map.put("WAREHOUSE_NAME",rs.getString(3));
				map.put("BILL_NO",rs.getString(4));
				map.put("BILL_DATE",rs.getString(5));
				map.put("ACTIVE_CODE",rs.getString(6));
				map.put("ACTIVE_ABV",rs.getString(7));
				map.put("IO_FLAG",rs.getString(8));
				map.put("OTHER_FLAG",rs.getString(9));
				map.put("OM_ORDER",rs.getString(10));
				map.put("PM_ORDER",rs.getString(11));
				map.put("SHOP_ORDER",rs.getString(12));
				map.put("DEPT_CODE",rs.getString(13));
				map.put("DEPT_ABV",rs.getString(14));
				map.put("VENDOR_CODE",rs.getString(15));
				map.put("VENDOR_ABV",rs.getString(16));
				map.put("CUSTOMER_CODE ",rs.getString(17));
				map.put("CUSTOMER_ABV",rs.getString(18));
				map.put("WAREHOUSE_MAN",rs.getString(19));
				map.put("WAREHOUSE_MAN_CODE",rs.getString(20));
				map.put("WAREHOUSE_MAN_NAME",rs.getString(21));
				map.put("USE_CODE",rs.getString(22));
				map.put("USE_DESC",rs.getString(23));
				map.put("OPERATOR",rs.getString(24));
				map.put("OPERATOR_CODE",rs.getString(25));
				map.put("OPERATOR_NAME",rs.getString(26));
				map.put("OPERATOR_DEPT",rs.getString(27));
				map.put("OPERATOR_DEPT_NAME",rs.getString(28));
				map.put("CHECK_FLAG",rs.getString(29));
				map.put("CHECK_DATE",rs.getString(30));
				map.put("CHECK_MAN",rs.getString(31));
				map.put("CHECK_MAN_NAME",rs.getString(32));
				map.put("QC_NO",rs.getString(33));
				map.put("POST_MAN",rs.getString(34));
				map.put("POST_MAN_NAME",rs.getString(35));
				map.put("POST_DATE",rs.getString(36));
				map.put("RECORD_MAN",rs.getString(37));
				map.put("RECORD_MAN_NAME",rs.getString(38));
				map.put("RECORD_DATE",rs.getString(39));
				map.put("RECORD_TIME",rs.getString(40));
				map.put("REMARK",rs.getString(41));
				map.put("COMPANY_NO",rs.getString(42));
				map.put("VOUCHER_PERIOD",rs.getString(43));
				map.put("VOUCHER_DATE",rs.getString(44));
				map.put("VOUCHER_FLAG",rs.getString(45));
				map.put("VOUCHER_NO",rs.getString(46));
				map.put("VOUCHER_ON_TIME",rs.getString(47));
				map.put("VOUCHER_TYPE",rs.getString(48));

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