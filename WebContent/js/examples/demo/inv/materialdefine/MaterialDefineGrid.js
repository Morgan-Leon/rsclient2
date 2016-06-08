Rs.define('rs.inv.MaterialDefineGrid', {

    extend: Ext.grid.GridPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var store = new Rs.ext.data.Store({

            autoLoad: true,

            autoDestroy: true,

            url: '../materialdefine/MaterialDefineGridDataService.rsc',

            idProperty: 'item_code',

            fields: ['company_code', 'org_id', 'item_code', 'item_name', 'item_abv', 'item_norm',
            'item_model', 'gb_code', 'drawing_no', 'refer_code', 'memory_code',
            'normal_class', 'group_code', 'feature_code', 'om_class', 'inv_class',
            'pm_class', 'qc_class', 'gl_class', 'sv_class', 'tool_class', 'pm_flag',
            'om_flag', 'inv_flag', 'qc_flag', 'special_class', 'em_no', 'warehouse_code',
            'bin_code', 'location_code', 'lot_flag', 'stock_unit', 'bi_unit_flag',
            'second_unit', 'assist_unit', 'pm_unit', 'om_unit', 'pm_stock_rate',
            'om_stock_rate', 'stock2_rate', 'unique_flag', 'safety_stock', 'max_stock',
            'min_stock', 'tolerance', 'price_sys', 'abc_class', 'stock_days', 'on_hand_qty',
            'on_hand_amt', 'norm_price', 'allocation_qty', 'inspection_qty', 'scrap_qty',
            'cycle_count', 'cost_flag', 'plan_price', 'standard_cost', 'actual_cost',
            'tax_code', 'tax_desc', 'tax_rate', 'net_weight', 'net_unit', 'gross_weight',
            'gross_unit', 'var_code', 'byproduct_flag', 'acct_no', 'acct_no1', 'acct_material',
            'acct_pur', 'acct_var', 'acct_income', 'mrp_flag', 'lot_policy', 'lot_qty',
            'round_times', 'dept_code', 'scrap_rate', 'product_flag', 'phantom_flag',
            'item_list_flag', 'mp_flag', 'mps_flag', 'planner_code', 'lot_merge_flag',
            'pseudo_flag', 'lead_time_flag', 'lead_time', 'lead_days', 'norm_batch',
            'plan_constant', 'lot_days', 'order_point', 'order_qty', 'onhand_flag',
            'stock_ok_qty', 'low_level_code', 'pac_flag', 'routing_no', 'routing_flag',
            'coop_flag', 'limit_flag', 'key_part_flag', 'bom_flag', 'material_flag',
            'create_flag', 'input_date', 'input_id', 'input_man', 'input_name',
            'new_flag', 'valid_flag', 'material_man', 'key_class', 'item_volume',
            'volume_unit', 'item_square', 'square_unit', 'set_flag', 'kb_flag', 'rs_char1',
            'rs_char2', 'rs_char3', 'rs_int1', 'rs_int2', 'rs_int3', 'rs_float1',
            'rs_float2', 'rs_float3', 'csm_flag', 'qc_trace_type', 'gl_mp_flag',
            'straight_send_flag', 'jit_unstock_qty', 'pick_round_times', 'grp_pm_flag',
            'self_pm_flag', 'admeasure_flag', 'dispense_flag', 'update_flag',
            'repair_flag', 'repair_period', 'new_old_flag', 'repair_op_flag',
            'new_rate', 'lead_time_check', 'repair_list_code', 'life_period',
            'unit_weight', 'unit_weight_unit', 'pdm_material_flag', 'check_dept_code',
            'parent_abv', 'note1', 'coop_db_flag', 'pac_trace_flag', 'customer_search_flag',
            'bs_flag', 'fap_resource', 'op_diff_flag', 'lot_merge_mp', 'inspection_qty_sum']
        });

        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({});

        config = Rs.apply(config || {},
        {

            store: store,

            sm: sm,

            colModel: new Rs.ext.grid.LockingColumnModel([new Ext.grid.RowNumberer() , sm , {
                xtype: 'actioncolumn',
                header: '操作',
                width: 50,
                align: 'center',
                items: [{
                    iconCls: 'rs-action-modify',
                    handler: this.openDetailPanel,
                    scope: this
                }]
            },
            {
                dataIndex: 'item_code',
                header: '物料编码',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'item_name',
                header: '物料名称',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'item_abv',
                header: '物料简称',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'item_norm',
                header: '规格',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'item_model',
                header: '型号',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'gb_code',
                header: '国标',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'drawing_no',
                header: '图号',
                align: 'left',
                width: 160,
                sortable: true
            },
            {
                dataIndex: 'memory_code',
                header: '助记码',
                align: 'left',
                width: 160,
                sortable: true
            }]),
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,
                //初始化显示的条数
                hasSlider: true,
                store: store,
                displayInfo: true
            })
        });
        rs.inv.MaterialDefineGrid.superclass.constructor.call(this, config);
        
		//注册打开卡片面板的事件
        Rs.EventBus.register(this, 'meterialgrid', ['detail']);
    },
    
	/** 
     * @method doDeleteRecord 删除记录
     */ 
    doDeleteRecord: function() {
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
    },

    /** 
     * @method openDetailPanel 打开卡片面板
     * @param {Ext.grid.EditorGridPanel} grid 表格Grid
     * @param {string} rowIndex 选中行的行号
     * @param {string} colIndex 选中行的列号
     */
    openDetailPanel: function(grid, rowIndex, colIndex) {
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 820;
        var height = 500;
        engine.install([{
            folder: '../materialmaintenance',
            region: {
                rid: 'border',
                x: cpos[0] + (csize.width - width) / 2,
                y: cpos[1] + (csize.height - height) / 2 - height/4,
                width: width,
                height: height,
				draggable : true ,//禁止拖拽
                resizable: false,//禁止改变大小
                maximizable: false,
                minimizable: true,
                hidden: true,
                modal: false//模态
            }
        }],
        function(succ, app) {
            if (succ && app) {
                app.open();
                var params = {
                    app: app,
                    rowIndex: rowIndex,
                    grid: grid
                };
                this.fireEvent('detail', params);
            }
        },
        this);
    }
});