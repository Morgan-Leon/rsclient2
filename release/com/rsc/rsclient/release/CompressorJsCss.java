package com.rsc.rsclient.release;

import com.yahoo.platform.yui.compressor.YUICompressor;

public class CompressorJsCss {

    public static void main(String[] args) {
        
        String[] rsjs = new String[] {
                "--type", 
                "js",
                "--charset",
                "GB2312",
                Release.DIR + "rs/rs-debug.js", 
                "-o",
                Release.DIR + "rs/rs-mini.js"};
        
        System.out.println("ѹ��rs-debug.js");
        YUICompressor.main(rsjs);
        System.out.println("rs-debug.jsѹ�����");
        
        String[] rsextjs = new String[] {
                "--type", 
                "js",
                "--charset",
                "GB2312",
                Release.DIR + "rs/ext/rs-ext-debug.js", 
                "-o",
                Release.DIR + "rs/ext/rs-ext-mini.js"};
        
        System.out.println("ѹ��rs-ext-debug.js");
        YUICompressor.main(rsextjs);
        System.out.println("rs-ext-debug.js ѹ�����");
        
        String[] rscss = new String[] {
                "--type", 
                "css",
                "--charset",
                "GB2312",
                Release.DIR + "rs/resources/css/rs-all.css", 
                "-o",
                Release.DIR + "rs/resources/css/rs-mini.css"};
        
        System.out.println("ѹ��rs-all.css");
        YUICompressor.main(rscss);
        System.out.println("rs-all.cssѹ�����");
        
        String[] rsextcss = new String[] {
                "--type", 
                "css",
                "--charset",
                "GB2312",
                Release.DIR + "rs/ext/resources/css/rs-ext-all.css", 
                "-o",
                Release.DIR + "rs/ext/resources/css/rs-ext-mini.css"};
        
        System.out.println("ѹ��rs-ext-all.css");
        YUICompressor.main(rsextcss);
        System.out.println("rs-ext-all.cssѹ�����...");
    }

}