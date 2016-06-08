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
            //ע�� ��������Ƿ��ظ��ķ���
            mm.add("doCreateCode")
                .addListParameter("params") ;
        }
        
        
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
            List items = new ArrayList();
            Map map = new HashMap();
            data.setData(items);
        }
         
        public void doCreateCode(List params) throws Exception{
            log(params.toString());
        	new CreateCodeUtil().doCreateCode(params);
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