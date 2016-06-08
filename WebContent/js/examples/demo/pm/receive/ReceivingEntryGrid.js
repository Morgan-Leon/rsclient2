/**
 * @class rs.pm.ReceivingEntryGrid
 * @namespace rs.pm
 * @extend Ext.grid.EditorGridPanel
 * @auth coldIce
 * @constructor
 */
Rs.define('rs.pm.ReceivingEntryGrid', {

    extend: Ext.grid.GridPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
		
        var store = new Rs.ext.data.Store({
            autoLoad: true,
            autoDestroy: true,
            url: '/rsc/js/examples/demo/pm/receive/ReceivingEntryDataService.rsc',
            idProperty: 'receive_no',
            fields: ['receive_no', 'type_desc', 'special_class', 'return_flag',
			   'receive_date', 'vendor_abv', 'deliver_abv',
			   'invoice_flag', 'buyer_name', 'receive_amt', 'buyer_id',
			   'vendor_code', 'group_id', 'group_name' , 'deliver_code' , 'bill_type'] ,
		    sortInfo : {
                field: 'receive_no',
                direction: 'ASC'
            }
        });

        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({});

        //采购分类编辑器
        this.specialClassEditor = new Ext.form.ComboBox({
            mode: 'remote',
            triggerAction: 'all',
            store: new Rs.ext.data.Store({
                url: '/rsc/js/examples/demo/pm/receive/pmclassservice.rsc',
                autoLoad: true,
                fields: ['special_class', 'special_name']
            }),
            valueField: 'special_class',
            displayField: 'special_name'
        });

        //采购分类渲染器
        this.specialClassRenderer = {
            fn: function(value) {
                var store = this.specialClassEditor.store ,
				    valueField = this.specialClassEditor.valueField,
					displayField = this.specialClassEditor.displayField;
				
                var idx = store.find(valueField, value);
                var rec = store.getAt(idx);
                return (rec == null ? value: rec.get(displayField));
            },
            scope: this
        };
		
        columnModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
            xtype: 'actioncolumn',
            header: '操作',
            width: 70,
            align: 'center',
            items: [{
                iconCls: 'rs-action-modify',
                handler: this.openDetailPanel,
                scope: this
            }]
        },
        {
            dataIndex: 'receive_no',
            header: '接收单号',
            align: 'left',
            width: 160,
            sortable: true,
            summaryType: 'count'

        },
        {
            dataIndex: 'vendor_abv',
            header: '供应商简称',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'receive_date',
            header: '接收日期',
            align: 'center',
            width: 160
        },
        {
            dataIndex: 'type_desc',
            header: '交易类型',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'special_class',
            header: '采购分类',
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.specialClassEditor,
            renderer: this.specialClassRenderer
        },
        {
            dataIndex: 'return_flag',
            header: '退货标记',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if ('Y' == v) {
                    return "<font color='red'>是</font>";
                } else if ('N' == v) {
                    return "<font color='green'>否</font>";
                }
            }
        },
        {
            dataIndex: 'deliver_abv',
            header: '送货单位简称',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'receive_amt',
            header: '接收总金额',
            align: 'right',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if (v < 0) {
                    return "<font color='red'>" + v + "</font>";
                } else {
                    return "<font color='green'>" + v + "</font>";
                }
            },
            summaryType: 'sum'
        },
        {
            dataIndex: 'invoice_flag',
            header: '发票标记',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if ('Y' == v) {
                    return "<font color='red'>是</font>";
                } else if ('N' == v) {
                    return "<font color='green'>否</font>";
                }
            }
        },
        {
            dataIndex: 'buyer_name',
            header: '采购员',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if (v == 'undefined') {
                    return '';
                } else {
                    return v;
                }
            }
        },
        {
            dataIndex: 'group_name',
            header: '采购小组',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if (v == 'undefined') {
                    return '';
                } else {
                    return v;
                }
            }
        }]);
        config = Rs.apply(config || {},
        {
            title: '接收单录入',
            store: store,
            clicksToEdit: 1,
            sm: sm,
            colModel: columnModel,
            plugins:[new Rs.ext.grid.HybridGridSummary()],
            tbar: [{
                text: '查询面板',
                iconCls: 'rs-action-querypanel',
                scope: this,
                handler: this.openQueryPanel
            },
            {
                text: '新增面板',
                iconCls: 'rs-action-create',
                handler: this.openDetailPanel,
                scope: this
            },
            {
                text: '删除',
                iconCls: 'rs-action-remove',
                scope: this,
                handler: this.deleteRecord
            },
            new Rs.ext.grid.ExportButton({
                grid: this,
                filename: "文件",
                paging: true
            }), '->', {
                text: '帮助',
                iconCls: 'rs-action-help'
            }],

            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,
                //初始化显示的条数
                hasSlider: true,
                //是否显示修改显示条数的滚动条
                store: store,
                displayInfo: true //是否显示总记录数
            })
        });

        rs.pm.ReceivingEntryGrid.superclass.constructor.call(this, config);

        Rs.EventBus.register(this, 'meterialgrid', ['detail']);

        Rs.EventBus.on('documenthead-addheadsuccess', this.doReload, this);

        Rs.EventBus.on('querypanel-query', this.doQuery, this);
    },

    /**
     * @method openQueryPanel 
     * 打开查询面板
     */
    openQueryPanel: function() {
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 530;
        var height = 200;
        engine.install({
            folder: '../receive/querypanel',
            region: {
                x: cpos[0] + (csize.width - width) / 2,
                y: cpos[1] + (csize.height - height) / 2,
                width: width,
                height: height,
                maximizable: false,
                minimizable: false,
                resizable: true,
                hidden: true
            }
        },
        function(succ, app) {
            if (succ && app) {
                app.open();
            }
        },
        this);
    },

    /**
     * @method openDetailPanel 打开详细面板,可以维护新增,或者更新
     * @param {} grid 当前的面板
     * @param {} rowIndex   点击的行号
     * @param {} colIndex   点击的列号
     */
    openDetailPanel: function(grid, rowIndex, colIndex) {
        var record = this.store.getAt(rowIndex);
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 820;
        var height = 650;
        engine.install([{
            folder: '../receive/updatepanel',
            region: {
                rid: 'border',
                x: cpos[0] + (csize.width - width) / 2,
                y: cpos[1] + (csize.height - height) / 2,
                width: width,
                height: height,
                maximizable: false,
                minimizable: true,
                resizable: true,
                hidden: true,
                modal: true //模态
            }
        }],
        function(succ, app) {
            if (succ && app) {
                app.open();
                var params = {
                    app: app,
                    rowIndex: rowIndex,
                    record: record
                };
                this.fireEvent('detail', params);
            }
        },
        this);
    },

    /**
     * @method doReload 
     * 重新加载数据
     */
    doReload: function() {
        this.store.reload();
    },

    /**
     * @method doQuery
     * 在查询面板点击查询后,通过注册和监听 querypanel-query 事件,触发的操作
     * @param {} querypanel 查询面板
     * @param {} params 查询条件
     */
    doQuery: function(querypanel, params) {
        this.store.reload({
            params: params
        })
    },

    /**
     * @method deleteRecord
     * 删除数据
     */
    deleteRecord: function() {
        var selects = this.getSelectionModel().getSelections();
        if (!selects || selects.length < 1) {
            Ext.Msg.alert("提示", "请选择要删除的数据行");
            return;
        }
        Ext.Msg.show({
            title: '提示',
            msg: "确定要删除选中的记录吗?",
            buttons: Ext.Msg.OKCANCEL,
            fn: function(b) {
                if (b == 'cancel') {
                    return;
                }
                this.store.remove(selects);
                this.store.save();
                this.store.on('save',
                function(store, batch, data) {
                    store.reload();
                },
                this);
            },
            scope: this,
            icon: Ext.MessageBox.QUESTION
        });
    }
});