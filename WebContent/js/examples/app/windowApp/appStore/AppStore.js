Rs.define('rs.acct.AppStore', {

    extend : Ext.grid.GridPanel,

    mixins : [Rs.app.Main],
    
    constructor : function(config) {
        var myData = [ [ 'acct_tree', '总账科目树', 'acctTree', {
            x : 100,
            y : 50,
            width : 300,
            height : 450
        }, '显示总账科目树' ], [ 'acct_grid', '子科目列表', 'acctGrid', {
            x : 500,
            y : 50,
            width : 600,
            height : 450,
            maximizable : true,
            minimizable : true
        }, '显示某父项科目的所有子项' ] ];

        var store = new Ext.data.SimpleStore( {
            fields : [ {
                name : 'id'
            }, {
                name : 'name'
            }, {
                name : 'folder'
            }, {
                name : 'region'
            }, {
                name : 'desc'
            } ]
        });
        store.loadData(myData);

        config = Rs.apply(config || {}, {
            store : store,
            columns : [ {
                header : "ID",
                width : 100,
                sortable : true,
                dataIndex : 'id',
                hidden : true
            }, {
                header : "名称",
                width : 100,
                sortable : true,
                dataIndex : 'name'
            }, {
                header : "描述",
                width : 200,
                sortable : true,
                dataIndex : 'desc'
            }, {
                header : '安装',
                xtype : 'actioncolumn',
                width : 50,
                items : [ {
                    iconCls : 'app-uninstalled',
                    tooltip : '安装应用程序',
                    scope : this,
                    handler : this.installApp
                } ]
            } ]
        });
        rs.acct.AppStore.superclass.constructor.call(this, config);
    },

    installApp : function(g, r, c) {
        var rec = g.getStore().getAt(r), engine = Rs.getAppEngine();
        engine.install(Rs.applyIf( {}, rec.data), (function(g, r, c) {
            var v = g.getView(), cell = v.getCell(r, c), img = Rs.get(cell)
                    .child('img');
            if (img && img.hasClass('app-uninstalled')) {
                img.removeClass('app-uninstalled');
                img.addClass('app-installed');
            }
        }).createDelegate(this, [ g, r, c ]), this);
    }

});
