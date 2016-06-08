package com.rsc.rsclient.http;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import junit.framework.TestCase;

public class TestJspUrl extends TestCase {

	public void testMethod() {
		String[] a = new String[] { "{a}", "/com/rs{a}.jsp",
				"/com/rs{a[3]}.jsp", "/com/rs{a[3,-3]}.jsp",
				"/com/rs{a[3,]}.jsp", "/com/rs{a[,-3]}.jsp", "/com/rs{a[}.jsp",
				"/com/rs{a]}.jsp", "/com/rs{a[33]}.jsp",
				"/com/rs{a[33,-13]}.jsp", "/com/rs{a[33,]}.jsp",
				"/com/rs{a[,-13]}.jsp" };
		String str = "/js/examples/app/windowApp/acctTree/dataservice.rsc";
		for (int i = 0, len = a.length; i < len; i++) {
			String result = new URLTemplate(a[i]).format(str);
			System.out.println("sourse : " + str);
			System.out.println("result : " + result);
			System.out.println("--------------------------------");
		}
	}

	public void testMethod2() {
		URLTemplate xt = new URLTemplate("/com/rsc/rs{uri[0,-4]}.jsp");
		String[] a = new String[] {
				"/js/examples/app/windowApp/acctTree/dataservice.rsc",
				"/tbm/tbm3300/listener.rsc", "/fap/fap5500/listener.rsc" };
		for (int i = 0, len = a.length; i < len; i++) {
			System.out.println(a[i]);
			System.out.println(xt.format(a[i]));
			System.out.println("--------------------------------");
		}
	}

	public void testMethod3() {
		URLTemplate xt = new URLTemplate("{uri[3,-4]}.jsp");
		String[] a = new String[] { "/rs/js/examples/app/windowApp/acctTree/dataservice.rsc" };
		for (int i = 0, len = a.length; i < len; i++) {
			System.out.println(a[i]);
			System.out.println(xt.format(a[i]));
			System.out.println("--------------------------------");
		}
	}

	public void testMethod4() {

		String[] urls = new String[] {
				"/rs/js/examples/app/windowApp/acctTree/dataservice.rsc",
				"/rs/fap/fap5500/listener.rsc", "/rs/tbm/tbm3300/listener.rsc" };

		String[] urle = new String[] {
				"/js/examples/app/windowApp/acctTree/dataservice.jsp",
				"/fap/fap5500/listener.jsp", "/tbm/tbm3300/listener.jsp" };

		URLTemplate xt = new URLTemplate("{uri[3,-4]}.jsp");
		
		xt.usepool = true;
		
		long s = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
			for (int j = 0; j < urls.length; j++) {
				String e = xt.format(urls[j]);
				if (!e.equals(urle[j])) {
					System.out.println("³ö´íÀ² " + e + " " + urle[j]);
				}
			}
		}
		long e = System.currentTimeMillis();
		System.out.println(e - s);
	}
	
}

class URLTemplate {

	private String template;

	private String regex = "(\\{{1}?)\\S*(\\}{1}?)";
	
	int start = 0;

	int end = 0;
	
	Map urlPool = Collections.synchronizedMap(new HashMap());
	
	public boolean usepool = true;
	
	public URLTemplate(String template) {
		this.template = template;
		Matcher m = Pattern.compile(this.regex).matcher(template);
		if (m.find()) {
			String temp = m.group();
			String regex2 = "(\\[{1}?)((-?)\\d+)?,?((-?)\\d+)?(\\]{1}?)";
			Matcher m2 = Pattern.compile(regex2).matcher(temp);
			if (m2.find()) {
				temp = m2.group();
				if (temp.startsWith("[")) {
					temp = temp.substring(1);
				}
				if (temp.endsWith("]")) {
					temp = (String) temp.substring(0, temp.length() - 1);
				}
				String[] se = temp.split(",");
				if (se != null) {
					if (se.length >= 1 && !"".equals(se[0])) {
						this.start = Integer.parseInt(se[0]);
					}
					if (se.length >= 2 && !"".equals(se[1])) {
						this.end = Integer.parseInt(se[1]);
					}
				}
			}
		}
	}
	
	public String format(String str) {
		if(this.usepool && urlPool.containsKey(str)){
			return (String)urlPool.get(str);
		};
		int s = 0, e = 0;
		String str2 = new String(str);
		int len = str2.length();
		if (this.start < 0) {
			s = len + this.start;
		} else {
			s = this.start;
		}
		if (this.end < 0) {
			e = len + this.end;
		} else if (this.end == 0) {
			e = len;
		} else {
			e = this.end;
		}
		if (s < e && s < len && e < len) {
			str2 = str2.substring(s, e);
		}
		String temp = new String(this.template).replaceAll(this.regex, str2);
		urlPool.put(str, temp);
		return temp;
	}
}