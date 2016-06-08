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
                header: "�ֿ����",
                align: 'left',
                width: 130,
                sortable: true
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
                	decimalPrecision : 3
                }
            }],
            
            tbar: [new Rs.ext.grid.ExportButton({
                grid: this ,
                filename: "�ļ�",
                paging: true
            })],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 11,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '��{2}��'
            }) ,
            plugins: [gridPageSummary]
        });
        rs.exp.GridPageSummary.superclass.constructor.call(this, config);
    }
});
