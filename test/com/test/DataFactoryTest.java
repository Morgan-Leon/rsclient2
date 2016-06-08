package com.test;

import java.util.Map;

import com.rsc.rsclient.parse.SuperParser;

import junit.framework.TestCase;

public class DataFactoryTest extends TestCase {

	public void test1() throws Exception {
		String[] f = { " A.aa, B.bb, cc", 
				" distinct A.a, B.b, c   ",
				" unique A.a, B.b, c", 
				" all A.a, B.b, c ",
				"  unique item_code, item_name, (select to_char(sysdate) as b from dual a) as aaaa ",
				"warehouse_code,warehouse_name,now_period",
				"distinct warehouse_code,warehouse_name,user_unique_no",
				"distinct forecast_no",
				"item_code,item_name,item_abv,item_norm,item_model,drawing_no,gb_code",
				"tax_code,tax_desc,ltrim(str(tax_rate,6,2))+ '%' as tax_rate_show,tax_rate",
				"distinct sheet_no,sheet_desc,rtrim(sheet_no)+'-'+rtrim(sheet_desc) as sheet",
				"currency_code,currency_name,round(exchange_rate,3) as exchange_rate",
				"distinct sheet_no,sheet_desc,rtrim(sheet_no)+'-'+rtrim(sheet_desc) as sheet",
				"order_no,order_qty,issue_qty,(isnull(order_qty,0)-isnull(issue_qty,0)) as tmp_qty",
				"distinct item_code,substring(rtrim(item_name) as item_name,1,replace(CHARINDEX('[',replace(rtrim(item_name),'{','[')),0,len(rtrim(item_name))+1)-1) as item_name",
				"distinct child_code,child_name,child_model,child_norm,child_stock_unit,child_unit_name,item_code,item_name,item_model,item_norm,item_stock_unit,item_unit_name,customer_order,nvl(sum(nvl(pick_actual_qty,0)-nvl(scrap_qty,0)),0) scrapt_qty",
				"a.vendor_customer_code,a.vendor_customer_name,a.vendor_customer_abv,decode(b.evaluate_flag,'Y','Y-评价','N','N-未评价') aaaa",
				"case when 1 = 1 then 'a' else 'b' end abend",
				"case when 1 = 1 then 'a' else 'b' end  \"ENDDDD\""
		};
		for (int i = 0; i < f.length; i++) {
			DataFactory factory = new DataFactory(f[i]);
			System.out.println("------------------------------------");
		}
	}
	
	public void test2() throws Exception{
		String fields = "a.vendor_customer_code,a.vendor_customer_name,a.vendor_customer_abv,decode(b.evaluate_flag,'Y','Y-评价','N','N-未评价') evaluate";
		
		DataFactory factory = new DataFactory(fields);
		
		factory.reset();
		
		factory.addData("1", "code");
		factory.addData("2", "name");
		factory.addData("3", "abv");
		factory.addData("4", "evaluate");
		
		Map data = factory.getDataMap();
		
		System.out.println(SuperParser.unmarshal("json", data));
	}

	public void test3() throws Exception{
		String fields = "a.vendor_customer_code, b.vendor_customer_name, c.vendor_customer_abv,decode(b.evaluate_flag,'Y','Y-评价','N','N-未评价') evaluate";
		
		DataFactory factory = new DataFactory(fields);
		
		factory.reset();
		
		factory.addData("1", "code");
		factory.addData("2", "name");
		factory.addData("3", "abv");
		factory.addData("4", "evaluate");
		
		Map data = factory.getDataMap();
		
		System.out.println(SuperParser.unmarshal("json", data));
	}
	
}
