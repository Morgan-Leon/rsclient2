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
            header: "������",
            dataIndex: 'order_no',
            align: "left",
            editable: false,
            sortable: true,
            width : 125
        },
        {
            header: "��������",
            dataIndex: 'head_type_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ͻ�����",
            dataIndex: 'customer_code',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "�ͻ�����",
            dataIndex: 'customer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "ǩ������",
            dataIndex: 'sign_date',
            align: "center",
            editable: false,
            sortable: true
        },
        {
            header: "����״̬",
            dataIndex: 'status',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���״̬",
            dataIndex: 'audit_flag',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����״̬",
            dataIndex: 'freeze_flag',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "ǩ����",
            dataIndex: 'signer_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "��֯",
            dataIndex: 'org_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "���´�",
            dataIndex: 'off_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "С��",
            dataIndex: 'grp_name',
            align: "left",
            editable: false,
            sortable: true
        },
        {
            header: "����Ա",
            dataIndex: 'sales_name',
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
        var tbarTool = [{
            text : '������' ,
            iconCls : 'rs-action-submit' ,
            scope : this ,
            handler : this.doBatchFreeze
        },'-',{
            text : '���ⶳ' ,
            iconCls : 'rs-action-cancel' ,
            scope : this ,
            handler : this.doBatchThow
        }]
        
        //�����û�ƫ����Ϣ�Ĳ��
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
        	//ÿ��������load������,�ټ���rowselect�¼�,�Ա�֤ѡ���һ������ʱ���ܹ�ִ��doRowSelect����
	        sm.on('rowselect' , this.doRowSelect , this , {
	        	single : true
	        }) ;
            if(store.getCount() != 0){//�����ѯ����м�¼,��ѡ���һ����¼,ִ��doRowSelect����
				this.on('rowclick' , this.doRowClick , this) ;//ͨ������rowclick�¼�������ѡ��
            }
        } , this);
        this.addEvents('rowchange');
        Rs.EventBus.register(this, 'gridpanel',['rowchange']);
    } ,
    
	/**
	 * @method doRowSelect ����ѡ���
	 * @param {Object} sm ѡ���
	 * @param {Object} rowIndex �к�
	 * @param {Object} record ��ǰ�еļ�¼
	 */
    doRowSelect : function(sm, rowIndex, record){
        this.fireEvent('rowchange',record.get('order_no'));
    } ,
	
	/**
	 * @method doRowClick ���ĳһ�м�¼
	 * @param {Object} grid ��ǰ��¼���ڵ�grid
	 * @param {Object} rowIndex �к�
	 * @param {Object} e
	 */
	doRowClick : function(grid, rowIndex, e){
		var record = this.store.getAt(rowIndex);
        this.fireEvent('rowchange',record.get('order_no'));
    } ,
	
	/**
     * @method doBatchThow ������
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
                Ext.Msg.alert("��ʾ" , result.msg);
            } else {
                this.getStore().reload();
            }        
        } , this) ;
        
    } ,
    
	/**
	 * @method doBatchThow ���ⶳ
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
                Ext.Msg.alert("��ʾ" , result.msg);
            } else {
                this.getStore().reload();
            }        
        } , this) ;
    } ,
    
	/**
	 * @method checkActionRecord 
	 *  �����Ҫ����������,����ѡ�еļ�¼��order_no�����������
	 * @return ���order_no������
	 */
    checkActionRecord : function(){
        var sm = this.getSelectionModel(),
            selectRecord =  sm.getSelections(),
            orderNo = [] ;
        if(selectRecord.length == 0 ){
            Ext.Msg.alert("��ʾ" , "��ѡ����Ҫ����������!");
            return ;
        }    
        for(var i=0,len=selectRecord.length;i<len ;i++){
            var record = selectRecord[i] ;        
            orderNo.push(record.get('order_no'));
        }
        return orderNo ;
    }
});