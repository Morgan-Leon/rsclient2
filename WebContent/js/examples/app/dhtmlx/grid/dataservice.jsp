<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"%>
<%@include file="../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("get").addObjectParameter(
							WebKeys.SelRsKey, SelRs.class).addStringParameter(
							WebKeys.CompanyCodeKey).addStringParameter(
							WebKeys.UserUniqueIdKey).setListReturnValue();
		}

        public List get(SelRs rsSr, String companyCode, String userId) 
        throws Exception {
        	List<List> list = new ArrayList<List>();
            List<String> list1 = new ArrayList<String>();
            list1.add("1");
            list1.add("2");
            List<String> list2 = new ArrayList<String>();
            list2.add("3");
            list2.add("4");
            list.add(list1);
            list.add(list2);
            return list;
        }
        
    }%>