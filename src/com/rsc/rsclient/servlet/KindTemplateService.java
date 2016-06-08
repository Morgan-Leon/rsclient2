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
		//增加模版
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
	 * @method readTemplate 获取模板
	 * @param {SelRs} rsSr 封装后的数据库操作对豿
	 * @param {String} companyCode 公司编码
	 * @param {String} userId 登录用户ID
	 * @param {String} dbType 数据库类垿
	 * @return {Map}  返回信息
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
			fileList.put("default.html" , "默认模板");
		}
		return map ;
	}

	/** 
	 * @method addTemplate 增加模板
	 * @param {String} title  模版名称
	 * @param {String} content  模版内容
	 * @param {String} username  创建人的姓名
	 * @param {String} remark 备注
	 * @param {String} state 模版状态
	 * @param {String} templatePath 模版保存的地址
	 * @param {SelRs} rsSr 封装后的数据库操作对象
	 * @param {String} companyCode 公司编码
	 * @param {String} userId 登录用户ID
	 * @param {String} dbType 数据库类垿
	 * @return {Map}  返回信息
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
		if(id == null || "".equals(id)){ //此时是新增
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
				System.out.println("抛出异常：" + e);
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
			map.put("msg", "新增模版成功");
		} else {
			map.put("success", "false");
			map.put("msg", "新增模版失败");
		}
		return map;
	}
	
	/** 
	 * @method templateToDisk 将模版内容保存在服务器路径下
	 * @param {String} content  模版内容
	 * @return {boolean}  返回信息
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
	 *  获取当前系统时间
	 * @return
	 */
	private String getYearMonth(String format){
		Date now = new Date(); 
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(now) ;
	}
}