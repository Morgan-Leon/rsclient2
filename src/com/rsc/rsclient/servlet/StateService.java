package com.rsc.rsclient.servlet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
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
public class StateService extends Service {

	private static Logger logger = Logger.getLogger(StateService.class);

	/**
	 * 注册业务方法。
	 * 
	 * @param methodMap
	 */
	public void registerMethods(MethodMap mm) throws Exception {
		mm.add("load").addListParameter("modules").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).setListReturnValue();
		mm.add("sync").addMapParameter("data").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).setBooleanReturnValue();
		mm.add("rename").addStringParameter("moduleCode").addStringParameter(
				"newName").addStringParameter("oldName").addObjectParameter(
				WebKeys.SelRsKey, SelRs.class).addStringParameter(
				WebKeys.CompanyCodeKey).addStringParameter(
				WebKeys.UserUniqueIdKey).setBooleanReturnValue();
		mm.add("clear").addStringParameter("moduleCode").addStringParameter(
				"schemeCode").addObjectParameter(WebKeys.SelRsKey, SelRs.class)
				.addStringParameter(WebKeys.CompanyCodeKey).addStringParameter(
						WebKeys.UserUniqueIdKey).setBooleanReturnValue();
		mm.add("setDefault").addStringParameter("moduleCode")
				.addStringParameter("schemeCode").addObjectParameter(
						WebKeys.SelRsKey, SelRs.class).addStringParameter(
						WebKeys.CompanyCodeKey).addStringParameter(
						WebKeys.UserUniqueIdKey).setBooleanReturnValue();
	}

	/**
	 * 加载用户偏好信息
	 * 
	 * @param modules 模块列表
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @return 
	 * @throws ServiceException
	 */
	public List load(List modules, SelRs rsSr, String companyCode, String userId)
			throws ServiceException {
		StringBuffer sql = new StringBuffer(
				"SELECT a.module_code, a.scheme_code, a.default_flag, a.state_data "
						+ " FROM sys_rsclient2_state a "
						+ " WHERE a.company_code = '" + companyCode + "' "
						+ " AND a.user_unique_id = '" + userId + "' "
						+ " AND ( 1 <> 1 ");
		for (Iterator i = modules.iterator(); i.hasNext();) {
			String module = (String) i.next();
			sql.append(" OR a.module_code = '" + module + "'");
		}
		sql.append(" ) ORDER BY a.module_code");
		logger.debug("load modules sql:" + sql);

		List list = new ArrayList();
		try {
			PreparedStatement pstmt = rsSr.pooledConn.prepareStatement(sql
					.toString());

			LobAgent agent = ConnectionGeneratorFactory
					.getConnectionGenerator().getLobAgent(pstmt,
							rsSr.pooledConn, sql.toString());

			agent.executeQuery();
			ResultSet rs = agent.getResultSet();
			while (rs != null && rs.next()) {
				String moduleCode = agent.getString(1);
				String schemeCode = agent.getString(2);
				String defaultFlag = agent.getString(3);
				String stateData = new String(agent.getClob(4));

				Map scheme = new HashMap();
				scheme.put("moduleCode", moduleCode);
				scheme.put("schemeCode", schemeCode);
				scheme.put("defaultFlag", ("Y".equals(defaultFlag)) ? Boolean
						.valueOf(true) : Boolean.valueOf(false));
				scheme.put("stateData", stateData);
				list.add(scheme);
			}
		} catch (SQLException e) {
			throw new ServiceException(e.getMessage());
		}
		return list;
	}

	/**
	 * 同步用户偏好信息
	 * 
	 * @param data 用户偏好信息
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @return
	 * @throws ServiceException
	 * @throws ParserException
	 */
	public boolean sync(Map data, SelRs rsSr, String companyCode, String userId)
			throws ServiceException, ParserException {
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
			for (Iterator i = data.keySet().iterator(); i.hasNext();) {
				String rawModuleCode = (String)i.next();
				String moduleCode = (String)SuperParser.marshal(rawModuleCode, String.class);
				Map schemes = (Map) data.get(rawModuleCode);
				for (Iterator j = schemes.keySet().iterator(); j.hasNext();) {
					String rawSchemeCode = (String)j.next();
					String schemeCode = (String)SuperParser.marshal(rawSchemeCode, String.class);
					
					Map scheme = (Map) schemes.get(rawSchemeCode);
					String defaultFlag = "true".equals((String) scheme
							.get("defaultFlag")) ? "Y" : "N";
					String stateData = (String) scheme.get("stateData");
					stateData = stateData == null ? "" : stateData.replaceAll(
							"\\\\\"", "'");
					delt.setString(1, companyCode);
					delt.setString(2, userId);
					delt.setString(3, moduleCode);
					delt.setString(4, schemeCode);
					delt.execute();
					if (stateData != null && !"".equals(stateData.trim())) {
						String selSql = "select state_data from sys_rsclient2_state "
								+ " where company_code = '"
								+ companyCode
								+ "' "
								+ " and user_unique_id = '"
								+ userId
								+ "' "
								+ " and module_code = '"
								+ moduleCode
								+ "'"
								+ " and scheme_code = '"
								+ schemeCode
								+ "'";
						LobAgent agent = ConnectionGeneratorFactory
								.getConnectionGenerator().getLobAgent(stmt,
										conn, selSql);
						agent.setString(1, companyCode);
						agent.setString(2, userId);
						agent.setString(3, moduleCode);
						agent.setString(4, schemeCode);
						agent.setString(5, defaultFlag);
						agent.setClob(6, stateData);
						agent.executeInsert();
					}
				}
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

	/**
	 * 重命名
	 * 
	 * @param moduleCode 模块编码
	 * @param newName 新名字
	 * @param oldName 老名字
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @return
	 * @throws Exception
	 */
	public boolean rename(String moduleCode, String newName, String oldName,
			SelRs rsSr, String companyCode, String userId) throws Exception {
		if (newName != null && !"".equals(newName) && !newName.equals(oldName)
				&& newName.length() <= 30) {
			String sql = "UPDATE sys_rsclient2_state SET scheme_code = '"
					+ newName + "' WHERE company_code = '" + companyCode
					+ "' AND user_unique_id = '" + userId + "' "
					+ " AND module_code = '" + moduleCode + "' "
					+ " AND scheme_code = '" + oldName + "'";
			logger.debug("rename sql:" + sql);
			rsSr.preTrans(sql);
			rsSr.doTrans();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 删除用户偏好信息
	 * 
	 * @param moduleCode 模块名称
	 * @param schemeCode 方案名称
	 * @param rsSr 数据库操作对象
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @return
	 * @throws Exception
	 */
	public boolean clear(String moduleCode, String schemeCode, SelRs rsSr,
			String companyCode, String userId) throws Exception {
		if (moduleCode != null && !"".equals(moduleCode)) {
			String sql = "DELETE FROM sys_rsclient2_state "
					+ " WHERE company_code = '" + companyCode + "' "
					+ " AND user_unique_id = '" + userId + "' "
					+ " AND module_code = '" + moduleCode + "' ";
			if (schemeCode != null && !"".equals(schemeCode)) {
				sql += " AND scheme_code = '" + schemeCode + "'";
			}
			logger.debug("clear sql:" + sql);
			rsSr.preTrans(sql);
			rsSr.doTrans();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 设置默认用户偏好信息
	 * 
	 * @param moduleCode 模块名称
	 * @param schemeCode 方案名称
	 * @param rsSr 用户偏好信息
	 * @param companyCode 公司号
	 * @param userId 用户ID
	 * @return
	 * @throws Exception
	 */
	public boolean setDefault(String moduleCode, String schemeCode, SelRs rsSr,
			String companyCode, String userId) throws Exception {
		if (moduleCode != null && !"".equals(moduleCode) && schemeCode != null
				&& !"".equals(schemeCode)) {
			String sql1 = "UPDATE sys_rsclient2_state "
					+ "SET default_flag = 'N' WHERE company_code = '"
					+ companyCode + "' AND user_unique_id = '" + userId
					+ "' AND module_code = '" + moduleCode + "'";

			String sql2 = "UPDATE sys_rsclient2_state "
					+ "SET default_flag = 'Y' WHERE company_code = '"
					+ companyCode + "' AND user_unique_id = '" + userId
					+ "'  AND module_code = '" + moduleCode + "'"
					+ " AND scheme_code = '" + schemeCode + "'";
			logger.debug("set undefault sql:" + sql1);
			logger.debug("set default sql:" + sql2);
			rsSr.preTrans(sql1);
			rsSr.preTrans(sql2);
			rsSr.doTrans();
			return true;
		} else {
			return false;
		}
	}
}
