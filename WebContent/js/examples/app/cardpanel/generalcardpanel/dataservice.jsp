<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>
<%@ page import="java.util.regex.Pattern"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		public void registerMethods(MethodMap mm) throws Exception {
			super.registerMethods(mm);

			mm.add("getGeneralForm").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("getGeneralModel").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("doActionNo").addStringParameter("formCode")
					.addStringParameter("actionNo")
					.addMapParameter("modelData").addMapParameter("formParams")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("doSaveAction").addStringParameter("formCode")
					.addMapParameter("modelData").addMapParameter("formParams")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("doClearAction").addStringParameter("formCode")
					.addMapParameter("modelData").addMapParameter("formParams")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("doLoadAction").addStringParameter("formCode")
					.addMapParameter("modelData").addMapParameter("formParams")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("doExecAction").addStringParameter("formCode")
					.addStringParameter("actionNo")
					.addMapParameter("modelData").addMapParameter("formParams")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();
		}

		//读取
		public Map getFormHead(String formCode, SelRs rsSr, String companyCode,
				String userId, String dbType) throws SQLException {
			String sql = "select form_code, form_name, sub_sys, model_code, "
					+ "business_condition from generalform_head where form_code = '"
					+ formCode + "'";
			log(sql);
			Map head = new HashMap();
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				head.put("formCode", this.doNull(rs.getString(1)));
				head.put("formName", this.doNull(rs.getString(2)));
				head.put("subSys", this.doNull(rs.getString(3)));
				head.put("modelCode", this.doNull(rs.getString(4)));
				head.put("businessCondition", this.doNull(rs.getString(5)));

				return head;
			}
			return null;
		}

		private Map getFormRegion(String formCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			Map formRegion = new HashMap();
			formRegion.put("formCode", formCode);
			String sql = "select form_code, form_region, data_index, field_label, value, color, font_size, region_config "
					+ "from generalform_region where form_code = '"
					+ formCode
					+ "'";
			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				String region = rs.getString("form_region");
				String dataIndex = rs.getString("data_index");
				String fieldLabel = rs.getString("field_label");
				String value = rs.getString("value");
				String color = rs.getString("color");
				String fontSize = rs.getString("font_size");
				String regionConfig = rs.getString("region_config");

				Map temp = new HashMap();
				temp.put("formRegion", region);
				temp.put("dataIndex", doNull(dataIndex));
				temp.put("fieldLabel", doNull(fieldLabel));
				temp.put("value", doNull(value));
				temp.put("color", doNull(color));
				temp.put("fontSize", doNull(fontSize));
				temp.put("regionConfig", doNull(regionConfig));

				formRegion.put(region, temp);
			}
			return formRegion;
		}

		public List getFormFieldLine(String formCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String sql2 = "select form_code, form_name, sub_sys, model_code, "
					+ "business_condition from generalform_head where form_code = '"
					+ formCode + "'";
			log(sql2);

			String formName = null;
			String subSys = null;
			String modelCode = null;
			String businessCondition = null;

			ResultSet rs2 = rsSr.getRs(sql2);
			if (rs2 != null && rs2.next()) {

				formName = rs2.getString("form_name");
				subSys = rs2.getString("sub_sys");
				modelCode = rs2.getString("model_code");
				businessCondition = rs2.getString("business_condition");
			}

			List fieldLines = new ArrayList();
			String sql = "select form_code, line_no, field_no, xtype, data_index,"
					+ " field_label, value, width, column_width, read_only, field_config, read_only_expression"
					+ " from generalform_fieldline where form_code = '"
					+ formCode + "' order by line_no, field_no";
			System.out.println(sql);

			String currentLineNo = null;
			Map currentLine = null;
			List currentFields = null;

			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {

				String lineNo = rs.getString("line_no");
				String fieldNo = rs.getString("field_no");
				String xtype = rs.getString("xtype");
				String dataIndex = rs.getString("data_index");
				String fieldLabel = rs.getString("field_label");
				String value = rs.getString("value");
				String width = rs.getString("width");
				String columnWidth = rs.getString("column_width");
				String readOnly = rs.getString("read_only");
				String fieldConfig = rs.getString("field_config");
				String readOnlyExpression = rs
						.getString("read_only_expression");

				Map temp = new HashMap();
				if (formName != null) {
					temp.put("formName", formName);
				}
				if (subSys != null) {
					temp.put("subSys", subSys);
				}
				if (modelCode != null) {
					temp.put("modelCode", modelCode);
				}
				if (businessCondition != null) {
					temp.put("businessCondition", businessCondition);
				}

				temp.put("formCode", formCode);
				temp.put("lineNo", lineNo);
				temp.put("fieldNo", fieldNo);

				temp.put("xtype", doNull(xtype));
				if (dataIndex != null && !"".equals(dataIndex)) {
					temp.put("dataIndex", dataIndex);
				}
				if (fieldLabel != null && !"".equals(fieldLabel)) {
					temp.put("fieldLabel", fieldLabel);
				}
				if (value != null && !"".equals(value)) {
					temp.put("value", value);
				}
				if (width != null && !"".equals(width)) {
					temp.put("width", new Double(Double.parseDouble(width)));
				}
				if (columnWidth != null && !"".equals(columnWidth)) {
					temp.put("columnWidth", new Double(Double.parseDouble(columnWidth)));
				}
				if (readOnly != null && !"".equals(readOnly)) {
					temp.put("readOnly", readOnly);
				}
				if (fieldConfig != null && !"".equals(fieldConfig)) {
					temp.put("fieldConfig", fieldConfig);
				}
				if (readOnlyExpression != null
						&& !"".equals(readOnlyExpression)) {
					temp.put("readOnlyExpression", readOnlyExpression);
				}

				if (lineNo.equals(currentLineNo)) {
					currentFields.add(temp);
				} else {
					currentLineNo = lineNo;
					currentLine = new HashMap();
					currentLine.put("formCode", formCode);
					currentLine.put("lineNo", lineNo);
					currentFields = new ArrayList();
					currentFields.add(temp);
					currentLine.put("fields", currentFields);
					fieldLines.add(currentLine);
				}
			}

			return fieldLines;
		}

		public List getFormActions(String formCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			List actions = new ArrayList();
			String sql = "select form_code, action_no, action_name, action_type, icon_cls, tooltip, exec_dml, call_sp, callback, disabled_expression"
					+ " from generalform_actions where form_code = '"
					+ formCode + "' order by action_no";
			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				String actionNo = rs.getString("action_no");
				String actionName = rs.getString("action_name");
				String actionType = rs.getString("action_type");
				String iconCls = rs.getString("icon_cls");
				String tooltip = rs.getString("tooltip");
				String execDML = rs.getString("exec_dml");
				String callSP = rs.getString("call_sp");
				String callback = rs.getString("callback");
				String disabledExpression = doNull(rs.getString("disabled_expression"));

				Map temp = new HashMap();
				temp.put("formCode", formCode);
				temp.put("actionNo", actionNo);
				temp.put("actionName", actionName);
				temp.put("actionType", actionType);
				temp.put("iconCls", iconCls);
				temp.put("tooltip", tooltip);
				temp.put("execDML", execDML);
				temp.put("callSP", callSP);
				temp.put("callback", callback);
				temp.put("disabledExpression", disabledExpression);

				actions.add(temp);
			}
			return actions;
		}

		public Map getGeneralForm(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");

			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form != null) {
				//位置
				Map formRegion = getFormRegion(formCode, rsSr, companyCode,
						userId, dbType);
				//字段行
				List fieldLines = getFormFieldLine(formCode, rsSr, companyCode,
						userId, dbType);
				//操作
				List actions = getFormActions(formCode, rsSr, companyCode,
						userId, dbType);
				form.put("formRegions", formRegion);
				form.put("fieldLines", fieldLines);
				form.put("formActions", actions);
				return form;
			}
			return null;
		}

		public Map getModelHead(String modelCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String sql = "select model_code, model_name, table_name, remark "
					+ "from generalmodel_head where model_code = '" + modelCode
					+ "'";
			log(sql);
			Map head = new HashMap();
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				head.put("modelCode", this.doNull(rs.getString(1)));
				head.put("modelName", this.doNull(rs.getString(2)));
				head.put("tableName", this.doNull(rs.getString(3)));
				head.put("remark", this.doNull(rs.getString(4)));

				return head;
			}
			return null;
		}

		public List getModelCols(String modelCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String sql = "select column_name, default_value, primary "
					+ "from generalmodel_cols where model_code = '" + modelCode
					+ "'";
			List cols = new ArrayList();
			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				String columnName = rs.getString("column_name");
				String defaultValue = rs.getString("default_value");
				String primary = rs.getString("primary");

				Map temp = new HashMap();
				temp.put("columnName", columnName);
				temp.put("defaultValue", defaultValue);
				if (primary == null || "".equals(primary)) {
					primary = "false";
				}
				temp.put("primary", primary);

				cols.add(temp);
			}
			return cols;
		}

		/**
		 * 将SQL中的占位符用变量替换
		 */
		public String replaceSQL(Map params, String sql) {
			sql = doNull(sql);
			VariablePool pool = this.getCurrentVariablePool();
			String reg = "(\\s*=\\s*)|(\\s*,\\s*)|(\\s*;\\s*)|(\\s+)|(\\()|(\\))";
			Pattern pattern = Pattern.compile(reg);
			String[] paramArray = pattern.split(sql);
			for(int i = 0; i < paramArray.length; i++){
				String param = paramArray[i];
				if (param.startsWith("@")) {
					param = param.replaceAll("@", "");
					String value = (String) params.get(param);
					if (value == null) {
						VariableAbstract variable = pool.getVariable(param);
						if (variable != null) {
							value = variable.getStringValue();
						}
					}
					if (value != null) {
						sql = sql.replaceAll("@" + param, "'" + value + "'");
					}
				}
			}
			return sql;
		}

		public Map getGeneralModel(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			Map result = new HashMap();

			String formCode = (String) data.get("formCode");
			String modelCode = (String) data.get("modelCode");
			Map formParams = (Map) data.get("formParams");

			//游标
			Integer cursor = new Integer(0);
			try {
				String temp = (String) data.get("cursor");
				cursor = new Integer(temp);
			} catch (NumberFormatException e) {
				cursor = new Integer(0);
			}

			log("cursor : " + cursor);

			Map model = getModelHead(modelCode, rsSr, companyCode, userId,
					dbType);
			List cols = getModelCols(modelCode, rsSr, companyCode, userId,
					dbType);
			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form != null && model != null && cols != null
					&& cols.size() > 0) {
				String tableName = (String) model.get("tableName");

				StringBuffer buf = new StringBuffer("select ");
				for (Iterator iter = cols.iterator(); iter.hasNext();) {
					Map col = (Map) iter.next();
					String columnName = (String) col.get("columnName");

					buf.append(" " + columnName + ",");
				}
				String dsql = buf.toString();
				if (dsql.endsWith(",")) {
					dsql = dsql.substring(0, dsql.length() - 1);
				}
				String condition = replaceSQL(formParams,
						(String) form.get("businessCondition"));

				dsql = dsql + " from " + tableName;

				String tsql = "select count(*) from " + tableName;
				if (condition != null && !"".equals(condition)) {
					dsql = dsql + " where " + condition;
					tsql = tsql + " where " + condition;
				}
				log("查询总数SQL:" + tsql);

				//查询总数
				ResultSet trs = rsSr.getRs(tsql);
				if (trs != null && trs.next()) {
					int total = trs.getInt(1);
					result.put("total", new Integer(trs.getInt(1)));
					//如果游标等于总数则取游标等于总数-1,即最后一条数据
					if (total == cursor.intValue()) {
						cursor = new Integer((cursor.intValue()) - 1);
						result.put("cursor", cursor);
					}
					;
				}
				dsql = SQLUtil.pagingSql(dsql, null, cursor, new Integer(1), dbType);
				log("查询数据SQL:" + dsql);

				//查询数据
				Map modelData = new HashMap();
				ResultSet drs = rsSr.getRs(dsql);
				if (drs != null && drs.next()) {
					//取数据
					for (Iterator iter = cols.iterator(); iter.hasNext();) {
						Map col = (Map) iter.next();
						String columnName = (String) col.get("columnName");
						String value = doNull(drs.getString(columnName));
						modelData.put(columnName, value);
					}
				}
				result.put("modelData", modelData);
			}
			return result;
		}

		private Map getFormAction(String formCode, String actionNo, SelRs rsSr)
				throws SQLException {
			String sql = "select form_code, action_no, action_name, action_type, icon_cls, tooltip, exec_dml, call_sp, callback from generalform_actions where form_code = '"
					+ formCode + "' and action_no = '" + actionNo + "'";
			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				String actionName = rs.getString("action_name");
				String actionType = rs.getString("action_type");
				String iconCls = rs.getString("icon_cls");
				String tooltip = rs.getString("tooltip");
				String execDML = rs.getString("exec_dml");
				String callSP = rs.getString("call_sp");
				String callback = rs.getString("callback");

				Map temp = new HashMap();
				temp.put("formCode", formCode);
				temp.put("actionNo", actionNo);
				temp.put("actionName", actionName);
				temp.put("actionType", actionType);
				temp.put("iconCls", iconCls);
				temp.put("tooltip", tooltip);
				temp.put("execDML", execDML);
				temp.put("callSP", callSP);
				temp.put("callback", callback);
				return temp;
			}
			return null;
		}

		//执行按钮操作
		public Map doSaveAction(String formCode, Map modelData, Map formParams,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws SQLException {
			Map result = new HashMap();
			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到表单" + formCode);
				return result;
			}
			String modelCode = (String) form.get("modelCode");
			Map model = getModelHead(modelCode, rsSr, companyCode, userId,
					dbType);
			if (model == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到数据模型" + modelCode);
				return result;
			}
			String msg = null;
			try {
				msg = saveModeData(form, model, modelData, rsSr, companyCode,
						userId, dbType);
			} catch (Exception e) {
				msg = e.getMessage();
			}
			result.put("SUCC", Boolean.TRUE);
			result.put("MSG", msg);
			return result;
		}

		//执行按钮操作
		public Map doClearAction(String formCode, Map modelData,
				Map formParams, SelRs rsSr, String companyCode, String userId,
				String dbType) throws SQLException {
			Map result = new HashMap();
			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到表单" + formCode);
				return result;
			}
			String modelCode = (String) form.get("modelCode");
			Map model = getModelHead(modelCode, rsSr, companyCode, userId,
					dbType);
			if (model == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到数据模型" + modelCode);
				return result;
			}
			String msg = null;
			try {
				msg = clearModeData(form, model, modelData, rsSr, companyCode,
						userId, dbType);
			} catch (Exception e) {
				msg = e.getMessage();
			}
			result.put("SUCC", Boolean.TRUE);
			result.put("MSG", msg);
			return result;
		}

		//执行按钮操作
		public Map doLoadAction(String formCode, Map modelData, Map formParams,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws SQLException {
			Map result = new HashMap();
			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到表单" + formCode);
				return result;
			}
			String modelCode = (String) form.get("modelCode");
			Map model = getModelHead(modelCode, rsSr, companyCode, userId,
					dbType);
			if (model == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到数据模型" + modelCode);
				return result;
			}
			try {
				Map data = loadModeData(form, model, modelData, rsSr,
						companyCode, userId, dbType);
				result.put("SUCC", Boolean.TRUE);
				result.put("DATA", data);
				return result;
			} catch (Exception e) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", e.getMessage());
				return result;
			}
		}

		//执行按钮操作
		public Map doExecAction(String formCode, String actionNo,
				Map modelData, Map formParams, SelRs rsSr, String companyCode,
				String userId, String dbType) throws SQLException {
			Map result = new HashMap();
			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);
			if (form == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到表单" + formCode);
				return result;
			}
			String modelCode = (String) form.get("modelCode");
			Map model = getModelHead(modelCode, rsSr, companyCode, userId,
					dbType);
			if (model == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到数据模型" + modelCode);
				return result;
			}
			Map action = getFormAction(formCode, actionNo, rsSr);
			if (action == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到操作" + actionNo);
				return result;
			}
			String msg = null;
			try {
				msg = exec(form, model, action, modelData, formParams, rsSr,
						companyCode, userId, dbType);
			} catch (Exception e) {
				msg = e.getMessage();
			}
			result.put("SUCC", Boolean.TRUE);
			result.put("MSG", msg);
			return result;
		}

		//执行按钮操作
		public Map doActionNo(String formCode, String actionNo, Map modelData,
				Map formParams, SelRs rsSr, String companyCode, String userId,
				String dbType) throws SQLException {

			Map result = new HashMap();
			Map action = getFormAction(formCode, actionNo, rsSr);
			if (action == null) {
				result.put("SUCC", Boolean.FALSE);
				result.put("MSG", "未找到操作" + actionNo);
				return result;
			}
			String actionType = (String) action.get("actionType");
			if ("save".equals(actionType)) {
				return doSaveAction(formCode, modelData, formParams, rsSr,
						companyCode, userId, dbType);
			} else if ("clear".equals(actionType)) {
				return doClearAction(formCode, modelData, formParams, rsSr,
						companyCode, userId, dbType);
			} else if ("load".equals(actionType)) {
				return doLoadAction(formCode, modelData, formParams, rsSr,
						companyCode, userId, dbType);
			} else if ("exec".equals(actionType)) {
				return doExecAction(formCode, actionNo, modelData, formParams,
						rsSr, companyCode, userId, dbType);
			}
			return result;
		}

		private String saveModeData(Map form, Map model, Map modelData,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws Exception {
			String modelCode = (String) model.get("modelCode");
			String tableName = (String) model.get("tableName");
			List cols = getModelCols(modelCode, rsSr, companyCode, userId,
					dbType);
			StringBuffer buf = new StringBuffer("update " + tableName + " set");
			StringBuffer buf2 = new StringBuffer(" where ");
			for (Iterator iter = cols.iterator(); iter.hasNext();) {
				Map col = (Map) iter.next();
				String columnName = (String) col.get("columnName");
				String value = doNull((String) modelData.get(columnName));
				if ("true".equals(col.get("primary"))) {
					buf2.append(" " + columnName + " = '" + value + "' and");
				} else {
					buf.append(" " + columnName + " = '" + value + "',");
				}
			}
			String sql = buf.toString();
			if (sql.endsWith(",")) {
				sql = sql.substring(0, sql.length() - 1);
			}
			String condition = buf2.toString();
			if (condition.endsWith("and")) {
				condition = condition.substring(0, condition.length() - 3);
			}
			sql = sql + condition;
			log("保存数据SQL:" + sql);
			boolean result = rsSr.runSql(sql);
			return result ? "true" : "false";
		}

		private String clearModeData(Map form, Map model, Map modelData,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws Exception {

			String modelCode = (String) model.get("modelCode");
			String tableName = (String) model.get("tableName");
			List cols = getModelCols(modelCode, rsSr, companyCode, userId,
					dbType);
			StringBuffer buf = new StringBuffer("delete from " + tableName
					+ " where");
			for (Iterator iter = cols.iterator(); iter.hasNext();) {
				Map col = (Map) iter.next();
				String columnName = (String) col.get("columnName");
				String value = doNull((String) modelData.get(columnName));
				if ("true".equals(col.get("primary"))) {
					buf.append(" " + columnName + " = '" + value + "' and");
				}
			}
			String sql = buf.toString();
			if (sql.endsWith("and")) {
				sql = sql.substring(0, sql.length() - 3);
			}
			log("删除数据SQL:" + sql);
			boolean result = rsSr.runSql(sql);
			return result ? "true" : "false";
		}

		private Map loadModeData(Map form, Map model, Map modelData,
				SelRs rsSr, String companyCode, String userId, String dbType)
				throws Exception {

			String modelCode = (String) model.get("modelCode");
			String tableName = (String) model.get("tableName");
			List cols = getModelCols(modelCode, rsSr, companyCode, userId,
					dbType);
			StringBuffer buf = new StringBuffer("select");
			StringBuffer buf2 = new StringBuffer(" where");
			for (Iterator iter = cols.iterator(); iter.hasNext();) {
				Map col = (Map) iter.next();
				String columnName = (String) col.get("columnName");

				buf.append(" " + columnName + ",");
				if ("true".equals(col.get("primary"))) {
					String value = doNull((String) modelData.get(columnName));
					buf2.append(" " + columnName + " = '" + value + "' and");
				}
			}
			String sql = buf.toString();
			if (sql.endsWith(",")) {
				sql = sql.substring(0, sql.length() - 1);
			}
			String condition = buf2.toString();
			if (condition.endsWith("and")) {
				condition = condition.substring(0, condition.length() - 3);
			}
			sql = sql + " from " + tableName + " " + condition;
			log("查询数据SQL:" + sql);

			Map data = new HashMap();
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next()) {
				for (Iterator iter = cols.iterator(); iter.hasNext();) {
					Map col = (Map) iter.next();
					String columnName = (String) col.get("columnName");
					String value = doNull(rs.getString(columnName));
					data.put(columnName, value);
				}
			}
			return data;
		}

		//执行数据操作
		private String exec(Map form, Map model, Map action, Map modelData,
				Map formParams, SelRs rsSr, String companyCode, String userId,
				String dbType) throws Exception {

			Map params = new HashMap();
			for (Iterator iter = formParams.keySet().iterator(); iter.hasNext();) {
				String key = (String) iter.next();
				params.put(key, formParams.get(key));
			}
			for (Iterator iter = modelData.keySet().iterator(); iter.hasNext();) {
				String key = (String) iter.next();
				params.put("model." + key, modelData.get(key));
			}
			String dml = (String) action.get("execDML");
			String sp = (String) action.get("callSP");
			rsSr.beginTrans();
			try {
				boolean result = true;
				if (dml != null && !"".equals(dml.trim())) {
					dml = replaceSQL(params, dml);
					log("执行DML:" + dml);
					result = rsSr.runSql(dml);
				}
				if (sp != null && !"".equals(sp.trim())) {
					sp = replaceSQL(params, sp);
					log("调用SP:" + sp);
					result = rsSr.callSp(sp);
				}
				rsSr.commit();
				return result ? "true" : "false";
			} catch (Exception e) {
				try {
					rsSr.rollback();
				} catch (Exception ee) {
				}
				return e.getMessage();
			}
		}

		public String doNull(String str) {
			if (str == null || "undefined".equals(str) || "null".equals(str)) {
				return "";
			} else {
				return str;
			}
		}
	}%>



