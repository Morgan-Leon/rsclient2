package com.rsc.rsclient.parse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import com.rsc.rsclient.exception.ParserException;

/**
 * JSON���������̳���{@link Parser}
 * 
 * @author changhu
 */
public class JSONParser extends Parser {

	private static Logger logger = Logger.getLogger(JSONParser.class);

	/**
	 * �������������ΪJSON�ַ���
	 * 
	 * @param bean
	 *            ֵ����
	 * @return {@link String} ������JSON�ַ���
	 */
	public String unmarshal(Object bean) throws ParserException {
		try {
			if (Map.class.isAssignableFrom(bean.getClass())) {
				JSONObject jo;
				jo = this.mapToJSONObject((Map) bean);
				return jo != null ? jo.toString() : null;
			} else if (List.class.isAssignableFrom(bean.getClass())) {
				JSONArray ja = this.listToJSONArray((List) bean);
				return ja != null ? ja.toString() : null;
			} else if (String.class.isAssignableFrom(bean.getClass())) {
				//return "'" + bean.toString() + "'";
				return bean.toString();
			} else {
				return bean.toString();
			}
		} catch (JSONException e) {
			throw new ParserException("map/list to json exception:"
					+ e.getMessage());
		}
	}

	/**
	 * ������������ΪJSON�ַ�������ָ��ֵ��������
	 * 
	 * @param name
	 *            ֵ��������
	 * @param bean
	 *            ֵ����
	 * @return {@link String} ������JSON�ַ���
	 */
	public String unmarshal(String name, Object bean) throws ParserException {
		return "{" + name + ":" + this.unmarshal(bean) + "}";
	}

	/**
	 * �������JSON�ַ�������ΪList
	 * 
	 * @param str
	 *            JSON�ַ���
	 * @return {@link List} ������list����
	 */
	public List marshalToList(String str) throws ParserException {
		logger.debug("json to list:" + str);
		JSONTokener jt = new JSONTokener(str);
		try {
			JSONArray ja = new JSONArray(jt);
			return this.jsonArrayToList(ja);
		} catch (JSONException e) {
			throw new ParserException("json to list exception:"
					+ e.getMessage());
		}
	}

	/**
	 * �������JSON�ַ�������ΪMap
	 * 
	 * @param str
	 *            JSON�ַ���
	 * @return {@link Map} ������Map����
	 */
	public Map marshalToMap(String str) throws ParserException {
		logger.debug("json to map:" + str);
		JSONTokener jt = new JSONTokener(str);
		try {
			JSONObject jo = new JSONObject(jt);
			return this.jsonObjectToMap(jo);
		} catch (JSONException e) {
			throw new ParserException("json to map exception:" + e.getMessage());
		}
	}

	/**
	 * ��JSON����ת��ΪObjectֵ����
	 * 
	 * @param obj
	 * @return
	 * @throws JSONException
	 * @throws ParserException
	 */
	private Object JSONToObj(Object obj) throws JSONException, ParserException {
		if (obj instanceof JSONArray) {
			return this.jsonArrayToList((JSONArray) obj);
		} else if (obj instanceof JSONObject) {
			return this.jsonObjectToMap((JSONObject) obj);
		} else {
			return obj.toString();
		}
	}

	/**
	 * ��JSON�������ת��ΪList
	 * 
	 * @param ja
	 * @return
	 * @throws JSONException
	 * @throws ParserException
	 */
	private List jsonArrayToList(JSONArray ja) throws JSONException,
			ParserException {
		List list = new ArrayList();
		for (int i = 0; i < ja.length(); i++) {
			Object obj = ja.get(i);
			list.add(this.JSONToObj(obj));
		}
		return list;
	}

	/**
	 * ��JSON����ת��ΪMap
	 * 
	 * @param jo
	 * @return
	 * @throws JSONException
	 * @throws ParserException
	 */
	private Map jsonObjectToMap(JSONObject jo) throws JSONException,
			ParserException {
		Map map = new HashMap();
		Iterator i = jo.sortedKeys();
		while (i.hasNext()) {
			String key = (String) i.next();
			Object obj = jo.get(key);
			map.put(key, this.JSONToObj(obj));
		}
		return map;
	}

	/**
	 * ��ֵ����ת��ΪJSON
	 * 
	 * @param obj
	 * @return
	 * @throws JSONException
	 */
	private Object objToJSON(Object obj) throws JSONException {
		if (obj == null) {
			return "undefined";
		} else {
			if (Map.class.isAssignableFrom(obj.getClass())) {
				return this.mapToJSONObject((Map) obj);
			} else if (List.class.isAssignableFrom(obj.getClass())) {
				return this.listToJSONArray((List) obj);
			} else if (String.class.isAssignableFrom(obj.getClass())) {
				return obj.toString();
			} else {
				return obj;
			}
		}
	}

	/**
	 * ��MAPת��ΪJSON����
	 * 
	 * @param map
	 * @return
	 * @throws JSONException
	 */
	private JSONObject mapToJSONObject(Map map) throws JSONException {
		JSONObject jo = new JSONObject();
		for (Iterator keys = map.keySet().iterator(); keys.hasNext();) {
			String key = (String) keys.next();
			jo.put(key, this.objToJSON(map.get(key)));
		}
		return jo;
	}

	/**
	 * ��Listת��ΪJSON����
	 * 
	 * @param list
	 * @return
	 * @throws JSONException
	 */
	private JSONArray listToJSONArray(List list) throws JSONException {
		JSONArray ja = new JSONArray();
		for (Iterator i = list.iterator(); i.hasNext();) {
			ja.put(this.objToJSON(i.next()));
		}
		return ja;
	}

}
