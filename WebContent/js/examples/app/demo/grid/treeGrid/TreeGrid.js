Rs.define('rs.demo.grid.TreeGrid', {
    
    extend : Rs.ext.grid.TreeGridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        var store = new Rs.ext.grid.TreeStore( {
            autoDestroy : true,
            remoteSort : false,
            url : '/rsc/js/examples/app/demo/grid/treeGrid/dataservice.rsc',
            idProperty: 'code',
            fields: ['code', 'name', 'leaf'],
            baseParams : {
                pm_flag : 'Y'
            }
        });
        
        config = Rs.apply(config || {}, {
            store : store,
            columns : [ {
                id       : 'code',
                xtype    : 'treecolumn',
                header : '±àÂë',
                width : 150,
                sortable : true,
                dataIndex : 'code'
            }, {
                header : 'Ãû³Æ',
                width : 150,
                sortable : true,
                dataIndex : 'name'
            }] ,
            tbar : [{
                text : 'Åú¶³½á' ,
                iconCls : 'rs-action-submit' ,
                scope : this ,
                handler : function(){
                    this.store.load({
                        params : {
                            node : '1002' ,
                            code : '1002'
                        }
                    });
                } 
            }]   
        });
        
        rs.demo.grid.TreeGrid.superclass.constructor.call(this, config);
    }

});