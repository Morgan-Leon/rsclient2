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
            header: '���ϱ���',
            dataIndex: 'item_code',
            width: 210
        },
        {
            header: '��������',
            dataIndex: 'item_name',
            width: 105
        },
        {
            header: '���Ϲ��',
            dataIndex: 'item_norm',
            width: 105
        },
        {
            header: '�����ͺ�',
            dataIndex: 'item_model',
            width: 105
        },
        {
            header: 'ִ�н׶�',
            dataIndex: 'sys_flag',
            width: 70,
            align: "center" ,
            renderer : function(v){
                if(v == 'MRP'){
                    return '�ƻ��׶�' ;
                } else if(v == 'PAC'){
                    return '�����׶�' ;
                } else if(v == 'PM1'){
                    return '�ɹ��׶�' ;
                } else if(v == 'PM1'){
                    return '�ɹ��׶�' ;
                } else{
                    return '' ;                
                }
            }		
        },
        {
            header: '���ű���',
            dataIndex: 'dept_code',
            width: 60
        },
        {
            header: '��������',
            dataIndex: 'dept_name',
            width: 80
        },
        {
            header: '�����',
            dataIndex: 'order_no',
            width: 110
        },
        {
            header: '����״̬',
            dataIndex: 'order_status',
            width: 70,
            align: "center" ,
            renderer : function(v){
            	if(v == 'M'){
            	   return 'MRP' ;
            	}else if(v == 'P'){
            	   return '�ƻ�' ;
            	} else if (v == 'F'){
            	   return 'ȷ��' ;
            	} else if (v == 'R'){
                   return '�´�' ;
                } else if (v == 'S'){
                   return '����' ;
                } else if (v == 'E'){
                   return '�깤' ;
                } else if (v == 'C'){
                   return '�ر�' ;
                } else if (v == 'PN'){
                   return '�ƻ�δ���' ;
                } else if (v == 'PY'){
                   return '�ƻ����' ;
                } else if (v == 'PR'){
                   return '�ƻ�����' ;
                } else if (v == 'ON'){
                   return '����δ���' ;
                } else if (v == 'OP'){
                   return '�������' ;
                } else if (v == 'OR'){
                   return '��������' ;
                } else if (v == 'EY'){
                   return '�����᰸' ;
                } else if (v == 'EC'){
                   return '��������' ;
                } else {
                    return '' ;
                }
            }
        },
        {
            header: '���ڱ��',
            dataIndex: 'delay_flag',
            width: 100,
            align: "center" ,
            renderer : function(v){
                if(v == 'N'){
                    return "����" ;
                } else if (v == 'Y') {
                	return '����' ;
                } else {
                	return '' ;
                }
            }
        },
        {
            header: '��������',
            dataIndex: 'delay_days',
            width: 100,
            align: "right"
        },
        {
            header: '�ƻ�����',
            dataIndex: 'plan_qty',
            width: 100,
            align: "right"
        },
        {
            header: '�´�����',
            dataIndex: 'release_qty',
            width: 100,
            align: "right"
        },
        {
            header: '��������',
            dataIndex: 'start_qty',
           width: 100,
            align: "right"
        },
        {
            header: '�깤����',
            dataIndex: 'finish_qty',
            width: 100,
            align: "right"
        },
        {
            header: '��Ʒ����',
            dataIndex: 'scrap_qty',
            width: 100,
            align: "right"
        },
        {
            header: '�������',
            dataIndex: 'issue_qty',
            width: 100,
            align: "right"
        },
        {
            header: '�ƻ���ʼ����',
            dataIndex: 'plan_begin_date',
            width: 90,
            align: "center"
        },
        {
            header: '�ƻ���������',
            dataIndex: 'plan_end_date',
            width: 90,
            align: "center"
        },
        {
            header: 'ʵ�ʿ�ʼ����',
            dataIndex: 'actual_begin_date',
            width: 90,
            align: "center"
        },
        {
            header: 'ʵ�ʽ�������',
            dataIndex: 'actual_end_date',
            width: 80,
            align: "center"
        },
        {
            header: '����/�ɹ�',
            dataIndex: 'mp_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'M') {
                    return "����"
                } else if (v == 'P') {
                    return "�ɹ�"
                } else {
                    return ""
                }
            }
        },
        {
            header: '�ؼ������',
            dataIndex: 'key_part_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'Y') {
                    return "�ؼ���"
                } else if (v == 'N') {
                    return "�ǹؼ���"
                } else {
                    return ""
                }
            }
        },
        {
            header: '��Э���',
            dataIndex: 'coop_flag',
            width: 70,
            align: "center",
            renderer: function(v) {
                if (v == 'Y') {
                    return "��Э"
                } else if (v == 'N') {
                    return "����Э"
                } else {
                    return ""
                }
            }
        },
        {
            header: '���ϱ��',
            dataIndex: 'coop_db_flag',
            width: 70,
            align: "center",
            sortable: true,
            hideable: false,
            renderer: function(v) {
                if (v == 'Y') {
                    return "����"
                } else if (v == 'N') {
                    return "������"
                } else {
                    return ""
                }
            }
        }];
        
       var pageToolBar = new Rs.ext.grid.SliderPagingToolbar({
            pageSize: 16,//��ʼ����ʾ������
            hasSlider: true,//�Ƿ���ʾ�޸���ʾ�����Ĺ�����
            store: this.store,
            displayInfo: true//�Ƿ���ʾ�ܼ�¼��
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