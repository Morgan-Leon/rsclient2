  package com.rsc.rsclient.servlet;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;

public class KindTemplateService extends Service {

	private static Logger logger = Logger.getLogger(KindTemplateService.class);

	public void registerMethods(MethodMap mm) throws Exception {
		//����ģ��
		mm.add("addTemplate")
				.addStringParameter("id")
				.addStringParameter("title")
				.addMapParameter("htmlcontent")
				.addStringParameter("username")
				.addStringParameter("remark")
				.addStringParameter("state")
				.addStringParameter("templateSavePath")
				.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey)
				.addStringParameter(WebKeys.UserUniqueIdKey)
				.addStringParameter(WebKeys.UsercodeKey)
				.addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
		
		mm.add("readTemplate")
				.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey)
				.addStringParameter(WebKeys.UserUniqueIdKey)
				.addStringParameter(WebKeys.DbType)
				.setMapReturnValue();
	}
	
	
	/** 
	 * @method readTemplate ��ȡģ��
	 * @param {SelRs} rsSr ��װ������ݿ�������x
	 * @param {String} companyCode ��˾����
	 * @param {String} userId ��¼�û�ID
	 * @param {String} dbType ���ݿ�����
	 * @return {Map}  ������Ϣ
	 */
	public Map readTemplate(SelRs rsSr, String companyCode, String userId,
			String dbType) throws Exception {
		Map map = new HashMap();
		String querySQL = "SELECT id, title FROM PORTAL_HTML_TEMPLATE" +
				" WHERE company_code = '" + companyCode + "' AND state='E'" ;
		Map fileList = new HashMap();
		ResultSet rs = rsSr.getRs(querySQL) ;
		while(rs != null && rs.next()){
			String title = rs.getString(2) ;
			int len = title.length() ;
			title = len > 10 ? (title.substring(0, 10) + "...") : title ;
			fileList.put(rs.getInt(1) + ".html" , title);
		}
		map.put("fileList", fileList);
		if(fileList.size() == 0){
			fileList.put("default.html" , "Ĭ��ģ��");
		}
		return map ;
	}

	/** 
	 * @method addTemplate ����ģ��
	 * @param {String} title  ģ������
	 * @param {String} content  ģ������
	 * @param {String} username  �����˵�����
	 * @param {String} remark ��ע
	 * @param {String} state ģ��״̬
	 * @param {String} templatePath ģ�汣��ĵ�ַ
	 * @param {SelRs} rsSr ��װ������ݿ��������
	 * @param {String} companyCode ��˾����
	 * @param {String} userId ��¼�û�ID
	 * @param {String} dbType ���ݿ�����
	 * @return {Map}  ������Ϣ
	 */
	public Map addTemplate(String id ,String title , Map content, String username, String remark , String state ,String templateSavePath,
			SelRs rsSr, String companyCode, String userId, String usercode, String dbType)
			throws Exception {
		Connection conn = rsSr.pooledConn ;
		PreparedStatement pstmt = null ;
		boolean flag = false ;
		Map map = new HashMap();
		String con = content.get("editorcontent").toString() ;
		ResultSet rs = null ;
		if(id == null || "".equals(id)){ //��ʱ������
			try {
				String maxIdSQL = "SELECT nvl(MAX(ID) , 0) FROM PORTAL_HTML_TEMPLATE WHERE "
								+ " company_code=?";
				int maxId = 0 ;
				pstmt = conn.prepareStatement(maxIdSQL) ;
				pstmt.setString(1, companyCode) ;
				rs = pstmt.executeQuery() ;
				if(rs != null && rs.next()){
					maxId = rs.getInt(1) + 1;
				}
				String sql = "INSERT INTO PORTAL_HTML_TEMPLATE("
					 + "COMPANY_CODE,ID,TITLE,CONTENT,STATE,CREATOR_ID,CREATOR_CODE,CREATOR_NAME,REMARK,CREATE_TIME)"
				     + " VALUES(?,?,?,?,?,?,?,?,?,?)" ;
				pstmt = conn.prepareStatement(sql) ;
				pstmt.setString(1, companyCode) ;
				pstmt.setInt(2, maxId) ;
				pstmt.setString(3, title) ;
				pstmt.setString(4, con);
				pstmt.setString(5, state) ;
				pstmt.setString(6, userId) ;
				pstmt.setString(7, usercode) ;
				pstmt.setString(8, username) ;
				pstmt.setString(9, remark) ;
				pstmt.setString(10, getYearMonth("yyyy/MM/dd")) ;
				int sum = pstmt.executeUpdate() ;
				flag = sum > 0 ;
				templateSavePath += File.separator + maxId + ".html" ;
				if (flag) {
					flag = templateToDisk(con,templateSavePath);
				}
			} catch (RuntimeException e) {
				System.out.println("�׳��쳣��" + e);
				e.printStackTrace();
			} finally {
				try {
					conn.close() ;
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		} else {
			try {
				String sql = "UPDATE portal_html_template "
					  + " SET title = ? , "
					  + " content = ?, " 
					  + " remark = ? , "
					  + " state = ? , "
					  + " create_time=? "
					  + " WHERE company_code =?"
					  + " AND id = ?" ;
				pstmt = conn.prepareStatement(sql) ;
				pstmt.setString(1, title) ;
				pstmt.setString(2, con) ;
				pstmt.setString(3, remark) ;
				pstmt.setString(4, state) ;
				pstmt.setString(5, getYearMonth("yyyy/MM/dd")) ;
				pstmt.setString(6, companyCode) ;
				pstmt.setInt(7, Integer.parseInt(id.trim())) ;
				int sum = pstmt.executeUpdate() ;
				flag = sum > 0 ;
				templateSavePath += File.separator + id + ".html" ;
				if (flag) {
					flag = templateToDisk(con,templateSavePath);
				}
			} catch(Exception e){
				e.printStackTrace();
			} finally {
				try {
					conn.close() ;
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		if (flag) {
			map.put("success", "true");
			map.put("msg", "����ģ��ɹ�");
		} else {
			map.put("success", "false");
			map.put("msg", "����ģ��ʧ��");
		}
		return map;
	}
	
	/** 
	 * @method templateToDisk ��ģ�����ݱ����ڷ�����·����
	 * @param {String} content  ģ������
	 * @return {boolean}  ������Ϣ
	 */
	private boolean templateToDisk(String content,String templatePath) {
		String file = templatePath ;
		String encoding = "GBK" ;
		FileOutputStream fos;
		PrintWriter out = null ;
		try {
			fos = new FileOutputStream(file);
			OutputStreamWriter osw = new OutputStreamWriter(fos , encoding);
			out = new PrintWriter(osw);
			out.println(content);
			out.flush();
			return true ;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} finally {
			out.close() ;
		}
		return false ;
	}
	
	/**
	 *  ��ȡ��ǰϵͳʱ��
	 * @return
	 */
	private String getYearMonth(String format){
		Date now = new Date(); 
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(now) ;
	}
}