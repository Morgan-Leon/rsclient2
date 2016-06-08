Rs.define('rs.exp.OnlyExport', {

    extend: Ext.grid.GridPanel,
    
    mixins: [Rs.app.Main],
    
    constructor: function(config){
    
        var store = new Rs.ext.data.Store({
            autoLoad: true,
            autoDestroy: true,
            //idProperty: 'receive_no',
            url: '/rsc/js/examples/export/onlyexport/dataservice.rsc',
            fields: ['rs_id', 'warehouse_code', 'warehouse_name', 'bill_no', 'bill_date',
			 'active_code', 'active_abv', 'io_flag', 'other_flag', 'om_order',
			  'pm_order', 'shop_order', 'dept_code', 'dept_abv', 'vendor_code',
			   'vendor_abv', 'customer_code', 'customer_abv', 'warehouse_man',
			    'warehouse_man_code', 'warehouse_man_name', 'use_code', 'use_desc',
				 'operator', 'operator_code', 'operator_name', 'operator_dept',
				  'operator_dept_name', 'check_flag', 'check_date', 'check_man',
				   'check_man_name', 'qc_no', 'post_man', 'post_man_name', 'post_date',
				    'record_man', 'record_man_name', 'record_date',
					 'record_time', 'remark', 'company_no', 'voucher_period',
					  'voucher_date', 'voucher_flag', 'voucher_no', 'voucher_on_time',
					   'voucher_type', 'seq_no', 'item_code', 'item_name',
					    'item_abv', 'order_no', 'bin_code', 'location_code',
				 'lot_no', 'qty', 'unit_code', 'unit_name', 'assist_unit',
				  'assist_unit_name', 'assist_qty', 'price', 'amt',
				   'inv_qty', 'value_flag', 'audit_flag', 'father_code',
			    'father_item_name', 'father_item_abv', 'father_order_no',
				 'item_sequence', 'gld_item_type', 'other_bill_no',
				  'inv_price', 'actual_price', 'actual_amt', 'invoice_date',
				   'invoice_price', 'invoice_amt', 'added_qty', 'added_amt',
				    'update_stock_flag', 'seq_desc', 'invoice_qty', 'invoice_no',
					 'added_inv_amt', 'cancel_flag', 'cancel_bill_no', 'op_no',
					  'work_no', 'remark_head', 'ma_read_flag', 'use_stamp',
					   'ap_ar_read_flag', 'suspense_price_flag', 'company_code',
					    'plan_date', 'times', 'line_code', 'line_name', 'position_code',
						 'position_name', 'pc', 'coop_flag', 'other_bill_no_ag',
						  'other_bill_line_no_ag', 'read_flag', 'flush_flag',
						   'ma_out_diff', 'cancel_bill_date', 'old_bill_no', 'old_seq_no', 'other_bill_seq_no']
        });
        
        
        var sm = new Ext.grid.CheckboxSelectionModel({});
        config = Rs.apply(config ||
        {}, {
            store: store,
            //columnLines:true,
            sm: sm,
            colModel : new Ext.grid.ColumnModel([sm, {
                xtype: 'actioncolumn',
                header: '����',
                width: 50,
                align: 'center',
                items: [{
                    iconCls: 'rs-action-modify',
                    handler: this.openModifyPanel,
                    scope: this
                }]
            }, {
			    dataIndex : 'rs_id' ,
			    header : '�ֶ�rs_id' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
				editor : true
			},
			{
			    dataIndex : 'warehouse_code' ,
			    header : '�ֶ�warehouse_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'warehouse_name' ,
			    header : '�ֶ�warehouse_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'bill_no' ,
			    header : '�ֶ�bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'bill_date' ,
			    header : '�ֶ�bill_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'active_code' ,
			    header : '�ֶ�active_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'active_abv' ,
			    header : '�ֶ�active_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'io_flag' ,
			    header : '�ֶ�io_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_flag' ,
			    header : '�ֶ�other_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'om_order' ,
			    header : '�ֶ�om_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'pm_order' ,
			    header : '�ֶ�pm_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'shop_order' ,
			    header : '�ֶ�shop_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'dept_code' ,
			    header : '�ֶ�dept_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'dept_abv' ,
			    header : '�ֶ�dept_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'vendor_code' ,
			    header : '�ֶ�vendor_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'vendor_abv' ,
			    header : '�ֶ�vendor_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'customer_code' ,
			    header : '�ֶ�customer_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'customer_abv' ,
			    header : '�ֶ�customer_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man' ,
			    header : '�ֶ�warehouse_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man_code' ,
			    header : '�ֶ�warehouse_man_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man_name' ,
			    header : '�ֶ�warehouse_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_code' ,
			    header : '�ֶ�use_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_desc' ,
			    header : '�ֶ�use_desc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator' ,
			    header : '�ֶ�operator' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_code' ,
			    header : '�ֶ�operator_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_name' ,
			    header : '�ֶ�operator_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_dept' ,
			    header : '�ֶ�operator_dept' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_dept_name' ,
			    header : '�ֶ�operator_dept_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_flag' ,
			    header : '�ֶ�check_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_date' ,
			    header : '�ֶ�check_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_man' ,
			    header : '�ֶ�check_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_man_name' ,
			    header : '�ֶ�check_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'qc_no' ,
			    header : '�ֶ�qc_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_man' ,
			    header : '�ֶ�post_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_man_name' ,
			    header : '�ֶ�post_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_date' ,
			    header : '�ֶ�post_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_man' ,
			    header : '�ֶ�record_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_man_name' ,
			    header : '�ֶ�record_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_date' ,
			    header : '�ֶ�record_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_time' ,
			    header : '�ֶ�record_time' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'remark' ,
			    header : '�ֶ�remark' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'company_no' ,
			    header : '�ֶ�company_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_period' ,
			    header : '�ֶ�voucher_period' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_date' ,
			    header : '�ֶ�voucher_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_flag' ,
			    header : '�ֶ�voucher_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_no' ,
			    header : '�ֶ�voucher_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_on_time' ,
			    header : '�ֶ�voucher_on_time' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_type' ,
			    header : '�ֶ�voucher_type' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'seq_no' ,
			    header : '�ֶ�seq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_code' ,
			    header : '�ֶ�item_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_name' ,
			    header : '�ֶ�item_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_abv' ,
			    header : '�ֶ�item_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'order_no' ,
			    header : '�ֶ�order_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'bin_code' ,
			    header : '�ֶ�bin_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'location_code' ,
			    header : '�ֶ�location_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'lot_no' ,
			    header : '�ֶ�lot_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'qty' ,
			    header : '�ֶ�qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'unit_code' ,
			    header : '�ֶ�unit_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'unit_name' ,
			    header : '�ֶ�unit_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_unit' ,
			    header : '�ֶ�assist_unit' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_unit_name' ,
			    header : '�ֶ�assist_unit_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_qty' ,
			    header : '�ֶ�assist_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'price' ,
			    header : '�ֶ�price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'amt' ,
			    header : '�ֶ�amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'inv_qty' ,
			    header : '�ֶ�inv_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'value_flag' ,
			    header : '�ֶ�value_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'audit_flag' ,
			    header : '�ֶ�audit_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_code' ,
			    header : '�ֶ�father_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_item_name' ,
			    header : '�ֶ�father_item_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_item_abv' ,
			    header : '�ֶ�father_item_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_order_no' ,
			    header : '�ֶ�father_order_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_sequence' ,
			    header : '�ֶ�item_sequence' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'gld_item_type' ,
			    header : '�ֶ�gld_item_type' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_no' ,
			    header : '�ֶ�other_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'inv_price' ,
			    header : '�ֶ�inv_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'actual_price' ,
			    header : '�ֶ�actual_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'actual_amt' ,
			    header : '�ֶ�actual_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_date' ,
			    header : '�ֶ�invoice_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_price' ,
			    header : '�ֶ�invoice_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_amt' ,
			    header : '�ֶ�invoice_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_qty' ,
			    header : '�ֶ�added_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_amt' ,
			    header : '�ֶ�added_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'update_stock_flag' ,
			    header : '�ֶ�update_stock_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'seq_desc' ,
			    header : '�ֶ�seq_desc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_qty' ,
			    header : '�ֶ�invoice_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_no' ,
			    header : '�ֶ�invoice_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_inv_amt' ,
			    header : '�ֶ�added_inv_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_flag' ,
			    header : '�ֶ�cancel_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_bill_no' ,
			    header : '�ֶ�cancel_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'op_no' ,
			    header : '�ֶ�op_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'work_no' ,
			    header : '�ֶ�work_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'remark_head' ,
			    header : '�ֶ�remark_head' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ma_read_flag' ,
			    header : '�ֶ�ma_read_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_stamp' ,
			    header : '�ֶ�use_stamp' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ap_ar_read_flag' ,
			    header : '�ֶ�ap_ar_read_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'suspense_price_flag' ,
			    header : '�ֶ�suspense_price_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'company_code' ,
			    header : '�ֶ�company_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'plan_date' ,
			    header : '�ֶ�plan_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'times' ,
			    header : '�ֶ�times' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'line_code' ,
			    header : '�ֶ�line_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'line_name' ,
			    header : '�ֶ�line_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'position_code' ,
			    header : '�ֶ�position_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'position_name' ,
			    header : '�ֶ�position_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'pc' ,
			    header : '�ֶ�pc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'coop_flag' ,
			    header : '�ֶ�coop_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_no_ag' ,
			    header : '�ֶ�other_bill_no_ag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_line_no_ag' ,
			    header : '�ֶ�other_bill_line_no_ag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'read_flag' ,
			    header : '�ֶ�read_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'flush_flag' ,
			    header : '�ֶ�flush_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ma_out_diff' ,
			    header : '�ֶ�ma_out_diff' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_bill_date' ,
			    header : '�ֶ�cancel_bill_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'old_bill_no' ,
			    header : '�ֶ�old_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'old_seq_no' ,
			    header : '�ֶ�old_seq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_seq_no' ,
			    header : '�ֶ�other_bill_seq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			}]),
            
            tbar: [new Rs.ext.grid.ExportButton({
                grid: this,
                filename: "�ļ�" ,
				paging : false
            })],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 30,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '��{2}��'
            }),
            plugins : [new Rs.ext.grid.EditorGridViewPlugin()]
            //viewConfig : {forceFit : true}
        });
        rs.exp.OnlyExport.superclass.constructor.call(this, config);
    }
});
