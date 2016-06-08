Rs.define('rs.opa.OrderTrackGridPanel', {
	
    extend: Rs.ext.grid.TreeGridPanel,
    
    mixins: [Rs.app.Main],
    
    constructor: function(config) {
    	
        this.store = new Rs.ext.grid.TreeStore({
            url: '/rsc/js/examples/demo/opa/ordertrack/DateService.rsc',
            idProperty: 'item_code',
            fields: ['item_code', 'item_name', 'leaf', 'item_norm', 'item_model',
		            'level_code', 'sys_flag', 'order_no', 'delay_flag',
		            {name : 'delay_days' , type : 'int'}, 'plan_qty',
		            'release_qty', 'start_qty', 'finish_qty',
		            'scrap_qty', 'issue_qty', 'plan_begin_date',
		            'plan_end_date', 'actual_begin_date', 'actual_end_date',
		            'dept_code', 'dept_name', 'order_status', 'mp_flag', 'key_part_flag',
		            'coop_flag', 'coop_db_flag', 'leaf_flag', 'order_no_q', 'seq_no']
        });
        
        var columnModel = [{
            xtype: 'treecolumn',
            header: '物料编码',
            dataIndex: 'item_code',
            width: 210
        },
        {
            header: '物料名称',
            dataIndex: 'item_name',
            width: 105
        },
        {
            header: '物料规格',
            dataIndex: 'item_norm',
            width: 105
        },
        {
            header: '物料型号',
            dataIndex: 'item_model',
            width: 105
        },
        {
            header: '执行阶段',
            dataIndex: 'sys_flag',
            width: 70,
            align: "center" ,
            renderer : function(v){
                if(v == 'MRP'){
                    return '计划阶段' ;
                } else if(v == 'PAC'){
                    return '生产阶段' ;
                } else if(v == 'PM1'){
                    return '采购阶段' ;
                } else if(v == 'PM1'){
                    return '采购阶段' ;
                } else{
                    return '' ;                
                }
            }		
        },
        {
            header: '部门编码',
            dataIndex: 'dept_code',
            width: 60
        },
        {
            header: '部门名称',
            dataIndex: 'dept_name',
            width: 80
        },
        {
            header: '任务号',
            dataIndex: 'order_no',
            width: 110
        },
        {
            header: '任务状态',
            dataIndex: 'order_status',
            width: 70,
            align: "center" ,
            renderer : function(v){
            	if(v == 'M'){
            	   return 'MRP' ;
            	}else if(v == 'P'){
            	   return '计划' ;
            	} else if (v == 'F'){
            	   return '确认' ;
            	} else if (v == 'R'){
                   return '下达' ;
                } else if (v == 'S'){
                   return '开工' ;
                } else if (v == 'E'){
                   return '完工' ;
                } else if (v == 'C'){
                   return '关闭' ;
                } else if (v == 'PN'){
                   return '计划未审核' ;
                } else if (v == 'PY'){
                   return '计划审核' ;
                } else if (v == 'PR'){
                   return '计划驳回' ;
                } else if (v == 'ON'){
                   return '订单未审核' ;
                } else if (v == 'OP'){
                   return '订单审核' ;
                } else if (v == 'OR'){
                   return '订单驳回' ;
                } else if (v == 'EY'){
                   return '订单结案' ;
                } else if (v == 'EC'){
                   return '订单作废' ;
                } else {
                    return '' ;
                }
            }
        },
        {
            header: '拖期标记',
            dataIndex: 'delay_flag',
            width: 100,
            align: "center" ,
            renderer : function(v){
                if(v == 'N'){
                    return "正常" ;
                } else if (v == 'Y') {
                	return '拖起' ;
                } else {
                	return '' ;
                }
            }
        },
        {
            header: '拖期天数',
            dataIndex: 'delay_days',
            width: 100,
            align: "right"
        },
        {
            header: '计划数量',
            dataIndex: 'plan_qty',
            width: 100,
            align: "right"
        },
        {
            header: '下达数量',
            dataIndex: 'release_qty',
            width: 100,
            align: "right"
        },
        {
            header: '开工数量',
            dataIndex: 'start_qty',
           width: 100,
            align: "right"
        },
        {
            header: '完工数量',
            dataIndex: 'finish_qty',
            width: 100,
            align: "right"
        },
        {
            header: '废品数量',
            dataIndex: 'scrap_qty',
            width: 100,
            align: "right"
        },
        {
            header: '入库数量',
            dataIndex: 'issue_qty',
            width: 100,
            align: "right"
        },
        {
            header: '计划开始日期',
            dataIndex: 'plan_begin_date',
            width: 90,
            align: "center"
        },
        {
            header: '计划结束日期',
            dataIndex: 'plan_end_date',
            width: 90,
            align: "center"
        },
        {
            header: '实际开始日期',
            dataIndex: 'actual_begin_date',
            width: 90,
            align: "center"
        },
        {
            header: '实际结束日期',
            dataIndex: 'actual_end_date',
            width: 80,
            align: "center"
        },
        {
            header: '自制/采购',
            dataIndex: 'mp_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'M') {
                    return "自制"
                } else if (v == 'P') {
                    return "采购"
                } else {
                    return ""
                }
            }
        },
        {
            header: '关键件标记',
            dataIndex: 'key_part_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'Y') {
                    return "关键件"
                } else if (v == 'N') {
                    return "非关键件"
                } else {
                    return ""
                }
            }
        },
        {
            header: '外协标记',
            dataIndex: 'coop_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'Y') {
                    return "外协"
                } else if (v == 'N') {
                    return "非外协"
                } else {
                    return ""
                }
            }
        },
        {
            header: '带料标记',
            dataIndex: 'coop_db_flag',
            width: 70,
            align: "center",
            sortable: true,
            hideable: false,
            renderer: function(v) {
                if (v == 'Y') {
                    return "带料"
                } else if (v == 'N') {
                    return "不带料"
                } else {
                    return ""
                }
            }
        }];
        
       var pageToolBar = new Rs.ext.grid.SliderPagingToolbar({
            pageSize: 16,//初始化显示的条数
            hasSlider: true,//是否显示修改显示条数的滚动条
            store: this.store,
            displayInfo: true//是否显示总记录数
        })
        
        var cfg = {
            columns: columnModel,
            store: this.store ,
            bbar : pageToolBar
        }
        config = Rs.apply(config || {},cfg);
        rs.opa.OrderTrackGridPanel.superclass.constructor.apply(this, arguments) ;
    }
});