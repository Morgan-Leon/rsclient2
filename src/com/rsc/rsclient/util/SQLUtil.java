package com.rsc.rsclient.util;

import java.util.Random;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

/**
 * SQL������
 * 
 * @author changhu
 */
public class SQLUtil {

	private static Logger logger = Logger.getLogger(SQLUtil.class);
	
	/**
	 * ���ɷ�ҳSQL
	 * 
	 * @param sql ����SQL
	 * @param dbType ���ݿ�����
	 * @param start  ��ʼλ��
	 * @param limit  ÿҳ��ʾ����
	 * @return {@link String} sql ���ɵķ�ҳSQL
	 */
	public static String pagingSql(String sql,String orderByInfo, Integer start,
			Integer limit, String dbType) {
		if (dbType != null && "ORACLE".equals(dbType.toUpperCase())) {
			return SQLUtil.oraclePagingSql(sql,orderByInfo, start, limit);
		} else {
			return SQLUtil.sqlserverPagingSql(sql, start, limit);
		}
	}
	
	private static String oraclePagingSql(String sql,String orderByInfo,Integer start,
			Integer limit) {
		String t1 = SQLUtil.createAliasName("table_", sql);
		String f1 = SQLUtil
				.createAliasName("field_", sql + " " + t1 );
		if("".equals(orderByInfo)){
			orderByInfo = null ;
		}
		String sortSql = "SELECT * "
				       + " FROM (SELECT " + t1 + ".* ,"
		               + " ROW_NUMBER() OVER(ORDER BY " + orderByInfo + ") " + f1
		               + " FROM ( " + sql + ") " + t1 + ") " ;
		if(!"".equals(limit) && limit != null){
			if("".equals(start) || start == null){
				start = new Integer(0) ;
			}
			sortSql += " WHERE " + f1 + " BETWEEN " + (start.intValue() + 1) + " AND " + (start.intValue() + limit.intValue())  ;
		}
		return sortSql ;
	}

	// TODO : ��дsql server �ķ�ҳ��ѯ
	private static String sqlserverPagingSql(String sql, Integer start,
			Integer limit) {
		return sql;
	}

	/**
	 * ����һ������ַ�����str�в��������ַ���
	 * 
	 * @param prefix
	 *            �ַ���ǰ׺
	 * @param str
	 *            ��Ҫ��֤���ַ���
	 * @return
	 */
	private static String createAliasName(String prefix, String str) {
		Random rnd = new Random();
		String temp = (prefix + rnd.nextInt(999)).toLowerCase();
		Pattern p = Pattern.compile(".*" + temp + ".*");
		boolean result = p.matcher(str.toLowerCase()).matches();
		if (result == true) {
			temp = SQLUtil.createAliasName(prefix, str);
		}
		return temp;
	}
}
