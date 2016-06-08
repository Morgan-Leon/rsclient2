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
                header : '����',
                width : 100,
                sortable : true,
                dataIndex : 'acct_code'
            }, {
                header : '����',
                width : 100,
                sortable : false,
                dataIndex : 'acct_type'
            }, {
                header : '��������',
                width : 200,
                sortable : false,
                dataIndex : 'acct_name'
            }, {
                header : 'Ҷ�ӽڵ�',
                width : 100,
                sortable : false,
                dataIndex : 'leaf',
                renderer : function(v) {
                    return v == true ? '��' : '��';
                }
            } ],

            tbar : [ {
                text : '����',
                iconCls : 'rs-action-create',
                tooltip : '�򿪴����ӿ�Ŀ���',
                scope : this,
                handler : this.openCreateAcctPanel
            }, {
                text : '����',
                iconCls : 'rs-action-save',
                tooltip : '����',
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
            Ext.Msg.alert('��ʾ', '���Ȱ�װ���˿�Ŀ������ѡ��<br/>һ����Ŀ���ٽ�������������');
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
