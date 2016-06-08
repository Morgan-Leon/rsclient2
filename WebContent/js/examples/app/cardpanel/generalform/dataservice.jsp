<%@ page language="java" contentType="text/html; charset=GB2312"
	pageEncoding="GB2312"%>
<%@include file="../../../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		public void registerMethods(MethodMap mm) throws Exception {
			super.registerMethods(mm);

			mm.add("create").addObjectParameter(WebKeys.SelRsKey, SelRs.class)
			        .addMapParameter("data")
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("save").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearGeneralForm").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("getFormRegion").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("saveFormRegion").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearFormRegion").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("getFormFieldLine").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("saveFieldLine").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearFieldLine").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearField").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("getGeneralForm").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("getFormActions").addMapParameter("params")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setMapReturnValue();

			mm.add("createFormAction").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("saveFormAction").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();

			mm.add("clearFormAction").addMapParameter("data")
					.addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					.addStringParameter(WebKeys.CompanyCodeKey)
					.addStringParameter(WebKeys.UserUniqueIdKey)
					.addStringParameter(WebKeys.DbType).setStringReturnValue();
		}

		public String create(SelRs rsSr, Map data,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");
			String formName = (String)data.get("formName");
			String subSys = (String)data.get("subSys");
			String modelCode = (String)data.get("modelCode");
			String businessCondition = (String)data.get("businessCondition");

			String sql = "SELECT count(*) FROM generalform_head where form_code = '"
					+ formCode + "'";
			System.out.println(sql);
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next() && rs.getInt(1) > 1) {
				return "'已存在该公用表单编码,请重新设置表单编码'";
			} else {
				sql = "insert into generalform_head(form_code, form_name, sub_sys, model_code, business_condition)"
						+ " values('"
						+ formCode
						+ "', '"
						+ formName
						+ "', '"
						+ subSys
						+ "', '"
						+ modelCode
						+ "', '"
						+ businessCondition + "')";
				System.out.println(sql);
				boolean result = rsSr.runSql(sql);
				return result == true ? "true" : "false";
			}
		}

		public String save(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");
			String formName = (String)data.get("formName");
			String subSys = (String)data.get("subSys");
			String modelCode = (String)data.get("modelCode");
			String businessCondition = (String)data.get("businessCondition");

			String sql = "update generalform_head set " + " form_name = '"
					+ formName + "', sub_sys = '" + subSys
					+ "', model_code = '" + modelCode
					+ "', business_condition = '" + businessCondition
					+ "' where form_code = '" + formCode + "'";
			System.out.println(sql);
			boolean result = rsSr.runSql(sql);
			return result == true ? "true" : "false";
		}

		public String clearGeneralForm(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String formCode = (String)data.get("formCode");
			String sql1 = "delete from  generalform_head where form_code = '"
					+ formCode + "'";
			String sql2 = "delete from  generalform_region where form_code = '"
					+ formCode + "'";
			String sql3 = "delete from  generalform_fieldline where form_code = '"
					+ formCode + "'";
			log(sql1);
			log(sql2);
			log(sql3);
			rsSr.beginTrans();
			try {
				rsSr.runSql(sql1);
				rsSr.runSql(sql2);
				rsSr.runSql(sql3);
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

			String sql = "select form_code, form_name, sub_sys, model_code, "
					+ "business_condition from generalform_head";

			String sortInfo = " form_code desc ";

			String sortField = data.getSortField();

			String sortDir = data.getSortDir();
			if (sortDir == null || "".equals(sortDir.trim())) {
				sortDir = "";
			}

			if ("formCode".equals(sortField)) {
				sortInfo = " form_code " + sortDir;
			} else if ("formName".equals(sortField)) {
				sortInfo = " form_name " + sortDir;
			} else if ("subSys".equals(sortField)) {
				sortInfo = " sub_sys " + sortDir;
			} else if ("modelCode".equals(sortField)) {
				sortInfo = " model_code " + sortDir;
			} else if ("businessCondition".equals(sortField)) {
				sortInfo = " business_condition " + sortDir;
			}

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo, start, limit, dbType);

			log(sql);
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();

				map.put("formCode", this.doNull(rs.getString(1)));
				map.put("formName", this.doNull(rs.getString(2)));
				map.put("subSys", this.doNull(rs.getString(3)));
				map.put("modelCode", this.doNull(rs.getString(4)));
				map.put("businessCondition", this.doNull(rs.getString(5)));

				items.add(map);
			}
			data.setData(items);

			//获取总数
			sql = "SELECT count(*) FROM generalform_head";
			ResultSet rs2 = rsSr.getRs(sql);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}

		public String doNull(String str) {
			return str == null ? "" : str;
		}

		public Map getFormRegion(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String formCode = (String)data.get("formCode");
			return getFormRegion(formCode, rsSr, companyCode, userId, dbType);
		}

		private Map getFormRegion(String formCode, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			Map formRegion = new HashMap();
			formRegion.put("formCode", formCode);

			String sql2 = "select form_code, form_name, sub_sys, model_code, "
					+ "business_condition from generalform_head where form_code = '"
					+ formCode + "'";
			log(sql2);
			ResultSet rs2 = rsSr.getRs(sql2);
			if (rs2 != null && rs2.next()) {

				String formName = rs2.getString("form_name");
				String subSys = rs2.getString("sub_sys");
				String modelCode = rs2.getString("model_code");
				String businessCondition = rs2.getString("business_condition");

				formRegion.put("formName", formName);
				formRegion.put("subSys", subSys);
				formRegion.put("modelCode", modelCode);
				formRegion.put("businessCondition", businessCondition);
			}

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

		public String saveFormRegion(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");
			String formRegion = (String)data.get("formRegion");
			String dataIndex = doNull((String)data.get("dataIndex"));
			String fieldLabel = doNull((String)data.get("fieldLabel"));
			String value = doNull((String)data.get("value"));
			String color = doNull((String)data.get("color"));
			String fontSize = doNull((String)data.get("fontSize"));
			String regionConfig = doNull((String)data.get("regionConfig"));

			String sql = "delete from generalform_region where form_code = '"
					+ formCode + "' and form_region = '" + formRegion + "'";
			String sql2 = "insert into generalform_region(form_code, form_region, data_index, field_label, value, color, font_size, region_config) "
					+ "values('"
					+ formCode
					+ "', '"
					+ formRegion
					+ "', '"
					+ dataIndex
					+ "', '"
					+ fieldLabel
					+ "', '"
					+ value
					+ "', '"
					+ color + "', '" + fontSize + "', '" + regionConfig + "')";
			System.out.println(sql);
			System.out.println(sql2);
			rsSr.beginTrans();
			try {
				rsSr.runSql(sql);
				rsSr.runSql(sql2);
				rsSr.commit();
				return "true";
			} catch (Exception e) {
				try {
					rsSr.rollback();
				} catch (Exception ee) {
				}
				;
				return "'" + e.getMessage() + "'";
			}
		}

		/**
		 * 删除位置信息
		 */
		public String clearFormRegion(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");
			String formRegion = (String)data.get("formRegion");

			String sql = "delete from generalform_region where form_code = '"
					+ formCode + "' and form_region = '" + formRegion + "'";
			System.out.println(sql);
			boolean result = rsSr.runSql(sql);
			return result == true ? "true" : "false";
		}

		public Map getFormFieldLine(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");

			Map formFieldLine = new HashMap();

			List fieldLines = getFormFieldLine(formCode, rsSr, companyCode,
					userId, dbType);
			formFieldLine.put("fieldLines", fieldLines);

			return formFieldLine;
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

		public String saveFieldLine(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String) data.get("formCode");
			String lineNo = (String) data.get("lineNo");

			List fields = (List) data.get("fields");

			rsSr.beginTrans();
			String sql1 = "delete from  generalform_fieldline where form_code = '"
					+ formCode + "' and line_no = '" + lineNo + "'";
			rsSr.runSql(sql1);
			try {
				for (Iterator iter = fields.iterator(); iter.hasNext();) {
					Map field = (Map) iter.next();
					String fieldNo = doNull((String) field.get("fieldNo"));
					String xtype = doNull((String) field.get("xtype"));
					String dataIndex = doNull((String) field.get("dataIndex"));
					String fieldLabel = doNull((String) field.get("fieldLabel"));
					String value = doNull((String) field.get("value"));
					String width = doNull((String) field.get("width"));
					String columnWidth = doNull((String) field
							.get("columnWidth"));
					String readOnly = doNull((String) field.get("readOnly"));
					String fieldConfig = doNull((String) field
							.get("fieldConfig"));
					String readOnlyExpression = doNull((String) field.get("readOnlyExpression"));
					readOnlyExpression = readOnlyExpression.replaceAll("'", "''");
					
					String sql2 = "insert into generalform_fieldline(form_code, line_no, field_no, xtype, data_index, field_label, value, width, column_width, read_only, field_config, read_only_expression)"
							+ "values('"
							+ formCode
							+ "', '"
							+ lineNo
							+ "', '"
							+ fieldNo
							+ "', '"
							+ xtype
							+ "', '"
							+ dataIndex
							+ "', '"
							+ fieldLabel
							+ "', '"
							+ value
							+ "', '"
							+ width
							+ "', '"
							+ columnWidth
							+ "', '"
							+ readOnly
							+ "', '"
							+ fieldConfig 
							+ "', '" 
							+ readOnlyExpression + "')";
					System.out.println(sql2);
					rsSr.runSql(sql2);
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

		public String clearFieldLine(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String formCode = (String)data.get("formCode");
			String lineNo = (String)data.get("lineNo");

			String sql1 = "delete from generalform_fieldline where form_code = '"
					+ formCode + "' and line_no = '" + lineNo + "'";

			String sql2 = "update generalform_fieldline set line_no = line_no - 1 where form_code = '"
					+ formCode + "' and line_no > " + lineNo;

			System.out.println(sql1);
			System.out.println(sql2);
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

		public String clearField(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");
			String lineNo = (String)data.get("lineNo");
			String fieldNo = (String)data.get("fieldNo");

			String sql = "delete from generalform_fieldline where form_code = '"
					+ formCode
					+ "' and line_no = '"
					+ lineNo
					+ "' and field_no = '" + fieldNo + "'";
			System.out.println(sql);
			boolean result = rsSr.runSql(sql);
			return result ? "true" : "false";
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
				String actionNo = doNull(rs.getString("action_no"));
				String actionName = doNull(rs.getString("action_name"));
				String actionType = doNull(rs.getString("action_type"));
				String iconCls = doNull(rs.getString("icon_cls"));
				String tooltip = doNull(rs.getString("tooltip"));
				String execDML = doNull(rs.getString("exec_dml"));
				String callSP = doNull(rs.getString("call_sp"));
				String callback = doNull(rs.getString("callback"));
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

		public Map getGeneralForm(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String)data.get("formCode");

			Map form = getFormHead(formCode, rsSr, companyCode, userId, dbType);

			//位置
			Map formRegion = getFormRegion(formCode, rsSr, companyCode, userId,
					dbType);
			//字段行
			List fieldLines = getFormFieldLine(formCode, rsSr, companyCode,
					userId, dbType);
			//操作
			List actions = getFormActions(formCode, rsSr, companyCode, userId,
					dbType);

			if (form != null) {
				form.put("formCode", formCode);
				form.put("formRegions", formRegion);
				form.put("fieldLines", fieldLines);
				form.put("formActions", actions);
				return form;
			} else {
				return null;
			}
		}

		public Map getFormActions(Map params, SelRs rsSr, String companyCode,
				String userId, String dbType) throws SQLException {
			StoreData data = new StoreData(params);
			try {
				this.getFormActions(data, rsSr, companyCode, userId, dbType);
				data.setSuccess();
			} catch (Exception e) {
				data.setFailure();
				data.setMessage(e.getMessage());
			} finally {
				return data.getDataMap();
			}
		}

		public void getFormActions(StoreData data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = (String) data.get("formCode");
			List actions = getFormActions(formCode, rsSr, companyCode, userId,
					dbType);
			data.setData(actions);
			data.setTotal(actions.size());
		}

		public String createFormAction(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = doNull((String)data.get("formCode"));
			String actionNo = doNull((String)data.get("actionNo"));
			String actionName = doNull((String)data.get("actionName"));
			String actionType = doNull((String)data.get("actionType"));
			String iconCls = doNull((String)data.get("iconCls"));
			String tooltip = doNull((String)data.get("tooltip"));
			String execDML = doNull((String)data.get("execDML"));
			String callSP = doNull((String)data.get("callSP"));
			String callback = doNull((String)data.get("callback"));
			String disabledExpression = doNull((String)data.get("disabledExpression"));
			disabledExpression = disabledExpression.replaceAll("'", "''");
			
			String sql = "select count(*) from  generalform_actions where form_code = '"
					+ formCode + "' and action_no = '" + actionNo + "'";
			log(sql);
			ResultSet rs = rsSr.getRs(sql);
			if (rs != null && rs.next() && rs.getInt(1) > 0) {
				return "'已存在编号为" + actionNo + "的操作,请重新输入'";
			}
			sql = "insert into generalform_actions(form_code, action_no, action_name, action_type, icon_cls, tooltip, exec_dml, call_sp, callback, disabled_expression) "
					+ "values('"
					+ formCode
					+ "', '"
					+ actionNo
					+ "', '"
					+ actionName
					+ "', '"
					+ actionType
					+ "', '"
					+ iconCls
					+ "', '"
					+ tooltip
					+ "', '"
					+ execDML
					+ "', '"
					+ callSP
					+ "', '" 
					+ callback 
					+ "', '" + disabledExpression + "')";
			log(sql);
			return rsSr.runSql(sql) ? "true" : "false";
		}

		public String saveFormAction(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {

			String formCode = doNull((String)data.get("formCode"));
			String actionNo = doNull((String)data.get("actionNo"));
			String actionName = doNull((String)data.get("actionName"));
			String actionType = doNull((String)data.get("actionType"));
			String iconCls = doNull((String)data.get("iconCls"));
			String tooltip = doNull((String)data.get("tooltip"));
			String execDML = doNull((String)data.get("execDML"));
			String callSP = doNull((String)data.get("callSP"));
			String callback = doNull((String)data.get("callback"));
			String disabledExpression = doNull((String)data.get("disabledExpression"));
			disabledExpression = disabledExpression.replaceAll("'", "''");
			String sql = "update generalform_actions set action_name = '"
					+ actionName + "', action_type = '" + actionType
					+ "', icon_cls = '" + iconCls + "', tooltip = '" + tooltip
					+ "', exec_dml = '" + execDML + "', call_sp = '" + callSP
					+ "', callback = '" + callback + "', disabled_expression = '" 
					+ disabledExpression + "'"
					+ " where form_code = '" + formCode + "' and action_no = '"
					+ actionNo + "'";
			log(sql);
			return rsSr.runSql(sql) ? "true" : "false";
		}

		public String clearFormAction(Map data, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws SQLException {
			String formCode = doNull((String)data.get("formCode"));
			String actionNo = doNull((String)data.get("actionNo"));
			String sql = "delete from generalform_actions where form_code = '"
					+ formCode + "' and action_no = '" + actionNo + "'";
			log(sql);
			return rsSr.runSql(sql) ? "true" : "false";
		}
	}%>