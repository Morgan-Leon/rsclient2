Rs.define('rs.demo.grid.Grid', {

    extend : Ext.grid.GridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
        var store = new Rs.ext.data.Store( {
            autoLoad : true,
            autoDestroy : true,
            url : '/rsc/js/examples/app/demo/grid/grid/dataservice.rsc',
            root : 'items',
            idProperty : 'code',
            sortField : 'code',
            fields : [ 'code', 'name', {
                name : 'price',
                type : 'float'
            } ],
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
                header : '物料编码',
                width : 100,
                sortable : true,
                dataIndex : 'code'
            }, {
                header : '物料名称',
                width : 100,
                sortable : true,
                dataIndex : 'name'
            }, {
                header : '计划价',
                width : 75,
                sortable : true,
                dataIndex : 'price'
            } ],
            tbar : [{
                text : '计算',
                scope : this,
                handler : this.callSp
            }]
        });
        rs.demo.grid.Grid.superclass.constructor.call(this, config);
    }, 
    
    callSp : function(){
        Rs.Service.call({
            url : '/rsc/js/examples/app/demo/grid/grid/dataservice.rsc',
            method : 'callSp',
            params : {}
        }, function(succ){
            
        },this);
    }

});
