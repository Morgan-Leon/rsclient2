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
								header : '����',
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
								header : "���յ���1",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_MAN',
								header : "���յ���30",
								align : 'left',
								width : 150,
								sortable : true
							},
							{
								dataIndex : 'CHECK_MAN',
								header : "���յ���30",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_CODE',
								header : "���յ���2",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_NAME',
								header : "���յ���3",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'BILL_NO',
								header : "���յ���4",
								align : 'BILL_DATE',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'ACTIVE_CODE',
								header : "���յ���5",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'ACTIVE_ABV',
								header : "���յ���6",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'IO_FLAG',
								header : "���յ���7",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OTHER_FLAG',
								header : "���յ���8",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OM_ORDER',
								header : "���յ���9",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'PM_ORDER',
								header : "���յ���10",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'SHOP_ORDER',
								header : "���յ���11",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'DEPT_CODE',
								header : "���յ���12",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'DEPT_ABV',
								header : "���յ���13",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VENDOR_CODE',
								header : "���յ���14",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VENDOR_ABV',
								header : "���յ���15",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CUSTOMER_CODE',
								header : "���յ���16",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CUSTOMER_ABV',
								header : "���յ���17",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'WAREHOUSE_MAN_NAME',
								header : "���յ���20",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'USE_CODE',
								header : "���յ���21",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'USE_DESC',
								header : "���յ���22",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR',
								header : "���յ���23",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_CODE',
								header : "���յ���24",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_NAME',
								header : "���յ���25",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_DEPT',
								header : "���յ���26",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'OPERATOR_DEPT_NAME',
								header : "���յ���27",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_FLAG',
								header : "���յ���28",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_DATE',
								header : "���յ���29",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'CHECK_MAN_NAME',
								header : "���յ���31",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'QC_NO',
								header : "���յ���32",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_MAN',
								header : "���յ���33",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_MAN_NAME',
								header : "���յ���34",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'POST_DATE',
								header : "���յ���35",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_MAN',
								header : "���յ���36",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_MAN_NAME',
								header : "���յ���37",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_DATE',
								header : "���յ���38",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'RECORD_TIME',
								header : "���յ���39",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'REMARK',
								header : "���յ���40",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'COMPANY_NO',
								header : "���յ���41",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_PERIOD',
								header : "���յ���42",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_DATE',
								header : "���յ���43",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_FLAG',
								header : "���յ���44",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_NO',
								header : "���յ���45",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_ON_TIME',
								header : "���յ���46",
								align : 'left',
								width : 160,
								sortable : true
							},

							{
								dataIndex : 'VOUCHER_TYPE',
								header : "���յ���47",
								align : 'left',
								width : 160,
								sortable : true
							}],

					tbar : [new Rs.ext.grid.ExportButton({
								grid : this,
								paging :  true,  
								filename : "�ļ�"
							})],
					bbar : new Rs.ext.grid.SliderPagingToolbar({
								pageSize : 30,
								hasSlider : true,
								store : store,
								displayInfo : true,
								displayMsg : '��{2}��'
							}) 
					       
						//viewConfig : {forceFit : true}
					});
				rs.exp.OnlyExport.superclass.constructor
						.call(this, config);
			}
		});
