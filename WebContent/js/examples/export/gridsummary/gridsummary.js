Rs.define('rs.exp.GridSummary', {

    extend: Ext.grid.GridPanel,
    
    mixins: [Rs.app.Main],
    
    
    constructor: function(config){
    
        var store = new Rs.ext.data.Store({
            autoLoad: true,
            url: '/rsc/js/examples/export/gridpagesummary/dataservice.rsc',
            fields: ['warehouse_code', 'warehouse_name', 'qty']
        });
        
        var gridSummary = new Rs.ext.grid.GridSummary();
        config = Rs.apply(config ||
        {}, {
            store: store,
            columns: [{
                dataIndex: 'warehouse_code',
                header: "仓库编码",
                align: 'left',
                width: 130,
                sortable: true
            }, {
                dataIndex: 'warehouse_name',
                header: "仓库名称",
                align: 'left',
                width: 130,
                sortable: true
            },{
                dataIndex: 'qty',
                header: "测试数据(合计)--",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'count'
            }, {
                dataIndex: 'qty',
                header: "测试数据(求和)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'sum'
            }, {
                dataIndex: 'qty',
                header: "测试数据2(最小值)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'min'
            }, {
                dataIndex: 'qty',
                header: "测试数据3(最大值)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'max'
            }, {
                dataIndex: 'qty',
                header: "测试数据4(平均)",
                align: 'left',
                width: 150,
                sortable: true,
                summaryType: {
                	type : 'average' ,
                	decimalPrecision : 3
                }
            }],
            
            tbar: [new Rs.ext.grid.ExportButton({
                grid: this ,
                filename: "文件",
                paging: true
            })],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '共{2}条'
            }) ,
            plugins: [gridSummary]
        });
        rs.exp.GridSummary.superclass.constructor.call(this, config);
    }
});
