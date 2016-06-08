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
 * ��װExt Store����ɾ�Ĳ������ҵ���ࡣ�̳���{@link Service}
 * 
 * @author changhu
 */

public abstract class StoreService extends Service {

	private Logger logger = Logger.getLogger(StoreService.class);

	private static java.text.NumberFormat nf = java.text.NumberFormat
			.getInstance();

	/**
	 * ע��ҵ�񷽷���
	 * 
	 * @param methodMap
	 *            ҵ�񷽷�Map
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
	 * ��ȡ����
	 * 
	 * @param params
	 *            ����MAP
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @return {@link Map} ������Ϣ
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
	 * ��ȡ����
	 * 
	 * @param params
	 *            ����MAP
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @return {@link Map} ������Ϣ
	 */
	public final Map export(HttpRequestProxy httpRequestProxy, Map params,
			SelRs rsSr, String companyCode, String userId, String dbType) {

		nf.setGroupingUsed(false); // �Ƿ���÷���
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
	 * @param data ��õ�ҳ������
	 * @param mdata �洢Ҫ����������
	 * @param sumType �ϼ��е����ͺ�С��λ
	 * @param map Ҫ��������ͷ����Ϣ
	 * @param f ����Ҫ�������ļ�
	 * @param rsSr ���ݿ��������
	 * @param companyCode ��˾��
	 * @param userId �û�ID
	 * @param dbType ���ݿ�����
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
						summaryMap.put(tempKey + "-" + summaryType , "�ϼ�ֵ��" + nf.format(lastValue)) ;
					} else if ("average".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "ƽ��ֵ��" + nf.format(lastValue)) ;
					} else if ("count".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "����" + nf.format(mdata.size()) + "��") ;
					} else if ("max".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "���ֵ��" + nf.format(lastValue)) ;
					} else if ("min".equals(val)) {
						summaryMap.put(tempKey + "-" + summaryType , "��Сֵ��" + nf.format(lastValue)) ;
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
	 * ������ҳ����
	 * @param data ��õ�ҳ������
	 * @param mdata �洢Ҫ����������
	 * @param sumType �ϼ��е����ͺ�С��λ
	 * @param rsSr ���ݿ��������
	 * @param companyCode ��˾��
	 * @param userId �û�ID
	 * @param dbType ���ݿ�����
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
					sum.put(key, "�ϼ�ֵ:" + nf.format(lastValue));
					
				} else if (val.equals("average")) {
					String value = this.sum(mdata, tempKey);
					String avg = Double.parseDouble(value)
							/ mdata.size() + "";
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "ƽ��ֵ:" + nf.format(lastValue));
					
				} else if (val.equals("count")) {
					sum.put(key, "��" + nf.format(mdata.size()) + "��");
					
				} else if (val.equals("max")) {
					String value = this.max(mdata, tempKey) ;
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "���ֵ:" + nf.format(lastValue));
					
				} else if (val.equals("min")) {
					String value = this.min(mdata, tempKey) ;
					double lastValue = doRoundingData(value, decimalPrecision);
					sum.put(key, "��Сֵ:" + nf.format(lastValue));
				}
			}
			mdata.add(sum);
		}
		return mdata ;
	}
	
	/**
	 * @param value Ҫ�����ֵ
	 * @param decimalPrecision С��λ��
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
			// GB2312ʹ��ȷ��ȡ�ָ���","
			csvFileOutputStream = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(csvFile), "GB2312"), 1024);
			// д���ļ�ͷ��
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
			// GB2312ʹ��ȷ��ȡ�ָ���","
			csvFileOutputStream = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(csvFile, true), "GB2312"), 1024);
			// д���ļ�����
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
	 * ��������
	 * 
	 * @param param
	 *            ����
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @return {@link Map} ������Ϣ
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
	 * �������ݲ���
	 * 
	 * @param params
	 *            ����MAP
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @return {@link Map} ������Ϣ
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
	 * ɾ�����ݲ���
	 * 
	 * @param params
	 *            ����MAP
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @return {@link Map} ������Ϣ
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
	 * �û�Ҫʵ�ֵķ��������������ݶ�ȡ�߼���
	 * 
	 * @param data
	 *            Store���ݷ�װ����
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @throws Exception
	 */
	public void read(StoreData data, SelRs rsSr, String companyCode,
			String userId, String dbType) throws Exception {
	};

	/**
	 * �û�Ҫʵ�ֵķ����������Ĵ������ݵ��߼�
	 * 
	 * @param data
	 *            Store���ݷ�װ����
	 * @param items
	 *            ��������
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @throws Exception
	 */
	public void create(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

	/**
	 * �û�Ҫʵ�ֵķ����� �����������ݵ��߼�
	 * 
	 * @param data
	 *            Store���ݷ�װ����
	 * @param items
	 *            ��������
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @throws Exception
	 */
	public void update(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

	/**
	 * �û�Ҫʵ�ֵķ���������ɾ�����ݵ��߼�
	 * 
	 * @param data
	 *            Store���ݷ�װ����
	 * @param items
	 *            ��������
	 * @param rsSr
	 *            ���ݿ��������
	 * @param companyCode
	 *            ��˾��
	 * @param userId
	 *            �û�ID
	 * @param dbType
	 *            ���ݿ�����
	 * @throws Exception
	 */
	public void destroy(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType) throws Exception {
	};

}
