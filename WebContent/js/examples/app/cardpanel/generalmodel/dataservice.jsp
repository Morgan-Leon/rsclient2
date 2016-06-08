<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		public void registerMethods(MethodMap mm) throws Exception {
			super.registerMethods(mm);

			mm.add("createModelHead").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("saveModelHead").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearGeneralModel").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("save").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("getModelColumns").addMapParameter("params")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("createModelColumn").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("saveModelColumn").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("applyModelColumnUpdate").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("createGeneralModelByTable").addStringParameter("tableName")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();
		}

		public String createModelHead(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String)data.get("modelCode");
			String modelName = (String)data.get("modelName");
			String tableName = (String)data.get("tableName");
			String remark = (String)data.get("remark");

			String sql = "SELECT count(*) FROM generalmodel_head where model_code = '"
					+ modelCode + "'";

			System.out.println(sql);
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next() && rs.getInt(1) > 1) {
				return "'已存在该通用数据模型编码,请重新设置编码'";
			} else {
				sql = "insert into generalmodel_head(model_code, model_name, table_name, remark)"
						+ " values('"
						+ modelCode
						+ "', '"
						+ modelName
						+ "', '"
						+ tableName + "', '" + remark + "')";
				System.out.println(sql);
				boolean result = rsSr.runSql(sql);
				return result == true ? "true" : "false";
			}
		}

		public String clearGeneralModel(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String modelCode = (String)data.get("modelCode");
			String sql1 = "delete from generalmodel_head where model_code = '"
					+ modelCode + "'";
			String sql2 = "delete from generalmodel_cols where model_code = '"
					+ modelCode + "'";
			log(sql1);
			log(sql2);
			rsSr.beginTrans();
			try {
				rsSr.runSql(sql1);
				rsSr.runSql(sql2);
				rsSr.commit();
				return "true";
			} catch (Exception e) {
				try {
					rsSr.rollback();
				} catch (Exception ee) {
				}
				return "'" + e.getMessage() + "'";
			}
		}

		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {

			String sql = "select model_code, model_name, table_name, remark from generalmodel_head";

			String sortInfo = " model_code desc ";

			String sortField = data.getSortField();

			String sortDir = data.getSortDir();
			if (sortDir == null || "".equals(sortDir.trim())) {
				sortDir = "";
			}

			if ("modelCode".equals(sortField)) {
				sortInfo = " model_code " + sortDir;
			} else if ("modelName".equals(sortField)) {
				sortInfo = " model_name " + sortDir;
			} else if ("tableName".equals(sortField)) {
				sortInfo = " table_name " + sortDir;
			} else if ("remark".equals(sortField)) {
				sortInfo = " remark " + sortDir;
			}

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo, start, limit, dbType);

			log(sql);
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();

				map.put("modelCode", this.doNull(rs.getString(1)));
				map.put("modelName", this.doNull(rs.getString(2)));
				map.put("tableName", this.doNull(rs.getString(3)));
				map.put("remark", this.doNull(rs.getString(4)));

				items.add(map);
			}
			data.setData(items);

			//获取总数
			sql = "SELECT count(*) FROM generalmodel_head";
			ResultSet rs2 = rsSr.getRs(sql);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}

		public String saveModelHead(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String)data.get("modelCode");
			String modelName = (String)data.get("modelName");
			String tableName = (String)data.get("tableName");
			String remark = (String)data.get("remark");

			String sql = "update generalmodel_head set model_name = '"
					+ modelName + "', " + " table_name = '" + tableName
					+ "', remark = '" + remark + "' where model_code = '"
					+ modelCode + "'";
			System.out.println(sql);
			boolean result = rsSr.runSql(sql);
			return result == true ? "true" : "false";
		}

		public Map getModelColumns(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws SQLException {
			StoreData data = new StoreData(params);
			try {
				this.getModelColumns(data, rsSr, companyCode, userId, dbType);
				data.setSuccess();
			} catch (Exception e) {
				data.setFailure();
				data.setMessage(e.getMessage());
			} finally {
				return data.getDataMap();
			}
		}

		public void getModelColumns(StoreData data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String) data.get("modelCode");
			List items = getColumnsByModelCode(modelCode, rsSr, companyCode,
					userId, dbType);
			data.setData(items);
		}

		private List getColumnsByModelCode(String modelCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String sql = "select model_code, column_name, column_comment, data_type, default_value, remark, status, primary"
					+ " from generalmodel_cols where model_code = '"
					+ modelCode + "' order by column_name";
			log(sql);
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();

				map.put("modelCode", this.doNull(rs.getString(1)));
				map.put("columnName", this.doNull(rs.getString(2)));
				map.put("columnComment", this.doNull(rs.getString(3)));
				map.put("dataType", this.doNull(rs.getString(4)));
				map.put("defaultValue", this.doNull(rs.getString(5)));
				map.put("remark", this.doNull(rs.getString(6)));
				map.put("status", this.doNull(rs.getString(7)));
				String primary = rs.getString(8);
				primary = (primary == null || "".equals(primary)) ? "false"
						: primary;
				map.put("primary", primary);

				items.add(map);
			}
			return items;
		}

		public String createModelColumn(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String)data.get("modelCode");
			String columnName = (String)data.get("columnName");

			String columnComment = doNull((String)data.get("columnComment"));
			String dataType = doNull((String)data.get("dataType"));
			String defaultValue = doNull((String)data.get("defaultValue"));
			String remark = doNull((String)data.get("remark"));
			String status = "ADD";
			String primary = doNull((String)data.get("primary"));

			String sql1 = "select count(*) from generalmodel_cols where model_code = '"
					+ modelCode + "' and column_name = '" + columnName + "'";
			log(sql1);
			ResultSet rs = rsSr.getRs(sql1);
			if (rs != null && rs.next() && rs.getInt(1) > 1) {
				return "'已经存在数据列" + columnName + ",请重新输入列名称'";
			} else {
				String sql2 = "insert into generalmodel_cols(model_code, column_name, column_comment, data_type, default_value, remark, status, primary)"
						+ " values('"
						+ modelCode
						+ "', '"
						+ columnName
						+ "', '"
						+ columnComment
						+ "', '"
						+ dataType
						+ "', '"
						+ defaultValue
						+ "', '"
						+ remark
						+ "', '"
						+ status
						+ "', '" + primary + "')";
				log(sql2);
				boolean result = rsSr.runSql(sql2);
				return result == true ? "true" : "false";
			}
		}

		public String saveModelColumn(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String)data.get("modelCode");
			String columnName = (String)data.get("columnName");

			String columnComment = doNull((String)data.get("columnComment"));
			String dataType = doNull((String)data.get("dataType"));
			String defaultValue = doNull((String)data.get("defaultValue"));
			String remark = doNull((String)data.get("remark"));
			String status = doNull((String)data.get("status"));
			String primary = doNull((String)data.get("primary"));

			String sql = "update generalmodel_cols set "
					+ " column_comment = '" + columnComment
					+ "', data_type = '" + dataType + "', default_value = '"
					+ defaultValue + "' , remark = '" + remark
					+ "', status = '" + status + "', primary = '" + primary
					+ "' where model_code = '" + modelCode
					+ "' and column_name = '" + columnName + "'";
			log(sql);
			boolean result = rsSr.runSql(sql);
			return result == true ? "true" : "false";
		}

		public String applyModelColumnUpdate(Map data,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws SQLException {

			String modelCode = (String)data.get("modelCode");

			List dosqls = new ArrayList();
			List rbsqls = new ArrayList();

			String tableName = null;
			List items = getColumnsByModelCode(modelCode, rsSr, companyCode,
					userId, dbType);
			String sql1 = "select model_code, model_name, table_name, remark from generalmodel_head "
					+ " where model_code = '" + modelCode + "'";
			log(sql1);
			ResultSet rs = rsSr.getRs(sql1);
			if (rs != null && rs.next()) {
				tableName = rs.getString("table_name");
			}
			if (tableName != null && !"".equals(tableName)) {
				String sql2 = "select count(*) from user_tables where table_name = '"
						+ tableName.toUpperCase() + "'";
				ResultSet rs2 = rsSr.getRs(sql2);
				if (rs2 != null && rs2.next() && rs2.getInt(1) == 0) {
					//创建新表
					if (items.size() > 0) {
						StringBuffer buf = new StringBuffer("create table "
								+ tableName + " ( ");
						for (Iterator iter = items.iterator(); iter.hasNext();) {
							Map field = (Map) iter
									.next();

							String columnName = (String)field.get("columnName");
							String dataType = (String)field.get("dataType");
							String defaultValue = (String)field.get("defaultValue");

							buf.append(columnName + " " + dataType);
							if (defaultValue != null
									&& !"".equals(defaultValue)) {
								buf.append(" default " + defaultValue + ",");
							} else {
								buf.append(",");
							}
						}
						String sql = buf.toString();
						if (sql.endsWith(",")) {
							sql = sql.substring(0, sql.length() - 1);
						}
						sql += ")";
						log("创建表:" + sql);
						dosqls.add(sql);
						rbsqls.add("drop table " + tableName);

						//添加备注信息
						for (Iterator iter = items.iterator(); iter.hasNext();) {
							Map field = (Map) iter
									.next();
							String columnName = (String)field.get("columnName");
							String columnComment = doNull((String)field
									.get("columnComment"));
							dosqls.add("comment on column " + tableName + "."
									+ columnName + " is '" + columnComment
									+ "'");
						}
					}
				} else {
					//更新表字段
					for (Iterator iter = items.iterator(); iter.hasNext();) {
						Map field = (Map) iter
								.next();

						String status = (String)field.get("status");
						String columnName = (String)field.get("columnName");
						String columnComment = doNull((String)field
								.get("columnComment"));
						String dataType = (String)field.get("dataType");
						String defaultValue = doNull((String)field.get("defaultValue"));

						if ("ADD".equals(status)) {
							dosqls.add("alter table " + tableName + " add "
									+ columnName + " " + dataType
									+ " default '" + defaultValue + "'");
							dosqls.add("comment on column " + tableName + "."
									+ columnName + " is '" + columnComment
									+ "'");

							rbsqls.add("alter table " + tableName
									+ " drop column " + columnName);
						} else if ("EDIT".equals(status)) {
							dosqls.add("alter table " + tableName
									+ " drop column " + columnName);
							dosqls.add("alter table " + tableName + " add "
									+ columnName + " " + dataType
									+ " default '" + defaultValue + "'");
							dosqls.add("comment on column " + tableName + "."
									+ columnName + " is '" + columnComment
									+ "'");

							log("修改字段信息暂无法回滚");
						} else if ("REMOVE".equals(status)) {
							dosqls.add("alter table " + tableName
									+ " drop column " + columnName);
							rbsqls.add("alter table " + tableName + " add "
									+ columnName + " " + dataType);
						}
					}
				}

				rsSr.beginTrans();
				try {
					for (Iterator iter = dosqls.iterator(); iter.hasNext();) {
						String sql = (String) iter.next();
						log(sql);
						rsSr.runSql(sql);
					}
					String dsql = "delete from generalmodel_cols where status = 'REMOVE' and model_code = '"
							+ modelCode + "'";
					log("删除已删字段记录" + dsql);
					rsSr.runSql(dsql);

					String usql = "update generalmodel_cols set status = 'APPLY' where model_code = '"
							+ modelCode
							+ "' and (status = 'ADD' or status = 'EDIT')";
					log("更新字段表中状态:" + usql);
					rsSr.runSql(usql);

					rsSr.commit();
				} catch (Exception e) {
					for (Iterator iter = rbsqls.iterator(); iter.hasNext();) {
						String sql = (String) iter.next();
						rsSr.runSql(sql);
					}
					try {
						rsSr.rollback();
					} catch (Exception ee) {
					}
					return "'" + e.getMessage() + "'";
				}
				return "true";
			} else {
				return "'未定义该通用数据模型对应的数据表'";
			}
		}

		public String createGeneralModelByTable(String tableName, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String sql1 = "select count(*) from user_tables where table_name = '"
					+ tableName.toUpperCase() + "'";
			ResultSet rs1 = rsSr.getRs(sql1);
			if (rs1 != null && rs1.next() && rs1.getInt(1) == 0) {
				return "'数据表" + tableName + "不存在,请确认数据表名称'";
			}

			String modelCode = tableName;
			String modelName = tableName;

			List dosqls = new ArrayList();

			dosqls.add("insert into generalmodel_head(model_code, model_name, table_name, remark) values('"
					+ modelCode
					+ "', '"
					+ modelName
					+ "', '"
					+ tableName
					+ "', '根据数据表创建')");

			String sql2 = "select a.column_id, a.column_name, a.data_type, a.data_length, b.comments "
					+ " from user_tab_columns a, user_col_comments b "
					+ " where a.table_name = b.table_name "
					+ "  and a.column_name = b.column_name "
					+ " and a.table_name = '"
					+ tableName.toUpperCase()
					+ "'"
					+ " order by a.column_id";
			log(sql2);
			ResultSet rs = rsSr.getRs(sql2);
			while (rs != null && rs.next()) {
				String columnName = rs.getString("column_name");
				String dataType = rs.getString("data_type");
				String dataLength = rs.getString("data_length");
				String comment = doNull(rs.getString("comments"));

				columnName = columnName.toLowerCase();

				if ("NVARCHAR2".equals(dataType)) {
					dataType = dataType.toLowerCase() + "(" + dataLength + ")";
				} else {
					dataType = dataType.toLowerCase();
				}

				String temp = "insert into generalmodel_cols(model_code, column_name, column_comment, data_type, default_value, remark, status, primary)"
						+ " values('"
						+ modelCode
						+ "', '"
						+ columnName
						+ "', '"
						+ comment
						+ "', '"
						+ dataType
						+ "', '', '', 'APPLY', 'false')";

				dosqls.add(temp);
			}

			rsSr.beginTrans();
			try {
				for (Iterator iter = dosqls.iterator(); iter.hasNext();) {
					String sql = (String) iter.next();
					log(sql);
					rsSr.runSql(sql);
				}
				rsSr.commit();
				return "true";
			} catch (Exception e) {
				try {
					rsSr.rollback();
				} catch (Exception ee) {
				}
				return "'" + e.getMessage() + "'";
			}
		}

		public String doNull(String str) {
			return str == null ? "" : str.trim();
		}
	}%>