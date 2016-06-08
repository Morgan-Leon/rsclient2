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
        
        System.out.println("—πÀırs-debug.js");
        YUICompressor.main(rsjs);
        System.out.println("rs-debug.js—πÀıÕÍ±œ");
        
        String[] rsextjs = new String[] {
                "--type", 
                "js",
                "--charset",
                "GB2312",
                Release.DIR + "rs/ext/rs-ext-debug.js", 
                "-o",
                Release.DIR + "rs/ext/rs-ext-mini.js"};
        
        System.out.println("—πÀırs-ext-debug.js");
        YUICompressor.main(rsextjs);
        System.out.println("rs-ext-debug.js —πÀıÕÍ±œ");
        
        String[] rscss = new String[] {
                "--type", 
                "css",
                "--charset",
                "GB2312",
                Release.DIR + "rs/resources/css/rs-all.css", 
                "-o",
                Release.DIR + "rs/resources/css/rs-mini.css"};
        
        System.out.println("—πÀırs-all.css");
        YUICompressor.main(rscss);
        System.out.println("rs-all.css—πÀıÕÍ±œ");
        
        String[] rsextcss = new String[] {
                "--type", 
                "css",
                "--charset",
                "GB2312",
                Release.DIR + "rs/ext/resources/css/rs-ext-all.css", 
                "-o",
                Release.DIR + "rs/ext/resources/css/rs-ext-mini.css"};
        
        System.out.println("—πÀırs-ext-all.css");
        YUICompressor.main(rsextcss);
        System.out.println("rs-ext-all.css—πÀıÕÍ±œ...");
    }

}