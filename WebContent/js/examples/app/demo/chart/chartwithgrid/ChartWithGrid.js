Rs.define('ChartWithGrid', {
   
    extend : Ext.Panel, 
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        this.store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy : true,
            idProperty: 'month',
            url : '/rsc/js/examples/fusioncharts/oo/o1.rsc',
            fields: ['v1', 'v2', 'v3','month']
        }) ;
        
        this.panel = new Ext.Panel({});

        //----------------------------------
        Ext.apply(this.store.baseParams.metaData, {
                limit : 20
            });
            var grid = new Ext.grid.EditorGridPanel({
                autoHeight : true ,
                store: this.store,
                columns: [
                    {
                        header   : 'Month', 
                        width    : 75,
                        dataIndex: 'month'
                    },
                    {
                        header   : 'Product A Sales', 
                        width    : 100, 
                        sortable : true, 
                        dataIndex: 'v1',
                        editor : new Ext.form.NumberField()
                    },
                    {
                        header   : 'Product B Sales', 
                        width    : 100, 
                        sortable : true, 
                        editor : new Ext.form.NumberField(),
                        dataIndex: 'v2'
                    },
                    {
                        header   : 'Total Downloads', 
                        width    : 75,
                        sortable : true, 
                        editor : new Ext.form.NumberField(),
                        dataIndex: 'v3'
                    }
                ],
                tbar : [
                    new Ext.Button({
                        text : '保存',
                        iconCls : 'rs-action-save',
                        handler : function(){
                        this.store.save();
                        },
                        scope : this
                    })
                ] ,
                bbar : new Rs.ext.grid.SliderPagingToolbar({
                    pageSize : 20,
                    hasSlider : true,
                    store : this.store,
                    displayInfo : true,
                    displayMsg: '共{2}条'
                }),
                stripeRows: true,
                height: 350,
                width: 400,
                title: '表格'
            });
        config = Rs.apply(config  || {}, {
            items: [this.panel,grid]
        });
        ChartWithGrid.superclass.constructor.call(this, config);
        this.panel.on('render', this.onPanelRender, this);
    },
   onPanelRender:function(panel){
        var chartPanel = new Rs.ext.chart.ChartPanel({
            //refreshTime : 5000 ,
            store : this.store ,
            height : 400 ,
            renderTo : panel.body,
            chartType : 'mscolumn3dlinedy' ,
            
            enableShowValues : false,
            
            //可选配置
            chart : {
                caption : "Product Sales & Downloads" ,
                xaxisname : "Month" 
            },
            
            categories : {
                dataIndex : 'month',
                //header : '月份',
                renderer : function(v){
                   return v == 'Feb' ? '二月' : v;
                }
            }, 
            dataSet : [{
                seriesname : 'product A',
                legend : 'v1' ,
                renderer : function(v){
                    //可进行显示数据的个性化
                    return v > 13000 ? 0 : v;                    
                }
            },{
                seriesname : 'product B',
                legend : 'v2'
            },{
                seriesname : 'down',
                legend : 'v3' , //图例项
                parentYAxis : 'S',
                renderer : function(v){
                    return v > 13000 ? 0 : v;                    
                }
            }] ,
            
            trendLines : {
                line : [{
                    startvalue : '500' ,
                    color : '009933' ,
                    displayvalue : 'Target'
                }]                    
            }
             
        });
    }
});