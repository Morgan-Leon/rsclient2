Rs.define('rs.acct.AppStore', {

    extend : Ext.grid.GridPanel,

    mixins : [Rs.app.Main],
    
    constructor : function(config) {
        var myData = [ [ 'acct_tree', '���˿�Ŀ��', 'acctTree', {
            x : 100,
            y : 50,
            width : 300,
            height : 450
        }, '��ʾ���˿�Ŀ��' ], [ 'acct_grid', '�ӿ�Ŀ�б�', 'acctGrid', {
            x : 500,
            y : 50,
            width : 600,
            height : 450,
            maximizable : true,
            minimizable : true
        }, '��ʾĳ�����Ŀ����������' ] ];

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
                header : "����",
                width : 100,
                sortable : true,
                dataIndex : 'name'
            }, {
                header : "����",
                width : 200,
                sortable : true,
                dataIndex : 'desc'
            }, {
                header : '��װ',
                xtype : 'actioncolumn',
                width : 50,
                items : [ {
                    iconCls : 'app-uninstalled',
                    tooltip : '��װӦ�ó���',
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
