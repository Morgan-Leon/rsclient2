<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@page import="rs.tool.CreateCodeUtil"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
        this.service = ServiceFactory.getService(this, MyService.class);
    }

    public class MyService extends StoreService {
        
    	public void registerMethods(MethodMap mm) throws Exception {
            super.registerMethods(mm) ;
            //注册 检测主键是否重复的方法
            mm.add("doCreateCode")
                .addListParameter("params") ;
        }
        
        
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
            List items = new ArrayList();
            Map map = new HashMap();
            data.setData(items);
        }
         
        public void doCreateCode(List params) throws Exception{
            log(params.toString());
        	new CreateCodeUtil().doCreateCode(params);
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