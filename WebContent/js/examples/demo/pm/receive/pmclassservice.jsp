<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}
	public class MyService extends StoreService {
		
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
			//��ѯ����
			String sql = "SELECT special_class, special_name" 
                + " FROM pm_special_class_v WHERE company_code='" 
                + companyCode + "' AND user_unique_id = '" + userId + "'";
            
			List items = new ArrayList();
			printLog("read" , sql);
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("special_class",rs.getString(1));
				map.put("special_name",rs.getString(2));
				items.add(map);
			}
			data.setData(items);
			//��ȡ����
            String sqlSum = "SELECT COUNT(*) FROM pm_special_class_v WHERE company_code='" 
                + companyCode + "' AND user_unique_id = '" + userId + "'";
            printLog("read" , sqlSum);
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}
         
         /** 
          * @method printLog ��ӡ��־�ķ���
          * @param {String} methodName  ���ڵķ�����
          * @param {String} log �������־
          */
         private void printLog(String methodName , String log) {
              System.out.println("\n��ǰִ�еķ���:�� " + methodName + " ��,��־::: " + log + "\n");   
         }
	}%>