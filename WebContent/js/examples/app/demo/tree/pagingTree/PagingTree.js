Rs.define('rs.demo.tree.PagingTree', {
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
            loader : new Rs.ext.tree.PagingTreeLoader( {
                dataUrl : '/rsc/js/examples/app/demo/tree/pagingTree/dataservice.rsc',
                method : 'getSubAccountsPaging',
                nodeAttrsParams : [ "code", "type" ],
                pageSize : 20
            })
        });
        if(config.queryEnable === true){
            var plugin = Rs.create('rs.demo.tree.PagingSearchPlugin');
            Rs.apply(config, {
                frame : false,
                plugins : plugin,
                tbar : plugin.getToolbar()
            });
        }
        rs.demo.tree.PagingTree.superclass.constructor.call(this, config);
        Rs.EventBus.register(this, 'tree', ['click', 'query']);
    }
});