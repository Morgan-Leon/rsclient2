package com.rsc.rsclient.http;

import junit.framework.TestCase;

public class TestContentType extends TestCase {

	public void testMethod1() {
		String mimeType = ContentType.get("js");
		System.out.print(mimeType);
	}

	public void testMethod2() {
		String mimeType = ContentType.get("json");
		System.out.print(mimeType);
	}

	public void testMethod3() {
		String mimeType = ContentType.get("xml");
		System.out.print(mimeType);
	}

	public void testMethod4() {
		String mimeType = ContentType.get("doc");
		System.out.print(mimeType);
	}

	public void testMethod5() {
		String mimeType = ContentType.get("txt");
		System.out.print(mimeType);
	}

	public void testMethod6() {
		String mimeType = ContentType.get("exe");
		System.out.print(mimeType);
	}

	public void testMethod7() {
		String mimeType = ContentType.get(null);
		System.out.print(mimeType);
	}
}
