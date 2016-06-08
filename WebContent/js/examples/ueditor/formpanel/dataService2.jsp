<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }
    public class MyService extends StoreService {
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
            
			String bulletinId = (String) data.get("bulletin_id");
            String attachmentSql = "SELECT attachment_id from PORTAL_BULLETIN_CONTENT "
                                 + " WHERE  bulletin_id = " + bulletinId ;
			ResultSet rs = rsSr.getRs(attachmentSql) ;
            String attachmentId = null ;
            if(rs != null && rs.next()){
            	attachmentId = rs.getString(1) ;
            }
            String sql = "SELECT attachment_id, "
                       + " attachment_index, "
                       + " file_name, "
                       + " attachment_size "
                       + " FROM sys_attachment "
                       + " WHERE company_code='" + companyCode + "'"
                       + " AND attachment_id =" + attachmentId
                       + " ORDER BY attachment_index";
            List items = new ArrayList();
            rs = rsSr.getRs(sql);
            int i = 0 ;
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