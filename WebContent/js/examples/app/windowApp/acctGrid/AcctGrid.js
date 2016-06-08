Rs.define('rs.acct.Grid', {

    extend : Ext.grid.GridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
        var store = new Rs.ext.data.Store( {
            autoLoad : false,
            autoDestroy : true,
            url : '/rsc/js/examples/app/windowApp/acctGrid/dataservice.rsc',
            root : 'items',
            sortField : 'acct_code',
            fields : [ 'acct_code', 'acct_type', 'acct_name', 'leaf' ]
        });

        config = Rs.apply(config || {}, {
            store : store,
            columns : [ {
                header : '编码',
                width : 100,
                sortable : true,
                dataIndex : 'acct_code'
            }, {
                header : '类型',
                width : 100,
                sortable : false,
                dataIndex : 'acct_type'
            }, {
                header : '物料名称',
                width : 200,
                sortable : false,
                dataIndex : 'acct_name'
            }, {
                header : '叶子节点',
                width : 100,
                sortable : false,
                dataIndex : 'leaf',
                renderer : function(v) {
                    return v == true ? '是' : '否';
                }
            } ],

            tbar : [ {
                text : '新增',
                iconCls : 'rs-action-create',
                tooltip : '打开创建子科目面板',
                scope : this,
                handler : this.openCreateAcctPanel
            }, {
                text : '保存',
                iconCls : 'rs-action-save',
                tooltip : '保存',
                scope : this,
                handler : this.save
            } ],

            bbar : new Rs.ext.grid.SliderPagingToolbar( {
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });

        rs.acct.Grid.superclass.constructor.call(this, config);

        Rs.EventBus.on('tree-click', this.onTreeClick, this);

        Rs.EventBus.on('acct-save', function() {
            this.getStore().reload();
        }, this);

    },

    onTreeClick : function(n, e) {
        var a = n ? n.attributes : {}, code = a.code, type = a.type;
        this.panentAcct = a;
        this.getStore().reload( {
            params : {
                code : code,
                type : type
            }
        });
    },

    openCreateAcctPanel : function() {
        if (this.panentAcct == undefined) {
            Ext.Msg.alert('提示', '请先安装总账科目树程序并选择<br/>一个科目，再进行新增操作。');
        } else {
            var engine = Rs.getAppEngine();
            engine.install( {
                folder : 'acctCreate',
                region : {
                    x : 550,
                    y : 50,
                    width : 330,
                    height : 200,
                    maximizable : false,
                    minimizable : false,
                    resizable : false,
                    hidden : true
                }
            }, function(succ, app) {
                if (succ && app) {
                    app.open();
                }
            }, this);
        }
    },

    save : function() {
        alert('save');
    }

});
