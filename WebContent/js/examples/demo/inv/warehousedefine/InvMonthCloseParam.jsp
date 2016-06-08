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
            String sql = "SELECT type_code,type_desc " 
                   + "FROM inv_month_close_param" ;
            String sortInfo = data.getSortInfo();
            Integer start = data.getStart();
            Integer limit = data.getLimit();
            System.out.println("sql :: " + sql);
            System.out.println("start :: " + start);
            System.out.println("limit :: " + limit);
            sql = SQLUtil.pagingSql(sql, sortInfo, start, limit, dbType);
            List items = new ArrayList();
            System.out.println("\n��ǰִ�еķ���:�� read ��,��־::: " + sql + "\n");
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                map.put("typeCode",rs.getString(1) == null ? "" : rs.getString(1));
                map.put("typeDesc",rs.getString(2) == null ? "" : rs.getString(2));
                items.add(map);
            }
            data.setData(items);
        }
    }%>