Rs.define('rs.inv.MaterialOther', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var item1 = [
        
	        this.itemCode = new Ext.form.TextField({
	            name: 'item_code',
	            readOnly: true,
	            xtype: 'textfield',
	            fieldLabel: '���ϱ���'
	        }),
	        this.routingNo = new Rs.ext.form.Telescope({
	            name: 'routing_no',
	            fieldLabel: '���պ�',
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
            fieldLabel: '��������'
        });

        var item3 = [
            
        this.pacFlag = new Ext.form.Checkbox({
            id: 'pac_flag',
            name: 'pac_flag',
            inputValue: 'Y',
            fieldLabel: '�ƻ��´���',
            checked: true
        }),
        
        	this.limitFlag = new Ext.form.Checkbox({
            id: 'limit_flag',
            name: 'limit_flag',
            inputValue: 'Y',
            fieldLabel: '�޶����ϱ��',
            check: true
        }),
    	this.repairFlag = new Ext.form.Checkbox({
            id: 'repair_flag',
            name: 'repair_flag',
            xtype: 'checkbox',
            inputValue: 'Y',
            fieldLabel: 'ϸ¼�����',
            check: true
        }),
        
        this.keyClass = new Rs.ext.form.Telescope({
            name: 'key_class',
            fieldLabel: '�ؼ�������',
            singleSelect: true,
            width: 125,
            progCode: 'edmClass',
            valueField: 'CLASS_CODE',
            displayField: 'CLASS_NAME'
        }), 
        
        this.repairOpFlag = new Ext.form.Checkbox({
            name: 'repair_op_flag',
            inputValue: 'Y',
            fieldLabel: '����ֱ�����'
        }),
        
        this.pdmMaterialFlag = new Ext.form.Checkbox({
            name: 'pdm_material_flag',
            inputValue: 'Y',
            fieldLabel: 'PDM��ȡ���'
        }),
        
        this.pacTraceFlag = new Ext.form.Checkbox({
            name: 'pac_trace_flag',
            inputValue: 'Y',
            fieldLabel: '�ؼ��������'
        })];

        var item4 = [
          
        this.routingFlag = new Ext.form.Checkbox({
            name: 'routing_flag',
            inputValue: 'Y',
            fieldLabel: '�Ź���ƻ�'
        }),
        
        this.keyPartFlag = new Ext.form.Checkbox({
            name: 'key_part_flag',
            inputValue: 'Y',
            fieldLabel: '�ؼ������'
        }),
        
        this.newOldFlag = new Ext.form.Checkbox({
            name: 'new_old_flag',
            inputValue: 'Y',
            fieldLabel: '�ɼ����'
        }),
        
        this.repairListCode = new Rs.ext.form.Telescope({
            name: 'repair_list_code',
            fieldLabel: 'ϸ¼��ģ�����',
            width: 125,
            singleSelect: true,
            progCode: 'Trm_template',
            valueField: 'REPAIR_LIST_CODE',
            displayField: 'REPAIR_LIST_NAME'
        }), 
        
        this.lifePeriod = new Ext.form.TextField({
            name: 'life_period',
            fieldLabel: 'ʹ������'
        }),
        
        this.customerSearchFlag = new Ext.form.Checkbox({
            name: 'customer_search_flag',
            inputValue: 'Y',
            fieldLabel: '�������ٱ��'
        })];

        var item5 = [
        
        this.coopFlag = new Ext.form.Checkbox({
            name: 'coop_flag',
            inputValue: 'Y',
            fieldLabel: '��Э'
        }),
        this.bomFlag = new Ext.form.Checkbox({
            name: 'bom_flag',
            inputValue: 'Y',
            fieldLabel: 'BOM���',
            checked: true
        }),
        
        this.repairPeriod = new Ext.form.TextField({
            name: 'repair_period',
            fieldLabel: '��������'
        }),
        this.materialFlag = new Ext.form.ComboBox({
            name: 'material_flag',
            fieldLabel: '��������',
            triggerAction: 'all',
            mode: 'local',
            width: 125,
            emptyText: 'N-ͳһ����',
            valueField: 'value',
            displayField: 'name',
            value: 'N',
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'Y-��������',
                    value: 'Y'
                },
                {
                    name: 'N-ͳһ����',
                    value: 'N'
                }]
            })
        }),
        
        this.newRate = new Ext.form.TextField({
            name: 'new_rate',
            fieldLabel: '������'
        }),
        
        this.checkDeptCode = new Rs.ext.form.Telescope({
            name: 'check_dept_code',
            fieldLabel: '�ֽⲿ��',
            width: 125,
            singleSelect: true,
            progCode: 'deptCode',
            valueField: 'DEPT_CODE',
            displayField: 'DEPT_NAME'
        }),
        
        this.opDiffFlag = new Ext.form.Checkbox({
            name: 'op_diff_flag',
            inputValue: 'Y',
            fieldLabel: '����BOM��������'
        })];

        var item6 = [
         
         this.coopDbFlag = new Ext.form.ComboBox({
            name: 'coop_db_flag',
            fieldLabel: '���ϱ��',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'D-����',
            valueField: 'value',
            displayField: 'name',
            value: 'D',
            width: 125,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'D-����',
                    value: 'D'
                },
                {
                    name: 'B-������',
                    value: 'B'
                }]
            })
        }),
        
        this.straightSendFlag = new Ext.form.ComboBox({
            name: 'straight_send_flag',
            inputValue: 'Y',
            fieldLabel: 'ֱ�ͱ��:'
        }),
        
        this.qcTraceType = new Ext.form.ComboBox({
            name: 'qc_trace_type',
            fieldLabel: '�������ٷ�ʽ',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'S-����',
            valueField: 'value',
            displayField: 'name',
            value: 'S',
            width: 125,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'S-����',
                    value: 'S'
                },
                {
                    name: 'V-��Ӧ��',
                    value: 'V'
                },
                {
                    name: 'P-����',
                    value: 'P'
                }]
            })
        }),
        
        this.setFlag = new Ext.form.ComboBox({
            name: 'set_flag',
            fieldLabel: '�׼����',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'N-��ͨ',
            valueField: 'value',
            displayField: 'name',
            width: 125,
            value: 'N',
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{
                    name: 'N-��ͨ',
                    value: 'N'
                },
                {
                    name: 'Y-�׼�',
                    value: 'Y'
                }]
            })
        }),
        
        this.leadTimeCheck = new Ext.form.TextField({
            name: 'lead_time_check',
            xtype: 'textfield',
            fieldLabel: '�ֽ���ǰ��'
        }),
        
        this.csmFlag = new Ext.form.TextField({
            name: 'csm_flag',
            inputValue: 'Y',
            fieldLabel: '�ۺ������'
        })];

        var item7 = [
        
        this.materialMan = new Rs.ext.form.Telescope({
            name: 'material_man',
            fieldLabel: '������',
            width: 125,
            singleSelect: true,
            progCode: 'edmAddress',
            valueField: 'ACCOUNT_ID',
            displayField: 'ACCOUNT_NAME'
        }), 
        
        this.itemVolume = new Ext.form.TextField({
            name: 'item_volume',
            fieldLabel: '�������:'
        }),
        
        this.itemSquare = new Ext.form.TextField({
            name: 'item_square',
            fieldLabel: '��λ���'
        })];

        var item8 = [
        /*
		 * { //id : 'create_flag' , xtype : 'textfield' , fieldLabel : '���ɷ�ʽ
		 * (������Ҫ�޸�)' },
		 */
        this.volumeUnit = new Rs.ext.form.Telescope({
            name: 'volume_unit',
            fieldLabel: '�����λ',
            width: 125,
            singleSelect: true,
            progCode: 'unit',
            valueField: 'UNIT_CODE',
            displayField: 'UNIT_NAME'
        }), 
        
        this.squareUnit = new Rs.ext.form.Telescope({
            name: 'square_unit',
            fieldLabel: '�����λ',
            width: 125,
            singleSelect: true,
            progCode: 'unit',
            valueField: 'UNIT_CODE',
            displayField: 'UNIT_NAME'
        })];

        var item9 = [
        
        this.companyCode = new Ext.form.TextField({
            name: 'company_code',
            fieldLabel: "��˾��"
        }),
        
        this.inputName = new Ext.form.TextField({
            name: 'input_name',
            fieldLabel: '¼����',
            readOnly: true,
            value: USERINFO.USERNAME
        })];

        var item10 = [
          
          this.companyName = new Rs.ext.form.Telescope({
            name: 'company_name',
            fieldLabel: '��˾����',
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
            fieldLabel: '¼��ʱ��',
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