package com.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DataFactory {

	private Map template;

	private Map data;

	public DataFactory(String fields) throws Exception {
		this.initTemplate(fields);
		this.reset();
	}
	
	private void initTemplate(String fields) throws Exception {
		if (fields != null) {
				try {
					this.template = this.stringToMap(fields);
				} catch (Exception e) {
					throw new Exception("根据查询字段" + fields +"初始化数据模版异常");
				}
		}
	}

	// 将完整的字段字符串转换成Map
	private Map stringToMap(String fields) throws Exception {
		fields = fields.toUpperCase().trim();
		if (fields.startsWith("DISTINCT")) {
			fields = fields.substring(8).trim();
		} else if (fields.startsWith("UNIQUE")) {
			fields = fields.substring(6).trim();
		} else if (fields.startsWith("ALL")) {
			fields = fields.substring(3).trim();
		}
		Map fieldsMap = new HashMap();
		int o = 0, idx = 0;
		String temp = "";
		for (int i = 0, len = fields.length(); i < len; i++) {
			char c = fields.charAt(i);
			if (c == '(') {
				temp += c;
				o++;
			} else if (c == ')') {
				temp += c;
				o--;
				if (i == len - 1) {
					fieldsMap.put("" + (++idx), this.stringToArray(temp));
				}
			} else {
				if ((o == 0 && c == ',')) {
					fieldsMap.put("" + (++idx), this.stringToArray(temp));
					temp = "";
				} else if (i == len - 1) {
					temp += c;
					fieldsMap.put("" + (++idx), this.stringToArray(temp));
				} else {
					temp += c;
				}
			}
		}
		return fieldsMap;
	}

	// 将单个的字段转换成字符串数组
	private List stringToArray(String field) throws Exception {
		field = field.trim();
		if (field.endsWith(")") || field.endsWith(" END")) {
			throw new Exception("查询字段:" + field + "必须声明别名");
		}
		for(int i = field.length() - 1, o = 0; i >= 0; i--){
			char c = field.charAt(i);
			if(c == ')'){
				o++;
			}else if(c == '('){
				o--;
			}
			if(o == 0 && c == ' '){
				field = field.substring(i+1);
				break;
			}
		}
		field = field.replaceAll("\"", "");
		List fieldList = new ArrayList();
		int idx = field.indexOf(".");
		if(idx > 0 && idx < field.length() - 1){
			fieldList.add(field.substring(0, idx));
			fieldList.add(field.substring(idx + 1));
		}else {
			fieldList.add(field);
		}
		return fieldList;
	}

	public void addData(String idx, Object data) throws Exception{
		List fieldList = (List)this.template.get(idx);
		if(fieldList != null){
			int len = fieldList.size();
			if(len == 2){
				String key = (String)fieldList.get(0);
				String key2 = (String)fieldList.get(1);
				Map d = (Map)this.data.get(key);
				if(d == null){
					d = new HashMap();
					this.data.put(key, d);
				}
				d.put(key2, data);
			}else if(len == 1){
				String key = (String)fieldList.get(0);
				this.data.put(key, data);
			}
		}else {
			throw new Exception("错误的值索引");
		}
	}

	public void reset() {
		this.data = new HashMap();
	}

	public Map getDataMap() {
		return this.data;
	}

	public int length() {
		return this.template.size();
	}

}
