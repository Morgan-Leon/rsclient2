Rs.define('rs.demo.chart.PieChart', {
   
    extend : Ext.Panel, 
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        var store = new Ext.data.JsonStore({
            fields: ['season', 'total'],
            data: [{
                season: 'Summer',
                total: 150
            },{
                season: 'Fall',
                total: 245
            },{
                season: 'Winter',
                total: 117
            },{
                season: 'Spring',
                total: 184
            }]
        });
        config = Rs.apply(config  || {}, {
            items: {
                store: store,
                xtype: 'piechart',
                dataField: 'total',
                categoryField: 'season',
                extraStyle: {
                    legend: {
                        display : 'bottom',
                        padding : 5,
                        font : {
                            family : 'Tahoma',
                            size : 13
                        }
                    }
                }
            }
        });
        rs.demo.chart.PieChart.superclass.constructor.call(this, config);
    }
});