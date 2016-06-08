<%@ page language="java" contentType="text/html; charset=GBk"
	pageEncoding="GBk"%>
<%@include file="../../pubservice.jsp"%>

<%!public void jspInit() {
		this.service = ServiceFactory.getService(this, MyService.class);
	}

	public class MyService extends StoreService {
		
		//读取
		public void read(StoreData data, SelRs rsSr, String companyCode,
				String userId, String dbType) throws Exception {
            
            log("------------------------------------------执行了read方法---------------------------------");
			//查询数据
			String sql = "SELECT rs_id,warehouse_code,warehouse_name,bill_no," +
                "bill_date,active_code,active_abv,io_flag,other_flag," +
                "om_order,pm_order,shop_order,dept_code,dept_abv," +
                "vendor_code,vendor_abv,customer_code,customer_abv," +
                "warehouse_man,warehouse_man_code,warehouse_man_name," +
                "use_code,use_desc,operator,operator_code,operator_name," +
                "operator_dept,operator_dept_name,check_flag,check_date," +
                "check_man,check_man_name,qc_no,post_man,post_man_name," +
                "post_date,record_man,record_man_name,record_date,record_time," +
                "remark,company_no,voucher_period,voucher_date,voucher_flag," +
                "voucher_no,voucher_on_time,voucher_type,seq_no,item_code,item_name," +
                "item_abv,order_no,bin_code,location_code,lot_no,qty,unit_code," +
                "unit_name,assist_unit,assist_unit_name,assist_qty,price,amt," +
                "inv_qty,value_flag,audit_flag,father_code,father_item_name," +
                "father_item_abv,father_order_no,item_sequence,gld_item_type," +
                "other_bill_no,inv_price,actual_price,actual_amt,invoice_date," +
                "invoice_price,invoice_amt,added_qty,added_amt,update_stock_flag," +
                "seq_desc,invoice_qty,invoice_no,added_inv_amt,cancel_flag,cancel_bill_no" +
                ",op_no,work_no,remark_head,ma_read_flag,use_stamp,ap_ar_read_flag," +
                "suspense_price_flag,company_code,plan_date,times,line_code,line_name," +
                "position_code,position_name,pc,coop_flag,other_bill_no_ag," +
                "other_bill_line_no_ag,read_flag,flush_flag,ma_out_diff,cancel_bill_date," +
                "old_bill_no,old_seq_no,other_bill_seq_no FROM inv_bill";
            
            String sqlSum = "SELECT COUNT(*) FROM inv_bill"  ;
            
			String sortInfo = data.getSortInfo();

			Integer start = data.getStart();
			Integer limit = data.getLimit();
			log(sql);
			sql = SQLUtil.pagingSql(sql, sortInfo , start, limit , dbType);
            
			List items = new ArrayList();
			ResultSet rs = rsSr.getRs(sql);
			while (rs != null && rs.next()) {
				Map map = new HashMap();
				map.put("rs_id",("null".equals(rs.getString(1)) || rs.getString(1) == null)  ? "" : rs.getString(1));
				map.put("warehouse_code",("null".equals(rs.getString(2)) || rs.getString(2) == null)  ? "" : rs.getString(2));
				map.put("warehouse_name",("null".equals(rs.getString(3)) || rs.getString(3) == null)  ? "" : rs.getString(3));
				map.put("bill_no",("null".equals(rs.getString(4)) || rs.getString(4) == null)  ? "" : rs.getString(4));
				map.put("bill_date",("null".equals(rs.getString(5)) || rs.getString(5) == null)  ? "" : rs.getString(5));
				map.put("active_code",("null".equals(rs.getString(6)) || rs.getString(6) == null)  ? "" : rs.getString(6));
				map.put("active_abv",("null".equals(rs.getString(7)) || rs.getString(7) == null)  ? "" : rs.getString(7));
				map.put("io_flag",("null".equals(rs.getString(8)) || rs.getString(8) == null)  ? "" : rs.getString(8));
				map.put("other_flag",("null".equals(rs.getString(9)) || rs.getString(9) == null)  ? "" : rs.getString(9));
				map.put("om_order",("null".equals(rs.getString(10)) || rs.getString(10) == null)  ? "" : rs.getString(10));
				map.put("pm_order",("null".equals(rs.getString(11)) || rs.getString(11) == null)  ? "" : rs.getString(11));
				map.put("shop_order",("null".equals(rs.getString(12)) || rs.getString(12) == null)  ? "" : rs.getString(12));
				map.put("dept_code",("null".equals(rs.getString(13)) || rs.getString(13) == null)  ? "" : rs.getString(13));
				map.put("dept_abv",("null".equals(rs.getString(14)) || rs.getString(14) == null)  ? "" : rs.getString(14));
				map.put("vendor_code",("null".equals(rs.getString(15)) || rs.getString(15) == null)  ? "" : rs.getString(15));
				map.put("vendor_abv",("null".equals(rs.getString(16)) || rs.getString(16) == null)  ? "" : rs.getString(16));
				map.put("customer_code",("null".equals(rs.getString(17)) || rs.getString(17) == null)  ? "" : rs.getString(17));
				map.put("customer_abv",("null".equals(rs.getString(18)) || rs.getString(18) == null)  ? "" : rs.getString(18));
				map.put("warehouse_man",("null".equals(rs.getString(19)) || rs.getString(19) == null)  ? "" : rs.getString(19));
				map.put("warehouse_man_code",("null".equals(rs.getString(20)) || rs.getString(20) == null)  ? "" : rs.getString(20));
				map.put("warehouse_man_name",("null".equals(rs.getString(21)) || rs.getString(21) == null)  ? "" : rs.getString(21));
				map.put("use_code",("null".equals(rs.getString(22)) || rs.getString(22) == null)  ? "" : rs.getString(22));
				map.put("use_desc",("null".equals(rs.getString(23)) || rs.getString(23) == null)  ? "" : rs.getString(23));
				map.put("operator",("null".equals(rs.getString(24)) || rs.getString(24) == null)  ? "" : rs.getString(24));
				map.put("operator_code",("null".equals(rs.getString(25)) || rs.getString(25) == null)  ? "" : rs.getString(25));
				map.put("operator_name",("null".equals(rs.getString(26)) || rs.getString(26) == null)  ? "" : rs.getString(26));
				map.put("operator_dept",("null".equals(rs.getString(27)) || rs.getString(27) == null)  ? "" : rs.getString(27));
				map.put("operator_dept_name",("null".equals(rs.getString(28)) || rs.getString(28) == null)  ? "" : rs.getString(28));
				map.put("check_flag",("null".equals(rs.getString(29)) || rs.getString(29) == null)  ? "" : rs.getString(29));
				map.put("check_date",("null".equals(rs.getString(30)) || rs.getString(30) == null)  ? "" : rs.getString(30));
				map.put("check_man",("null".equals(rs.getString(31)) || rs.getString(31) == null)  ? "" : rs.getString(31));
				map.put("check_man_name",("null".equals(rs.getString(32)) || rs.getString(32) == null)  ? "" : rs.getString(32));
				map.put("qc_no",("null".equals(rs.getString(33)) || rs.getString(33) == null)  ? "" : rs.getString(33));
				map.put("post_man",("null".equals(rs.getString(34)) || rs.getString(34) == null)  ? "" : rs.getString(34));
				map.put("post_man_name",("null".equals(rs.getString(35)) || rs.getString(35) == null)  ? "" : rs.getString(35));
				map.put("post_date",("null".equals(rs.getString(36)) || rs.getString(36) == null)  ? "" : rs.getString(36));
				map.put("record_man",("null".equals(rs.getString(37)) || rs.getString(37) == null)  ? "" : rs.getString(37));
				map.put("record_man_name",("null".equals(rs.getString(38)) || rs.getString(38) == null)  ? "" : rs.getString(38));
				map.put("record_date",("null".equals(rs.getString(39)) || rs.getString(39) == null)  ? "" : rs.getString(39));
				map.put("record_time",("null".equals(rs.getString(40)) || rs.getString(40) == null)  ? "" : rs.getString(40));
				map.put("remark",("null".equals(rs.getString(41)) || rs.getString(41) == null)  ? "" : rs.getString(41));
				map.put("company_no",("null".equals(rs.getString(42)) || rs.getString(42) == null)  ? "" : rs.getString(42));
				map.put("voucher_period",("null".equals(rs.getString(43)) || rs.getString(43) == null)  ? "" : rs.getString(43));
				map.put("voucher_date",("null".equals(rs.getString(44)) || rs.getString(44) == null)  ? "" : rs.getString(44));
				map.put("voucher_flag",("null".equals(rs.getString(45)) || rs.getString(45) == null)  ? "" : rs.getString(45));
				map.put("voucher_no",("null".equals(rs.getString(46)) || rs.getString(46) == null)  ? "" : rs.getString(46));
				map.put("voucher_on_time",("null".equals(rs.getString(47)) || rs.getString(47) == null)  ? "" : rs.getString(47));
				map.put("voucher_type",("null".equals(rs.getString(48)) || rs.getString(48) == null)  ? "" : rs.getString(48));
				map.put("seq_no",Double.valueOf(rs.getDouble(49)));
				map.put("item_code",("null".equals(rs.getString(50)) || rs.getString(50) == null)  ? "" : rs.getString(50));
				map.put("item_name",("null".equals(rs.getString(51)) || rs.getString(51) == null)  ? "" : rs.getString(51));
				map.put("item_abv",("null".equals(rs.getString(52)) || rs.getString(52) == null)  ? "" : rs.getString(52));
				map.put("order_no",("null".equals(rs.getString(53)) || rs.getString(53) == null)  ? "" : rs.getString(53));
				map.put("bin_code",("null".equals(rs.getString(54)) || rs.getString(54) == null)  ? "" : rs.getString(54));
				map.put("location_code",("null".equals(rs.getString(55)) || rs.getString(55) == null)  ? "" : rs.getString(55));
				map.put("lot_no",("null".equals(rs.getString(56)) || rs.getString(56) == null)  ? "" : rs.getString(56));
				map.put("qty",Double.valueOf(rs.getDouble(57)));
				map.put("unit_code",("null".equals(rs.getString(58)) || rs.getString(58) == null)  ? "" : rs.getString(58));
				map.put("unit_name",("null".equals(rs.getString(59)) || rs.getString(59) == null)  ? "" : rs.getString(59));
				map.put("assist_unit",("null".equals(rs.getString(60)) || rs.getString(60) == null)  ? "" : rs.getString(60));
				map.put("assist_unit_name",("null".equals(rs.getString(61)) || rs.getString(61) == null)  ? "" : rs.getString(61));
				map.put("assist_qty",Double.valueOf(rs.getDouble(62)));
				map.put("price",Double.valueOf(rs.getDouble(63)));
				map.put("amt",Double.valueOf(rs.getDouble(64)));
				map.put("inv_qty",Double.valueOf(rs.getDouble(65)));
				map.put("value_flag",("null".equals(rs.getString(66)) || rs.getString(66) == null)  ? "" : rs.getString(66));
				map.put("audit_flag",("null".equals(rs.getString(67)) || rs.getString(67) == null)  ? "" : rs.getString(67));
				map.put("father_code",("null".equals(rs.getString(68)) || rs.getString(68) == null)  ? "" : rs.getString(68));
				map.put("father_item_name",("null".equals(rs.getString(69)) || rs.getString(69) == null)  ? "" : rs.getString(69));
				map.put("father_item_abv",("null".equals(rs.getString(70)) || rs.getString(70) == null)  ? "" : rs.getString(70));
				map.put("father_order_no",("null".equals(rs.getString(71)) || rs.getString(71) == null)  ? "" : rs.getString(71));
				map.put("item_sequence",("null".equals(rs.getString(72)) || rs.getString(72) == null)  ? "" : rs.getString(72));
				map.put("gld_item_type",("null".equals(rs.getString(73)) || rs.getString(73) == null)  ? "" : rs.getString(73));
				map.put("other_bill_no",("null".equals(rs.getString(74)) || rs.getString(74) == null)  ? "" : rs.getString(74));
				map.put("inv_price",Double.valueOf(rs.getDouble(75)));
				map.put("actual_price",Double.valueOf(rs.getDouble(76)));
				map.put("actual_amt",Double.valueOf(rs.getDouble(77)));
				map.put("invoice_date",("null".equals(rs.getString(78)) || rs.getString(78) == null)  ? "" : rs.getString(78));
				map.put("invoice_price",Double.valueOf(rs.getDouble(79)));
				map.put("invoice_amt",Double.valueOf(rs.getDouble(80)));
				map.put("added_qty",Double.valueOf(rs.getDouble(81)));
				map.put("added_amt",Double.valueOf(rs.getDouble(82)));
				map.put("update_stock_flag",("null".equals(rs.getString(83)) || rs.getString(83) == null)  ? "" : rs.getString(83));
				map.put("seq_desc",("null".equals(rs.getString(84)) || rs.getString(84) == null)  ? "" : rs.getString(84));
				map.put("invoice_qty",Double.valueOf(rs.getDouble(85)));
				map.put("invoice_no",("null".equals(rs.getString(86)) || rs.getString(86) == null)  ? "" : rs.getString(86));
				map.put("added_inv_amt",Double.valueOf(rs.getDouble(87)));
				map.put("cancel_flag",("null".equals(rs.getString(88)) || rs.getString(88) == null)  ? "" : rs.getString(88));
				map.put("cancel_bill_no",("null".equals(rs.getString(89)) || rs.getString(89) == null)  ? "" : rs.getString(89));
				map.put("op_no",Double.valueOf(rs.getDouble(90)));
				map.put("work_no",("null".equals(rs.getString(91)) || rs.getString(91) == null)  ? "" : rs.getString(91));
				map.put("remark_head",("null".equals(rs.getString(92)) || rs.getString(92) == null)  ? "" : rs.getString(92));
				map.put("ma_read_flag",("null".equals(rs.getString(93)) || rs.getString(93) == null)  ? "" : rs.getString(93));
				map.put("use_stamp",("null".equals(rs.getString(94)) || rs.getString(94) == null)  ? "" : rs.getString(94));
				map.put("ap_ar_read_flag",("null".equals(rs.getString(95)) || rs.getString(95) == null)  ? "" : rs.getString(95));
				map.put("suspense_price_flag",("null".equals(rs.getString(96)) || rs.getString(96) == null)  ? "" : rs.getString(96));
				map.put("company_code",("null".equals(rs.getString(97)) || rs.getString(97) == null)  ? "" : rs.getString(97));
				map.put("plan_date",("null".equals(rs.getString(98)) || rs.getString(98) == null)  ? "" : rs.getString(98));
				map.put("times",Double.valueOf(rs.getDouble(99)));
				map.put("line_code",("null".equals(rs.getString(100)) || rs.getString(100) == null)  ? "" : rs.getString(100));
				map.put("line_name",("null".equals(rs.getString(101)) || rs.getString(101) == null)  ? "" : rs.getString(101));
				map.put("position_code",("null".equals(rs.getString(102)) || rs.getString(102) == null)  ? "" : rs.getString(102));
				map.put("position_name",("null".equals(rs.getString(103)) || rs.getString(103) == null)  ? "" : rs.getString(103));
				map.put("pc",("null".equals(rs.getString(104)) || rs.getString(104) == null)  ? "" : rs.getString(104));
				map.put("coop_flag",("null".equals(rs.getString(105)) || rs.getString(105) == null)  ? "" : rs.getString(105));
				map.put("other_bill_no_ag",("null".equals(rs.getString(106)) || rs.getString(106) == null)  ? "" : rs.getString(106));
				map.put("other_bill_line_no_ag",Double.valueOf(rs.getDouble(107)));
				map.put("read_flag",("null".equals(rs.getString(108)) || rs.getString(108) == null)  ? "" : rs.getString(108));
				map.put("flush_flag",("null".equals(rs.getString(109)) || rs.getString(109) == null)  ? "" : rs.getString(109));
				map.put("ma_out_diff",Double.valueOf(rs.getDouble(110)));
				map.put("cancel_bill_date",("null".equals(rs.getString(111)) || rs.getString(111) == null)  ? "" : rs.getString(111));
				map.put("old_bill_no",("null".equals(rs.getString(112)) || rs.getString(112) == null)  ? "" : rs.getString(112));
				map.put("old_seq_no",Double.valueOf(rs.getDouble(113)));
				map.put("other_bill_seq_no",Double.valueOf(rs.getDouble(114)));
				items.add(map);
			}
			data.setData(items);

			//获取总数
			ResultSet rs2 = rsSr.getRs(sqlSum);
			if (rs2 != null && rs2.next()) {
				data.setTotal(rs2.getInt(1));
			}
		}
	}%>