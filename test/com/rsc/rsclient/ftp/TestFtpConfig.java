package com.rsc.rsclient.ftp;

import junit.framework.TestCase;

public class TestFtpConfig extends TestCase {

	public void testMethod1() {
		String v = FtpConfig.getTempPath();
		System.out.println(v);
	}

	public void testMethod2() {
		String v = FtpConfig.getPath();
		System.out.println(v);
	}

	public void testMethod3() {
		String v = FtpConfig.getLocalPath();
		System.out.println(v);
	}

	public void testMethod4() {
		String v = FtpConfig.getFTPUser();
		System.out.println(v);
	}

	public void testMethod5() {
		int v = FtpConfig.getFTPPort();
		System.out.println(v);
	}

	public void testMethod6() {
		String v = FtpConfig.getFTPPass();
		System.out.println(v);
	}

	public void testMethod7() {
		String v = FtpConfig.getFTPMode();
		System.out.println(v);
	}

	public void testMethod8() {
		String v = FtpConfig.getFTPHost();
		System.out.println(v);
	}

	public void testMethod9() {
		String v = FtpConfig.getFTPConnMode();
		System.out.println(v);
	}

	public void testMethod10() {

	}

}
