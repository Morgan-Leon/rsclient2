<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

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
			//查询数据
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
			//获取总数
            String sqlSum = "SELECT COUNT(*) FROM pm_special_class_v WHERE company_code='" 
                + companyCode + "' AND user_unique_id = '" + userId + "'";
            printLog("read" , sqlSum);
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}
         
         /** 
          * @method printLog 打印日志的方法
          * @param {String} methodName  所在的方法名
          * @param {String} log 输出的日志
          */
         private void printLog(String methodName , String log) {
              System.out.println("\n当前执行的方法:【 " + methodName + " 】,日志::: " + log + "\n");   
         }
	}%>