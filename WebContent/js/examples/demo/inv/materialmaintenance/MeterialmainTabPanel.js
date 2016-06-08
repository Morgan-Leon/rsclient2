Rs.define('rs.inv.MeterialmainTabPanel', {

    extend: Ext.TabPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
    	this.other = new rs.inv.MaterialOther();
    	this.productPlan = new rs.inv.MaterialProductionPlan();
    	this.financial = new rs.inv.MaterialFinancialCosts();
    	this.warehouseData = new rs.inv.MaterialWarehouseData();
    	this.commonData = new rs.inv.MaterialCommonData({
    		otherPanel: this.other,
    		productPlanPanel: this.productPlan,
    		financialPanel: this.financial,
    		warehouseDataPanel: this.warehouseData
    	});
    	
    	this.prevBtn = new Ext.Button({
            text: '��һ��',
            iconCls: 'rs-action-previous',
            scope: this,
            handler: function() {
                this.myMask.show();
                this.params.rowIndex = this.params.rowIndex - 1;
                this.doProcessingRecord(this.params);
                this.myMask.hide();
            }
    	});
    	
    	this.nextBtn = new Ext.Button({
            text: '��һ��',
            iconCls: 'rs-action-next',
            scope: this,
            handler: function() {
                this.myMask.show();
                this.params.rowIndex = this.params.rowIndex + 1;
                this.doProcessingRecord(this.params);
                this.myMask.hide();
            }
        });
    	
    	
        config = Rs.apply(config || {},
        {
            autoDestroy: true,
            deferredRender: false,
            activeTab: 0,
            plain: true,
            border: false,
            frame: true,
            items: [{
                title: '��ͨ����',
                border: false,
                layout: 'fit',
                items: [this.commonData]
            },
            {
                title: '�ֿ�����',
                layout: 'fit',
                border: false,
                items: [this.warehouseData]
            },
            {
                title: '����ɱ�',
                layout: 'fit',
                items: [this.financial]
            },
            {
                title: '�����ƻ�',
                layout: 'fit',
                items: [this.productPlan]
            },
            {
                title: 'ר������/����',
                layout: 'fit',
                items: [this.other]
            }],
            bbar: [this.prevBtn,this.nextBtn,
            '->',
            {
                text: '���淵��',
                iconCls: 'rs-action-create',
                scope: this,
                handler: function() {
                    this.doSave(true);
                }
            },
            {
                text: '�������',
                iconCls: 'rs-action-save',
                scope: this,
                handler: this.doSave
            },
            {
                text: '����',
                iconCls: 'rs-action-reset',
                handler: this.resetDataHandler,
                scope: this
            },
            {
                text: '����',
                iconCls: 'rs-action-cancel',
                scope: this,
                handler: function() {
                    this.params.app.close();
                }
            }]
        });

        rs.inv.MeterialmainTabPanel.superclass.constructor.call(this, config);
        
		//���������ϸ��ť������������¼�
        Rs.EventBus.on('meterialgrid-detail', this.doProcessingRecord, this);
        
        this.myMask = new Ext.LoadMask(Ext.getBody(), {
            msg: "Loadding..."
        });
        this.myMask.show();

        this.on('render', function() {
            this.myMask.hide();
        },
        this)
    },

    
	/**
	 * @method ����ͨ������޸�,����������ť.
	 * @param {Object} params
	 */
    doProcessingRecord: function(params) {
        this.params = params;
        var grid = params.grid ,
		    store = grid.store ,
            but = grid.getBottomToolbar() ,
            d = but.getPageData() ,
            ap = d.activePage , //��ǰҳ
            ps = d.pages , //��ҳ��
            record = {} ,
            gsm = grid.getSelectionModel();
		//���ȶ�params.rowIndex�����ж�	
        if (!params.rowIndex) { //˵���˴�������
        	this.commonData.itemCode.setReadOnly(false);
        	this.commonData.itemName.setReadOnly(false);
            this.prevBtn.setDisabled(true);
            this.nextBtn.setDisabled(true);

            record = new store.recordType();
            
            var keys = store.fields.keys;
            for (var i = 0,
            len = keys.length; i < len; i++) {
                record.set(keys[i], '');
            }

            record.set('special_class', 'M');
            record.set('pm_flag', 'Y');
            record.set('om_flag', 'Y');
            record.set('inv_flag', 'Y');
            record.set('self_pm_flag', 'Y');
            record.set('qc_flag', 'Y');
            record.set('valid_flag', 'Y');

            record.set('abc_class', 'A');

            record.set('cost_flag', 'Y');

            record.set('mp_flag', 'M');
            record.set('lot_policy', 'DIR');
            record.set('order_point', '0.00');
            record.set('round_times', '1');
            record.set('scrap_rate', '0.00');
            record.set('mrp_flag', 'M');
            record.set('order_qty', '1.00');
            record.set('lead_days', '0');
            record.set('lot_days', '1');
            record.set('lot_merge_flag', 'A');
            record.set('lead_time', '0');
            record.set('norm_batch', '0.00');
            record.set('plan_constant', '0.00');
            record.set('pseudo_flag', 'S');
            record.set('onhand_flag', 'A');
            record.set('fap_resource', 'A');

            record.set('pac_flag', 'Y');
            record.set('repair_op_flag', 'Y');
            record.set('pdm_material_flag', '');
            record.set('bom_flag', 'Y');
            record.set('material_flag', 'N');
            record.set('coop_db_flag', 'D');
            record.set('qc_trace_type', 'S');
            record.set('set_flag', 'N');
            record.set('input_name', USERINFO.USERNAME);
            record.set('input_date', new Date());
            record.set('company_code', USERINFO.COMPANYCODE);
			
        } else { //�˴�����ϸ��Ϣ
        	this.commonData.itemCode.setReadOnly(true);
        	this.commonData.itemName.setReadOnly(true);
            if (params.rowIndex == 0) { //˵���ǵ�һ������
                if (ap == 1) { //����ǵ�һҳ
                    this.prevBtn.setDisabled(true);
                    this.nextBtn.setDisabled(false);
                } else {
                    this.prevBtn.setDisabled(false);
                    this.nextBtn.setDisabled(false);
                }
                gsm.select(params.rowIndex, 1);
                record = store.getAt(params.rowIndex);
            } else if (params.rowIndex == store.data.length - 1) { //˵�������һ��
                if (ap == ps) { //˵�������һҳ
                    this.prevBtn.setDisabled(false);
                    this.nextBtn.setDisabled(true);
                } else {
                    this.prevBtn.setDisabled(false);
                    this.nextBtn.setDisabled(false);
                }
                gsm.select(params.rowIndex, 1);
                record = store.getAt(params.rowIndex);
            } else {
                if (params.rowIndex < 0) {
                    but.movePrevious();
                    store.on('load', function() {
						params.rowIndex = store.data.length - 1;
                        gsm.select(params.rowIndex, 1);
                        record = store.getAt(params.rowIndex);
                        this.doSetData(record);
                        return;
                    },
                    this);
                } else if (params.rowIndex > store.data.length - 1) {
                    but.moveNext();
                    store.on('load', function() {
	                    params.rowIndex = 0;
                        gsm.select(params.rowIndex, 1);
                        record = store.getAt(params.rowIndex);
                        this.doSetData(record);
                        return;
                    },
                    this);
                } else {
                    gsm.select(params.rowIndex, 1);
                    record = store.getAt(params.rowIndex);
                }
                this.prevBtn.setDisabled(false);
                this.nextBtn.setDisabled(false);
            }
        }
        this.doSetData(record);
    },
    
	/**
	 * @method doSetData ��Ƭ�������ֵ
	 * @param {Object} record
	 */
    doSetData: function(record) {
        this.commonData.getForm().loadRecord(record);
        this.warehouseData.getForm().loadRecord(record);
        this.productPlan.getForm().loadRecord(record);
        this.financial.getForm().loadRecord(record);
        this.other.getForm().loadRecord(record);
    },

	/**
	 * @method resetDataHandler ����,ÿ�����ý����tab�������Ϊ��һ��
	 */
    resetDataHandler: function() {
        this.setActiveTab(0);
        this.commonData.getForm().reset();
        this.warehouseData.getForm().reset();
        this.productPlan.getForm().reset();
        this.financial.getForm().reset();
        this.other.getForm().reset();
    },
    
	/**
	 * @method doSave �������
	 * @param {Object} flag �жϵ������[���淵��]��ť,����[�������]��ť�ı��
	 */
    doSave: function(flag) {
        //������Ҫ�����ֶ�����
        var mustInputField = ['item_code' , 'item_abv' , 'item_name' , 
		                      'stock_unit' , 'second_unit' ,'pm_unit' ,
							  'om_unit' ,'stock2_rate','pm_stock_rate' ,
							  'om_stock_rate' , 'normal_class'];
		//��������ֶ�
        if(!this.doCheckData(mustInputField)){
            return ;
        }
		
        if (this.commonData.biUnitFlag.getValue()) {
        	if (this.commonData.assistUnit.getValue().trim() === '') {
                Ext.Msg.alert('��ʾ', "˫������λ��ѡ��ʱ������������λ����Ϊ��",
                function() {
                	this.commonData.assistUnit.focus();
                });
                return;
            }
        }
        //����������Ƭҳ�ؼ���ֵ
        var commonDataValue = {} , 
	        warehouseDataValue = {},
	        productPlanValue = {},
	        financialValue = {},
	        otherValue = {};
		//��ȡ������Ƭ��BasicForm	
        var cf = this.commonData.getForm(), //
	        wf = this.warehouseData.getForm(),
	        pf = this.productPlan.getForm(),
	        ff = this.financial.getForm(),
	        of = this.other.getForm();
        
		//�����Ƿ��м�¼�޸ĵı��
        var hasModifyRecord = false;
        
		//�ж���ͨ��������Ͽؼ��Ƿ����޸�
        if (cf.isDirty()) {
            hasModifyRecord = true;
            commonDataValue = cf.getFieldValues();
        }
        if (wf.isDirty()) {
            hasModifyRecord = true;
            warehouseDataValue = wf.getFieldValues();
        }
        if (pf.isDirty()) {
            hasModifyRecord = true;
            productPlanValue = pf.getFieldValues();
        }
        if (ff.isDirty()) {
            hasModifyRecord = true;
            financialValue = ff.getFieldValues();
        }
        if (of.isDirty()) {
            hasModifyRecord = true;
            otherValue = of.getFieldValues();
        }

        if (!hasModifyRecord) {
            Ext.Msg.alert("��ʾ", "û���޸�����");
            return;
        }

        Rs.Service.call({
			url: '../materialdefine/MaterialDefineGridDataService.rsc',
            method: 'updateRecord' ,
            params: {
                item_code: this.commonData.itemCode.getValue(),
                data: {
                    commonDataValue: commonDataValue,
                    warehouseDataValue: warehouseDataValue,
                    productPlanValue: productPlanValue,
                    financialValue: financialValue,
                    otherValue: otherValue
                }
            }
        },
        function(result) {
            if (result) { //˵���ɹ�
                if (flag == true) { //˵���Ǳ��淵�ز���,��Ҫ�����ر�
                    this.params.app.close();
                } else { //�����������,��Ҫ����¼���
                    Ext.Msg.alert("��ʾ", "����ɹ�");
                    this.params.rowIndex = undefined;
                    this.doProcessingRecord(this.params);
                    this.params.grid.getBottomToolbar().doRefresh();
                }
            } else {
                Ext.Msg.alert("��ʾ", "����ʧ��");
            }
        },
        this);
    },

	/**
	 * @method doCheckData У������ֶ�,������б����ֶ�δ����ʱ,��������ڴ˿ؼ�
	 * @param {Object} mustInputField
	 */
    doCheckData: function(mustInputField) {
		var len = mustInputField.length ;
        for (var i = 0 ; i < len; i++) {
            if (Ext.getCmp(mustInputField[i]).getValue().trim() === '') {
                this.setActiveTab(0);
                Ext.Msg.alert("��ʾ", "��*�ı�������",function() {
                    Ext.getCmp(mustInputField[i]).focus();
                });
                return false;
            }
        }
		return true ;
    }
});