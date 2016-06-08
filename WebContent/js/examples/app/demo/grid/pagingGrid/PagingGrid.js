Rs.define('rs.demo.grid.PagingGrid', {
   
    extend : Ext.grid.GridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    
        var store = new Rs.ext.data.Store( {
            autoLoad : true,
            autoDestroy : true,
            url : '/rsc/js/examples/app/demo/grid/pagingGrid/dataservice.rsc',
            root : 'items',
            idProperty: 'code',
            sortField : 'code',
            fields: ['code', 'name', {name:'price', type: 'float'}],
            baseParams : {
                pm_flag : 'Y'
            }
        });
        
        Rs.apply(store.baseParams.metaData, {
            limit : 20
        });
        
        config = Rs.apply(config || {}, {
            store : store,
            columns : [ {
                header : '���ϱ���',
                width : 100,
                sortable : true,
                dataIndex : 'code'
            }, {
                header : '��������',
                width : 100,
                sortable : true,
                dataIndex : 'name'
            }, {
                header : '�ƻ���',
                width : 75,
                sortable : true,
                dataIndex : 'price'
            }],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 10,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });
        rs.demo.grid.PagingGrid.superclass.constructor.call(this, config);
    }

});
