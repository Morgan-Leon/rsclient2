package com.rsc.rsclient.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * 
 * @author changhu
 */
public class StoreMetaData {

	private boolean loadMetaData;

	private Map paramNames;
	
	private Map data;

	private Logger logger = Logger.getLogger(StoreMetaData.class);

	public StoreMetaData() {
		this.data = new HashMap();
		this.initDefaultProperty(this.data);
	}

	public StoreMetaData(Map data) {
		this.data = data == null ? new HashMap() : data;
		this.initDefaultProperty(this.data);
	}

	private void initDefaultProperty(Map data) {
		String loadMetaData = (String) data.get("loadMetaData");
		this.loadMetaData = "true".equals(loadMetaData)? true : false;
		this.setParamNames((Map) data.get("paramNames"));
		this.setSortInfo((Map) data.get("sortInfo"));
		this.setGroupInfo((Map)data.get("groupInfo"));
		this.setRoot((String) data.get("root"));
		this.setIdProperty((String) data.get("idProperty"));
		this.setTotalProperty((String) data.get("totalProperty"));
		this.setSuccessProperty((String) data.get("successProperty"));
		this.setMessageProperty((String) data.get("messageProperty"));
		this.setFields((List) data.get("fields"));
	}

	/**
	 * �Ƿ����metaData
	 * 
	 * @return
	 */
	public boolean isLoad() {
		return this.loadMetaData;
	}

	/**
	 * ���ò�������
	 * 
	 * @param {@link Map} paramsNames
	 */
	public void setParamNames(Map paramNames) {
		paramNames = paramNames == null ? new HashMap() : paramNames;
		String start = (String) paramNames.get("start");
		if (start == null || "".equals(start)) {
			paramNames.put("start", "start");
		}
		String limit = (String) paramNames.get("limit");
		if (limit == null || "".equals(limit)) {
			paramNames.put("limit", "limit");
		}
		String sort = (String) paramNames.get("sort");
		if (sort == null || "".equals(sort)) {
			paramNames.put("sort", "sort");
		}
		String dir = (String) paramNames.get("dir");
		if (dir == null || "".equals(dir)) {
			paramNames.put("dir", "dir");
		}
		this.paramNames = paramNames;
	}

	/**
	 * ����������Ϣ
	 * 
	 * @param sortInfo
	 */
	public void setSortInfo(Map sortInfo) {
		sortInfo = sortInfo == null ? new HashMap() : sortInfo;
		String sortProperty = (String) this.paramNames.get("sort");
		String dirProperty = (String) this.paramNames.get("dir");
		if (sortInfo.get(sortProperty) != null
				&& sortInfo.get(dirProperty) != null) {
			this.data.put("sortInfo", sortInfo);
		}
	}

	/**
	 * ���÷�����Ϣ
	 * 
	 * @param groupInfo
	 */
	public void setGroupInfo(Map groupInfo){
		groupInfo = groupInfo == null ? new HashMap() : groupInfo;
		String groupBy = (String)groupInfo.get("groupBy");
		String groupDir = (String)groupInfo.get("groupDir");
		if(groupBy != null && groupDir != null){
			this.data.put("groupInfo", groupInfo);
		}
	}
	
	/**
	 * ���ֶ� field ���� ASC ����
	 * 
	 * @param field
	 */
	public void setSortFieldASC(String field) {
		String sortProperty = (String) this.paramNames.get("sort");
		String dirProperty = (String) this.paramNames.get("dir");

		Map sortInfo = new HashMap();
		sortInfo.put(sortProperty, field);
		sortInfo.put(dirProperty, "ASC");
		this.data.put("sortInfo", sortInfo);
	}

	/**
	 * ���ֶ� field ���� DESC ����
	 * 
	 * @param field
	 */
	public void setSortFieldDESC(String field) {
		String sortProperty = (String) this.paramNames.get("sort");
		String dirProperty = (String) this.paramNames.get("dir");

		Map sortInfo = new HashMap();
		sortInfo.put(sortProperty, field);
		sortInfo.put(dirProperty, "DESC");
		this.data.put("sortInfo", sortInfo);
	}

	public void setRoot(String root) {
		this.data.put("root", root == null || "".equals(root) ? "data" : root);
	}

	public String getRoot() {
		return (String) this.data.get("root");
	}
	
	public String getSummaryDataProperty(){
		return "summaryData";
	}
	
	public String getGroupSummaryDataProperty(){
		return "groupSummaryData";
	}
	
	
	public void setIdProperty(String idProperty) {
		this.data.put("idProperty", idProperty == null || "".equals(idProperty) ? "id" : idProperty);
	}

	public String getIdProperty() {
		return (String) this.data.get("idProperty");
	}

	public void setTotalProperty(String totalProperty) {
		this.data.put("totalProperty", totalProperty == null
				|| "".equals(totalProperty) ? "total" : totalProperty);
	}

	public String getTotalProperty() {
		return (String) this.data.get("totalProperty");
	}

	public void setSuccessProperty(String successProperty) {
		this.data.put("successProperty", successProperty == null
				|| "".equals(successProperty) ? "success" : successProperty);
	}

	public String getSuccessProperty() {
		return (String) this.data.get("successProperty");
	}

	public void setMessageProperty(String messageProperty) {
		this.data.put("messageProperty", messageProperty == null
				|| "".equals(messageProperty) ? "message" : messageProperty);
	}

	public String getMessageProperty() {
		return (String) this.data.get("messageProperty");
	}

	public void setFields(List fields) {
		this.data.put("fields", fields == null ? new ArrayList() : fields);
	}

	public List getFields() {
		return (List) this.data.get("fields");
	}
	
	/**
	 * ���ò�ѯͷ�ֶ�
	 * @param fields
	 */
	public void setQueryField(List fields){
		this.data.put("queryFields", fields == null ? new ArrayList() : fields);
	}
	
	/**
	 * ��ȡ�����ֶ�����<br/>
	 * ���û�������ֶ��򷵻�null��<br/>
	 * 
	 * @return {@link String} sortField
	 */
	public String getSortField() {
		Map sortInfo = (Map) this.data.get("sortInfo");
		if(sortInfo != null){
			String sortProperty = (String) this.paramNames.get("sort");
			String sort = (String)sortInfo.get(sortProperty); 
			return sort == null || "".equals(sort) ? null : sort;
		}else {
			return null;
		}
	}

	/**
	 * ��ȡ����ʽ,����ֵΪ ASC �� DESC ��
	 * 
	 * @return {@link String} dir
	 */
	public String getSortDir() {
		Map sortInfo = (Map) this.data.get("sortInfo");
		if(sortInfo != null){
			String dirProperty = (String) this.paramNames.get("dir");
			String dir = (String) sortInfo.get(dirProperty); 
			if (dir != null && ("ASC".equals(dir.toUpperCase()) || "DESC".equals(dir.toUpperCase()))) {
				return dir;
			} else {
				return "ASC";
			}
		}else {
			return "ASC";
		}
	}

	/**
	 * ��ȡ�����ֶ�����
	 * 
	 * @return
	 */
	public String getGroupBy(){
		Map groupInfo = (Map) this.data.get("groupInfo");
		if(groupInfo != null){
			String groupBy = (String)groupInfo.get("groupBy"); 
			return groupBy == null || "".equals(groupBy) ? null : groupBy;
		}else {
			return null;
		}
	}
	
	/**
	 * ��ȡ������������
	 * 
	 * @return
	 */
	public String getGroupDir(){
		Map groupInfo = (Map) this.data.get("groupInfo");
		if(groupInfo != null){
			String dir = (String)groupInfo.get("groupDir"); 
			if (dir != null && ("ASC".equals(dir.toUpperCase()) || "DESC".equals(dir.toUpperCase()))) {
				return dir;
			} else {
				return "ASC";
			}
		}else {
			return "ASC";
		}
	}
	
	/**
	 * ��ȡҪ��ѯ���ݿ�ʼλ��
	 * 
	 * @return
	 */
	public Integer getStart() {
		String startProperty = (String) this.paramNames.get("start");
		Object start = this.data.get(startProperty);
		return start == null ? new Integer(0) : Integer.valueOf("" + start);
	}
	
	/**
	 * ����Ҫ��ѯ���ݿ�ʼλ��
	 * 
	 */
	public void setStart(Object start) {
		String startProperty = (String) this.paramNames.get("start");
		if(start == null){
			this.data.remove(startProperty);
		} else{
			this.data.put(startProperty, start);
		}
	}

	/**
	 * ��ȡҪ��ѯ�����������������������Ϊnull���ʾ�����ơ�
	 * 
	 * @return
	 */
	public Integer getLimit() {
		String limitProperty = (String) this.paramNames.get("limit");
		Object limit = this.data.get(limitProperty);
		return limit == null ? null : Integer.valueOf("" + limit);
	}

	/**
	 * ����Ҫ��ѯ�����������������������Ϊnull���ʾ�����ơ�
	 * 
	 */
	public void setLimit(Object limit) {
		String limitProperty = (String) this.paramNames.get("limit");
		if(limit == null){
			this.data.remove(limitProperty);
		} else{
			this.data.put(limitProperty, limit);
		}
	}

	/**
	 * ���ݼ�ֵ��ȡ����
	 * 
	 * @param key
	 * @return
	 */
	public Object get(String key) {
		return this.data.get(key);
	}

	/**
	 * ��ȡ metaData ����Map
	 * 
	 * @return
	 */
	public Map getDataMap() {
		this.data.remove("loadMetaData");
		this.data.remove("paramNames");
		
		return this.data;
	}
}
