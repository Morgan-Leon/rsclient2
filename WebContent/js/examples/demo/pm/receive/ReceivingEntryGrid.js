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

        //�ɹ�����༭��
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

        //�ɹ�������Ⱦ��
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
            header: '����',
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
            header: '���յ���',
            align: 'left',
            width: 160,
            sortable: true,
            summaryType: 'count'

        },
        {
            dataIndex: 'vendor_abv',
            header: '��Ӧ�̼��',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'receive_date',
            header: '��������',
            align: 'center',
            width: 160
        },
        {
            dataIndex: 'type_desc',
            header: '��������',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'special_class',
            header: '�ɹ�����',
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.specialClassEditor,
            renderer: this.specialClassRenderer
        },
        {
            dataIndex: 'return_flag',
            header: '�˻����',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if ('Y' == v) {
                    return "<font color='red'>��</font>";
                } else if ('N' == v) {
                    return "<font color='green'>��</font>";
                }
            }
        },
        {
            dataIndex: 'deliver_abv',
            header: '�ͻ���λ���',
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'receive_amt',
            header: '�����ܽ��',
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
            header: '��Ʊ���',
            align: 'left',
            width: 160,
            sortable: true,
            renderer: function(v) {
                if ('Y' == v) {
                    return "<font color='red'>��</font>";
                } else if ('N' == v) {
                    return "<font color='green'>��</font>";
                }
            }
        },
        {
            dataIndex: 'buyer_name',
            header: '�ɹ�Ա',
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
            header: '�ɹ�С��',
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
            title: '���յ�¼��',
            store: store,
            clicksToEdit: 1,
            sm: sm,
            colModel: columnModel,
            plugins:[new Rs.ext.grid.HybridGridSummary()],
            tbar: [{
                text: '��ѯ���',
                iconCls: 'rs-action-querypanel',
                scope: this,
                handler: this.openQueryPanel
            },
            {
                text: '�������',
                iconCls: 'rs-action-create',
                handler: this.openDetailPanel,
                scope: this
            },
            {
                text: 'ɾ��',
                iconCls: 'rs-action-remove',
                scope: this,
                handler: this.deleteRecord
            },
            new Rs.ext.grid.ExportButton({
                grid: this,
                filename: "�ļ�",
                paging: true
            }), '->', {
                text: '����',
                iconCls: 'rs-action-help'
            }],

            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,
                //��ʼ����ʾ������
                hasSlider: true,
                //�Ƿ���ʾ�޸���ʾ�����Ĺ�����
                store: store,
                displayInfo: true //�Ƿ���ʾ�ܼ�¼��
            })
        });

        rs.pm.ReceivingEntryGrid.superclass.constructor.call(this, config);

        Rs.EventBus.register(this, 'meterialgrid', ['detail']);

        Rs.EventBus.on('documenthead-addheadsuccess', this.doReload, this);

        Rs.EventBus.on('querypanel-query', this.doQuery, this);
    },

    /**
     * @method openQueryPanel 
     * �򿪲�ѯ���
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
     * @method openDetailPanel ����ϸ���,����ά������,���߸���
     * @param {} grid ��ǰ�����
     * @param {} rowIndex   ������к�
     * @param {} colIndex   ������к�
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
                modal: true //ģ̬
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
     * ���¼�������
     */
    doReload: function() {
        this.store.reload();
    },

    /**
     * @method doQuery
     * �ڲ�ѯ�������ѯ��,ͨ��ע��ͼ��� querypanel-query �¼�,�����Ĳ���
     * @param {} querypanel ��ѯ���
     * @param {} params ��ѯ����
     */
    doQuery: function(querypanel, params) {
        this.store.reload({
            params: params
        })
    },

    /**
     * @method deleteRecord
     * ɾ������
     */
    deleteRecord: function() {
        var selects = this.getSelectionModel().getSelections();
        if (!selects || selects.length < 1) {
            Ext.Msg.alert("��ʾ", "��ѡ��Ҫɾ����������");
            return;
        }
        Ext.Msg.show({
            title: '��ʾ',
            msg: "ȷ��Ҫɾ��ѡ�еļ�¼��?",
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