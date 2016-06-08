package com.rsc.rsclient.servlet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.ConnectionGeneratorFactory;
import com.rsc.rs.pub.dbUtil.LobAgent;
import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;
import com.rsc.rsclient.exception.ParserException;
import com.rsc.rsclient.exception.ServiceException;
import com.rsc.rsclient.parse.SuperParser;

/**
 * 用户偏好信息维护。继承自 {@link Service}<br/>
 * 用户偏好信息是以JSON字符串的形式存于后台数据库sys_rsclient2_state表中。
 * 
 * @author changhu
 */
public class PageStateService extends Service {

	private static Logger logger = Logger.getLogger(PageStateService.class);

	/**
	 * 注册业务方法。
	 * 
	 * @param methodMap
	 */
	public void registerMethods(MethodMap mm) throws Exception {
		mm.add("load").addStringParameter("id").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).setListReturnValue();
		mm.add("sync").addStringParameter("id").addStringParameter("data")
				.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey).addStringParameter(
						WebKeys.UserUniqueIdKey).setBooleanReturnValue();
	}

	/**
	 * 加载用户偏好信息
	 * 
	 * @param modules
	 *            模块列表
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @return
	 * @throws ServiceException
	 */
	public Map load(String id, SelRs rsSr, String companyCode, String userId)
			throws ServiceException {

		StringBuffer sql = new StringBuffer(
				"SELECT a.module_code, a.scheme_code, a.default_flag, a.state_data "
						+ " FROM sys_rsclient2_state a "
						+ " WHERE a.company_code = '" + companyCode + "' "
						+ " AND a.user_unique_id = '" + userId + "' "
						+ " AND a.module_code = '" + id + "'");

		System.out.println(sql);
		Map scheme = new HashMap();
		try {
			PreparedStatement pstmt = rsSr.pooledConn.prepareStatement(sql
					.toString());
			LobAgent agent = ConnectionGeneratorFactory
					.getConnectionGenerator().getLobAgent(pstmt,
							rsSr.pooledConn, sql.toString());
			agent.executeQuery();
			ResultSet rs = agent.getResultSet();
			if (rs != null && rs.next()) {
				String moduleCode = agent.getString(1);
				String schemeCode = agent.getString(2);
				String stateData = new String(agent.getClob(4));

				scheme.put("moduleCode", moduleCode);
				scheme.put("schemeCode", schemeCode);
				scheme.put("defaultFlag", Boolean.valueOf(true));
				scheme.put("stateData", stateData);
			}
		} catch (SQLException e) {
			throw new ServiceException(e.getMessage());
		}
		return scheme;
	}

	/**
	 * 同步用户偏好信息
	 * 
	 * @param data
	 *            用户偏好信息
	 * @param rsSr
	 *            数据库操作对象
	 * @param companyCode
	 *            公司号
	 * @param userId
	 *            用户ID
	 * @return
	 * @throws ServiceException
	 * @throws ParserException
	 */
	public boolean sync(String id, String stateData, SelRs rsSr,
			String companyCode, String userId) throws ServiceException,
			ParserException {
		Connection conn = rsSr.pooledConn;
		try {
			conn.setAutoCommit(false);
			String del = "delete from sys_rsclient2_state "
					+ "where company_code = ? and user_unique_id = ? "
					+ "and module_code = ? and scheme_code = ? ";
			PreparedStatement delt = conn.prepareStatement(del);
			String sql = "INSERT INTO sys_rsclient2_state "
					+ "(company_code, user_unique_id, module_code, scheme_code, default_flag, state_data) "
					+ "VALUES (?, ?, ?, ?, ?, ?)";
			PreparedStatement stmt = conn.prepareStatement(sql);
			String defaultFlag = "Y";
			stateData = stateData == null ? "" : stateData.replaceAll("\\\\\"", "'");

			delt.setString(1, companyCode);
			delt.setString(2, userId);
			delt.setString(3, id);
			delt.setString(4, id);
			delt.execute();
			if (stateData != null && !"".equals(stateData.trim())) {
				String selSql = "select state_data from sys_rsclient2_state "
						+ " where company_code = '" + companyCode + "' "
						+ " and user_unique_id = '" + userId + "' "
						+ " and module_code = '" + id + "'"
						+ " and scheme_code = '" + id + "'";
				LobAgent agent = ConnectionGeneratorFactory
						.getConnectionGenerator().getLobAgent(stmt, conn,
								selSql);
				agent.setString(1, companyCode);
				agent.setString(2, userId);
				agent.setString(3, id);
				agent.setString(4, id);
				agent.setString(5, defaultFlag);
				agent.setClob(6, stateData);
				agent.executeInsert();
			}
			delt.close();
			stmt.close();
			conn.commit();
			return true;
		} catch (SQLException e) {
			logger.fatal(e.getMessage(), e);
			throw new ServiceException(e.getMessage());
		}
	}
}
