package com.rsc.rsclient.servlet;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;
import com.rsc.rsclient.http.StoreData;
import com.rsc.rsclient.util.SQLUtil;

/**
 * 望远镜数据GeneralselService 继承自{@link Service}
 * 
 * @author changhu
 */
public class GeneralselService extends Service {

	private Logger logger = Logger.getLogger(GeneralselService.class);
	
	/**
	 * 注册业务方法，注册read方法
	 * 
	 * @param methodMap
	 */
	public void registerMethods(MethodMap mm) throws Exception {
		mm.add("read").addMapParameter("params").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		mm.add("export").addObjectParameter("response",
				HttpServletResponse.class).addStringParameter("workpath")
				.addMapParameter("params").addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey).addStringParameter(
						WebKeys.UserUniqueIdKey).addStringParameter(
						WebKeys.DbType).setMapReturnValue();
	}
	
	/**
	 * read
	 * 
	 * @param params
	 * @param rsSr
	 * @param companyCode
	 * @param userId
	 * @param dbType
	 * @return
	 */
	public Map read(Map params, SelRs rsSr, String companyCode, String userId,
			String dbType){
		StoreData data = new StoreData(params);
		try {
			this.read(data, rsSr, companyCode, userId, dbType);
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		} finally {
			return data.getDataMap();	
		}
	}

	// 查询
	public void read(StoreData data, SelRs rsSr, String companyCode,
			String userId, String dbType) throws Exception {

		// progCode
		String progCode = (String) data.get("progCode");
		//progCondition
		String progCondition = (String) data.get("progCondition");
		//dataCompany
		String dataCompany = (String) data.get("dataCompany");
		
		String dbLink = "" ;
		
		if(!(dataCompany == null || "null".equals(dataCompany) || "".equals(dataCompany.trim()))){
			//取db_link
			String dbLinkSql = "SELECT NVL(MAX(db_link),'') FROM sys_company WHERE company_code='"
				+ dataCompany + "' AND NVL(local_flag,'N')='N'";
			
			ResultSet rs5 = rsSr.getRs(dbLinkSql);
			if (rs5 != null && rs5.next()) {
				dbLink = rs5.getString(1);
			}
			if (dbLink == null){
				dbLink = "";
			} else {
				dbLink = "@"+dbLink;
			}
		}
		
		//字段信息
		data.setMetaDataFields(this.readMetaDataFields(progCode, dbLink, rsSr));
		
		//查询头字段信息
		data.setMetaDataQeuryFields(this.readMeataDataQueryFields(progCode, dbLink, rsSr));
		// 数据
		this.readData(data, progCode, progCondition, dbLink, rsSr, dbType);
		
		if(!(null == dataCompany || "null".equals(dataCompany) || "".equals(dataCompany.trim()))){
			rsSr.update("exec ddm_core.release_session '" + dataCompany + "'");
		}
	}
	
	//导出表格内容
	public final Map export(HttpServletResponse response, String workpath,
			Map params,SelRs rsSr, String companyCode, String userId, String dbType) {
		String path = workpath+"profile\\";
		File f = new File(path);
		f.mkdirs();
		
		Map info = new HashMap();
		StoreData data = new StoreData(params);
		int step = 20000;
		try {
			List list = (List)data.get("header");
			Map sumType = new HashMap();
			LinkedHashMap map = new LinkedHashMap();
			for(int i = 0; i < list.size();i++){
				List l = (List)list.get(i);
				map.put(l.get(0),l.get(1));
				if(l.size()==3){
					sumType.put(l.get(0), l.get(2));
				}
			}

			f = this.createCSVFileHead(map, path);
			
			List mdata = new ArrayList();
			if(data.get("paging")=="false" && data.getLimit()!=null){
				int start = 0, limit=step;
				data.setLimit(new Integer(limit));
				data.setStart(new Integer(start));
				this.read(data, rsSr, companyCode, userId, dbType);
				mdata = data.getData();
				while(mdata.size()==step){
					start += step;
					data.setStart(new Integer(start));
					this.read(data, rsSr, companyCode, userId, dbType);
					this.createCSVFile(mdata, map, f);
					mdata = data.getData();
				}
				Map sum = data.getSummaryData();
				if(sum!=null){
					mdata.add(sum);
				}
				this.createCSVFile(mdata, map, f);
			} else{
				this.read(data, rsSr, companyCode, userId, dbType);
				mdata = data.getData();
				if(sumType.size()>0){
					Map sum = new HashMap();
					Iterator iter = sumType.entrySet().iterator(); 
					while (iter.hasNext()) { 
					    Map.Entry entry = (Map.Entry) iter.next(); 
					    String key = (String)entry.getKey(); 
					    String val = (String)entry.getValue();
					    if(val.equals("sum")){
					    	String value = this.sum(mdata, key)+"";
					    	sum.put(key, value);
					    } else if(val.equals("average")){
					    	double value = this.sum(mdata,key);
					    	sum.put(key, value/mdata.size()+"");
					    } else if(val.equals("count")){
					    	sum.put(key, mdata.size()+"");
					    } else if(val.equals("max")){
					    	sum.put(key, this.max(mdata, key)+"");
					    } else if(val.equals("min")){
					    	sum.put(key, this.min(mdata,key)+"");
					    }
					} 
					mdata.add(sum);
				}
				this.createCSVFile(mdata, map, f);
			}
			//File file = this.createCSVFile(mdata, map, path);
			info.put("filename", f.getName());
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		}
		return info;
	}
	
	//求某一列的和
	public double sum(List data, String key){
		double sum = 0.0;
		int length = data.size();
		for(int i = 0; i < length; i++){
			String value = ((Map)data.get(i)).get(key).toString();
			sum+=Double.parseDouble(value);
		}
		return sum;
	}
	//求某一列的最大值
	public double max(List data, String key){
		double max = Double.NEGATIVE_INFINITY;
		int length = data.size();
		for(int i = 0; i < length; i++){
			String value = ((Map)data.get(i)).get(key).toString();
			max = max>Double.parseDouble(value)?max:Double.parseDouble(value);
		}
		return max;
	}

	//求某一列的最小值
	public double min(List data, String key){
		double min = Double.POSITIVE_INFINITY;
		int length = data.size();
		for(int i = 0; i < length; i++){
			String value = ((Map)data.get(i)).get(key).toString();
			min = min<Double.parseDouble(value)?min:Double.parseDouble(value);
		}
		return min;
	}
	
	//创建临时csv文件并写入头部
	public static File createCSVFileHead(LinkedHashMap rowMapper, String outPutPath){
		File csvFile = null;
		BufferedWriter csvFileOutputStream = null;
		try {
			csvFile = File.createTempFile("temp", ".csv", new File(outPutPath));
			// GB2312使正确读取分隔符","
			csvFileOutputStream = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(csvFile), "GB2312"), 1024);
			// 写入文件头部
			for (Iterator propertyIterator = rowMapper.entrySet().iterator(); propertyIterator
					.hasNext();) {
				java.util.Map.Entry propertyEntry = (java.util.Map.Entry) propertyIterator
						.next();
				csvFileOutputStream.write("\""
						+ propertyEntry.getValue().toString() + "\"");
				if (propertyIterator.hasNext()) {
					csvFileOutputStream.write(",");
				}
			}
			csvFileOutputStream.newLine();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				csvFileOutputStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return csvFile;
	}
	//在创建的临时文件中写入表格内容
	public static File createCSVFile(List exportData, LinkedHashMap rowMapper,
			File file) {
		File csvFile = null;
		BufferedWriter csvFileOutputStream = null;
		try {
			csvFile = file;
			// GB2312使正确读取分隔符","
			csvFileOutputStream = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(csvFile,true), "GB2312"), 1024);
			// 写入文件内容
			for (Iterator iterator = exportData.iterator(); iterator.hasNext();) {
				Object row = (Object) iterator.next();
				for (Iterator propertyIterator = rowMapper.entrySet()
						.iterator(); propertyIterator.hasNext();) {
					java.util.Map.Entry propertyEntry = (java.util.Map.Entry) propertyIterator
							.next();
					String svalue = BeanUtils.getProperty(row,
							propertyEntry.getKey().toString());
					svalue = svalue==null?"":svalue.toString();
					csvFileOutputStream.write("\""
							+ svalue + "\"");
					if (propertyIterator.hasNext()) {
						csvFileOutputStream.write(",");
					}
				}
				if (iterator.hasNext()) {
					csvFileOutputStream.newLine();
				}
			}
			csvFileOutputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				csvFileOutputStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return csvFile;
	}

	
	

	// 查询元数据
	private List readMetaDataFields(String progCode, String dbLink ,SelRs rsSr) throws SQLException{
		Map fields = new HashMap();
		String sql = "SELECT field_name, desc_ch, desc_en, "
				+ "(CASE WHEN regexp_like(width, '^[0-9]+\\.?[0-9]*$') THEN to_char(width) ELSE to_char(length(desc_ch) * 20) END) AS width, isHidden "
				+ " FROM generalsel_detail " + dbLink + " WHERE prog_code = '" + progCode
				+ "' " + " ORDER BY seq_no";
		logger.debug(sql);
		ResultSet rs = rsSr.getRs(sql);
		int temp = 0 ;
		while (rs != null && rs.next()) {
			String fieldName = rs.getString(1).toUpperCase();
			String descCh = rs.getString(2);
			String descEn = rs.getString(3);
			double width = rs.getDouble(4);
			boolean isHidden = "Y".equals(rs.getString(5));
			Map field = new HashMap();
			field.put("seqNo",Integer.valueOf(temp++));
			field.put("name", fieldName);
			field.put("descCh", descCh);
			field.put("descEn", descEn);
			field.put("width", new Double(width));
			field.put("hidden", Boolean.valueOf(isHidden));

			fields.put(fieldName, field);
		}

		// 获取数据库元数据
		String sql1 = "SELECT 'select ' || fields_ora || ' from ' || table_name || '" + dbLink + "' || ' where rownum < 2' AS sql1 "
				+ " FROM generalsel_head " + dbLink
				+ " WHERE prog_code = '"
				+ progCode
				+ "' " + "   AND rownum < 2";
		
		String sql3 = null;
		ResultSet rs2 = rsSr.getRs(sql1);
		if (rs2 != null && rs2.next()) {
			sql3 = rs2.getString(1);
		}
		if (sql3 != null && !"".equals(sql3)) {
			ResultSet rs3 = rsSr.getRs(sql3);
			ResultSetMetaData metaData = rs3.getMetaData();
			int c = metaData.getColumnCount();
			for (int i = 1; i <= c; i++) {
				String fieldName = metaData.getColumnName(i);
				Map field = (Map) fields.get(fieldName);
				if (field != null) {
					String typeName = metaData.getColumnTypeName(i);
					if (typeName != null
							&& typeName.toUpperCase().equals("NUMBER")) {
						field.put("align", "right");
					} else {
						field.put("align", "left");
					}
				}
			}
		}
		
		//输出List
		List list = new ArrayList();
		for (Iterator i = fields.keySet().iterator(); i.hasNext();) {
			list.add(fields.get(i.next()));
		}
		return list;
	}
	
	//查询头字段信息
	private List readMeataDataQueryFields(String progCode,  String dbLink ,SelRs rsSr) throws SQLException{
		List fields = new ArrayList(); 
		String sql = "SELECT field_name, desc_ch, desc_en, "
			+ "decode(is_must_input, 'Y', 'false', 'true') AS allowBlank "
			+ "FROM generalsel_cri " + dbLink
			+ " WHERE prog_code = '" + progCode + "' "
			+ "AND (ishidden IS NULL OR ishidden <> 'Y') "
			+ "ORDER BY seq_no";
		ResultSet rs = rsSr.getRs(sql);
		while(rs != null && rs.next()){
			Map field = new HashMap();
			String name = rs.getString(1);
			field.put("name", name != null ? name.toUpperCase() : name);
			field.put("descCh", rs.getString(2));
			field.put("descEn", rs.getString(3));
			field.put("allowBlank", Boolean.valueOf("true".equals(rs.getString(4))));
			
			fields.add(field);
		}
		return fields;
	}
	
	// 查询数据
	private void readData(StoreData data, String progCode,
			String progCondition,  String dbLink ,SelRs rsSr, String dbType)
			throws Exception {
		boolean ora = dbType != null && "ORACLE".equals(dbType.toUpperCase());
		// 数据
		String sql = "SELECT 'select ' || fields" + (ora == true ? "_ora" : "")
				+ " || ' from ' || table_name || '" + dbLink + " where ' || "
				+ "	CASE WHEN cri_add" + (ora == true ? "_ora" : "")
				+ " IS NULL THEN '1 = 1' ELSE to_char(cri_add" 
				+ (ora == true ? "_ora" : "") + ") END AS sql1, "
				+ "'select count(*) from (select ' || fields || ' from ' || table_name || ' where ' || CASE "
		        + " WHEN cri_add" + (ora == true ? "_ora" : "") 
		        + " IS NULL THEN '1 = 1' ELSE to_char(cri_add" 
		        + (ora == true ? "_ora" : "") + ") END AS sql2, "
		        + " fields" + (ora == true ? "_ora" : "") + " as fields"
				+ " FROM generalsel_head " + dbLink + " WHERE prog_code = '" + progCode
				+ "' " + "AND rownum < 2";
		logger.debug(sql);
		System.out.println("望远镜[ " + progCode + " ]查询的日志:" + sql);
		ResultSet rs2 = rsSr.getRs(sql);
		boolean flag = false;
		String sql1 = null;
		String sql2 = null;
		String fields = null;
		if (rs2 != null && rs2.next()) {
			sql1 = rs2.getString(1);
			sql2 = rs2.getString(2);
			fields = rs2.getString(3);
			if (sql1 != null && !"".equals(sql1)) {
				flag = true;
			}
		}
		if (flag == true) {
			Integer start = data.getStart();
			Integer limit = data.getLimit();

			// 取数据
			if (progCondition != null && !"".equals(progCondition.trim())) {
				sql1 += " and " + progCondition;
				sql2 += " and " + progCondition;
			}
			//补上sql2的右括号
			sql2 += ")";
			
			//声明数据工厂
			DataFactory factory = new DataFactory(fields);
			
			String sortInfo = data.getSortInfo();

			sql1 = SQLUtil.pagingSql(sql1,sortInfo, start, limit ,dbType);
			logger.debug(sql1);
			ResultSet rs3 = rsSr.getRs(sql1);
			if(rs3 != null){
				int l = factory.length();
				List items = new ArrayList();
				while (rs3 != null && rs3.next()){
					factory.reset();
					for (int i = 1; i <= l; i++){
						factory.addData(i, formatString(rs3.getObject(i)));
					}
					items.add(factory.getDataMap());
				}
				data.setData(items);
			}

			// 取总数
			logger.debug(sql2);
			ResultSet rs4 = rsSr.getRs(sql2);
			if (rs4 != null && rs4.next()) {
				data.setTotal(rs4.getInt(1));
			}
		}
	}
	
	/** 
     * @method formatString 将数据库中查询出来的空值转换为空字符串
     * @param {String} value
     * @return {String}  返回信息
     */  
    private String formatString(Object value){
    	if(value == null){
    		return "" ;
    	}
        if("null".equals(value.toString()) || "undefined".equals(value.toString())){
        	return "" ;
        }
        return value.toString() ;
    }
	
	/**
	 * 根据望远镜定义的查询字段，组织数据结构
	 * 
	 * 例如: 
	  	
	  	String fields = "a.vendor_customer_code,a.vendor_customer_name,a.vendor_customer_abv,decode(b.evaluate_flag,'Y','Y-评价','N','N-未评价') evaluate";
		DataFactory factory = new DataFactory(fields);
		
		factory.reset();  //注意每次开始放入数据前需要reset
		factory.addData("1", "code");
		factory.addData("2", "name");
		factory.addData("3", "abv");
		factory.addData("4", "evaluate");
		Map data = factory.getDataMap(); //获取数据
		
		System.out.println(SuperParser.unmarshal("json", data));
		
		输出结果为：
		{"A":{"VENDOR_CUSTOMER_CODE":"code","VENDOR_CUSTOMER_NAME":"name","VENDOR_CUSTOMER_ABV":"abv"},"EVALUATE":"evaluate"}
		
	 * 
	 */
	class DataFactory {

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

		public void addData(int idx, Object data) throws Exception{
			List fieldList = (List)this.template.get("" + idx);
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
	
}
