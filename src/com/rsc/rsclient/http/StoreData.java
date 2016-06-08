package com.rsc.rsclient.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ��װExt��Store����
 * 
 * @author changhu
 */
public class StoreData {

	private Map data;

    private StoreMetaData metaData;

	/**
	 * ���췽��
	 * 
	 * @param data
	 *            ����
	 */
 	public StoreData(Map data) {
		this.data = data == null ? new HashMap() : data;
		Map metaData = (Map) this.data.get("metaData");
		if (metaData != null) {
			this.setMetaData(new StoreMetaData(metaData));
		}
	}

	/**
	 * ��ȡmetaData
	 * 
	 * @return {@link StoreMetaData}
	 */
	public StoreMetaData getMetaData() {
		return this.metaData;
	}

	/**
	 * ��ȡ����List <br/>
	 * read ���� StoreData �в��������ݣ��򷵻�null <br/>
	 * create update destroy ���� StoreData �а���Ҫ���������ݣ�ͨ���÷�����ȡ��Щ���� <br/>
	 * 
	 * @return
	 */
	public List getData() {
		return (List) this.data.get(this.metaData.getRoot());
	}

	/**
	 * ���ݼ�ֵ��ȡdata�����ݡ�
	 * 
	 * @param key
	 * @return {@link Object} object
	 */
	public Object get(String key) {
		return this.data.get(key);
	}

	/**
	 * ��ȡ�����ֶ�����<br/>
	 * ���û�������ֶ��򷵻�null��<br/>
	 * 
	 * @return {@link String} sortField
	 */
	public String getSortField() {
		return this.metaData.getSortField();
	}

	/**
	 * ��ȡ����ʽ,����ֵΪ ASC �� DESC ��
	 * 
	 * @return {@link String} dir
	 */
	public String getSortDir() {
		return this.metaData.getSortDir();
	}

	/**
	 * 
	 * @return
	 */
	public String getGroupBy() {
		return this.metaData.getGroupBy();
	}

	/**
	 * 
	 * @return
	 */
	public String getGroupDir() {
		return this.metaData.getGroupDir();
	}

	/**
	 * ��ȡ������Ϣ
	 * 
	 * @return {@link String} sortInfo
	 */
	public String getSortInfo() {
		String sortInfo = null;
		String groupBy = this.getGroupBy();
		String field = this.getSortField();
		if (groupBy != null && !groupBy.equals(field)) {
			String groupDir = this.getGroupDir();
			sortInfo = groupBy + " " + groupDir;
		}
		if (field != null) {
			return (sortInfo != null ? sortInfo + ", " : "") + field + " "
					+ this.getSortDir();
		} else {
			return null;
		}
	}

	/**
	 * ��ȡҪ��ѯ���ݿ�ʼλ��
	 * 
	 * @return
	 */
	public Integer getStart() {
		return this.metaData.getStart();
	}

	/**
	 * ����Ҫ��ѯ���ݿ�ʼλ��
	 * 
	 */
	public void setStart(Object start) {
		this.metaData.setStart(start);
	}

	/**
	 * ��ȡҪ��ѯ�����������������������Ϊnull���ʾ�����ơ�
	 * 
	 * @return
	 */
	public Integer getLimit() {
		return this.metaData.getLimit();
	}

	/**
	 * ����Ҫ��ѯ�����������������������Ϊnull���ʾ�����ơ�
	 * 
	 */
	public void setLimit(Object limit) {
		this.metaData.setLimit(limit);
	}

	/**
	 * ����metaData
	 * 
	 * @param metaData
	 */
	public void setMetaData(StoreMetaData metaData) {
		this.metaData = metaData;
	}

	/**
	 * ��������List
	 * 
	 * @param data
	 */
	public void setData(List data) {
		this.data.put(this.metaData.getRoot(), data);
	}

	/**
	 * ���úϼ�����Map
	 * 
	 * @param summaryData
	 */
	public void setSummaryData(Map summaryData){
		this.data.put(this.metaData.getSummaryDataProperty(), summaryData);
	}

	/**
	 * ��ȡ�ϼ�����Map
	 * 
	 * @param summaryData
	 */
	public Map getSummaryData(){
		return (Map)this.data.get(this.metaData.getSummaryDataProperty());
	}
	
	/**
	 * ���÷���ϼ�����
	 * 
	 * @param groupSummaryData
	 */
	public void setGroupSummaryData(Map groupSummaryData){
		this.data.put(this.metaData.getGroupSummaryDataProperty(), groupSummaryData);
	}
	
	/**
	 * ������������
	 * 
	 * @param total
	 */
	public void setTotal(int total) {
		this.data.put(this.metaData.getTotalProperty(), new Integer(total));
	}

	/**
	 * ���óɹ����
	 */
	public void setSuccess() {
		this.data
				.put(this.metaData.getSuccessProperty(), Boolean.valueOf(true));
	}

	/**
	 * ����ʧ�ܱ��
	 */
	public void setFailure() {
		this.data.put(this.metaData.getSuccessProperty(), Boolean
				.valueOf(false));
	}

	/**
	 * ������Ϣ����
	 */
	public void setMessage(String message) {
		this.data.put(this.metaData.getMessageProperty(), message);
	}

	/**
	 * ����metaData fields
	 * 
	 * @param fields
	 */
	public void setMetaDataFields(List fields) {
		this.metaData.setFields(fields);
	}

	/**
	 * ���ò�ѯͷ�ֶ�
	 * 
	 * @param fields
	 */
	public void setMetaDataQeuryFields(List fields) {
		this.metaData.setQueryField(fields);
	}

	/**
	 * ���ֶ� field ���� ASC ����
	 * 
	 * @param field
	 */
	public void setSortFieldASC(String field) {
		this.metaData.setSortFieldASC(field);
	}

	/**
	 * ���ֶ� field ���� DESC ����
	 * 
	 * @param field
	 */
	public void setSortFieldDESC(String field) {
		this.metaData.setSortFieldDESC(field);
	}

	/**
	 * ��������Map,��Map�а�������Ҫ���ص����ݡ�<br/>
	 * ���а���Ԫ����metaData��
	 * 
	 * @return {@link Map} data
	 */
	public Map getDataMap() {
		Object data = this.data.get(this.metaData.getRoot());
		if (data == null) {
			this.setData(new ArrayList());
		}
		if (this.metaData.isLoad() != true) {
			this.data.remove("metaData");
		} else {
			this.data.put("metaData", this.metaData.getDataMap());
		}
		return this.data;
	}

}
