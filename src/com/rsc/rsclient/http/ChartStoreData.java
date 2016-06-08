package com.rsc.rsclient.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChartStoreData extends StoreData {
    
    private Map chart ;
    
    private List dataset ;
    
    private List categories ;
    
    private Map vtrendlines ;
    
    private Map trendlines ;

    public ChartStoreData(Map data) {
        super(data);
        this.chart =  new HashMap();
        this.dataset = new ArrayList() ;
        this.categories = new ArrayList() ;
        this.vtrendlines = new HashMap() ;
        this.trendlines = new HashMap() ;
    }
    
    public Map getChart() {
        return chart;
    }
    
    public void setChart(Map chartMap) {
        this.chart = chartMap ;
    }
    
    /**
     * 返回数据Map,该Map中包含所有要返回的数据。<br/>
     * 其中包括元数据metaData。
     * 
     * @return {@link Map} data
     */
    public Map getDataMap() {
        Map data = super.getDataMap() ;
        data.put("chart",this.getChart()) ;
        data.put("dataset",this.getDataset()) ;
        data.put("categories",this.getCategories()) ;
        data.put("vtrendlines",this.getVtrendlines()) ;
        data.put("trendlines",this.getTrendlines()) ;
        
        return data;
    }

    public List getDataset() {
        return dataset;
    }

    public void setDataset(List dataset) {
        this.dataset = dataset;
    }

    public List getCategories() {
        return categories;
    }

    public void setCategories(List categories) {
        this.categories = categories;
    }

    public Map getVtrendlines() {
        return vtrendlines;
    }

    public void setVtrendlines(Map vtrendlinesMap) {
        this.vtrendlines = vtrendlinesMap;
    }

    public Map getTrendlines() {
        return trendlines;
    }

    public void setTrendlines(Map trendlinesMap) {
        this.trendlines = trendlinesMap;
    }
}
