package com.rsc.rsclient.http;

import java.util.HashMap;
import java.util.Map;

import junit.framework.TestCase;

import com.rsc.rsclient.exception.NoneParserException;
import com.rsc.rsclient.exception.ParserException;
import com.rsc.rsclient.parse.SuperParser;

public class TestSubSysInfo extends TestCase {

	class SubSys {

		private String name;

		private Map sysConfig;

		private Map authority;

		private Map extra;

		public SubSys(String name) {
			this.name = name;
			this.sysConfig = new HashMap();
			this.authority = new HashMap();
			this.extra = new HashMap();
		}

		public void addSysConfig(String key, Object value) {
			this.sysConfig.put(key, value);
		}

		public void addAuthority(String key, Object value) {
			this.authority.put(key, value);
		}

		public void addExtra(String key, Object value) {
			this.extra.put(key, value);
		}

		public String toString() {
			Map sys = new HashMap();
			sys.put("SYSCONFIG", this.sysConfig);
			sys.put("AUTHORITY", this.authority);
			sys.put("EXTRA", this.extra);

			Map rs = new HashMap();
			rs.put(this.name, sys);

			String json;
			try {
				json = SuperParser.unmarshal("json", rs, "RS");
				return json;
			} catch (ParserException e) {
				e.printStackTrace();
			} catch (NoneParserException e) {
				e.printStackTrace();
			}
			return this.name;
		}
	}

	public void testMethod() {

		SubSys ss = new SubSys("TBM");
		ss.addSysConfig("DIMENSIONS", this.getDimensions());

		ss.addAuthority("VIEWCREATE", true);
		ss.addAuthority("VIEWMANAGER", true);

		ss.addExtra("PERIOD", "2011");

		System.out.println(ss);
	}

	public Map getDimensions() {
		Map dims = new HashMap();

		Map dim1 = new HashMap();
		dim1.put("field", 1);
		dim1.put("name", "时间");
		dims.put("1", dim1);

		Map dim2 = new HashMap();
		dim2.put("field", 2);
		dim2.put("name", "组织");
		dims.put("2", dim2);

		return dims;
	}
}
