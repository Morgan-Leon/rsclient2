Rs.define('rs.om.OrderBatchFreezeGridPanel', {

    extend: Ext.grid.GridPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var store = new Rs.ext.data.Store({
            autoDestroy: true,
            idProperty: 'order_no',
            url: '/rsc/js/examples/demo/om/orderbatchfreeze/OrderBatchFreezeDataService.rsc',
            fields: ["order_no", "head_type_name", "customer_code", "customer_name",
			 "sign_date", "signer_name", "org_name", "off_name", "grp_name", "sales_name",
			  "status", "audit_flag", "freeze_flag"] ,
			sortInfo : {
				field: 'sign_date DESC, order_no' ,
				direction: 'ASC'
			}
        });

        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	moveEditorOnEnter: false
        });

        var columnModel = new Rs.ext.grid.ColumnModel([sm, {
            header: "订单号",
            dataIndex: 'order_no',
            align: "left",
            editable: false,
            sortable: true,
            width : 125
        },
        {
            header: "订单类型",
            dataIndex: 'head_type_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "客户编码",
            dataIndex: 'customer_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "客户名称",
            dataIndex: 'customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "签订日期",
            dataIndex: 'sign_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "订单状态",
            dataIndex: 'status',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "审核状态",
            dataIndex: 'audit_flag',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "冻结状态",
            dataIndex: 'freeze_flag',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "签订人",
            dataIndex: 'signer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "组织",
            dataIndex: 'org_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "办事处",
            dataIndex: 'off_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "小组",
            dataIndex: 'grp_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "销售员",
            dataIndex: 'sales_name',
            align: "left",
            editable: false,
            sortable: true
        }]);

        var pageToolBar = new Rs.ext.grid.SliderPagingToolbar({
            pageSize: 16,//初始化显示的条数
            hasSlider: true,//是否显示修改显示条数的滚动条
            store: store,
            displayInfo: true//是否显示总记录数
        })
        var tbarTool = [{
            text : '批冻结' ,
            iconCls : 'rs-action-submit' ,
            scope : this ,
            handler : this.doBatchFreeze
        },'-',{
            text : '批解冻' ,
            iconCls : 'rs-action-cancel' ,
            scope : this ,
            handler : this.doBatchThow
        }]
        
        //保存用户偏好信息的插件
		var stateplugin = new Rs.ext.state.StatePlugin( { 
		     scheme : false
		});
        
        var cfg = {
        	loadMask : true ,
            sm : sm ,
            store: store,
            clickToEdit: 1,
            stripeRows: true,
            colModel: columnModel,
            bbar:pageToolBar ,
			tbar : tbarTool ,
			stateful:true,
            stateId : 'om6f00-grid' ,
	        stateEvents: ['columnmove', 'columnresize','columnhiddenchange' , 'sortchange', 'groupchange'],
			plugins : stateplugin
        };

        config = Rs.apply(config || {}, cfg);
        
        rs.om.OrderBatchFreezeGridPanel.superclass.constructor.apply(this, arguments);
        
        this.addEvents('columnhiddenchange');
        this.getColumnModel().on('hiddenchange' , function(columnModel,columnIndex, hidden){
        	this.fireEvent('columnhiddenchange' , columnModel,columnIndex, hidden);
	    },this);
        
        store.on('load' , function(){
        	//每次在数据load回来后,再监听rowselect事件,以保证选择第一条数据时候能够执行doRowSelect方法
	        sm.on('rowselect' , this.doRowSelect , this , {
	        	single : true
	        }) ;
            if(store.getCount() != 0){//如果查询结果有记录,则选择第一条记录,执行doRowSelect方法
				this.on('rowclick' , this.doRowClick , this) ;//通过监听rowclick事件来进行选择
            }
        } , this);
        this.addEvents('rowchange');
        Rs.EventBus.register(this, 'gridpanel',['rowchange']);
    } ,
    
	/**
	 * @method doRowSelect 单击选择框
	 * @param {Object} sm 选择框
	 * @param {Object} rowIndex 行号
	 * @param {Object} record 当前行的记录
	 */
    doRowSelect : function(sm, rowIndex, record){
        this.fireEvent('rowchange',record.get('order_no'));
    } ,
	
	/**
	 * @method doRowClick 点击某一行记录
	 * @param {Object} grid 当前记录所在的grid
	 * @param {Object} rowIndex 行号
	 * @param {Object} e
	 */
	doRowClick : function(grid, rowIndex, e){
		var record = this.store.getAt(rowIndex);
        this.fireEvent('rowchange',record.get('order_no'));
    } ,
	
	/**
     * @method doBatchThow 批冻结
     */
	doBatchFreeze : function(){
        var orderNo = this.checkActionRecord() ;
        if(!orderNo){
            return ;
        }
        Rs.Service.call({
			url: '/rsc/js/examples/demo/om/orderbatchfreeze/OrderBatchFreezeDataService.rsc',
            method: 'batchFreezeRecords' ,
            params : {
                params : orderNo
            }
        },function(result){
            if(!result.success){
                Ext.Msg.alert("提示" , result.msg);
            } else {
                this.getStore().reload();
            }        
        } , this) ;
        
    } ,
    
	/**
	 * @method doBatchThow 批解冻
	 */
    doBatchThow : function(){
        var orderNo = this.checkActionRecord() ;
        if(!orderNo){
            return ;
        }
        Rs.Service.call({
			url: '/rsc/js/examples/demo/om/orderbatchfreeze/OrderBatchFreezeDataService.rsc',
            method: 'batchThowRecords' ,
            params : {
                params : orderNo
            }
        },function(result){
            if(!result.success){
                Ext.Msg.alert("提示" , result.msg);
            } else {
                this.getStore().reload();
            }        
        } , this) ;
    } ,
    
	/**
	 * @method checkActionRecord 
	 *  检测需要操作的数据,并将选中的记录的order_no存放在数组中
	 * @return 存放order_no的数组
	 */
    checkActionRecord : function(){
        var sm = this.getSelectionModel(),
            selectRecord =  sm.getSelections(),
            orderNo = [] ;
        if(selectRecord.length == 0 ){
            Ext.Msg.alert("提示" , "请选择你要操作的数据!");
            return ;
        }    
        for(var i=0,len=selectRecord.length;i<len ;i++){
            var record = selectRecord[i] ;        
            orderNo.push(record.get('order_no'));
        }
        return orderNo ;
    }
});