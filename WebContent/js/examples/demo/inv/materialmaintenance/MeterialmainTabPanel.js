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
            text: '上一条',
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
            text: '下一条',
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
                title: '普通资料',
                border: false,
                layout: 'fit',
                items: [this.commonData]
            },
            {
                title: '仓库资料',
                layout: 'fit',
                border: false,
                items: [this.warehouseData]
            },
            {
                title: '财务成本',
                layout: 'fit',
                items: [this.financial]
            },
            {
                title: '生产计划',
                layout: 'fit',
                items: [this.productPlan]
            },
            {
                title: '专项生产/其他',
                layout: 'fit',
                items: [this.other]
            }],
            bbar: [this.prevBtn,this.nextBtn,
            '->',
            {
                text: '保存返回',
                iconCls: 'rs-action-create',
                scope: this,
                handler: function() {
                    this.doSave(true);
                }
            },
            {
                text: '保存继续',
                iconCls: 'rs-action-save',
                scope: this,
                handler: this.doSave
            },
            {
                text: '重置',
                iconCls: 'rs-action-reset',
                handler: this.resetDataHandler,
                scope: this
            },
            {
                text: '返回',
                iconCls: 'rs-action-cancel',
                scope: this,
                handler: function() {
                    this.params.app.close();
                }
            }]
        });

        rs.inv.MeterialmainTabPanel.superclass.constructor.call(this, config);
        
		//监听点击详细按钮或者新增按妞事件
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
	 * @method 处理通过点击修改,或者新增按钮.
	 * @param {Object} params
	 */
    doProcessingRecord: function(params) {
        this.params = params;
        var grid = params.grid ,
		    store = grid.store ,
            but = grid.getBottomToolbar() ,
            d = but.getPageData() ,
            ap = d.activePage , //当前页
            ps = d.pages , //总页数
            record = {} ,
            gsm = grid.getSelectionModel();
		//首先对params.rowIndex进行判断	
        if (!params.rowIndex) { //说明此处是新增
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
			
        } else { //此处是详细信息
        	this.commonData.itemCode.setReadOnly(true);
        	this.commonData.itemName.setReadOnly(true);
            if (params.rowIndex == 0) { //说明是第一条数据
                if (ap == 1) { //如果是第一页
                    this.prevBtn.setDisabled(true);
                    this.nextBtn.setDisabled(false);
                } else {
                    this.prevBtn.setDisabled(false);
                    this.nextBtn.setDisabled(false);
                }
                gsm.select(params.rowIndex, 1);
                record = store.getAt(params.rowIndex);
            } else if (params.rowIndex == store.data.length - 1) { //说明是最后一条
                if (ap == ps) { //说明在最后一页
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
	 * @method doSetData 卡片面板设置值
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
	 * @method resetDataHandler 重置,每次重置将活动的tab面板设置为第一个
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
	 * @method doSave 保存操作
	 * @param {Object} flag 判断点击的是[保存返回]按钮,还是[保存继续]按钮的标记
	 */
    doSave: function(flag) {
        //创建需要检测的字段数组
        var mustInputField = ['item_code' , 'item_abv' , 'item_name' , 
		                      'stock_unit' , 'second_unit' ,'pm_unit' ,
							  'om_unit' ,'stock2_rate','pm_stock_rate' ,
							  'om_stock_rate' , 'normal_class'];
		//检测必输的字段
        if(!this.doCheckData(mustInputField)){
            return ;
        }
		
        if (this.commonData.biUnitFlag.getValue()) {
        	if (this.commonData.assistUnit.getValue().trim() === '') {
                Ext.Msg.alert('提示', "双计量单位被选中时，辅助计量单位不能为空",
                function() {
                	this.commonData.assistUnit.focus();
                });
                return;
            }
        }
        //声明各个卡片页控件的值
        var commonDataValue = {} , 
	        warehouseDataValue = {},
	        productPlanValue = {},
	        financialValue = {},
	        otherValue = {};
		//获取各个卡片的BasicForm	
        var cf = this.commonData.getForm(), //
	        wf = this.warehouseData.getForm(),
	        pf = this.productPlan.getForm(),
	        ff = this.financial.getForm(),
	        of = this.other.getForm();
        
		//声明是否有记录修改的标记
        var hasModifyRecord = false;
        
		//判断普通资料面板上控件是否有修改
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
            Ext.Msg.alert("提示", "没有修改数据");
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
            if (result) { //说明成功
                if (flag == true) { //说明是保存返回操作,需要将面板关闭
                    this.params.app.close();
                } else { //保存继续操作,需要将记录清空
                    Ext.Msg.alert("提示", "保存成功");
                    this.params.rowIndex = undefined;
                    this.doProcessingRecord(this.params);
                    this.params.grid.getBottomToolbar().doRefresh();
                }
            } else {
                Ext.Msg.alert("提示", "保存失败");
            }
        },
        this);
    },

	/**
	 * @method doCheckData 校验必输字段,当检测有必输字段未输入时,将光标置于此控件
	 * @param {Object} mustInputField
	 */
    doCheckData: function(mustInputField) {
		var len = mustInputField.length ;
        for (var i = 0 ; i < len; i++) {
            if (Ext.getCmp(mustInputField[i]).getValue().trim() === '') {
                this.setActiveTab(0);
                Ext.Msg.alert("提示", "带*的必须输入",function() {
                    Ext.getCmp(mustInputField[i]).focus();
                });
                return false;
            }
        }
		return true ;
    }
});