Rs.define('rs.inv.MaterialOther', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var item1 = [
        
	        this.itemCode = new Ext.form.TextField({
	            name: 'item_code',
	            readOnly: true,
	            xtype: 'textfield',
	            fieldLabel: '物料编码'
	        }),
	        this.routingNo = new Rs.ext.form.Telescope({
	            name: 'routing_no',
	            fieldLabel: '工艺号',
	            singleSelect: true,
	            width: 125,
	            progCode: 'trmRoutingNo',
	            valueField: 'ROUTING_NO',
	            displayField: 'ROUTING_NAME'
        })];

        this.itemName = new Ext.form.TextField({
            id: 'item_name5',
            name: 'item_name',
            readOnly: true,
            fieldLabel: '物料名称'
        });

        var item3 = [
            
        this.pacFlag = new Ext.form.Checkbox({
            id: 'pac_flag',
            name: 'pac_flag',
            inputValue: 'Y',
            fieldLabel: '计划下达标记',
            checked: true
        }),
        
        	this.limitFlag = new Ext.form.Checkbox({
            id: 'limit_flag',
            name: 'limit_flag',
            inputValue: 'Y',
            fieldLabel: '限额领料标记',
            check: true
        }),
    	this.repairFlag = new Ext.form.Checkbox({
            id: 'repair_flag',
            name: 'repair_flag',
            xtype: 'checkbox',
            inputValue: 'Y',
            fieldLabel: '细录单标记',
            check: true
        }),
        
        this.keyClass = new Rs.ext.form.Telescope({
            name: 'key_class',
            fieldLabel: '关键件大类',
            singleSelect: true,
            width: 125,
            progCode: 'edmClass',
            valueField: 'CLASS_CODE',
            displayField: 'CLASS_NAME'
        }), 
        
        this.repairOpFlag = new Ext.form.Checkbox({
            name: 'repair_op_flag',
            inputValue: 'Y',
            fieldLabel: '检修直流标记'
        }),
        
        this.pdmMaterialFlag = new Ext.form.Checkbox({
            name: 'pdm_material_flag',
            inputValue: 'Y',
            fieldLabel: 'PDM读取标记'
        }),
        
        this.pacTraceFlag = new Ext.form.Checkbox({
            name: 'pac_trace_flag',
            inputValue: 'Y',
            fieldLabel: '关键工序跟踪'
        })];

        var item4 = [
          
        this.routingFlag = new Ext.form.Checkbox({
            name: 'routing_flag',
            inputValue: 'Y',
            fieldLabel: '排工序计划'
        }),
        
        this.keyPartFlag = new Ext.form.Checkbox({
            name: 'key_part_flag',
            inputValue: 'Y',
            fieldLabel: '关键件标记'
        }),
        
        this.newOldFlag = new Ext.form.Checkbox({
            name: 'new_old_flag',
            inputValue: 'Y',
            fieldLabel: '旧件标记'
        }),
        
        this.repairListCode = new Rs.ext.form.Telescope({
            name: 'repair_list_code',
            fieldLabel: '细录单模板编码',
            width: 125,
            singleSelect: true,
            progCode: 'Trm_template',
            valueField: 'REPAIR_LIST_CODE',
            displayField: 'REPAIR_LIST_NAME'
        }), 
        
        this.lifePeriod = new Ext.form.TextField({
            name: 'life_period',
            fieldLabel: '使用寿命'
        }),
        
        this.customerSearchFlag = new Ext.form.Checkbox({
            name: 'customer_search_flag',
            inputValue: 'Y',
            fieldLabel: '订单跟踪标记'
        })];

        var item5 = [
        
        this.coopFlag = new Ext.form.Checkbox({
            name: 'coop_flag',
            inputValue: 'Y',
            fieldLabel: '外协'
        }),
        this.bomFlag = new Ext.form.Checkbox({
            name: 'bom_flag',
            inputValue: 'Y',
            fieldLabel: 'BOM标记',
            checked: true
        }),
        
        this.repairPeriod = new Ext.form.TextField({
            name: 'repair_period',
            fieldLabel: '检修周期'
        }),
        this.materialFlag = new Ext.form.ComboBox({
            name: 'material_flag',
            fieldLabel: '工序领料',
            triggerAction: 'all',
            mode: 'local',
            width: 125,
            emptyText: 'N-统一领料',
            valueField: 'value',
            displayField: 'name',
            value: 'N',
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'Y-工序领料',
                    value: 'Y'
                },
                {
                    name: 'N-统一领料',
                    value: 'N'
                }]
            })
        }),
        
        this.newRate = new Ext.form.TextField({
            name: 'new_rate',
            fieldLabel: '换新率'
        }),
        
        this.checkDeptCode = new Rs.ext.form.Telescope({
            name: 'check_dept_code',
            fieldLabel: '分解部门',
            width: 125,
            singleSelect: true,
            progCode: 'deptCode',
            valueField: 'DEPT_CODE',
            displayField: 'DEPT_NAME'
        }),
        
        this.opDiffFlag = new Ext.form.Checkbox({
            name: 'op_diff_flag',
            inputValue: 'Y',
            fieldLabel: '工序BOM增补定义'
        })];

        var item6 = [
         
         this.coopDbFlag = new Ext.form.ComboBox({
            name: 'coop_db_flag',
            fieldLabel: '带料标记',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'D-带料',
            valueField: 'value',
            displayField: 'name',
            value: 'D',
            width: 125,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'D-带料',
                    value: 'D'
                },
                {
                    name: 'B-不带料',
                    value: 'B'
                }]
            })
        }),
        
        this.straightSendFlag = new Ext.form.ComboBox({
            name: 'straight_send_flag',
            inputValue: 'Y',
            fieldLabel: '直送标记:'
        }),
        
        this.qcTraceType = new Ext.form.ComboBox({
            name: 'qc_trace_type',
            fieldLabel: '质量跟踪方式',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'S-单件',
            valueField: 'value',
            displayField: 'name',
            value: 'S',
            width: 125,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'S-单件',
                    value: 'S'
                },
                {
                    name: 'V-供应商',
                    value: 'V'
                },
                {
                    name: 'P-批次',
                    value: 'P'
                }]
            })
        }),
        
        this.setFlag = new Ext.form.ComboBox({
            name: 'set_flag',
            fieldLabel: '套件标记',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'N-普通',
            valueField: 'value',
            displayField: 'name',
            width: 125,
            value: 'N',
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'N-普通',
                    value: 'N'
                },
                {
                    name: 'Y-套件',
                    value: 'Y'
                }]
            })
        }),
        
        this.leadTimeCheck = new Ext.form.TextField({
            name: 'lead_time_check',
            xtype: 'textfield',
            fieldLabel: '分解提前期'
        }),
        
        this.csmFlag = new Ext.form.TextField({
            name: 'csm_flag',
            inputValue: 'Y',
            fieldLabel: '售后服务标记'
        })];

        var item7 = [
        
        this.materialMan = new Rs.ext.form.Telescope({
            name: 'material_man',
            fieldLabel: '送料人',
            width: 125,
            singleSelect: true,
            progCode: 'edmAddress',
            valueField: 'ACCOUNT_ID',
            displayField: 'ACCOUNT_NAME'
        }), 
        
        this.itemVolume = new Ext.form.TextField({
            name: 'item_volume',
            fieldLabel: '单件体积:'
        }),
        
        this.itemSquare = new Ext.form.TextField({
            name: 'item_square',
            fieldLabel: '单位面积'
        })];

        var item8 = [
        /*
		 * { //id : 'create_flag' , xtype : 'textfield' , fieldLabel : '生成方式
		 * (这里需要修改)' },
		 */
        this.volumeUnit = new Rs.ext.form.Telescope({
            name: 'volume_unit',
            fieldLabel: '体积单位',
            width: 125,
            singleSelect: true,
            progCode: 'unit',
            valueField: 'UNIT_CODE',
            displayField: 'UNIT_NAME'
        }), 
        
        this.squareUnit = new Rs.ext.form.Telescope({
            name: 'square_unit',
            fieldLabel: '面积单位',
            width: 125,
            singleSelect: true,
            progCode: 'unit',
            valueField: 'UNIT_CODE',
            displayField: 'UNIT_NAME'
        })];

        var item9 = [
        
        this.companyCode = new Ext.form.TextField({
            name: 'company_code',
            fieldLabel: "公司号"
        }),
        
        this.inputName = new Ext.form.TextField({
            name: 'input_name',
            fieldLabel: '录入人',
            readOnly: true,
            value: USERINFO.USERNAME
        })];

        var item10 = [
          
          this.companyName = new Rs.ext.form.Telescope({
            name: 'company_name',
            fieldLabel: '公司名称',
            width: 125,
            singleSelect: true,
            progCode: 'company',
            valueField: 'COMPANY_CODE',
            displayField: 'COMPANY_NAME',
            listeners: {
                change: function(e, v, ov) {
                    Ext.getCmp('company_code').setValue(v);
                }
            }
        }), this.df = new Rs.ext.form.DateField({
            name: 'input_date',
            fieldLabel: '录入时间',
            width: 125,
            format: 'y/m/d'
        })];

        var materialData = [{
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: item1
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: this.itemName5
            }]
        }];

        var unit = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: item3
                },
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: item4
                }]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: item5
                },
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: item6
                }]
            }]
        };

        var classification = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: item7
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: item8
            }]
        };

        var source = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: item9
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: item10
            }]
        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            frame: true,
            labelAlign: 'right',
            autoScroll: true,
            items: [materialData, unit, classification, source]
        });
        rs.inv.MaterialOther.superclass.constructor.call(this, config);
    }
});