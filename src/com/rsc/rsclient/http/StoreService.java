package com.rsc.rsclient.http;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;

/**
 * 封装Ext Store中增删改查操作的业务类。继承自{@link Service}
 * 
 * @author changhu
 */

public abstract class StoreService extends Service {

	private Logger logger = Logger.getLogger(StoreService.class);

	private static java.text.NumberFormat nf = java.text.NumberFormat
			.getInstance();

	/**
	 * 注册业务方法。
	 * 
	 * @param methodMap
	 *            业务方法Map
	 */
	public void registerMethods(MethodMap mm) throws Exception {
		mm.add("read").addMapParameter("params").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		mm.add("create").addMapParameter("params").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		mm.add("update").addMapParameter("params").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		mm.add("destroy").addMapParameter("params").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		mm.add("export").addObjectParameter("httpRequestProxy",
				HttpRequestProxy.class).addMapParameter("params")
				.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey).addStringParameter(
						WebKeys.UserUniqueIdKey).addStringParameter(
						WebKeys.DbType).setMapReturnValue();
	}

	/**
	 * 读取数据
	 * 
	 * @param params
	 *            参数MAP
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @return {@link Map} 返回信息
	 */
	public final Map read(Map params, SelRs rsSr, String companyCode,
			String userId, String dbType) {
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

	/**
	 * 读取数据
	 * 
	 * @param params
	 *            参数MAP
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @return {@link Map} 返回信息
	 */
	public final Map export(HttpRequestProxy httpRequestProxy, Map params,
			SelRs rsSr, String companyCode, String userId, String dbType) {

		nf.setGroupingUsed(false); // 是否采用分组
		String path = null;
		if (httpRequestProxy.getServletContext() == null)
			path = httpRequestProxy.getRequest().getRealPath("/") + "profile\\";
		else {
			path = httpRequestProxy.getServletContext().getRealPath("/")
					+ "profile\\";
		}
		File f = new File(path);
		if (!f.isDirectory()) {
			f.mkdirs();
		}

		Map info = new HashMap();
		StoreData data = new StoreData(params);
		try {
			List list = (List) data.get("header");
			Map sumType = new HashMap();
			LinkedHashMap map = new LinkedHashMap();
			for (int i = 0; i < list.size(); i++) {
				List l = (List) list.get(i);
				if (l != null) {
					int size = l.size();
					if (size == 2) {
						map.put(l.get(0), l.get(1));
					} else if (size == 3) {
						map.put(l.get(0) + "-" + l.get(2), l.get(1));
						sumType.put(l.get(0) + "-" + l.get(2), l.get(2));
					}
				}
			}
			
			f = this.createCSVFileHead(map, path);

			List mdata = new ArrayList();
			if ("false".equals(data.get("paging")) && data.getLimit() != null) {
				mdata = doExportAllPageData(data, mdata, sumType, map, f, rsSr, companyCode, userId, dbType);
				this.createCSVFile(mdata, map, f);
			} else {
				mdata = doExportOnePageData(data, mdata, sumType, rsSr, companyCode, userId, dbType);
				this.createCSVFile(mdata, map, f);
			}
			// File file = this.createCSVFile(mdata, map, path);
			info.put("filename", f.getName());
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		}
		return info;
	}
	
	/**
	 * 
	 * @param data 获得当页的数据
	 * @param mdata 存储要导出的数据
	 * @param sumType 合计行的类型和小数位
	 * @param map 要导出的列头的信息
	 * @param f 操作要导出的文件
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @param dbType 数据库类型
	 * @throws Exception
	 */
	private List doExportAllPageData(StoreData data, List mdata, 
			Map sumType, LinkedHashMap map, File f, 
			SelRs rsSr, String companyCode, String userId, String dbType) throws Exception{
		int step = 20000;
		int start = 0, limit = step;
		data.setLimit(new Integer(limit));
		data.setStart(new Integer(start));
		this.read(data, rsSr, companyCode, userId, dbType);
		mdata = data.getData();
		while (mdata.size() == step) {
			start += step;
			data.setStart(new Integer(start));
			this.read(data, rsSr, companyCode, userId, dbType);
			this.createCSVFile(mdata, map , f);
			mdata = data.getData();
		}
		Map sum = data.getSummaryData();
		if(sum != null){
			Map summaryMap = new HashMap();
			Iterator it = sum.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry m = (Map.Entry) it.next();
				String key = (String) m.getKey() ;
				Map mv = (Map) m.getValue() ;
				Iterator iter = mv.entrySet().iterator();
				while(iter.hasNext()){
					Map.Entry mm = (Map.Entry) iter.next();
					summaryMap.put(key + "-" + mm.getKey(), mm.getValue()) ;
				}
			}
			
			if (sumType.size() > 0) {
				Iterator iter = sumType.entrySet().iterator();
				while (iter.hasNext()) {
					Map.Entry entry = (Map.Entry) iter.next();
					String key = (String) entry.getKey();
					String tempKey = key.split("-")[0];
					Map summaryType = (Map)entry.getValue();
					String val = (String) summaryType.get("type") ;
					int decimalPrecision = Integer.parseInt((String)summaryType.get("decimalPrecision"));
					String value = (String) summaryMap.get(tempKey + "-" + val) ;
					double lastValue = doRoundingData(value, decimalPrecision);
					nf.setMaximumFractionDigits(decimalPrecision);
					if("sum".equals(val)){
						summaryMap.put(tempKey + "-" + summaryType , "合计值：" + nf.format(lastValue)) ;
					} else if ("average".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "平均值：" + nf.format(lastValue)) ;
					} else if ("count".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "共：" + nf.format(mdata.size()) + "条") ;
					} else if ("max".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "最大值：" + nf.format(lastValue)) ;
					} else if ("min".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "最小值：" + nf.format(lastValue)) ;
					}
				}
			}
			
			if (summaryMap != null) {
				mdata.add(summaryMap) ;
			}
		}
		return mdata ;
	}
	
	/**
	 * 导出单页数据
	 * @param data 获得当页的数据
	 * @param mdata 存储要导出的数据
	 * @param sumType 合计行的类型和小数位
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @param dbType 数据库类型
	 * @throws Exception
	 */
	private List doExportOnePageData(StoreData data, List mdata, Map sumType, 
			SelRs rsSr, String companyCode, String userId, String dbType) throws Exception{
		this.read(data, rsSr, companyCode, userId, dbType);
		mdata = data.getData();
		if (sumType.size() > 0) {
			Map sum = new HashMap();
			Iterator iter = sumType.entrySet().iterator();
			while (iter.hasNext()) {
				Map.Entry entry = (Map.Entry) iter.next();
				String key = (String) entry.getKey();
				String tempKey = key.split("-")[0];
				Map summaryType = (Map)entry.getValue();
				String val = (String) summaryType.get("type") ;
				int decimalPrecision = Integer.parseInt((String)summaryType.get("decimalPrecision"));
				nf.setMaximumFractionDigits(decimalPrecision);
				if (val.equals("sum")) {
					String value = this.sum(mdata, tempKey) + "";
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "合计值:" + nf.format(lastValue));
					
				} else if (val.equals("average")) {
					String value = this.sum(mdata, tempKey);
					String avg = Double.parseDouble(value)
							/ mdata.size() + "";
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "平均值:" + nf.format(lastValue));
					
				} else if (val.equals("count")) {
					sum.put(key, "共" + nf.format(mdata.size()) + "条");
					
				} else if (val.equals("max")) {
					String value = this.max(mdata, tempKey) ;
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "最大值:" + nf.format(lastValue));
					
				} else if (val.equals("min")) {
					String value = this.min(mdata, tempKey) ;
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "最小值:" + nf.format(lastValue));
				}
			}
			mdata.add(sum);
		}
		return mdata ;
	}
	
	/**
	 * @param value 要计算的值
	 * @param decimalPrecision 小数位数
	 * @return
	 */
	private double doRoundingData(String value , int decimalPrecision){
		BigDecimal b = new BigDecimal(value);
		return b.setScale(decimalPrecision, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	public String sum(List data, String key) {
		nf.setGroupingUsed(false);
		double sum = 0.0;
		int length = data.size();
		for (int i = 0; i < length; i++) {
			String value = ((Map) data.get(i)).get(key).toString();
			sum += Double.parseDouble(value);
		}
		return nf.format(sum);
	}

	public String max(List data, String key) {
		nf.setGroupingUsed(false);
		double max = Double.NEGATIVE_INFINITY;
		int length = data.size();
		for (int i = 0; i < length; i++) {
			String value = ((Map) data.get(i)).get(key).toString();
			max = max > Double.parseDouble(value) ? max : Double
					.parseDouble(value);
		}
		return nf.format(max);
	}

	public String min(List data, String key) {
		nf.setGroupingUsed(false);
		double min = Double.POSITIVE_INFINITY;
		int length = data.size();
		for (int i = 0; i < length; i++) {
			String value = ((Map) data.get(i)).get(key).toString();
			min = min < Double.parseDouble(value) ? min : Double
					.parseDouble(value);
		}
		return nf.format(min);
	}

	public static File createCSVFileHead(LinkedHashMap rowMapper,
			String outPutPath) {
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

	public static File createCSVFile(List exportData, LinkedHashMap rowMapper,
			File file) {
		File csvFile = null;
		BufferedWriter csvFileOutputStream = null;
		try {
			csvFile = file;
			// GB2312使正确读取分隔符","
			csvFileOutputStream = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(csvFile, true), "GB2312"), 1024);
			// 写入文件内容
			int index = 0;
			for (Iterator iterator = exportData.iterator(); iterator.hasNext();) {
				Object row = (Object) iterator.next();
				index++;
				for (Iterator propertyIterator = rowMapper.entrySet()
						.iterator(); propertyIterator.hasNext();) {
					java.util.Map.Entry propertyEntry = (java.util.Map.Entry) propertyIterator
							.next();

					String svalue = BeanUtils.getProperty(row, propertyEntry
							.getKey().toString().split("-")[0]);

					if (index == exportData.size()) {
						svalue = BeanUtils.getProperty(row, propertyEntry
								.getKey().toString());
					}

					svalue = svalue == null ? "" : svalue.toString();

					nf.setGroupingUsed(false);

					double formatValue = 0;
					try {
						formatValue = Double.parseDouble(svalue);
						svalue = nf.format(formatValue).toString();
					} catch (Exception e) {
						svalue = svalue;
					}
					csvFileOutputStream.write("\"" + svalue + "\"");
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

	/**
	 * 新增数据
	 * 
	 * @param param
	 *            参数
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @return {@link Map} 返回信息
	 */
	public final Map create(Map params, SelRs rsSr, String companyCode,
			String userId, String dbType) {
		StoreData data = new StoreData(params);
		try {
			this
					.create(data, data.getData(), rsSr, companyCode, userId,
							dbType);
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		}
		return data.getDataMap();
	}

	/**
	 * 更新数据操作
	 * 
	 * @param params
	 *            参数MAP
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @return {@link Map} 返回信息
	 */
	public final Map update(Map params, SelRs rsSr, String companyCode,
			String userId, String dbType) {
		StoreData data = new StoreData(params);
		try {
			this.update(data, data.getData(), rsSr, companyCode, userId,
							dbType);
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		}
		return data.getDataMap();
	}

	/**
	 * 删除数据操作
	 * 
	 * @param params
	 *            参数MAP
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @return {@link Map} 返回信息
	 */
	public Map destroy(Map params, SelRs rsSr, String companyCode,
			String userId, String dbType) {
		StoreData data = new StoreData(params);
		Object o = data.getData() ;
		try {
			this.destroy(data, data.getData(), rsSr, companyCode, userId,
					dbType);
			data.setSuccess();
		} catch (Exception e) {
			data.setFailure();
			data.setMessage(e.getMessage());
			logger.error(e.getMessage(), e);
		}
		return data.getDataMap();
	}

	/**
	 * 用户要实现的方法，真正的数据读取逻辑。
	 * 
	 * @param data
	 *            Store数据封装对象
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @throws Exception
	 */
	public void read(StoreData data, SelRs rsSr, String companyCode,
			String userId, String dbType) throws Exception {
	};

	/**
	 * 用户要实现的方法，真正的创建数据的逻辑
	 * 
	 * @param data
	 *            Store数据封装对象
	 * @param items
	 *            传入数据
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @throws Exception
	 */
	public void create(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

	/**
	 * 用户要实现的方法， 真正更新数据的逻辑
	 * 
	 * @param data
	 *            Store数据封装对象
	 * @param items
	 *            传入数据
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @throws Exception
	 */
	public void update(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

	/**
	 * 用户要实现的方法，真正删除数据的逻辑
	 * 
	 * @param data
	 *            Store数据封装对象
	 * @param items
	 *            传入数据
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @param dbType
	 *            数据库类型
	 * @throws Exception
	 */
	public void destroy(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

}
