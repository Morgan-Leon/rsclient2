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
            header: "�к�",
            width: 60,
            dataIndex: 'seq_no',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��ϸ����",
            dataIndex: 'detail_type_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���ϱ���",
            dataIndex: 'item_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��������",
            width: 200,
            dataIndex: 'item_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���ϼ��",
            dataIndex: 'item_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��������",
            dataIndex: 'required_qty',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "�������",
            dataIndex: 'finish_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "��������",
            dataIndex: 'ship_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "���״̬",
            dataIndex: 'audit_flag',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "δ���";
                case 'P':
                    return "���ͨ��";
                case 'R':
                    return "����";
                }
            }
        },
        {
            header: "����״̬",
            dataIndex: 'status',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "����";
                case 'S':
                    return "���";
                case 'C':
                    return "�᰸";
                }
            }
        },
        {
            header: "���۷������",
            dataIndex: 'om_class',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���۷�������",
            dataIndex: 'om_class_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��˰����",
            dataIndex: 'price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "���˼۸�",
            dataIndex: 'check_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "����˰����",
            dataIndex: 'notax_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "�����۸�",
            dataIndex: 'basic_price',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "˰��",
            dataIndex: 'tax_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "˰��",
            dataIndex: 'tax_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "˰��",
            dataIndex: 'tax',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����",
            dataIndex: 'amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "�ܽ��",
            dataIndex: 'total_amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "��λ���ܽ��",
            dataIndex: 'standard_total_amt',
            align: "right",
            editable: false,
            sortable: true
        },
        {
            header: "�ۿ���",
            dataIndex: 'discount_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����",
            dataIndex: 'exchange_rate',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ջ���λ",
            dataIndex: 'ship_customer',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ջ���λ����",
            dataIndex: 'ship_customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ջ���λ���",
            dataIndex: 'ship_customer_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���㵥λ",
            dataIndex: 'pay_customer',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���㵥λ����",
            dataIndex: 'pay_customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���㵥λ���",
            dataIndex: 'pay_customer_abv',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ջ�վ",
            dataIndex: 'receive_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ջ�վ����",
            dataIndex: 'receive_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����վ",
            dataIndex: 'deliver_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����վ����",
            dataIndex: 'deliver_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ֿ����",
            dataIndex: 'warehouse_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ֿ�����",
            dataIndex: 'warehouse_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��ע",
            dataIndex: 'remark',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "������ƻ�״̬",
            dataIndex: 'mds_flag',
            align: "center",
            editable: false,
            sortable: true,
            renderer: function(v) {
                switch (v) {
                case 'N':
                    return "����";
                case 'Y':
                    return "ȷ��";
                case 'R':
                    return "����";
                case 'P':
                    return "�ƻ�";
                case 'C':
                    return "���";
                }
            }
        },
        {
            header: "�׼���",
            dataIndex: 'set_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�׼�����",
            dataIndex: 'set_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��������",
            dataIndex: 'child_qty',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�᰸��",
            dataIndex: 'close_man_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�����",
            dataIndex: 'modify_man_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���ʱ��",
            dataIndex: 'modify_date',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���ԭ��",
            dataIndex: 'modify_reason',
            align: "left",
            editable: false,
            sortable: true
        }]);

        var pageToolBar = new Rs.ext.grid.SliderPagingToolbar({
            pageSize: 16,//��ʼ����ʾ������
            hasSlider: true,//�Ƿ���ʾ�޸���ʾ�����Ĺ�����
            store: store,
            displayInfo: true//�Ƿ���ʾ�ܼ�¼�� 
        })

        //�����û�ƫ����Ϣ�Ĳ��
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
		 * ����store��load�¼�,������load������,����ϸ���չ��
		 */
        store.on('load' , function(){
            if(this.collapsed){
                this.expand();
            }
        },this) ; 
    } ,
    
	/**
	 * @method doRowChange ����ѡ���
	 * @param {Object} orderNo ������
	 */
    doRowChange : function(orderNo){
    	if(this.currentOrderNo === orderNo){ //����ظ����ͬһ�����ݣ���ִ�м���
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