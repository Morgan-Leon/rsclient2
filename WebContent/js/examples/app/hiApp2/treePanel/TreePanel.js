Rs.define('rs.acct.Tree', {
   
    extend : Ext.tree.TreePanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            useArrows : true,
            autoScroll : true,
            animate : true,
            containerScroll : true,
            rootVisible : false,
            frame : true,
            //bodyStyle : 'background-color:#FFFFFF;',
            root : {
                nodeType : 'async',
                code : 'root',
                type : 'root'
            },
            loader : new Rs.ext.tree.TreeLoader( {
                dataUrl : '/rsc/js/examples/app/hiApp2/treePanel/dataservice.rsc',
                method : 'getSubAccounts',
                nodeAttrsParams : [ "code", "type" ]
            })
        });
        rs.acct.Tree.superclass.constructor.call(this, config);
        Rs.EventBus.register(this, 'tree', ['click']);
    }

});