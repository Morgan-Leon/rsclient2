package com.rsc.rsclient;

import java.lang.reflect.Constructor;

import org.apache.log4j.Logger;

public class ServiceFactory {

	private static Logger logger = Logger.getLogger(ServiceFactory.class);

	/**
	 * ����һ��MehodEngine���� serviceClass �������ڲ���
	 * 
	 * @param serviceClass
	 * @return
	 */
	public static Service getService(Class serviceClass) {
		Service service = null;
		if (serviceClass != null
				&& Service.class.isAssignableFrom(serviceClass)) {
			try {
				service = (Service) serviceClass.newInstance();
			} catch (Exception e) {
				try {
					Constructor con = serviceClass
							.getConstructor(new Class[] {});
					service = (Service) con.newInstance(new Object[] {});
				} catch (Exception e1) {
					logger.fatal("create an service of "
							+ serviceClass.getName() + " exception!", e1);
				}
			}
		}
		return service;
	}

	/**
	 * ����һ��MethodEngine���� serviceClass��һ���ڲ���
	 * 
	 * @param handler
	 * @param serviceClass
	 * @return
	 */
	public static Service getService(Object handler, Class serviceClass) {
		Service service = null;
		if (serviceClass != null
				&& Service.class.isAssignableFrom(serviceClass)) {
			try {
				service = (Service) serviceClass.newInstance();
			} catch (Exception e) {
				try {
					Constructor con = serviceClass
							.getConstructor(new Class[] { handler.getClass() });
					service = (Service) con
							.newInstance(new Object[] { handler });
				} catch (Exception e1) {
					logger.fatal("create an service of "
							+ serviceClass.getName() + " exception!", e1);
				}
			}
		}
		return service;
	}
}
