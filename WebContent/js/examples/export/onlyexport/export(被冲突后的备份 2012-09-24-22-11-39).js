Rs.define('rs.exp.OnlyExport', {

			extend : Ext.grid.GridPanel,

			mixins : [Rs.app.Main],

			constructor : function(config) {
				
				var store = new Rs.ext.data.Store({
							autoLoad : true,
							autoDestroy : true,
							//idProperty: 'receive_no',
							url : '/rsc/js/examples/export/onlyexport/dataservice.rsc',
							fields : ['RS_ID', 'WAREHOUSE_CODE',
									'WAREHOUSE_NAME', 'BILL_NO', 'BILL_DATE',
									'ACTIVE_CODE', 'ACTIVE_ABV', 'IO_FLAG',
									'OTHER_FLAG', 'OM_ORDER', 'PM_ORDER',
									'SHOP_ORDER', 'DEPT_CODE', 'DEPT_ABV',
									'VENDOR_CODE', 'VENDOR_ABV',
									'CUSTOMER_CODE', 'CUSTOMER_ABV',
									'WAREHOUSE_MAN', 'WAREHOUSE_MAN_CODE',
									'WAREHOUSE_MAN_NAME', 'USE_CODE',
									'USE_DESC', 'OPERATOR', 'OPERATOR_CODE',
									'OPERATOR_NAME', 'OPERATOR_DEPT',
									'OPERATOR_DEPT_NAME', 'CHECK_FLAG',
									'CHECK_DATE', 'CHECK_MAN',
									'CHECK_MAN_NAME', 'QC_NO', 'POST_MAN',
									'POST_MAN_NAME', 'POST_DATE', 'RECORD_MAN',
									'RECORD_MAN_NAME', 'RECORD_DATE',
									'RECORD_TIME', 'REMARK', 'COMPANY_NO',
									'VOUCHER_PERIOD', 'VOUCHER_DATE',
									'VOUCHER_FLAG', 'VOUCHER_NO',
									'VOUCHER_ON_TIME', 'VOUCHER_TYPE']
						});


				var sm = new Ext.grid.CheckboxSelectionModel({});
				config = Rs.apply(config || {}, {
					store : store,
					//columnLines:true,
					visibleOnly : false ,
					columns : [ {
								xtype : 'actioncolumn',
								header : '操作',
								width : 50,
								align : 'center',
								items : [{
											iconCls : 'rs-action-modify',
											handler : this.openModifyPanel,
											scope : this
										}]
							},
							{
								dataIndex : 'RS_ID',
								header : "接收单号1",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_MAN',
								header : "接收单号30",
								align : 'left',
								width : 150,
								sortable : true
							},
							{
								dataIndex : 'CHECK_MAN',
								header : "接收单号30",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_CODE',
								header : "接收单号2",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_NAME',
								header : "接收单号3",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'BILL_NO',
								header : "接收单号4",
								align : 'BILL_DATE',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'ACTIVE_CODE',
								header : "接收单号5",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'ACTIVE_ABV',
								header : "接收单号6",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'IO_FLAG',
								header : "接收单号7",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OTHER_FLAG',
								header : "接收单号8",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OM_ORDER',
								header : "接收单号9",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'PM_ORDER',
								header : "接收单号10",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'SHOP_ORDER',
								header : "接收单号11",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'DEPT_CODE',
								header : "接收单号12",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'DEPT_ABV',
								header : "接收单号13",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VENDOR_CODE',
								header : "接收单号14",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VENDOR_ABV',
								header : "接收单号15",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CUSTOMER_CODE',
								header : "接收单号16",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CUSTOMER_ABV',
								header : "接收单号17",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_MAN_NAME',
								header : "接收单号20",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'USE_CODE',
								header : "接收单号21",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'USE_DESC',
								header : "接收单号22",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR',
								header : "接收单号23",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_CODE',
								header : "接收单号24",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_NAME',
								header : "接收单号25",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_DEPT',
								header : "接收单号26",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_DEPT_NAME',
								header : "接收单号27",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_FLAG',
								header : "接收单号28",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_DATE',
								header : "接收单号29",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_MAN_NAME',
								header : "接收单号31",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'QC_NO',
								header : "接收单号32",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_MAN',
								header : "接收单号33",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_MAN_NAME',
								header : "接收单号34",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_DATE',
								header : "接收单号35",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_MAN',
								header : "接收单号36",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_MAN_NAME',
								header : "接收单号37",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_DATE',
								header : "接收单号38",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_TIME',
								header : "接收单号39",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'REMARK',
								header : "接收单号40",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'COMPANY_NO',
								header : "接收单号41",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_PERIOD',
								header : "接收单号42",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_DATE',
								header : "接收单号43",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_FLAG',
								header : "接收单号44",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_NO',
								header : "接收单号45",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_ON_TIME',
								header : "接收单号46",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_TYPE',
								header : "接收单号47",
								align : 'left',
								width : 160,
								sortable : true
							}],

					tbar : [new Rs.ext.grid.ExportButton({
								grid : this,
								paging :  true,  
								filename : "文件"
							})],
					bbar : new Rs.ext.grid.SliderPagingToolbar({
								pageSize : 30,
								hasSlider : true,
								store : store,
								displayInfo : true,
								displayMsg : '共{2}条'
							}) 
					       
						//viewConfig : {forceFit : true}
					});
				rs.exp.OnlyExport.superclass.constructor
						.call(this, config);
			}
		});
