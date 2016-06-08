package com.rsc.rsclient.http;

import java.util.Map;

import junit.framework.TestCase;

import com.rsc.rsclient.exception.ParserException;
import com.rsc.rsclient.parse.SuperParser;

public class TestStoreData extends TestCase {

	public void test1() throws ParserException {
		String str = "{'pm_flag':'Y','metaData':{'paramNames':{'start':'start','limit':'limit','sort':'sort','dir':'dir'},'idProperty':'code','root':'items','totalProperty':'total','successProperty':'success','messageProperty':'message','limit':3,'sortInfo':{'sort':'name','dir':'ASC'}},'xaction':'read'}";
		Map map = (Map) SuperParser.marshal(str, Map.class);
		System.out.println(map);
		StoreData data = new StoreData(map);
		System.out.println(data.get("pm_flag"));
		System.out.println(data.getSortDir());
		System.out.println(data.getSortInfo());
		System.out.println(data.getMetaData().getDataMap());
	}

}
