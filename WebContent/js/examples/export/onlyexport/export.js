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
                header: '²Ù×÷',
                width: 50,
                align: 'center',
                items: [{
                    iconCls: 'rs-action-modify',
                    handler: this.openModifyPanel,
                    scope: this
                }]
            }, {
			    dataIndex : 'rs_id' ,
			    header : '×Ö¶Îrs_id' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
				editor : true
			},
			{
			    dataIndex : 'warehouse_code' ,
			    header : '×Ö¶Îwarehouse_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'warehouse_name' ,
			    header : '×Ö¶Îwarehouse_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'bill_no' ,
			    header : '×Ö¶Îbill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true ,
                editor : true
			},
			{
			    dataIndex : 'bill_date' ,
			    header : '×Ö¶Îbill_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'active_code' ,
			    header : '×Ö¶Îactive_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'active_abv' ,
			    header : '×Ö¶Îactive_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'io_flag' ,
			    header : '×Ö¶Îio_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_flag' ,
			    header : '×Ö¶Îother_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'om_order' ,
			    header : '×Ö¶Îom_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'pm_order' ,
			    header : '×Ö¶Îpm_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'shop_order' ,
			    header : '×Ö¶Îshop_order' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'dept_code' ,
			    header : '×Ö¶Îdept_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'dept_abv' ,
			    header : '×Ö¶Îdept_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'vendor_code' ,
			    header : '×Ö¶Îvendor_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'vendor_abv' ,
			    header : '×Ö¶Îvendor_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'customer_code' ,
			    header : '×Ö¶Îcustomer_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'customer_abv' ,
			    header : '×Ö¶Îcustomer_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man' ,
			    header : '×Ö¶Îwarehouse_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man_code' ,
			    header : '×Ö¶Îwarehouse_man_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'warehouse_man_name' ,
			    header : '×Ö¶Îwarehouse_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_code' ,
			    header : '×Ö¶Îuse_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_desc' ,
			    header : '×Ö¶Îuse_desc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator' ,
			    header : '×Ö¶Îoperator' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_code' ,
			    header : '×Ö¶Îoperator_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_name' ,
			    header : '×Ö¶Îoperator_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_dept' ,
			    header : '×Ö¶Îoperator_dept' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'operator_dept_name' ,
			    header : '×Ö¶Îoperator_dept_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_flag' ,
			    header : '×Ö¶Îcheck_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_date' ,
			    header : '×Ö¶Îcheck_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_man' ,
			    header : '×Ö¶Îcheck_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'check_man_name' ,
			    header : '×Ö¶Îcheck_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'qc_no' ,
			    header : '×Ö¶Îqc_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_man' ,
			    header : '×Ö¶Îpost_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_man_name' ,
			    header : '×Ö¶Îpost_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'post_date' ,
			    header : '×Ö¶Îpost_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_man' ,
			    header : '×Ö¶Îrecord_man' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_man_name' ,
			    header : '×Ö¶Îrecord_man_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_date' ,
			    header : '×Ö¶Îrecord_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'record_time' ,
			    header : '×Ö¶Îrecord_time' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'remark' ,
			    header : '×Ö¶Îremark' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'company_no' ,
			    header : '×Ö¶Îcompany_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_period' ,
			    header : '×Ö¶Îvoucher_period' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_date' ,
			    header : '×Ö¶Îvoucher_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_flag' ,
			    header : '×Ö¶Îvoucher_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_no' ,
			    header : '×Ö¶Îvoucher_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_on_time' ,
			    header : '×Ö¶Îvoucher_on_time' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'voucher_type' ,
			    header : '×Ö¶Îvoucher_type' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'seq_no' ,
			    header : '×Ö¶Îseq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_code' ,
			    header : '×Ö¶Îitem_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_name' ,
			    header : '×Ö¶Îitem_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_abv' ,
			    header : '×Ö¶Îitem_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'order_no' ,
			    header : '×Ö¶Îorder_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'bin_code' ,
			    header : '×Ö¶Îbin_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'location_code' ,
			    header : '×Ö¶Îlocation_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'lot_no' ,
			    header : '×Ö¶Îlot_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'qty' ,
			    header : '×Ö¶Îqty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'unit_code' ,
			    header : '×Ö¶Îunit_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'unit_name' ,
			    header : '×Ö¶Îunit_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_unit' ,
			    header : '×Ö¶Îassist_unit' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_unit_name' ,
			    header : '×Ö¶Îassist_unit_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'assist_qty' ,
			    header : '×Ö¶Îassist_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'price' ,
			    header : '×Ö¶Îprice' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'amt' ,
			    header : '×Ö¶Îamt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'inv_qty' ,
			    header : '×Ö¶Îinv_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'value_flag' ,
			    header : '×Ö¶Îvalue_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'audit_flag' ,
			    header : '×Ö¶Îaudit_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_code' ,
			    header : '×Ö¶Îfather_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_item_name' ,
			    header : '×Ö¶Îfather_item_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_item_abv' ,
			    header : '×Ö¶Îfather_item_abv' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'father_order_no' ,
			    header : '×Ö¶Îfather_order_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'item_sequence' ,
			    header : '×Ö¶Îitem_sequence' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'gld_item_type' ,
			    header : '×Ö¶Îgld_item_type' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_no' ,
			    header : '×Ö¶Îother_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'inv_price' ,
			    header : '×Ö¶Îinv_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'actual_price' ,
			    header : '×Ö¶Îactual_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'actual_amt' ,
			    header : '×Ö¶Îactual_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_date' ,
			    header : '×Ö¶Îinvoice_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_price' ,
			    header : '×Ö¶Îinvoice_price' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_amt' ,
			    header : '×Ö¶Îinvoice_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_qty' ,
			    header : '×Ö¶Îadded_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_amt' ,
			    header : '×Ö¶Îadded_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'update_stock_flag' ,
			    header : '×Ö¶Îupdate_stock_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'seq_desc' ,
			    header : '×Ö¶Îseq_desc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_qty' ,
			    header : '×Ö¶Îinvoice_qty' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'invoice_no' ,
			    header : '×Ö¶Îinvoice_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'added_inv_amt' ,
			    header : '×Ö¶Îadded_inv_amt' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_flag' ,
			    header : '×Ö¶Îcancel_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_bill_no' ,
			    header : '×Ö¶Îcancel_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'op_no' ,
			    header : '×Ö¶Îop_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'work_no' ,
			    header : '×Ö¶Îwork_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'remark_head' ,
			    header : '×Ö¶Îremark_head' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ma_read_flag' ,
			    header : '×Ö¶Îma_read_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'use_stamp' ,
			    header : '×Ö¶Îuse_stamp' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ap_ar_read_flag' ,
			    header : '×Ö¶Îap_ar_read_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'suspense_price_flag' ,
			    header : '×Ö¶Îsuspense_price_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'company_code' ,
			    header : '×Ö¶Îcompany_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'plan_date' ,
			    header : '×Ö¶Îplan_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'times' ,
			    header : '×Ö¶Îtimes' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'line_code' ,
			    header : '×Ö¶Îline_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'line_name' ,
			    header : '×Ö¶Îline_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'position_code' ,
			    header : '×Ö¶Îposition_code' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'position_name' ,
			    header : '×Ö¶Îposition_name' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'pc' ,
			    header : '×Ö¶Îpc' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'coop_flag' ,
			    header : '×Ö¶Îcoop_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_no_ag' ,
			    header : '×Ö¶Îother_bill_no_ag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_line_no_ag' ,
			    header : '×Ö¶Îother_bill_line_no_ag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'read_flag' ,
			    header : '×Ö¶Îread_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'flush_flag' ,
			    header : '×Ö¶Îflush_flag' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'ma_out_diff' ,
			    header : '×Ö¶Îma_out_diff' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'cancel_bill_date' ,
			    header : '×Ö¶Îcancel_bill_date' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'old_bill_no' ,
			    header : '×Ö¶Îold_bill_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'old_seq_no' ,
			    header : '×Ö¶Îold_seq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			},
			{
			    dataIndex : 'other_bill_seq_no' ,
			    header : '×Ö¶Îother_bill_seq_no' ,
			    align: 'left' ,
			    width: 160,
			    sortable: true
			}]),
            
            tbar: [new Rs.ext.grid.ExportButton({
                grid: this,
                filename: "ÎÄ¼þ" ,
				paging : false
            })],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 30,
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '¹²{2}Ìõ'
            }),
            plugins : [new Rs.ext.grid.EditorGridViewPlugin()]
            //viewConfig : {forceFit : true}
        });
        rs.exp.OnlyExport.superclass.constructor.call(this, config);
    }
});
