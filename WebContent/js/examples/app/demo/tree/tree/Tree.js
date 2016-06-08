Rs.define('rs.demo.tree.Tree', {
    extend : Ext.tree.TreePanel, 
    mixins : [Rs.app.Main], 
    constructor : function(config){
        config = Rs.apply(config || {}, {
            useArrows : true,
            autoScroll : true,
            containerScroll : true,
            rootVisible : false,
            root : {
                nodeType : 'async',
                code : 'root',
                type : 'root'
            },
            loader : new Rs.ext.tree.TreeLoader( {
                dataUrl : '/rsc/js/examples/app/demo/tree/tree/dataservice.rsc',
                method : 'getSubAccounts',
                nodeAttrsParams : [ "code", "type" ]
            })
        });
        
        if(config.queryEnable === true){
            var plugin = Rs.create('rs.demo.tree.SearchPlugin');
            Rs.apply(config, {
                frame : false,
                plugins : plugin,
                tbar : plugin.getToolbar()
            });
            delete config.queryEnable;
        }
        rs.demo.tree.Tree.superclass.constructor.call(this, config);
        Rs.EventBus.register(this, 'tree', ['click', 'query']);
    }
    
});