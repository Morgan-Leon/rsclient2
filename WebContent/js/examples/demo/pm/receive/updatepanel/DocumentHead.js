Rs.define('rs.pm.DocumentHead', {

    extend: Ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
		
		this.grid = config.grid ;
		this.grid.head = this ;
		
        //������ͣ�¼�
        Ext.QuickTips.init();

        var config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            layout: 'column',
            height: 120,
            width: 820,
            bodyStyle: 'padding:5px;',
            items: [{
                layout: 'form',
                border: false,
                columnWidth: .3,
                items: [this.rn = new Ext.form.TextField({
					id : 'receive_no' ,
                    width: 125,
                    labelStyle: 'text-align:right;',
                    fieldLabel: '*���յ���',
                    readOnly: true,
                    allowBlank: false,
                    maxLength: 15,
                    blankText: '���յ��Ų���Ϊ��',
                    maxLengthText: '���յ�����󳤶�Ϊ15',
                    tooltipType: 'qtip',
                    listeners: {
                        blur: this.checkReceiveNo
                    }
                }),this.bt = new Rs.ext.form.Telescope({
					id : 'bill_type' ,
                    fieldLabel: '��������',
                    singleSelect: true,
                    width: 125,
                    editable: false,
                    labelStyle: 'text-align:right;',
                    progCode: 'billType',
                    valueField: 'BILL_TYPE',
                    displayField: 'TYPE_DESC'
                }), this.vc = new Rs.ext.form.Telescope({
					id : 'vendor_code' ,
                    fieldLabel: '��Ӧ��',
                    singleSelect: true,
                    labelStyle: 'text-align:right;',
                    progCode: 'tempUserVendorNew',
                    valueField: 'PM_GROUP_VENDOR.VENDOR_CODE',
                    displayField: 'PM_VENDOR.VENDOR_ABV',
                    buildProgCondtion: (function(progCondition, qp) {
                        return "pm_group_vendor.group_id = '" + qp.gi.getValue() + "'" + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    }).createDelegate(this, [this], 2),
                    listeners: {
                        beforeexpand: {
                            fn: function() {
                                if (!this.gi.getValue() || this.gi.getValue().length < 1) {
                                    Ext.Msg.alert("��ʾ", '����ѡ��ɹ�С��');
                                    return false;
                                }
                            },
                            scope: this
                        }
                    }
                })]
            },
            {
                layout: 'form',
                border: false,
                columnWidth: .3,
                items: [this.sc = new Ext.form.ComboBox({
                    mode: 'remote',
                    fieldLabel: '�ɹ�����',
                    labelStyle: 'text-align:right;',
                    id : 'special_class',
                    width: 125,
                    triggerAction: 'all',
                    emptyText: 'M-����',
                    value: 'M',
                    store: new Rs.ext.data.Store({
                        url: '/rsc/js/examples/demo/pm/receive/pmclassservice.rsc',
                        autoLoad: false,
                        fields: ['special_class', 'special_name']
                    }),
                    valueField: 'special_class',
                    displayField: 'special_name'
                }), this.gi = new Rs.ext.form.Telescope({
					id :'group_id' ,
                    fieldLabel: '�ɹ�С��',
                    labelStyle: 'text-align:right;',
                    singleSelect: true,
                    progCode: 'groupUser',
                    valueField: 'GROUP_ID',
                    displayField: 'GROUP_NAME'
                }), this.dc = new Rs.ext.form.Telescope({
					id : 'deliver_code' ,
                    fieldLabel: '�ͻ���λ',
                    labelStyle: 'text-align:right;',
                    singleSelect: true,
                    progCode: 'relVendor',
                    valueField: 'PARTNER_CODE',
                    displayField: 'PARTNER_ABV',
                    buildProgCondtion: (function(progCondition, qp) {
                        return "vendor_code = '" + qp.vc.getValue() + "'" + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    }).createDelegate(this, [this], 2),
                    listeners: {
                        beforeexpand: {
                            fn: function() {
                                if (!this.vc.getValue() || this.vc.getValue().length < 1) {
                                    Ext.Msg.alert("��ʾ", '����ѡ��Ӧ��');
                                    return false;
                                }
                            },
                            scope: this
                        }
                    }
                })]
            },
            {
                layout: 'form',
                border: false,
                columnWidth: .4,
                items: [this.rd = new Rs.ext.form.DateField({
					id :'receive_date' ,
                    fieldLabel: '��������',
                    labelStyle: 'text-align:right;',
                    width: 125,
                    format: 'Y/m/d'
                }), this.bc = new Rs.ext.form.Telescope({
					id : 'buyer_id' ,
                    fieldLabel: '�ɹ�Ա',
                    labelStyle: 'text-align:right;',
                    progCode: 'buyerCodeNew',
                    valueField: 'PM_GROUP_USER.USER_UNIQUE_ID',
                    displayField: 'PM_USER.USER_NAME',
                    singleSelect: true
                })]
            }],
            tbar: new Ext.Toolbar({
                items: [{
                    text: 'ɾ��',
                    iconCls: 'rs-action-remove',
                    scope: this,
                    handler: function() {
                        this.fireEvent('deleterecord', this);
                    }
                },
                {
                    text: '����',
                    iconCls: 'rs-action-save',
                    scope: this,
                    handler: this.doUpdate,
                    tooltip: "�������������,������ͷ����Ϣ�Լ�������Ϣ,����Ǹ��²���,ֻ�����������Ϣ",
                    tooltipType: "qtip"
                },
                {
                    text: '����',
                    iconCls: 'rs-action-reset',
                    scope: this,
                    handler: function() {
                        this.fireEvent('resetdata', this);
                    }
                },
                {
                    text: '��������',
                    iconCls: 'rs-action-batch',
                    scope: this
                },
                {
                    text: '������Ϣ',
                    iconCls: 'rs-action-exception',
                    scope: this
                }]
            })
        });

        rs.pm.DocumentHead.superclass.constructor.call(this, config);

        this.addEvents('save', 'reset', 'addheadsuccess', 'receivenochange');

        Rs.EventBus.register(this, 'documenthead', ['save' , 'addheadsuccess' , 'deleterecord' , 'resetdata']);

        Rs.EventBus.on('detailgrid-savedata', this.doUpdate, this);

    },

    /**
     * @method setData
     *  ���ݼ�¼������ʾ����
     * @param {} rec
     */
    setData: function(rec) {
		this.getForm().loadRecord(rec);
    	/*this.record = rec ;
        this.rn.setValue(rec.get('receive_no')); //���յ���
        this.bt.setValue(rec.get('bill_type')); //��������
        this.rd.setValue(rec.get('receive_date')); //��������
        this.sc.setValue(rec.get('special_class'));//�ɹ�����
        this.bc.setValue(rec.get('buyer_id')); //�ɹ�Ա
        this.gi.setValue(rec.get('group_id')); //�ɹ�С��
        this.gi.on('change', this.vc.setValue.createDelegate(this.vc, [rec.get('vendor_code')]), this, {
            single: true
        }); //��Ӧ��
        this.vc.on('change', this.dc.setValue.createDelegate(this.dc, [rec.get('deliver_code')]), this, {
            single: true
        }); //�ͻ���λ*/
    },

    /**
     * @method ��������
     */
    resetData: function() {
		this.getForm().reset();
    },
	
    /**
     * @method doUpdate �������,����Ҫ���жϽ��յ����Ƿ����,ͬʱ����������м�¼���Ķ�,��Ҫ��֤�к��Ƿ���д(����ҵ���߼�)
     */
    doUpdate: function() {
        var grid = this.grid;
        var receiveNo = this.rn.getValue();
        if (!receiveNo) {
            Ext.Msg.alert('��ʾ', '����д���յ���',
            function() {
                this.rn.focus();
            },
            this);
            return;
        } else {
            var modifyRecord = grid.getStore().getModifiedRecords();
            for (var i = 0,len = modifyRecord.length; i < len; i++) {
                var record = modifyRecord[i];
                if (record.data['seq_no'] == "" || record.data['seq_no'] == 'undefined') {
                    Ext.Msg.alert("��ʾ", "�������е��к�û������,����");
                    return;
                } else {
                    record.data['receive_no'] = receiveNo;
					record.data['key'] = record.data['seq_no'] + '-' + receiveNo ;
                }
            }
            var readOnly = this.rn.readOnly ;
			//�������ֶ�
			if(!grid.checkMustInputField()){
				return ;
			}
            if(!readOnly){ //��ʾ����������,��Ҫ������ͷ����Ϣ,Ȼ����grid��Ϣ
                this.doSaveHeadRecord(receiveNo);
            } else {
                this.doUpdateHeadRecord(receiveNo);//��Ҫ�ж�ͷ���Ƿ��޸�,��ʾ���²���(������pm_receive_detail�����޸�������)
            }
        }
    } ,
    
    /**
     * @method doSaveHeadRecord �ȱ���ͷ����Ϣ,�ɹ����ڱ���grid�ϵ���Ϣ
     * @param {string} receiveNo ���յ���
     */
    doSaveHeadRecord: function(receiveNo) {
		var params = this.getForm().getFieldValues() ;
        params['type_desc'] =  this.bt.getRawValue();
        params['vendor_abv'] =  this.vc.getRawValue();
        params['deliver_abv'] =  this.dc.getRawValue();
        
		Rs.Service.call({
            url: '/rsc/js/examples/demo/pm/receive/detailservice.rsc',
            method: 'doSaveHeadRecord' ,
            params: {
                params: params
            }
        },
        function(result) {
            if (result.success == true) { //�ɹ����ٱ���grid����Ϣ
                this.fireEvent('addheadsuccess', this);
                this.grid.doSave(receiveNo);
            } else {
                Ext.Msg.alert("��ʾ", result.message);
            }
        },
        this);
    } ,
	
	/**
     * @method doUpdateRecord ����
     * @param {string} receiveNo ���յ���
     */
    doUpdateHeadRecord: function(receiveNo) {
		var form = this.getForm();
		var params = this.getForm().getFieldValues() ;
		params['type_desc'] =  this.bt.getRawValue();
		params['vendor_abv'] =  this.vc.getRawValue();
        params['deliver_abv'] =  this.dc.getRawValue();
		if(form.isDirty()){//�ж�ͷ����Ϣ�Ƿ��޸�,true��ʾ�޸�
            Rs.Service.call({
	            url: '/rsc/js/examples/demo/pm/receive/detailservice.rsc',
	            method: 'doUpdateHeadRecord' ,
	            params: {
	                params: params
	            }
	        },
	        function(result) {
	            if (result.success == true) { //�ɹ����ٱ���grid����Ϣ
	                this.fireEvent('addheadsuccess', this);
	                this.grid.doSave(receiveNo);
	            } else {
	                Ext.Msg.alert("��ʾ", result.message);
	            }
	        },
	        this);
		} else {
			this.grid.doSave(receiveNo);
		}
        
    } ,
	
	/**
     * @method checkReceiveNo �����յ����Ƿ��ظ�
     * @param {Ext.form.TextField} textField
     */
	checkReceiveNo : function(textField){
		if(textField.readOnly){//�����ֻ��,��ʾ���޸�
			return ;
		}
        Rs.Service.call({
            url: '/rsc/js/examples/demo/pm/receive/detailservice.rsc',
            method : 'checkRepeatReceiveNo' ,
            params : {
                receiveNo : textField.getValue()
            }
        } , function(result){
                if(result.success == 'false'){
                   Ext.Msg.alert('��ʾ' , result.msg , function(){
                       textField.setValue('') ;
                   } , this);
                }
        } , this);
	}
});