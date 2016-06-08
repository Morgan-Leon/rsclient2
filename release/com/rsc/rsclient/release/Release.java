package com.rsc.rsclient.release;

import org.apache.log4j.Logger;

/**
 * 运行该类main方法，进行完整发布.
 * @author Administrator
 *
 */
public class Release {

	//项目目录
	public static String DIR = "D:/workspaces/eclipse/workspaces3_rsclient2/rsclient2_bate/WebContent/js/";

	private static Logger logger = Logger.getLogger(Release.class);
	
	public static void main(String[] args) {
        logger.info("合并Rs JS文件");
        ReleaseRsJs.main(new String[] {});

        logger.info("合并Rs Ext JS文件");
        ReleaseRsExtJs.main(new String[] {});

        logger.info("生成文档");
        ReleaseRsDocs.main(new String[] {});

        logger.info("压缩JS CSS");
        CompressorJsCss.main(new String[] {});
    }

}
