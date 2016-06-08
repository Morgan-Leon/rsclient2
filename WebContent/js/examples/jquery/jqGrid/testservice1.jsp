<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {

		//新增
		public void create(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			log("create--------------------------------------------------");
			for (Iterator i = items.iterator(); i.hasNext();) {
				log(""+ i.next());
			}
		}

		//删除
		public void destroy(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			log("destroy--------------------------------------------------");
			for (Iterator i = items.iterator(); i.hasNext();) {
				log(""+i.next());
			}
		}

		//修改
		public void update(StoreData data, List items, SelRs rsSr,
				String companyCode, String userId, String dbType)
				throws Exception {
			log("update--------------------------------------------------");
			for (Iterator i = items.iterator(); i.hasNext();) {
				log(""+i.next());
			}
		}

		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
			log("read--------------------------------------------------");

			//查询数据
			String pm_flag = (String) data.get("pm_flag");

			String sql = "SELECT"
					+ " COMPANY_CODE,ORG_ID,item_code as code, item_name as name, plan_price as price,ITEM_ABV,GB_CODE,DRAWING_NO,"
					+ "REFER_CODE,MEMORY_CODE,NORMAL_CLASS,PM_FLAG,OM_FLAG,INV_FLAG,QC_FLAG,SPECIAL_CLASS,LOT_FLAG,STOCK_UNIT,BI_UNIT_FLAG,"
					+ "SECOND_UNIT,ASSIST_UNIT,PM_UNIT,OM_UNIT,PM_STOCK_RATE,OM_STOCK_RATE,STOCK2_RATE,UNIQUE_FLAG,TOLERANCE,PRICE_SYS,"
					+ "ABC_CLASS,ON_HAND_QTY,ON_HAND_AMT,COST_FLAG,NET_WEIGHT,NET_UNIT,BYPRODUCT_FLAG,MRP_FLAG,LOT_POLICY,LOT_QTY,ROUND_TIMES,"
					+ "DEPT_CODE,SCRAP_RATE,PHANTOM_FLAG,ITEM_LIST_FLAG,MP_FLAG,MPS_FLAG,LOT_MERGE_FLAG,"
					+ "PSEUDO_FLAG,LEAD_TIME_FLAG,LEAD_TIME,LEAD_DAYS,NORM_BATCH,PLAN_CONSTANT,LOT_DAYS,"
	                + "ORDER_POINT,ORDER_QTY,ONHAND_FLAG,PAC_FLAG,ROUTING_NO,ROUTING_FLAG,COOP_FLAG,LIMIT_FLAG,"
	                + "KEY_PART_FLAG,BOM_FLAG,MATERIAL_FLAG,CREATE_FLAG,INPUT_DATE,INPUT_ID,PRODUCT_FLAG,INPUT_MAN"
					+ " FROM inv_master "
					+ " WHERE company_code = '"
					+ companyCode
					+ "' and plan_price IS NOT NULL  and pm_flag = '"
					+ pm_flag
					+ "'";
			
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
			
			log(sql);
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("COMPANY_CODE", rs.getString(1));
				map.put("ORG_ID", rs.getString(2));
				map.put("code", rs.getString(3));
				map.put("name", rs.getString(4));
				map.put("price", new Double(5));
				map.put("ITEM_ABV", rs.getString(6));
				map.put("GB_CODE", rs.getString(7));
				map.put("DRAWING_NO", rs.getString(8));
				map.put("REFER_CODE", rs.getString(9));
				map.put("MEMORY_CODE", rs.getString(10));
				map.put("NORMAL_CLASS", rs.getString(11));
				map.put("PM_FLAG", rs.getString(12));
				map.put("OM_FLAG", rs.getString(13));
				map.put("INV_FLAG", rs.getString(14));
				map.put("QC_FLAG", rs.getString(15));
				map.put("SPECIAL_CLASS", rs.getString(16));
				map.put("LOT_FLAG", rs.getString(17));
				map.put("STOCK_UNIT", rs.getString(18));
				map.put("BI_UNIT_FLAG", rs.getString(19));
				map.put("SECOND_UNIT", rs.getString(20));
				map.put("ASSIST_UNIT", rs.getString(21));
				map.put("PM_UNIT", rs.getString(22));
				map.put("OM_UNIT", rs.getString(23));
				map.put("PM_STOCK_RATE", rs.getString(24));
				map.put("OM_STOCK_RATE", rs.getString(25));
				map.put("STOCK2_RATE", rs.getString(26));
				map.put("UNIQUE_FLAG", rs.getString(27));
				map.put("TOLERANCE", rs.getString(28));
				map.put("PRICE_SYS", rs.getString(29));
				map.put("ABC_CLASS", rs.getString(30));
				map.put("ON_HAND_QTY", rs.getString(31));
				map.put("ON_HAND_AMT", rs.getString(32));
				map.put("COST_FLAG", rs.getString(33));
				map.put("NET_WEIGHT", rs.getString(34));
				map.put("NET_UNIT", rs.getString(35));
				map.put("BYPRODUCT_FLAG", rs.getString(36));
				map.put("MRP_FLAG", rs.getString(37));
				map.put("LOT_POLICY", rs.getString(38));
				map.put("LOT_QTY", rs.getString(39));
				map.put("ROUND_TIMES", rs.getString(40));
				map.put("DEPT_CODE", rs.getString(41));
				map.put("SCRAP_RATE", rs.getString(42));
				map.put("PHANTOM_FLAG", rs.getString(43));
				map.put("ITEM_LIST_FLAG", rs.getString(44));
				map.put("MP_FLAG", rs.getString(45));
				map.put("MPS_FLAG", rs.getString(46));
				map.put("LOT_MERGE_FLAG", rs.getString(47));
				map.put("PSEUDO_FLAG", rs.getString(48));
				map.put("LEAD_TIME_FLAG", rs.getString(49));
				map.put("LEAD_TIME", rs.getString(50));
				map.put("LEAD_DAYS", rs.getString(51));
				map.put("NORM_BATCH", rs.getString(52));
				map.put("PLAN_CONSTANT", rs.getString(53));
				map.put("LOT_DAYS", rs.getString(54));
				map.put("ORDER_POINT", rs.getString(55));
				map.put("ORDER_QTY", rs.getString(56));
				map.put("ONHAND_FLAG", rs.getString(57));
				map.put("PAC_FLAG", rs.getString(58));
				map.put("ROUTING_NO", rs.getString(59));
				map.put("ROUTING_FLAG", rs.getString(60));
				map.put("COOP_FLAG", rs.getString(61));
				map.put("LIMIT_FLAG", rs.getString(62));
				map.put("KEY_PART_FLAG", rs.getString(63));
				map.put("BOM_FLAG", rs.getString(64));
				map.put("MATERIAL_FLAG", rs.getString(65));
				map.put("CREATE_FLAG", rs.getString(66));
				map.put("INPUT_DATE", rs.getString(67));
				map.put("INPUT_ID", rs.getString(68));
				map.put("PRODUCT_FLAG", rs.getString(69));
				map.put("INPUT_MAN", rs.getString(70));

				items.add(map);
			}
			data.setData(items);

			//获取总数
			sql = "SELECT count(*) FROM inv_master "
					+ " WHERE company_code = '" + companyCode
					+ "' and plan_price IS NOT NULL  and pm_flag = '" + pm_flag
					+ "'";
			ResultSet rs2 = rsSr.getRs(sql);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}

	}%>