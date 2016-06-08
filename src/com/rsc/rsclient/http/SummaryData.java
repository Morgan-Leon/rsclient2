package com.rsc.rsclient.http;

import java.util.HashMap;
import java.util.Map;

public class SummaryData extends HashMap{

	public void setData(String fieldName, String summaryType, String value) {

		Map map = (Map) this.get(fieldName);

		if (!(map instanceof Map)) {
			this.put(fieldName, new HashMap());
		}
		map = (Map) this.get(fieldName);
		
		value = formatValue(summaryType , value);
		
		map.put(summaryType, value);
	}

	private String formatValue(String summaryType,String value) {
		if ("sum".equalsIgnoreCase(summaryType)) {
			value = value ;
		} else if ("max".equalsIgnoreCase(summaryType)) {
			value = value ;
		} else if ("min".equalsIgnoreCase(summaryType)) {
			value = value ;
		} else if ("average".equalsIgnoreCase(summaryType)) {
			value = value ;
		} else if ("count".equalsIgnoreCase(summaryType)) {
			value = value ;
		} else {
			throw new RuntimeException("没有这种合计,请检查合计类别");
		}
		return value ;
	}
}
