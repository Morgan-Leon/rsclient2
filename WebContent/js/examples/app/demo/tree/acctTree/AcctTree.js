Rs.define('rs.demo.tree.AcctTree', {
    
    extend : Ext.tree.TreePanel, 
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            useArrows : true,
            autoScroll : true,
            containerScroll : true,
            rootVisible : false,
            //bodyStyle : 'background-color:#FFFFFF;',
            root : {
                nodeType : 'async',
                code : 'root',
                type : 'root'
            },
            loader : new Rs.ext.tree.TreeLoader( {
                dataUrl : '/rsc/js/examples/app/windowApp/acctTree/dataservice.rsc',
                method : 'getSubAccounts',
                nodeAttrsParams : [ "code", "type" ]
            })
        });
        rs.demo.tree.AcctTree.superclass.constructor.call(this, config);
        Rs.EventBus.register(this, 'tree', ['click', 'query']);
    }
    
});