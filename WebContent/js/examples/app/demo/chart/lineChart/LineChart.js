Rs.define('rs.demo.chart.LineChart', {
   
    extend : Ext.Panel, 
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        var store = new Ext.data.JsonStore({
            fields:['name', 'visits', 'views'],
            data: [
                {name:'Jul 07', visits: 245000, views: 3000000},
                {name:'Aug 07', visits: 240000, views: 3500000},
                {name:'Sep 07', visits: 355000, views: 4000000},
                {name:'Oct 07', visits: 375000, views: 4200000},
                {name:'Nov 07', visits: 490000, views: 4500000},
                {name:'Dec 07', visits: 495000, views: 5800000},
                {name:'Jan 08', visits: 520000, views: 6000000},
                {name:'Feb 08', visits: 620000, views: 7500000}
            ]
        });
        config = Rs.apply(config  || {}, {
            items: {
                xtype: 'linechart',
                store: store,
                xField: 'name',
                yField: 'visits',
                listeners: {
                    itemclick: function(o){
                        var rec = store.getAt(o.index);
                    }
                }
            }
        });
        rs.demo.chart.LineChart.superclass.constructor.call(this, config);
    }
});