Rs.define('rs.om.OrderBatchFreezeDetailPanel', {

    extend: Ext.grid.GridPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var store = new Rs.ext.data.Store({
            autoLoad: false,
            autoDestroy: true,
            idProperty: 'seq_no',
            url: '/rsc/js/examples/demo/om/orderbatchfreeze/OrderBatchFreezeDetailDataService.rsc',
            fields: ["seq_no", "detail_type_name", "item_code", "item_name", "item_abv",
                "required_qty", "finish_date", "ship_date", "audit_flag", "status", 
                "om_class", "om_class_name", "price", "check_price", "notax_price",
                "basic_price", "tax_code", "tax_rate", "tax", "amt", "total_amt",
                "standard_total_amt", "discount_rate", "exchange_rate", "ship_customer",
                "ship_customer_name", "ship_customer_abv", "pay_customer",
                "pay_customer_name", "pay_customer_abv", "receive_code",
                "receive_name", "deliver_code", "deliver_name", "warehouse_code",
                "warehouse_name", "remark", "mds_flag", "set_code", "set_name",
                "child_qty", "close_man_name", "modify_man_name", "modify_date", "modify_reason"]
        });
        
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	moveEditorOnEnter: false
        });
        
        var columnModel = new Ext.grid.ColumnModel([sm , {
            header: "行号",
            width: 60,
            dataIndex: 'seq_no',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "明细类型",
            dataIndex: 'detail_type_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "物料编码",
            dataIndex: 'item_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "物料名称",
            width: 200,
            dataIndex: 'item_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "物料简称",
            dataIndex: 'item_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "需求数量",
            dataIndex: 'required_qty',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "完成日期",
            dataIndex: 'finish_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "交货日期",
            dataIndex: 'ship_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "审核状态",
            dataIndex: 'audit_flag',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "未审核";
                case 'P':
                    return "审核通过";
                case 'R':
                    return "驳回";
                }
            }
        },
        {
            header: "订单状态",
            dataIndex: 'status',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "新增";
                case 'S':
                    return "提货";
                case 'C':
                    return "结案";
                }
            }
        },
        {
            header: "销售分类编码",
            dataIndex: 'om_class',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "销售分类名称",
            dataIndex: 'om_class_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "含税单价",
            dataIndex: 'price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "考核价格",
            dataIndex: 'check_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "不含税单价",
            dataIndex: 'notax_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "基本价格",
            dataIndex: 'basic_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "税码",
            dataIndex: 'tax_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "税率",
            dataIndex: 'tax_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "税金",
            dataIndex: 'tax',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "货款",
            dataIndex: 'amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "总金额",
            dataIndex: 'total_amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "本位币总金额",
            dataIndex: 'standard_total_amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "折扣率",
            dataIndex: 'discount_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "汇率",
            dataIndex: 'exchange_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "收货单位",
            dataIndex: 'ship_customer',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "收货单位名称",
            dataIndex: 'ship_customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "收货单位简称",
            dataIndex: 'ship_customer_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "结算单位",
            dataIndex: 'pay_customer',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "结算单位名称",
            dataIndex: 'pay_customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "结算单位简称",
            dataIndex: 'pay_customer_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "收货站",
            dataIndex: 'receive_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "收货站名称",
            dataIndex: 'receive_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "发货站",
            dataIndex: 'deliver_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "发货站名称",
            dataIndex: 'deliver_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "仓库编码",
            dataIndex: 'warehouse_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "仓库名称",
            dataIndex: 'warehouse_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "备注",
            dataIndex: 'remark',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "主需求计划状态",
            dataIndex: 'mds_flag',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "新增";
                case 'Y':
                    return "确认";
                case 'R':
                    return "读入";
                case 'P':
                    return "计划";
                case 'C':
                    return "完成";
                }
            }
        },
        {
            header: "套件号",
            dataIndex: 'set_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "套件名称",
            dataIndex: 'set_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "单套数量",
            dataIndex: 'child_qty',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "结案人",
            dataIndex: 'close_man_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "变更人",
            dataIndex: 'modify_man_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "变更时间",
            dataIndex: 'modify_date',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "变更原因",
            dataIndex: 'modify_reason',
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

        //保存用户偏好信息的插件
		var stateplugin = new Rs.ext.state.StatePlugin( { 
		     scheme : false
		});
        
        var cfg = {
    		sm : sm ,
            store: store,
            clickToEdit: 1,
            stripeRows: true,
            colModel: columnModel,
            bbar: pageToolBar ,
            loadMask : true ,
            stateful:true,
            stateId : 'om6f00-detailgrid31' ,
	        stateEvents: ['columnmove', 'columnresize','columnhiddenchange' , 'sortchange', 'groupchange'],
			plugins : stateplugin
        };
        config = Rs.apply(config || {},
        cfg);

        rs.om.OrderBatchFreezeDetailPanel.superclass.constructor.apply(this, arguments);
        
        this.addEvents('columnhiddenchange');
        this.getColumnModel().on('hiddenchange' , function(columnModel,columnIndex, hidden){
        	this.fireEvent('columnhiddenchange' , columnModel,columnIndex, hidden);
	    },this);
        
        
        Rs.EventBus.on('gridpanel-rowchange' , this.doRowChange , this);
        
		/**
		 * @ listeners load
		 * 监听store的load事件,当数据load回来后,将详细面板展开
		 */
        store.on('load' , function(){
            if(this.collapsed){
                this.expand();
            }
        },this) ; 
    } ,
    
	/**
	 * @method doRowChange 单击选择框
	 * @param {Object} orderNo 订单号
	 */
    doRowChange : function(orderNo){
    	if(this.currentOrderNo === orderNo){ //如果重复点击同一条数据，则不执行加载
    		return ;
    	}
    	this.currentOrderNo = orderNo;
        this.getStore().load({
            params : {
                orderNo : orderNo
            }
        });
    }
});