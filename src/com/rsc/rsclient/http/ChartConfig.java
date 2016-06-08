package com.rsc.rsclient.http;

import java.util.HashMap;
import java.util.Map;

public class ChartConfig {
    
    private String caption; //主标题

    private String palette ; //内置的图表样式,共5个
    
    private String animation ; //是否显示加载图表时的动画
    
    private String yaxisname ; // 纵向坐标轴(y轴)名称

    private String xaxisname ; // 横向坐标轴(x轴)名称

    private String showvalues ; //是否显示值
    
    private String numberprefix ;  //numberPrefix
    
    private String formatnumberscale ; //是否格式化数字,默认为1(True),自动的给你的数字加上K（千）或M（百万）；若取0,则丌加K或M
    
    private String showpercentintooltip ;//tip上是否显示百分数
    
    private String showlabels ; //是否显示Label
    
    private String showlegend ; //是否显示图例
    
    private Map chartMap  ;
    
    public ChartConfig() {
        this.chartMap = new HashMap() ; 
        chartMap.put("caption", "title") ;
        chartMap.put("palette","2") ;
        chartMap.put("animation","1") ;
        chartMap.put("xaxisname","X") ;
        chartMap.put("yaxisname","Y") ;
        chartMap.put("showvalues","1") ;
        chartMap.put("numberprefix","$") ;
        chartMap.put("formatnumberscale","0") ;
        chartMap.put("showpercentintooltip","0") ;
        chartMap.put("showlabels","1") ;
        chartMap.put("showlegend","1") ; 
    }
    
    public String getCaption() {
        return caption;
    }
    
    public void setCaption(String caption) {
        chartMap.put("caption", caption) ;
    }
    
    
    public String getPalette() {
        return palette;
    }

    public void setPalette(String palette) {
        chartMap.put("palette", palette) ;
    }

    public String getAnimation() {
        return animation;
    }

    public void setAnimation(String animation) {
        chartMap.put("animation", animation) ;
    }

    public String getYaxisname() {
        return yaxisname;
    }

    public void setYaxisname(String yaxisname) {
        chartMap.put("yaxisname", yaxisname) ;
    }

    public String getShowvalues() {
        return showvalues;
    }

    public void setShowvalues(String showvalues) {
        chartMap.put("showvalues", showvalues) ;
    }

    public String getNumberprefix() {
        return numberprefix;
    }

    public void setNumberprefix(String numberprefix) {
        chartMap.put("numberprefix", numberprefix) ;
    }

    public String getFormatnumberscale() {
        return formatnumberscale;
    }

    public void setFormatnumberscale(String formatnumberscale) {
        chartMap.put("formatnumberscale", formatnumberscale) ;
    }

    public String getShowpercentintooltip() {
        return showpercentintooltip;
    }

    public void setShowpercentintooltip(String showpercentintooltip) {
        chartMap.put("showpercentintooltip", showpercentintooltip) ;
    }

    public String getShowlabels() {
        return showlabels;
    }

    public void setShowlabels(String showlabels) {
        chartMap.put("showlabels", showlabels) ;
    }

    public String getShowlegend() {
        return showlegend;
    }

    public void setShowlegend(String showlegend) {
        chartMap.put("showlegend", showlegend) ;
    }

    public String getXaxisname() {
        return xaxisname;
    }

    public void setXaxisname(String xaxisname) {
        chartMap.put("xaxisname", xaxisname) ;
    }

    public Map getChartMap() {
        return this.chartMap;
    }
    
}
