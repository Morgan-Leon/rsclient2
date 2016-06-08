Rs.define('rs.exp.HybridGridSummary', {

    extend: Ext.grid.GridPanel,
    
    mixins: [Rs.app.Main],
    
    constructor: function(config){
    
        var store = new Rs.ext.data.Store({
            autoLoad: true,
            url: '/rsc/js/examples/export/hybridgridsummary/dataservice.rsc',
            fields: ['warehouse_code', 'warehouse_name', 'qty']
        });
        
        var totalSummary = new Rs.ext.grid.HybridGridSummary();
        config = Rs.apply(config ||
        {}, {
            store: store,
            columns: [{
                dataIndex: 'warehouse_code',
                header: "�ֿ����",
                align: 'left',
                width: 130,
                sortable: true
            }, {
                dataIndex: 'warehouse_name',
                header: "�ֿ�����",
                align: 'left',
                width: 130,
                sortable: true
            }, {
                dataIndex: 'qty',
                header: "��������(�ϼ�)--",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'count'
            }, {
                dataIndex: 'qty',
                header: "��������(���)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'sum'
            }, {
                dataIndex: 'qty',
                header: "��������2(��Сֵ)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'min'
            }, {
                dataIndex: 'qty',
                header: "��������3(���ֵ)",
                align: 'left',
                width: 130,
                sortable: true,
                summaryType: 'max'
            }, {
                dataIndex: 'qty',
                header: "��������4(ƽ��)",
                align: 'left',
                width: 150,
                sortable: true,
                summaryType: {
                	type : 'average' ,
                	decimalPrecision : 4
                }
            }],
            
            tbar: [new Rs.ext.grid.ExportButton({
                grid: this,
                filename: "�ļ�"
            })],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '��{2}��'
            }),
            plugins: [totalSummary]
        });
        rs.exp.HybridGridSummary.superclass.constructor.call(this, config);
    }
});
