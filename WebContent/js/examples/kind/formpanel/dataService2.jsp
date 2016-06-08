<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="pubservice.jsp"%>

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
            String attachmentId = null ;
            attachmentId = "6" ;
            String sql = "SELECT attachment_id, "
                       + " attachment_index, "
                       + " file_name, "
                       + " attachment_size "
                       + " FROM sys_attachment "
                       + " WHERE company_code='" + companyCode + "'"
                       + " AND attachment_id =" + attachmentId
                       + " ORDER BY attachment_index";
            log("SQL >>>" + sql);
            List items = new ArrayList();
            ResultSet rs = rsSr.getRs(sql);
            while (rs.next() && rs != null) {
                Map map = new HashMap();
                map.put("attachment_id",rs.getInt(1));
                map.put("attachment_index",rs.getInt(2));
                map.put("filename",rs.getString(3));
                map.put("ftype",getFileType(rs.getString(3)));
                map.put("fsize",rs.getString(4));
                items.add(map);
            }
            data.setData(items);
        }
         
         private String getFileType(String fileName){
        	  if(fileName.indexOf(".") > -1){
                  return fileName.substring(fileName.lastIndexOf(".") + 1) ;
              } else {
                  return "" ;   
              }
         }
    }%>