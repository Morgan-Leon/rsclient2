package com.rsc.rsclient.http;

import java.util.HashMap;
import java.util.Map;

public class ChartConfig {
    
    private String caption; //������

    private String palette ; //���õ�ͼ����ʽ,��5��
    
    private String animation ; //�Ƿ���ʾ����ͼ��ʱ�Ķ���
    
    private String yaxisname ; // ����������(y��)����

    private String xaxisname ; // ����������(x��)����

    private String showvalues ; //�Ƿ���ʾֵ
    
    private String numberprefix ;  //numberPrefix
    
    private String formatnumberscale ; //�Ƿ��ʽ������,Ĭ��Ϊ1(True),�Զ��ĸ�������ּ���K��ǧ����M�����򣩣���ȡ0,��آ��K��M
    
    private String showpercentintooltip ;//tip���Ƿ���ʾ�ٷ���
    
    private String showlabels ; //�Ƿ���ʾLabel
    
    private String showlegend ; //�Ƿ���ʾͼ��
    
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
