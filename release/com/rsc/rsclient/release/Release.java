package com.rsc.rsclient.release;

import org.apache.log4j.Logger;

/**
 * ���и���main������������������.
 * @author Administrator
 *
 */
public class Release {

	//��ĿĿ¼
	public static String DIR = "D:/workspaces/eclipse/workspaces3_rsclient2/rsclient2_bate/WebContent/js/";

	private static Logger logger = Logger.getLogger(Release.class);
	
	public static void main(String[] args) {
        logger.info("�ϲ�Rs JS�ļ�");
        ReleaseRsJs.main(new String[] {});

        logger.info("�ϲ�Rs Ext JS�ļ�");
        ReleaseRsExtJs.main(new String[] {});

        logger.info("�����ĵ�");
        ReleaseRsDocs.main(new String[] {});

        logger.info("ѹ��JS CSS");
        CompressorJsCss.main(new String[] {});
    }

}
