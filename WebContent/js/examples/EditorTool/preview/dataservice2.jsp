<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

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
            String receiveNo = (String) data.get("receive_no");
            
            String sql = "";
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            sql = SQLUtil.pagingSql(sql, sortInfo, start, limit,dbType);
            List items = new ArrayList();
            ResultSet rs = rsSr.getRs(sql);
            printLog("read" , sql);
            while (rs != null && rs.next()) {
                Map map = new HashMap();
                items.add(map);
            }
            data.setData(items);
            String sqlSum = "";
            printLog("read" , sqlSum);
            ResultSet rs2 = rsSr.getRs(sqlSum);
            if (rs2 != null && rs2.next()) {
                data.setTotal(rs2.getInt(1));
            }
        }
        
        /** 
         * @method ��������
         * @param {StoreData} data  ���ݹ����Ĳ���
         * @param {List} items ����������
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {List}  ���ؽڵ㼯��
         */
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}

		/** 
         * @method ɾ������
         * @param {StoreData} data  ���ݹ����Ĳ���
         * @param {List} items ����������
         * @param {SelRs} rsSr ��װ������ݿ��������
         * @param {String} companyCode ��˾����
         * @param {String} userId ��¼�û�ID
         * @param {String} dbType ���ݿ�����
         * @return {List}  ���ؽڵ㼯��
         */
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			rsSr.beginTrans();
			rsSr.doTrans();
		}

         /** 
          * @method ��������
          * @param {StoreData} data  ���ݹ����Ĳ���
          * @param {List} items ����������
          * @param {SelRs} rsSr ��װ������ݿ��������
          * @param {String} companyCode ��˾����
          * @param {String} userId ��¼�û�ID
          * @param {String} dbType ���ݿ�����
          * @return {List}  ���ؽڵ㼯��
          */
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}
        
		/** 
         * @method printLog ��ӡ��־�ķ���
         * @param {String} methodName  ���ڵķ�����
         * @param {String} log �������־
         */
        private void printLog(String methodName , String log) {
             System.out.println("\n��ǰִ�еķ���:�� " + methodName + " ��,��־::: " + log + "\n");   
        }
        
        /** 
         * @method formatString �����ݿ��в�ѯ�����Ŀ�ֵת��Ϊ���ַ���
         * @param {String} value
         * @return {String}  ������Ϣ
         */  
        private String formatString(String value){
             if(value == null || "null".equals(value) || "undefined".equals(value)){
                 value = "" ;
             }
             return value ;
        }
	}%>