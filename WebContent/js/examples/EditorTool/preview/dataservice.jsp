<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

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
         * @method 新增数据
         * @param {StoreData} data  传递过来的参数
         * @param {List} items 操作的类型
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}

		/** 
         * @method 删除数据
         * @param {StoreData} data  传递过来的参数
         * @param {List} items 操作的类型
         * @param {SelRs} rsSr 封装后的数据库操作对象
         * @param {String} companyCode 公司编码
         * @param {String} userId 登录用户ID
         * @param {String} dbType 数据库类型
         * @return {List}  返回节点集合
         */
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			rsSr.beginTrans();
			rsSr.doTrans();
		}

         /** 
          * @method 更新数据
          * @param {StoreData} data  传递过来的参数
          * @param {List} items 操作的类型
          * @param {SelRs} rsSr 封装后的数据库操作对象
          * @param {String} companyCode 公司编码
          * @param {String} userId 登录用户ID
          * @param {String} dbType 数据库类型
          * @return {List}  返回节点集合
          */
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
		}
        
		/** 
         * @method printLog 打印日志的方法
         * @param {String} methodName  所在的方法名
         * @param {String} log 输出的日志
         */
        private void printLog(String methodName , String log) {
             System.out.println("\n当前执行的方法:【 " + methodName + " 】,日志::: " + log + "\n");   
        }
        
        /** 
         * @method formatString 将数据库中查询出来的空值转换为空字符串
         * @param {String} value
         * @return {String}  返回信息
         */  
        private String formatString(String value){
             if(value == null || "null".equals(value) || "undefined".equals(value)){
                 value = "" ;
             }
             return value ;
        }
	}%>