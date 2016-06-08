package com.rsc.rsclient.http;

import java.util.HashMap;

public class CompositeKey extends HashMap {
	public Object put(Object key, Object value) {
		value = "'" + value + "'";
		return super.put(key, value);
	}
}
