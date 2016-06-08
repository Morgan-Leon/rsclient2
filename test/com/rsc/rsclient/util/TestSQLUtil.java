package com.rsc.rsclient.util;

import junit.framework.TestCase;

public class TestSQLUtil extends TestCase {

	public void testMethod1() {
		String sql = "SELECT fields, table_name, cri_add_ora FROM generalsel_head ";
		sql = SQLUtil.pagingSql(sql, "", Integer.valueOf(100), Integer.valueOf(20) , "Oracle");
		System.out.println(sql);
	}
}
