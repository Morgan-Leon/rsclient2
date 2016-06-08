<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		//����
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			System.out.println("������������") ;
		}
		
		//ɾ��
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			log("ִ����ɾ������") ;
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

		//�޸�
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {

       
		}
		
	
		//��ȡ
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
            
            log("------------------------------------------ִ����read����---------------------------------");
			//��ѯ����
			String sql = "select v2 "
                + " from test_export";
            
            String sqlSum = "select count(1) from test_export "  ;
            
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("v2_count",rs.getString(1));				
				map.put("v2_max",rs.getString(1));				
				map.put("v2_min",rs.getString(1));				
				map.put("v2_sum",rs.getString(1));				
				map.put("v2_average",rs.getString(1));			
				items.add(map);
			}
			
			data.setData(items);

			int count = 0 ;
			//��ȡ����
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				count = rs2.getInt(1) ;
				data.setTotal(count);
			}
		}
	}%>