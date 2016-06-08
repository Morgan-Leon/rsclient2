Rs.define('rs.inv.MaterialCommonData', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        Ext.QuickTips.init();

        var materialData = [{
            layout: 'column',
            xtype: 'fieldset',
            border: true,
            frame: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                labelAlign: 'right',
                items: [this.itemCode = new Ext.form.TextField({
                    name: 'item_code',
                    allowBlank: false,
                    msgTarget: 'side',
                    blankText: '请输入物料编码',
                    fieldLabel: '*物料编码',
                    readOnly: true
                }),
                this.itemAbv = new Ext.form.TextField({
                    name: 'item_abv',
                    fieldLabel: '*物料简称'

                }),
                this.gbCode = new Ext.form.TextField({
                    name: 'gb_code',
                    fieldLabel: '国标号'

                }),
                this.drawingNo  = new Ext.form.TextField({
                    name: 'drawing_no',
                    fieldLabel: '图号'
                }),
                this.memoryCode  = new Ext.form.TextField({
                    name: 'memory_code',
                    fieldLabel: '助记码'

                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                labelAlign: 'right',
                items: [
                    this.itemName  = new Ext.form.TextField({
                    allowBlank: false,
                    msgTarget: 'side',
                    blankText: '请输入物料名称',
                    name: 'item_name',
                    readOnly: true,
                    fieldLabel: '*物料名称'
                }),
                this.itemNorm  = new Ext.form.TextField({
                    fieldLabel: '规格',
                    name: 'item_norm'
                }),
                this.itemModel  = new Ext.form.TextField({
                    fieldLabel: '型号',
                    name: 'item_model'
                }),
                this.referCode  = new Ext.form.TextField({
                    fieldLabel: '参考号',
                    name: 'refer_code'
                }),
                this.featureCode  = new Ext.form.TextField({
                    fieldLabel: '特征编码',
                    name: 'feature_code'
                })]
            }]
        }];

        var unit = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [this.biUnitFlag  = new Ext.form.TextField({
                    inputValue: 'Y',
                    name: 'bi_unit_flag',
                    fieldLabel: '双计量单位'
                }),
                this.stockUnit = new Rs.ext.form.Telescope({
                    name: 'stock_unit',
                    fieldLabel: '*库存单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.secondUnit = new Rs.ext.form.Telescope({
                    name: 'second_unit',
                    fieldLabel: '*第二库存单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.pmUnit = new Rs.ext.form.Telescope({
                    name: 'pm_unit',
                    fieldLabel: '*采购单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.omUnit = new Rs.ext.form.Telescope({
                    name: 'om_unit',
                    fieldLabel: '*销售单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [
                this.assistUnit = new Rs.ext.form.Telescope({
                    name: 'assist_unit',
                    fieldLabel: '辅助计量单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.stock2Rate = new Ext.form.TextField({
                    name: 'stock2_rate',
                    fieldLabel: '*第二/库存换算比'

                }),
                this.pmStockRate = new Ext.form.TextField({
                    name: 'pm_stock_rate',
                    fieldLabel: '*采购/库存换算比'

                }),
                this.omStockRate = new Ext.form.TextField({
                    name: 'om_stock_rate',
                    fieldLabel: '*销售/库存换算比'
                })]
            }]
        };

        var classification = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [
                
                this.normalClass = new Rs.ext.form.Telescope({
                    name: 'normal_class',
                    fieldLabel: '*普通分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='G' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.invClass = new Rs.ext.form.Telescope({
                    name: 'inv_class',
                    fieldLabel: '仓库分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='W' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.qcClass = new Rs.ext.form.Telescope({
                    name: 'qc_class',
                    fieldLabel: '质量分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='Q' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.svClass = new Rs.ext.form.Telescope({
                    name: 'sv_class',
                    fieldLabel: '售后分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='A' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.specialClass = new Ext.form.ComboBox({
                    name: 'special_class',
                    fieldLabel: '专用分类',
                    triggerAction: 'all',
                    displayField: 'name',
                    valueField: 'value',
                    mode: 'local',
                    //使用本地数据
                    emptyText: 'M-物料',
                    value: 'M',
                    width: 125,
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'M-物料',
                            value: 'M'
                        },
                        {
                            name: 'P-备件',
                            value: 'P'
                        },
                        {
                            name: 'T-工具',
                            value: 'T'
                        },
                        {
                            name: 'F-费用',
                            value: 'F'
                        },
                        {
                            name: 'S-服务',
                            value: 'S'
                        },
                        {
                            name: 'K-包装物',
                            value: 'K'
                        },
                        {
                            name: 'A-辅助产品',
                            value: 'A'
                        },
                        {
                            name: 'G-其他',
                            value: 'G'
                        }]
                    })
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [
                        
                this.omClass = new Rs.ext.form.Telescope({
                    name: 'om_class',
                    fieldLabel: '销售分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='S' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.pmClass = new Rs.ext.form.Telescope({
                    name: 'pm_class',
                    fieldLabel: '采购分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='P' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.glClass = new Rs.ext.form.Telescope({
                    name: 'gl_class',
                    fieldLabel: '财务分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='F' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.toolClass = new Rs.ext.form.Telescope({
                    name: 'tool_class',
                    fieldLabel: '工具分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='T' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                }), 
                this.groupCode = new Rs.ext.form.Telescope({
                    name: 'group_code',
                    fieldLabel: '成组工艺分类',
                    singleSelect: true,
                    width: 125,
                    progCode: 'edmClass',
                    buildProgCondtion: function(progCondition) {
                        return " class_flag='R' and leaf_flag = 'Y' " + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    },
                    valueField: 'CLASS_CODE',
                    displayField: 'CLASS_NAME'
                })]
            }]
        };

        var source = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .2,
                layout: 'form',
                items: [
                this.pmFlag  = new Ext.form.Checkbox({
                    name: 'pm_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '可采购'
                }),
                this.omFlag = new Ext.form.Checkbox({
                    name: 'om_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '可销售'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
                  this.grpPmFlag = new Ext.form.Checkbox({
                    name: 'grp_pm_flag',
                    inputValue: 'Y',
                    fieldLabel: '可采集'
                }),
                
                this.invFlag = new Ext.form.Checkbox({
                    name: 'inv_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '可库存'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
               
                this.selfPmFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '可自采'
                }),
                
                this.qcFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '可检验'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
            	
            	this.admeasureFlag = new Ext.form.Checkbox({
                    name: 'admeasure_flag',
                    inputValue: 'Y',
                    fieldLabel: '可配送'
                }),
                this.validFlag = new Ext.form.Checkbox({
                    name: 'valid_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: "<span color='red'>有效标记</span>"
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
                
                this.bsFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    name: 'bs_flag',
                    fieldLabel: "可招标"
                })]
            }]

        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,//如果为true，则表单对象的form.reset()方法重置到最后一次加载的数据或setValues()数据，以相对于一开始创建表单那时的数据
            autoDestroy: true,
            frame: true,
            border: false,
            labelAlign: 'right',
            autoScroll: true,
            items: [materialData, unit, classification, source]
        });
        rs.inv.MaterialCommonData.superclass.constructor.call(this, config);
		
        this.itemCode.on('change',this.codeBackFill,this);
		
        
        this.itemName.on('change',this.nameBackFill, this);
        
        this.stockUnit.on('change',this.unitBackFill, this);
    } ,
	
	/** 
     * @method checkKeyRepeat 物料编码反填
     * @param {Ext.form.TextField} tf 控件
     */
	checkKeyRepeat : function(value){
		Rs.Service.call({
		   url: '../materialdefine/MaterialDefineGridDataService.rsc',
		   method : 'checkKeyRepeat' ,
		   params : {
		      itemCode : value
		   }
		} , function(result){
			if(result.success === 'false'){
				this.itemCode.setValue();
				this.warehouseDataPanel.itemCode.setValue();
				this.financialPanel.itemCode.setValue();
				this.productPlanPanel.itemCode.setValue();
				this.otherPanel.itemCode.setValue();
				
		        this.gbCode.setValue(); //国标号
		        this.drawingNo.setValue(); //图号
		        this.memoryCode.setValue(); //助记码
		        this.referCode.setValue(); //参考号
				Ext.Msg.alert('提示',result.msg);
				return ;
			}
		} , this);
	} ,
	
	/** 
     * @method codeBackFill 物料编码反填
     * @param {Ext.form.TextField} textfield 控件
     * @param {string} newValue 最新值
     * @param {string} oldValue 上一次的值 
     */ 
	codeBackFill : function(textfield, newValue, oldValue) {
		if(newValue != oldValue){
			this.checkKeyRepeat(newValue);
		}
		
		this.otherPanel.itemCode.setValue(newValue);
		this.productPlanPanel.itemCode.setValue(newValue);
		this.financialPanel.itemCode.setValue(newValue);
		this.warehouseDataPanel.itemCode.setValue(newValue);

        this.gbCode.setValue(newValue); //国标号
        this.drawingNo.setValue(newValue); //图号
        this.memoryCode.setValue(newValue); //助记码
        this.referCode.setValue(newValue); //参考号
    } ,
	
	/** 
     * @method nameBackFill 物料名称反填
     * @param {Ext.form.TextField} textfield 控件
     * @param {string} newValue 最新值
     * @param {string} oldValue 上一次的值 
     */ 
	nameBackFill : function(textfield, newValue, oldValue) {
        this.otherPanel.itemName.setValue(newValue);
        this.productPlanPanel.itemName.setValue(newValue);
        this.financialPanel.itemName.setValue(newValue);
        this.warehouseDataPanel.itemName.setValue(newValue);
        this.itemAbv.setValue(newValue);
    },
	
	/** 
     * @method unitBackFill 单位反填
     * @param {Ext.form.TextField} textfield 控件
     * @param {string} newValue 最新值
     * @param {string} oldValue 上一次的值 
     */ 
	unitBackFill : function(textfield, newValue, oldValue) {
		this.secondUnit.setValue(newValue);
		this.pmUnit.setValue(newValue);
		this.omUnit.setValue(newValue);
    }
});