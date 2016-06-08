Rs.define('rs.exp.GridPageSummary', {

    extend: Ext.grid.GridPanel,
    
    mixins: [Rs.app.Main],
    
    constructor: function(config){
    
        var store = new Rs.ext.data.Store({
            autoLoad: true,
            url: '/rsc/js/examples/export/gridpagesummary/dataservice.rsc',
            fields: ['warehouse_code', 'warehouse_name', 'qty']
        });
        
        var gridPageSummary = new Rs.ext.grid.GridPageSummary();
        //var sm = new Ext.grid.CheckboxSelectionModel({});
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
                pageSize: 11,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '共{2}条'
            }) ,
            plugins: [gridPageSummary]
        });
        rs.exp.GridPageSummary.superclass.constructor.call(this, config);
    }
});
