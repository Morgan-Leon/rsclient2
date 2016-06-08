<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("createItems").addMapParameter("params")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType)
					.setMapReturnValue();
		}

		public Map createItems(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			StoreData storeData = new StoreData(params);
			//TODO : 编写创建Item的业务逻辑
			return storeData.getDataMap();
		}
	}%>