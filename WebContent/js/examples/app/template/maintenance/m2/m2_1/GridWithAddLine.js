Rs.define('rs.app.template.maintenance.GridWithAddLine', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
    
        var myData = [
                  ['3m Co',71.72,0.02],
                  ['Alcoa Inc',29.01,0.42],
                  ['Altria Group Inc',83.81,0.28],
                  ['American Express Company',52.55,0.01],
                  ['American International Group, Inc.',64.13,0.31],
                  ['AT&T Inc.',31.61,-0.48],
                  ['Boeing Co.',75.43,0.53],
                  ['Caterpillar Inc.',67.27,0.92],
                  ['Citigroup, Inc.',49.37,0.02],
                  ['E.I. du Pont de Nemours and Company',40.48,0.51],
                  ['Exxon Mobil Corp',68.1,-0.43]
                ];

        var store = new Ext.data.SimpleStore({
          fields: [
            {name: 'company'},
            {name: 'price', type: 'float'},
            {name: 'change', type: 'float'}
          ]
        });
        store.loadData(myData);
        
        /*var store = new Rs.ext.data.Store( {
            autoLoad : false,
            autoDestroy : true,
            url : '/rsc/js/examples/app/template/maintenance/m2/dataservice.rsc',
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
                dataIndex : 'acct_code',
                editor : new Ext.form.TextField({})
            }, {
                header : '类型',
                width : 100,
                sortable : false,
                dataIndex : 'acct_type',
                editor : new Ext.form.TextField({})
            }, {
                header : '物料名称',
                width : 200,
                sortable : false,
                dataIndex : 'acct_name',
                editor : new Ext.form.TextField({})
            }, {
                header : '叶子节点',
                width : 100,
                sortable : false,
                dataIndex : 'leaf',
                renderer : function(v) {
                    return v === true ? '是' : (v === false ?'否':'');
                },
                editor : new Ext.form.TextField({})
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
        });*/
        
        config = Rs.apply(config || {}, {
            store : store,
            columns : [ new Ext.grid.RowNumberer(),
                        {id:'company',header: "Company", width: 160, sortable: true, dataIndex: 'company', editor : new Ext.form.TextField({})},
                        {header: "Price", width: 75, sortable: true, dataIndex: 'price',editor: new Ext.form.NumberField({allowDecimals: true})},
                        {header: "Change", width: 100, sortable: true, dataIndex: 'change',editor: new Ext.form.NumberField({allowDecimals: true})}
                      ],

            tbar : [ {
                text : '新增',
                iconCls : 'rs-action-create',
                scope : this,
                handler : this.openCreateAcctPanel
            }, {
                text : '保存',
                iconCls : 'rs-action-save',
                tooltip : '保存',
                scope : this,
                handler : this.save
            } ],
            
            viewConfig : {forceFit : true}
        });
        

        rs.app.template.maintenance.GridWithAddLine.superclass.constructor.call(this, config);


    },

    openCreateAcctPanel : function() {
        this.store.insert(this.store.getCount(), new this.store.recordType({}));
    },

    save : function() {
        alert('save');
    }

});
