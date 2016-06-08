<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends Service {

		public void registerMethods(MethodMap mm) throws Exception {
			mm.add("destroyItems").addMapParameter("params")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType)
					.setMapReturnValue();
		}

		public Map destroyItems(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			log("destroyItems -------------------------------------------------- ");
			StoreData storeData = new StoreData(params);
			return storeData.getDataMap();
		}
	}%>