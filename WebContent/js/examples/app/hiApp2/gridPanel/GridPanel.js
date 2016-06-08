Rs.define('rs.acct.Grid', {

    extend : Ext.grid.GridPanel,

    mixins : [Rs.app.Main],
    
    constructor : function(config) {
        var store = new Rs.ext.data.Store( {
            autoLoad : false,
            autoDestroy : true,
            url : '/rsc/js/examples/app/hiApp2/gridPanel/dataservice.rsc',
            root : 'items',
            sortField : 'acct_code',
            fields : [ 'acct_code', 'acct_type', 'acct_name', 'leaf' ]
        });

        config = Rs.apply(config || {}, {
            stripeRows : true,
            store : store,
            columns : [ {
                header : '����',
                width : 100,
                sortable : true,
                dataIndex : 'acct_code'
            }, {
                header : '����',
                width : 100,
                sortable : true,
                dataIndex : 'acct_type'
            }, {
                header : '��������',
                width : 200,
                sortable : true,
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
            bbar : new Rs.ext.grid.SliderPagingToolbar( {
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });
        rs.acct.Grid.superclass.constructor.call(this, config);
        Rs.EventBus.on('tree-click', this.onTreeClick, this);
    },

    onTreeClick : function(n, e) {
        var a = n ? n.attributes : {}, code = a.code, type = a.type;
        this.getStore().reload( {
            params : {
                code : code,
                type : type
            }
        });
    }

});