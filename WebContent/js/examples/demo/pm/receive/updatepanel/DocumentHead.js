Rs.define('rs.pm.DocumentHead', {

    extend: Ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
		
		this.grid = config.grid ;
		this.grid.head = this ;
		
        //启动悬停事件
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
                    fieldLabel: '*接收单号',
                    readOnly: true,
                    allowBlank: false,
                    maxLength: 15,
                    blankText: '接收单号不能为空',
                    maxLengthText: '接收单号最大长度为15',
                    tooltipType: 'qtip',
                    listeners: {
                        blur: this.checkReceiveNo
                    }
                }),this.bt = new Rs.ext.form.Telescope({
					id : 'bill_type' ,
                    fieldLabel: '交易类型',
                    singleSelect: true,
                    width: 125,
                    editable: false,
                    labelStyle: 'text-align:right;',
                    progCode: 'billType',
                    valueField: 'BILL_TYPE',
                    displayField: 'TYPE_DESC'
                }), this.vc = new Rs.ext.form.Telescope({
					id : 'vendor_code' ,
                    fieldLabel: '供应商',
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
                                    Ext.Msg.alert("提示", '请先选择采购小组');
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
                    fieldLabel: '采购类型',
                    labelStyle: 'text-align:right;',
                    id : 'special_class',
                    width: 125,
                    triggerAction: 'all',
                    emptyText: 'M-物料',
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
                    fieldLabel: '采购小组',
                    labelStyle: 'text-align:right;',
                    singleSelect: true,
                    progCode: 'groupUser',
                    valueField: 'GROUP_ID',
                    displayField: 'GROUP_NAME'
                }), this.dc = new Rs.ext.form.Telescope({
					id : 'deliver_code' ,
                    fieldLabel: '送货单位',
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
                                    Ext.Msg.alert("提示", '请先选择供应商');
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
                    fieldLabel: '接收日期',
                    labelStyle: 'text-align:right;',
                    width: 125,
                    format: 'Y/m/d'
                }), this.bc = new Rs.ext.form.Telescope({
					id : 'buyer_id' ,
                    fieldLabel: '采购员',
                    labelStyle: 'text-align:right;',
                    progCode: 'buyerCodeNew',
                    valueField: 'PM_GROUP_USER.USER_UNIQUE_ID',
                    displayField: 'PM_USER.USER_NAME',
                    singleSelect: true
                })]
            }],
            tbar: new Ext.Toolbar({
                items: [{
                    text: '删除',
                    iconCls: 'rs-action-remove',
                    scope: this,
                    handler: function() {
                        this.fireEvent('deleterecord', this);
                    }
                },
                {
                    text: '保存',
                    iconCls: 'rs-action-save',
                    scope: this,
                    handler: this.doUpdate,
                    tooltip: "如果是新增操作,将保存头部信息以及表格的信息,如果是更新操作,只将保存表格的信息",
                    tooltipType: "qtip"
                },
                {
                    text: '重置',
                    iconCls: 'rs-action-reset',
                    scope: this,
                    handler: function() {
                        this.fireEvent('resetdata', this);
                    }
                },
                {
                    text: '成批接收',
                    iconCls: 'rs-action-batch',
                    scope: this
                },
                {
                    text: '例外信息',
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
     *  根据记录设置显示数据
     * @param {} rec
     */
    setData: function(rec) {
		this.getForm().loadRecord(rec);
    	/*this.record = rec ;
        this.rn.setValue(rec.get('receive_no')); //接收单号
        this.bt.setValue(rec.get('bill_type')); //交易类型
        this.rd.setValue(rec.get('receive_date')); //接收日期
        this.sc.setValue(rec.get('special_class'));//采购类型
        this.bc.setValue(rec.get('buyer_id')); //采购员
        this.gi.setValue(rec.get('group_id')); //采购小组
        this.gi.on('change', this.vc.setValue.createDelegate(this.vc, [rec.get('vendor_code')]), this, {
            single: true
        }); //供应商
        this.vc.on('change', this.dc.setValue.createDelegate(this.dc, [rec.get('deliver_code')]), this, {
            single: true
        }); //送货单位*/
    },

    /**
     * @method 数据重置
     */
    resetData: function() {
		this.getForm().reset();
    },
	
    /**
     * @method doUpdate 保存操作,首先要先判断接收单号是否存在,同时如果有新增行记录被改动,则要验证行号是否填写(根据业务逻辑)
     */
    doUpdate: function() {
        var grid = this.grid;
        var receiveNo = this.rn.getValue();
        if (!receiveNo) {
            Ext.Msg.alert('提示', '请填写接收单号',
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
                    Ext.Msg.alert("提示", "有新增行的行号没有输入,请检查");
                    return;
                } else {
                    record.data['receive_no'] = receiveNo;
					record.data['key'] = record.data['seq_no'] + '-' + receiveNo ;
                }
            }
            var readOnly = this.rn.readOnly ;
			//检测必输字段
			if(!grid.checkMustInputField()){
				return ;
			}
            if(!readOnly){ //表示是新增操作,需要先新增头部信息,然后还有grid信息
                this.doSaveHeadRecord(receiveNo);
            } else {
                this.doUpdateHeadRecord(receiveNo);//需要判断头部是否修改,表示更新操作(表述对pm_receive_detail数据修改与新增)
            }
        }
    } ,
    
    /**
     * @method doSaveHeadRecord 先保存头部信息,成功后在保存grid上的信息
     * @param {string} receiveNo 接收单号
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
            if (result.success == true) { //成功后再保存grid上信息
                this.fireEvent('addheadsuccess', this);
                this.grid.doSave(receiveNo);
            } else {
                Ext.Msg.alert("提示", result.message);
            }
        },
        this);
    } ,
	
	/**
     * @method doUpdateRecord 更新
     * @param {string} receiveNo 接收单号
     */
    doUpdateHeadRecord: function(receiveNo) {
		var form = this.getForm();
		var params = this.getForm().getFieldValues() ;
		params['type_desc'] =  this.bt.getRawValue();
		params['vendor_abv'] =  this.vc.getRawValue();
        params['deliver_abv'] =  this.dc.getRawValue();
		if(form.isDirty()){//判断头部信息是否修改,true表示修改
            Rs.Service.call({
	            url: '/rsc/js/examples/demo/pm/receive/detailservice.rsc',
	            method: 'doUpdateHeadRecord' ,
	            params: {
	                params: params
	            }
	        },
	        function(result) {
	            if (result.success == true) { //成功后再保存grid上信息
	                this.fireEvent('addheadsuccess', this);
	                this.grid.doSave(receiveNo);
	            } else {
	                Ext.Msg.alert("提示", result.message);
	            }
	        },
	        this);
		} else {
			this.grid.doSave(receiveNo);
		}
        
    } ,
	
	/**
     * @method checkReceiveNo 检查接收单号是否重复
     * @param {Ext.form.TextField} textField
     */
	checkReceiveNo : function(textField){
		if(textField.readOnly){//如果是只读,表示在修改
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
                   Ext.Msg.alert('提示' , result.msg , function(){
                       textField.setValue('') ;
                   } , this);
                }
        } , this);
	}
});