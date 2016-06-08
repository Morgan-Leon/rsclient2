package com.rsc.rsclient.http;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

import junit.framework.TestCase;

import com.rsc.rs.pub.dbUtil.SelRs;

public class TestStoreEngine extends TestCase {

	public void testMethod1() throws Exception {

		String sql = "SELECT * FROM inv_master table_1 WHERE company_code = '00'";

		Map map = new HashMap();
		map.put("limit", Integer.valueOf(10));
		map.put("start", Integer.valueOf(20));

		Map map2 = new HashMap();
		map2.put("item_code", "DESC");
		
		sql = this.getOrderBySql(map2, sql);
		String result = this.getPagingSql(map, sql);

		System.out.println(result);
		SelRs rsSr = new SelRs("", "sys");
		ResultSet rs = rsSr.getRs(result);
		
		System.out.println(" rs:  " + rs);
	}

	public String getOrderBySql(Map map, String sql) {
		StringBuffer sb = new StringBuffer(" ORDER BY ");
		boolean append = false;
		for (Iterator i = map.keySet().iterator(); i.hasNext();) {
			String field = (String) i.next();
			String dir = (String) map.get(field);
			if (field != null && !"".equals(field)
					&& dir != null && ("ASC".equals(dir.toUpperCase()) 
						|| "DESC".equals(dir.toUpperCase())
						|| "".equals(dir))) {
				sb.append(field + " " + dir + ",");
				append = append == false;
			}
		}
		if(append == true){
			return sql + sb.substring(0, sb.length() - 1);
		}else {
			return sql;
		}
	}

	public String getPagingSql(Map map, String sql) {
		
		String limitField = "limit";
		String startField = "start";
		String limit = map.get(limitField) != null ? "" + map.get(limitField) : null;
		String start = map.get(startField) != null ? "" + map.get(startField) : null;
		
		String t1 = this.createAliasName("table_", sql);
		String t2 = this.createAliasName("table_", sql + " " + t1);
		String f1 = this.createAliasName("field_", sql + " " + t1 + " " + t2);
		
		StringBuffer temp = new StringBuffer("SELECT * FROM (SELECT " + t1 + ".*, rownum AS " + f1
				+ " FROM (" + sql + ") " + t1 + ") " + t2);
		temp.append("  WHERE " + t2 + "." + f1 + " > " + (start == null ? "0" : start));
		if(limit != null){
			temp.append(" AND rownum <= " + limit);
		}
		return temp.toString();
	}

	public String createAliasName(String prefix, String sql) {
		Random rnd = new Random();
		String temp = (prefix + rnd.nextInt(999)).toLowerCase();
		Pattern p = Pattern.compile(".*" + temp + ".*");
		boolean result = p.matcher(sql.toLowerCase()).matches();
		if (result == true) {
			temp = this.createAliasName(prefix, sql);
		}
		return temp;
	}

	public void testMethod2() {
		String limit = "0";
		int l = Integer.parseInt("" + limit);
		System.out.println(l);
	}

}
