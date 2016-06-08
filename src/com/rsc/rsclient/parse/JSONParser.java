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
 * JSON解析器。继承自{@link Parser}
 * 
 * @author changhu
 */
public class JSONParser extends Parser {

	private static Logger logger = Logger.getLogger(JSONParser.class);

	/**
	 * 将传入参数编码为JSON字符串
	 * 
	 * @param bean
	 *            值对象
	 * @return {@link String} 编码后的JSON字符串
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
	 * 将传入对象编码为JSON字符串，并指定值对象名字
	 * 
	 * @param name
	 *            值对象名称
	 * @param bean
	 *            值对象
	 * @return {@link String} 编码后的JSON字符串
	 */
	public String unmarshal(String name, Object bean) throws ParserException {
		return "{" + name + ":" + this.unmarshal(bean) + "}";
	}

	/**
	 * 将传入的JSON字符串解码为List
	 * 
	 * @param str
	 *            JSON字符串
	 * @return {@link List} 解码后的list对象
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
	 * 将传入的JSON字符串解码为Map
	 * 
	 * @param str
	 *            JSON字符串
	 * @return {@link Map} 解码后的Map对象
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
	 * 将JSON对象转换为Object值对象
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
	 * 将JSON数组对象转换为List
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
	 * 将JSON对象转换为Map
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
	 * 将值对象转换为JSON
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
	 * 将MAP转换为JSON对象
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
	 * 将List转换为JSON数组
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
