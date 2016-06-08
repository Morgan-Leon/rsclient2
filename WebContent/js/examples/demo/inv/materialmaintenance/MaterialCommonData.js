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
                    blankText: '���������ϱ���',
                    fieldLabel: '*���ϱ���',
                    readOnly: true
                }),
                this.itemAbv = new Ext.form.TextField({
                    name: 'item_abv',
                    fieldLabel: '*���ϼ��'

                }),
                this.gbCode = new Ext.form.TextField({
                    name: 'gb_code',
                    fieldLabel: '�����'

                }),
                this.drawingNo  = new Ext.form.TextField({
                    name: 'drawing_no',
                    fieldLabel: 'ͼ��'
                }),
                this.memoryCode  = new Ext.form.TextField({
                    name: 'memory_code',
                    fieldLabel: '������'

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
                    blankText: '��������������',
                    name: 'item_name',
                    readOnly: true,
                    fieldLabel: '*��������'
                }),
                this.itemNorm  = new Ext.form.TextField({
                    fieldLabel: '���',
                    name: 'item_norm'
                }),
                this.itemModel  = new Ext.form.TextField({
                    fieldLabel: '�ͺ�',
                    name: 'item_model'
                }),
                this.referCode  = new Ext.form.TextField({
                    fieldLabel: '�ο���',
                    name: 'refer_code'
                }),
                this.featureCode  = new Ext.form.TextField({
                    fieldLabel: '��������',
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
                    fieldLabel: '˫������λ'
                }),
                this.stockUnit = new Rs.ext.form.Telescope({
                    name: 'stock_unit',
                    fieldLabel: '*��浥λ',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.secondUnit = new Rs.ext.form.Telescope({
                    name: 'second_unit',
                    fieldLabel: '*�ڶ���浥λ',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.pmUnit = new Rs.ext.form.Telescope({
                    name: 'pm_unit',
                    fieldLabel: '*�ɹ���λ',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.omUnit = new Rs.ext.form.Telescope({
                    name: 'om_unit',
                    fieldLabel: '*���۵�λ',
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
                    fieldLabel: '����������λ',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.stock2Rate = new Ext.form.TextField({
                    name: 'stock2_rate',
                    fieldLabel: '*�ڶ�/��滻���'

                }),
                this.pmStockRate = new Ext.form.TextField({
                    name: 'pm_stock_rate',
                    fieldLabel: '*�ɹ�/��滻���'

                }),
                this.omStockRate = new Ext.form.TextField({
                    name: 'om_stock_rate',
                    fieldLabel: '*����/��滻���'
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
                    fieldLabel: '*��ͨ����',
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
                    fieldLabel: '�ֿ����',
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
                    fieldLabel: '��������',
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
                    fieldLabel: '�ۺ����',
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
                    fieldLabel: 'ר�÷���',
                    triggerAction: 'all',
                    displayField: 'name',
                    valueField: 'value',
                    mode: 'local',
                    //ʹ�ñ�������
                    emptyText: 'M-����',
                    value: 'M',
                    width: 125,
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'M-����',
                            value: 'M'
                        },
                        {
                            name: 'P-����',
                            value: 'P'
                        },
                        {
                            name: 'T-����',
                            value: 'T'
                        },
                        {
                            name: 'F-����',
                            value: 'F'
                        },
                        {
                            name: 'S-����',
                            value: 'S'
                        },
                        {
                            name: 'K-��װ��',
                            value: 'K'
                        },
                        {
                            name: 'A-������Ʒ',
                            value: 'A'
                        },
                        {
                            name: 'G-����',
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
                    fieldLabel: '���۷���',
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
                    fieldLabel: '�ɹ�����',
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
                    fieldLabel: '�������',
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
                    fieldLabel: '���߷���',
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
                    fieldLabel: '���鹤�շ���',
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
                    fieldLabel: '�ɲɹ�'
                }),
                this.omFlag = new Ext.form.Checkbox({
                    name: 'om_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '������'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
                  this.grpPmFlag = new Ext.form.Checkbox({
                    name: 'grp_pm_flag',
                    inputValue: 'Y',
                    fieldLabel: '�ɲɼ�'
                }),
                
                this.invFlag = new Ext.form.Checkbox({
                    name: 'inv_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '�ɿ��'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
               
                this.selfPmFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '���Բ�'
                }),
                
                this.qcFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '�ɼ���'
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
            	
            	this.admeasureFlag = new Ext.form.Checkbox({
                    name: 'admeasure_flag',
                    inputValue: 'Y',
                    fieldLabel: '������'
                }),
                this.validFlag = new Ext.form.Checkbox({
                    name: 'valid_flag',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: "<span color='red'>��Ч���</span>"
                })]
            },
            {
                columnWidth: .2,
                layout: 'form',
                items: [
                
                this.bsFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    name: 'bs_flag',
                    fieldLabel: "���б�"
                })]
            }]

        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,//���Ϊtrue����������form.reset()�������õ����һ�μ��ص����ݻ�setValues()���ݣ��������һ��ʼ��������ʱ������
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
     * @method checkKeyRepeat ���ϱ��뷴��
     * @param {Ext.form.TextField} tf �ؼ�
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
				
		        this.gbCode.setValue(); //�����
		        this.drawingNo.setValue(); //ͼ��
		        this.memoryCode.setValue(); //������
		        this.referCode.setValue(); //�ο���
				Ext.Msg.alert('��ʾ',result.msg);
				return ;
			}
		} , this);
	} ,
	
	/** 
     * @method codeBackFill ���ϱ��뷴��
     * @param {Ext.form.TextField} textfield �ؼ�
     * @param {string} newValue ����ֵ
     * @param {string} oldValue ��һ�ε�ֵ 
     */ 
	codeBackFill : function(textfield, newValue, oldValue) {
		if(newValue != oldValue){
			this.checkKeyRepeat(newValue);
		}
		
		this.otherPanel.itemCode.setValue(newValue);
		this.productPlanPanel.itemCode.setValue(newValue);
		this.financialPanel.itemCode.setValue(newValue);
		this.warehouseDataPanel.itemCode.setValue(newValue);

        this.gbCode.setValue(newValue); //�����
        this.drawingNo.setValue(newValue); //ͼ��
        this.memoryCode.setValue(newValue); //������
        this.referCode.setValue(newValue); //�ο���
    } ,
	
	/** 
     * @method nameBackFill �������Ʒ���
     * @param {Ext.form.TextField} textfield �ؼ�
     * @param {string} newValue ����ֵ
     * @param {string} oldValue ��һ�ε�ֵ 
     */ 
	nameBackFill : function(textfield, newValue, oldValue) {
        this.otherPanel.itemName.setValue(newValue);
        this.productPlanPanel.itemName.setValue(newValue);
        this.financialPanel.itemName.setValue(newValue);
        this.warehouseDataPanel.itemName.setValue(newValue);
        this.itemAbv.setValue(newValue);
    },
	
	/** 
     * @method unitBackFill ��λ����
     * @param {Ext.form.TextField} textfield �ؼ�
     * @param {string} newValue ����ֵ
     * @param {string} oldValue ��һ�ε�ֵ 
     */ 
	unitBackFill : function(textfield, newValue, oldValue) {
		this.secondUnit.setValue(newValue);
		this.pmUnit.setValue(newValue);
		this.omUnit.setValue(newValue);
    }
});