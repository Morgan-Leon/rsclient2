package com.rsc.rsclient.release;

import extdoc.Main;

/**
 * @author Administrator
 */
public class ReleaseRsDocs {

    public static void main(String[] args) {
        String[] options = new String[] { "-p",
                Release.DIR + "docs/docs_creater/rs.xml", "-o",
                Release.DIR + "docs", "-t",
                Release.DIR + "docs/docs_creater/template/ext/template.xml",
                "-verbose" };
        Main.main(options);
    }

}
