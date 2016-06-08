Ext.ns('Rs.ext.chart');

/**
 * @class Rs.ext.chart.ChartPanel
 * <p>ͼ�����
 * Provides a chart panel to show data.</p>
 * <p>֧��4�����ݸ�ʽ</p>
 * <p>��̬���� : һά���ݲ��� chart:{},data:{}</p>
 * <p>��̬���� : ��άά���ݲ��� chart:{},data:{},categories:{},dataSet:{},trendLines:{},styles:{}</p>
 * <p>��̬��ֵ,��̬����:��άά���ݲ��� : dataSet:{},jsonData:{}</p>
 * <p>����̬����: jsonData:{}</p>
 * <p>chart : {
        caption : "Product Sales & Downloads" ,  
        xaxisname : "Month" 
   }</p>
 * <p>data : {
            dataIndex : 'month' , //�Ա���ֶ� month��������Ϊ������
            legend : 'v1' //ֵ��store��fields�е�v1��ֵ
      }</p>
 * <p>categories : [{ 
        category : [{
           label : 'Jan' //�Զ�������� 
        },{
           label : 'Feb' 
        },{
           label : 'Mar'
        },{
           label : 'Apr'
        }]
    }]
    or 
    categories : {
            dataIndex : 'month', //�Ա���ֶ� month��������Ϊ������
            renderer : function(v){  //��ʾ�������ֵ���Ի�
               return v == 'Feb' ? '����' : v;
            }
    }
    </p>
 * <p>dataSet : [{
            seriesname : 'product A', //ͼ������
            legend : 'v1' ,  //ֵ��store��fields�е�v1��ֵ
            renderer : function(v){
                return v > 13000 ? 0 : v;                    
            }
        },{
            seriesname : 'product B',
            legend : 'v2' ,
        },{
            seriesname : 'down',
            legend : 'v3' , //ͼ����
            parentYAxis : 'S', //��������Y��ĸ���Ϊ��׼
            renderer : function(v){
                return v > 13000 ? 0 : v;                    
            }
    }]</p>
 * <p>trendLines : {
            line : [{
                startvalue : '500' ,
                color : '009933' ,
                displayvalue : 'Target'
            }]                    
        }</p>
 * <p>styles : [{
            definition : [{
                style : [{
                    name:"CanvasAnim" ,
                    type:'font' ,
                    face:'Verdana', 
                    size:'12' ,
                    color:'FF0000', 
                    bold:'1' ,
                    bgColor:'FFFFDD' 
                }]            
            }],
            application : [{
                apply : [{
                    toobject:"Caption",
                    styles:"CanvasAnim"                
                }]
            }]
        }]</p>  
 * <p>jsonData : {  
 *                  "chart":{
 *                      "caption":"Company Revenue",
 *                      "showpercentvalues":"1"
 *                  },
 *                "data":[
 *                      {"label":"Services", "value":"26"},
 *                      {"label":"Hardware", "value":"32"},
 *                      {"label":"Software", "value":"42"}
 *                ]
 *           }
 *     or 
 *     jsonData : {  
 *                  "chart":{
 *                      "caption":"Business Results 2005 v 2006",
 *                      "xaxisname":"Month",
 *                  },
 *                "categories":[{
 *                    "category":[
 *                      {"label":"Jan"},
 *                      {"label":"Feb"},
 *                      {"label":"Mar"},
 *                      ]}],
 *              "dataset":[
 *                  {"seriesname":"2006",
 *                  "data":[
 *                      {"value":"27400"},
 *                      {"value":"29800"},
 *                      {"value":"25800"}
 *                  ]},
 *                  {"seriesname":"2005",
 *                  "data":[
 *                      {"value":"10000"},
 *                      {"value":"11500"},
 *                      {"value":"12500"}
 *                  ]}
 *              ],
 *              "trendlines":{
 *                  "line":[
 *                      {"startvalue":"26000",
 *                       "color":"91C728",
 *                       "displayvalue":"Target"
 *                      }
 *                  ]
 *              }
 *          }
</p>                    
 * @extends Ext.Panel
 * @constructor
 * @param {Object} config 
 */
Rs.ext.chart.ChartPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {String} chartType
     * The chartType of chart panel(defaults to <tt>''</tt>)(required).
     * <p>��ʾͼ����ʽ</p>
     * <p>һά������ʽ:  Column3D Column3D.swf
     *              Column2D Column2D.swf
     *              Line Line.swf
     *              Area2D Area2D.swf
     *              Bar2D Bar2D.swf
     *              Pie2D Pie2D.swf
     *              Pie3D Pie3D.swf
     *              Doughnut2D Doughnut2D.swf
     *              Doughnut3D Doughnut3D.swf
     *              Pareto2D Pareto2D.swf
     *              Pareto3D Pareto3D.swf</p>
     *<p>��ά����ά������ʽ:
     *              MSColumn2D MSColumn2D.swf
     *              MSColumn3D MSColumn3D.swf
     *              MSLine MSLine.swf
     *              MSBar2D MSBar2D.swf
     *              MSBar3D MSBar3D.swf
     *              MSArea MSArea.swf
     *              Marimekko Marimekko.swf
     *              ZoomLine ZoomLine.swf
     *              StackedColumn3D StackedColumn3D.swf
     *              StackedColumn2D StackedColumn2D.swf
     *              StackedBar2D StackedBar2D.swf
     *              StackedBar3D StackedBar3D.swf
     *              StackedArea2D StackedArea2D.swf
     *              MSCombi3D MSCombi3D.swf
     *              MSCombi2D MSCombi2D.swf
     *              MSColumnLine3D MSColumnLine3D.swf
     *              StackedColumn2DLine StackedColumn2DLine.swf
     *              StackedColumn3DLine StackedColumn3DLine.swf
     *              MSCombiDY2D MSCombiDY2D.swf
     *              MSColumn3DLineDY MSColumn3DLineDY.swf
     *              StackedColumn3DLineDY StackedColumn3DLineDY.swf
     *              ScrollColumn2D ScrollColumn2D.swf
     *              ScrollArea2D ScrollArea2D.swf
     *              ScrollStackedColumn2D ScrollStackedColumn2D.swf
     *              ScrollCombi2D ScrollCombi2D.swf
     *              ScrollCombiDY2D ScrollCombiDY2D.swf
     */
    chartType: '',

    /**
     * @cfg {Number} height
     * The height of chart panel(defaults to <tt>500</tt>).
     * <p>ͼ�θ߶�</p>
     */
    height: 500,

    /**
     * @cfg {Number} width
     * The width of chart panel(defaults to <tt>600</tt>).
     * <p>ͼ�ο��</p>
     */
    width: 600,

    /**
     * @cfg {Number} refreshTime
     * The refreshTime of chart panel(defaults to <tt>0</tt>).
     * <p>ˢ�¼��ʱ��,0��ʾ��ˢ��</p>
     */
    refreshTime: 0,

    /**
     * @cfg {Boolean}  enableShowValues
     * The enableShowValues of chart panel(defaults to <tt>true</tt>).
     * <p>��ʾֵ</p> 
     */
    enableShowValues: true,

    /**
     * @cfg {Boolean}  enableShowLegend
     * The enableShowLegend of chart panel(defaults to <tt>true</tt>).
     * <p>��ʾͼ��</p> 
     */
    enableShowLegend: true,

    /**
     * @cfg {Boolean}  enableShowLabels
     * The enableShowLabels of chart panel(defaults to <tt>true</tt>).
     * <p>��ʾ��</p> 
     */
    enableShowLabels: true,

    constructor: function(config) {

        if (config.dataSet && !config.store) {
            Rs.error("û������store");
        }

        config.chart = Rs.applyIf(config.chart || config.jsonData.chart || {}��, {
            numberprefix: "��",
            formatNumberScale: '0'
        });

        // config ��new��ʱ�����õĲ���
        Rs.ext.chart.ChartPanel.superclass.constructor.call(this, config || {});

        this.setDefaultChart();

        this.chartId = Ext.id('chart-gen-'); // ����Ψһ��ID
        this.chartDir = config.chartDir || '/com/rsc/rs/pub/rsclient2/rs/lib/FusionCharts_v3/';

        this.getViewStyle(this.chartType);

        if (this.store) {
            var renderFlag = false;
            this.store.on('load',
            function(store, records, options) {
                this.setJsonData(store);
                if (!renderFlag) {
                    this.myChart.render(this.body.id);
                    renderFlag = true;
                }
            },
            this);
            this.startRefreshData();
            this.store.on('update',
            function(store, records, options) {
                this.setJsonData(store);
            },
            this);
        } else {
            this.myChart.setJSONData(this.jsonData);
            this.myChart.render(this.body.id);
        }

    },
    //private ��ȡ��ʾ��ʽ
    getViewStyle: function(chartType) {
        var chartType = this.chartType,
        chartDir = this.chartDir;
        //--start һάͼ 
        if (chartType == 'Column3D') {
            chartDir = chartDir + 'Column3D.swf';
        } else if (chartType == 'Column2D') {
            chartDir = chartDir + 'Column2D.swf';
        } else if (chartType == 'Line') {
            chartDir = chartDir + 'Line.swf';
        } else if (chartType == 'Area2D') {
            chartDir = chartDir + 'Area2D.swf';
        } else if (chartType == 'Bar2D') {
            chartDir = chartDir + 'Bar2D.swf';
        } else if (chartType == 'Pie2D') {
            chartDir = chartDir + 'Pie2D.swf';
        } else if (chartType == 'Pie3D') {
            chartDir = chartDir + 'Pie3D.swf';
        } else if (chartType == 'Doughnut2D') {
            chartDir = chartDir + 'Doughnut2D.swf';
        } else if (chartType == 'Doughnut3D') {
            chartDir = chartDir + 'Doughnut3D.swf';
        } else if (chartType == 'Pareto2D') {
            chartDir = chartDir + 'Pareto2D.swf';
        } else if (chartType == 'Pareto3D') {
            chartDir = chartDir + 'Pareto3D.swf';
            //----end һά----
            //----start ��ά----
        } else if (chartType == 'MSColumn2D') {
            chartDir = chartDir + 'MSColumn2D.swf';
        } else if (chartType == 'MSColumn3D') {
            chartDir = chartDir + 'MSColumn3D.swf';
        } else if (chartType == 'MSLine') {
            chartDir = chartDir + 'MSLine.swf';
        } else if (chartType == 'MSBar2D') {
            chartDir = chartDir + 'MSBar2D.swf';
        } else if (chartType == 'MSBar3D') {
            chartDir = chartDir + 'MSBar3D.swf';
        } else if (chartType == 'MSArea') {
            chartDir = chartDir + 'MSArea.swf';
        } else if (chartType == 'Marimekko') {
            chartDir = chartDir + 'Marimekko.swf';
        } else if (chartType == 'ZoomLine') {
            chartDir = chartDir + 'ZoomLine.swf';
        } else if (chartType == 'StackedColumn3D') {
            chartDir = chartDir + 'StackedColumn3D.swf';
        } else if (chartType == 'StackedColumn2D') {
            chartDir = chartDir + 'StackedColumn2D.swf';
        } else if (chartType == 'StackedBar2D') {
            chartDir = chartDir + 'StackedBar2D.swf';
        } else if (chartType == 'StackedBar3D') {
            chartDir = chartDir + 'StackedBar3D.swf';
        } else if (chartType == 'StackedArea2D') {
            chartDir = chartDir + 'StackedArea2D.swf';
        } else if (chartType == 'MSCombi3D') {
            chartDir = chartDir + 'MSCombi3D.swf';
        } else if (chartType == 'MSCombi2D') {
            chartDir = chartDir + 'MSCombi2D.swf';
        } else if (chartType == 'MSColumnLine3D') {
            chartDir = chartDir + 'MSColumnLine3D.swf';
        } else if (chartType == 'StackedColumn2DLine') {
            chartDir = chartDir + 'StackedColumn2DLine.swf';
        } else if (chartType == 'StackedColumn3DLine') {
            chartDir = chartDir + 'StackedColumn3DLine.swf';
        } else if (chartType == 'MSCombiDY2D') {
            chartDir = chartDir + 'MSCombiDY2D.swf';
        } else if (chartType == 'MSColumn3DLineDY') {
            chartDir = chartDir + 'MSColumn3DLineDY.swf';
        } else if (chartType == 'StackedColumn3DLineDY') {
            chartDir = chartDir + 'StackedColumn3DLineDY.swf';
        } else if (chartType == 'ScrollColumn2D') {
            chartDir = chartDir + 'ScrollColumn2D.swf';
        } else if (chartType == 'ScrollArea2D') {
            chartDir = chartDir + 'ScrollArea2D.swf';
        } else if (chartType == 'ScrollStackedColumn2D') {
            chartDir = chartDir + 'ScrollStackedColumn2D.swf';
        } else if (chartType == 'ScrollCombi2D') {
            chartDir = chartDir + 'ScrollCombi2D.swf';
        } else if (chartType == 'ScrollCombiDY2D') {
            chartDir = chartDir + 'ScrollCombiDY2D.swf';
        } else {
            Rs.error("�����õ�ͼ����ʾ��ʽ����,����");
        }
        this.myChart = new FusionCharts(chartDir, this.chartId, "100%", "100%", "0", "0");
    },

    setJsonData: function(store) {
        if (this.jsonData) {
            if (this.dataSet) {
                this.jsonData['dataSet'] = this.getDataSet(store);
            }
            this.myChart.setJSONData(this.jsonData);
        } else {
            var jsonData = Rs.apply(this.jsonData || {},{});
            if (this.chart) {
                jsonData['chart'] = this.getChart();
            }
            if (this.categories && this.dataSet) {
                jsonData['categories'] = [this.getCategory(store)];
                jsonData['dataSet'] = this.getDataSet(store);
            } else if (this.data) {
                jsonData['data'] = this.getData(store);
            } else {
                Rs.error("categories,dataset  or data ��������һ��");
            }

            if (this.trendLines) {
                jsonData['trendLines'] = this.getTrendLines();
            }
            if (this.styles) {
                jsonData['styles'] = this.getStyles();
            }
            this.myChart.setJSONData(jsonData);
        }

    },

    getCategory: function(store) {
        var category = [],
        key = this.categories['dataIndex'],
        cate = this.categories['renderer'],
        renderer = Ext.isFunction(cate) ? cate: function(v) {
            return v
        };
        store.each(function(rec) {
            category.push({
                label: renderer.call(this, rec.get(key))
            })
        },
        this);

        return {
            category: category
        };
    },

    getDataSet: function(store) {

        var dataSet = [];

        for (var i = 0,
        len = this.dataSet.length; i < len; i++) {
            var key = this.dataSet[i]['legend'],
            data = [],
            cate = this.dataSet[i]['renderer'],
            renderer = Ext.isFunction(cate) ? cate: function(v) {
                return v
            };
            store.each(function(rec) {
                data.push({
                    value: renderer.call(this, rec.get(key))
                });
            },
            this);

            dataSet[i] = {
                seriesname: this.dataSet[i]['seriesname'] || this.dataSet[i]['legend'],
                //renderAs : this.dataSet[i]['renderAs'] ,
                parentYAxis: this.dataSet[i]['parentYAxis'] || 'P',
                data: data
            }
        }

        return dataSet;
    },
    //private
    getChart: function() {
        return this.chart;
    },
    //private    
    getData: function(store) {
        var data = [];
        store.each(function(rec) {
            data.push({
                label: rec.get(this.data['dataIndex']),
                value: rec.get(this.data['legend'])
            });
        },
        this);

        return data;
    },

    //private    
    getTrendLines: function() {
        return this.trendLines;
    },

    //private    
    getStyles: function() {
        return this.styles;
    },

    //private ����Ĭ��Chart
    setDefaultChart: function() {
        if (!this.enableShowValues) {
            this.chart.showvalues = '0';
        }

        if (!this.enableShowLabels) {
            this.chart.showLabels = '0';
        }

        if (!this.enableShowLegend) {
            this.chart.showlegend = '0';
        } else {
            this.chart.showlegend = '1';
        }
    },
    //private ��ˢ�´�����
    startRefreshData: function() {
        if (this.refreshTime > 0) {
            Ext.TaskMgr.start({
                run: function() {
                    this.store.reload();
                },
                interval: this.refreshTime,
                scope: this
            });
        }
    }
});