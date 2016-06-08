Rs.define('rs.inv.WarehouseDefinitionGrid', {
	
    extend: Ext.grid.EditorGridPanel,   //�̳���EditorGridPanel
    
    constructor: function(config) {
		
    	Ext.QuickTips.init();  //������ʾ
		
		var url = '../warehousedefine/WarehouseDefinitionGridDataService.rsc' ;
		
        var store = new Rs.ext.data.Store({ //����Դ
            autoLoad: false , //�Զ�����
            autoDestroy: true , //�Զ�����
            url: url , //�����ַ
            idProperty: 'WAREHOUSE_CODE', //store����
            fields: ['WAREHOUSE_CODE', 'WAREHOUSE_NAME', 'WAREHOUSE_ADDR', 'MP_FLAG',    //����Դ�ֶ��б�
			         'MANAGEMENT_FLAG', 'TOTAL_QTY_FLAG', 'NEGATIVE_QTY_FLAG', 
					 'CHECK_BILL_FLAG', 'NOW_PERIOD', 'PURCHASE_DEPT_CODE', 
					 'PURCHASE_DEPT_NAME', 'MONTH_CLOSE_FLAG', 'SET_CODE', 
					 'SET_NAME', 'LTK_FLAG', 'NUM_OF_KIND', 'CHANGEOVER_DATE']
        });
		
		//�ֿ����༭��
		this.warehouseCodeEditor = new Ext.form.TextField({
			maxLength : 4 ,
			selectOnFocus : true //��ý���ʱ������ȫѡ
        }) ;
		
		this.warehouseNameEditor = new Ext.form.TextField({
			maxLength : 20
		}) ;
		
		this.warehouseAddrEditor = new Ext.form.TextField({
			maxLength : 30
		}) ;
		
		//�ֿ����ͱ༭��
		this.mpFlagEditor =  new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            editable : false ,
            mode: 'local',//ʹ�ñ�������
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '�ɹ�����',value: 'P'},
                       {name: '���Ƽ���',value: 'M'}]
            })
        }) ;
		
		//����ʽ�༭��
        this.managementFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            editable : false ,
            mode: 'local',//ʹ�ñ�������
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '���ֿ����',value: 'W'},
                       {name: '����������',value: 'B'},
				       {name: '����λ����',value: 'L'}]
            })
        }) ;
        
		//�ƻ�ʹ�òֿ�༭��
		this.totalQtyFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '��',value: 'Y'},{name: '��',value: 'N'}]
            })
        }) ;
		
		//��������Ǳ༭��
		this.negativeQtyFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '����',value: 'Y'},
                       {name: '������',value: 'N'}]
            })
        });
		
		//������˱�Ǳ༭��
		this.checkBillFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '��',value: 'Y'},
                       {name: '��',value: 'N'}]
            })
        }) ;
		
		//��ǰ�����ڱ༭��
		this.nowPeriodEditor = new Rs.ext.form.PeriodField({
            format: 'Y/m'
        }) ;
		
		//�ɹ��������Ʊ༭��
		this.purchaseDeptNameEditor = new Rs.ext.form.Telescope({
            progCode: 'deptCode',
            singleSelect: false ,
            //allowBlank : false ,
            valueField: 'DEPT_NAME',
            displayField: 'DEPT_NAME',
            listeners : {
            	select : function(telesope, record, value, display){
            		var a = this ;
            	}
            }
        }) ;
		
		//�½���Ʊ༭��
		this.monthCloseFlagEditor = new Ext.form.ComboBox({
            mode: 'remote',
            triggerAction: 'all',
			editable : false,
			allowBlank : false,
			selectOnFocus : true ,
			editable : false ,
            displayField: 'typeDesc',
            valueField: 'typeCode',
            store: new Rs.ext.data.Store({
                url: '../warehousedefine/InvMonthCloseParam.rsc' ,
				autoLoad : true ,
                fields: ['typeCode', 'typeDesc']
            })
        }) ;
		
		//�������Ʊ༭��
		this.setNameEditor = new Rs.ext.form.Telescope({
            progCode: 'pmWare',
            valueField: 'WAREHOUSE_NAME',
            singleSelect: true,
            displayField: 'WAREHOUSE_NAME'
        })
		
		//������Ǳ༭��
		this.ltkFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '��',value: 'Y'},
                       {name: '��',value: 'N'}]
            })
        }) ;
		
		
		//�ֿ�������Ⱦ��
		this.mpFlagRenderer = function(v) {
            if ('P' == v) {
                return "�ɹ�����";
            } else if ('M' == v) {
                return "���Ƽ���";
            } else {
                return "";
            }
        } ;
        
		//����ʽ��Ⱦ��
		this.managementFlagRenderer = function(v) {
            if ('W' == v) {
                return "���ֿ����";
            } else if ('B' == v) {
                return "����������";
            } else if ('L' == v) {
                return "����λ����"
            } else {
                return '';
            }
        } ;
        
		//�ƻ�ʹ�òֿ���Ⱦ��
		this.totalQtyFlagRenderer = function(v) {
            if ('Y' == v) {
                return "<span style='color:red'>��</span>";
            } else if ('N' == v) {
                return "<span style='color:green'>��</span>";
            } else {
                return "";
            }
        } ;
		
		//�����������Ⱦ��
		this.negativeQtyFlagRenderer = function(v) {
            if ('Y' == v) {
                return "<font color='red'>����</font>";
            } else if ('N' == v) {
                return "<font color='green'>������</font>";
            } else {
                return "";
            }
        } ;
        
		//������˱����Ⱦ��
		this.checkBillFlagRenderer = function(v) {
            if ('Y' == v) {
                return "��";
            } else if ('N' == v) {
                return "��";
            } else {
                return "";
            }
        } ;
        
		//�½������Ⱦ��
		this.monthCloseFlagRenderer = {
			fn : function(value) {
				var store = this.monthCloseFlagEditor.store ;
	            var idx = store.find(this.monthCloseFlagEditor.valueField, value);
	            var rec = store.getAt(idx);
	            return (rec == null ? value : rec.get(this.monthCloseFlagEditor.displayField) );
            } , 
			scope : this,
			delay: 200
		} ;
		
		//���������Ⱦ��
		this.ltkFlagRenderer = function(v) {
            if ('Y' == v) {
                return "��";
            } else if ('N' == v) {
                return "��";
            } else {
                return "";
            }
        } ;
        
        //ѡ��������Ϊ��ѡ����ѡ����
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	moveEditorOnEnter: false
        });
		
        var columnModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer() , sm , {
            dataIndex: 'WAREHOUSE_CODE',
            header: "�ֿ����",
            align: 'left',
            width: 160,
            sortable: true ,
			editor : this.warehouseCodeEditor
        },
        {
            dataIndex: 'WAREHOUSE_NAME',
            header: "�ֿ�����",
            align: 'left',
            width: 160,
            editor: this.warehouseNameEditor
        },
        {
            dataIndex: 'WAREHOUSE_ADDR',
            header: "�ֿ��ַ",
            align: 'left',
            width: 160,
            editor: this.warehouseAddrEditor
        },
        {
            dataIndex: 'MP_FLAG',
            header: "�ֿ�����",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.mpFlagEditor ,
            renderer: this.mpFlagRenderer
        },
        {
            dataIndex: 'MANAGEMENT_FLAG',
            header: "����ʽ",
            align: 'left',
            width: 160,
            sortable: true,
            //������
            editor: this.managementFlagEditor ,
            renderer: this.managementFlagRenderer
        },
        {
            dataIndex: 'TOTAL_QTY_FLAG',
            header: "�ƻ�ʹ�òֿ�",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.totalQtyFlagEditor,
            renderer: this.totalQtyFlagRenderer
        },
        {
            dataIndex: 'NEGATIVE_QTY_FLAG',
            header: "���������",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.negativeQtyFlagEditor ,
            renderer: this.negativeQtyFlagRenderer
        },
        {
            dataIndex: 'CHECK_BILL_FLAG',
            header: "������˱��",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.checkBillFlagEditor,
            renderer: this.checkBillFlagRenderer
        },
        {
            dataIndex: 'NOW_PERIOD',
            header: "��ǰ������",
            align: 'center',
            width: 160,
            sortable: true,
            editor: this.nowPeriodEditor
        },
        {
            dataIndex: 'PURCHASE_DEPT_CODE',
            header: "�ɹ����ű���",
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'PURCHASE_DEPT_NAME',
            header: "�ɹ���������",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.purchaseDeptNameEditor 
        },
        {
            dataIndex: 'MONTH_CLOSE_FLAG',
            header: "�½����",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.monthCloseFlagEditor,
            renderer: this.monthCloseFlagRenderer
        },
        {
            dataIndex: 'SET_CODE',
            header: "���ױ���",
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'SET_NAME',
            header: "��������",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.setNameEditor
        },
        {
            dataIndex: 'LTK_FLAG',
            header: "�������",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.ltkFlagEditor ,
            renderer: this.ltkFlagRenderer
        },
        {
            dataIndex: 'CHANGEOVER_DATE',
            header: "�����ת����",
            align: 'center',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'NUM_OF_KIND',
            header: "���",
            align: 'right',
            width: 160,
            sortable: true
        }]);
		
		//�����û�ƫ����Ϣ�Ĳ��
		var stateplugin = new Rs.ext.state.StatePlugin( { 
		     scheme : false
		});
		
		var tarConfig = [new Rs.ext.grid.ExportButton({
            grid: this ,
			tooltip: "����CSV�ļ�",
			text : '����',
            tooltipType: "qtip" ,
            filename: "�ļ�",
            paging: false
        }),'-',{
			text : '��ӡ',
			iconCls: 'rs-action-printer' 
		}] ;
		
		this.doInitPlugin();
		
        Rs.apply(config || {}, {
            store: store,
            sm: sm,
            loadMask : true,
            stripeRows: true,//����ɫ������ʽ
            cm: columnModel,
            clicksToEdit: 2,
            stateful:true,
            stateId : 'inv1100-gridkl11220',
	        stateEvents: ['columnmove', 'columnresize','columnhiddenchange', 'sortchange', 'groupchange'],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16 ,//��ʼ����ʾ������
                hasSlider: true,//�Ƿ���ʾ�޸���ʾ�����Ĺ�����
                store: store,
                displayInfo: true
            }) ,
            tbar: tarConfig,
			plugins: [this.createPlugin,
			          this.deletePlugin, this.savePlugin,
			          new Rs.ext.grid.EditorGridViewPlugin(),
			          stateplugin]
        });
        
        
        rs.inv.WarehouseDefinitionGrid.superclass.constructor.apply(this, arguments);
        
        this.doInitEvent();
    }  ,
    
    doInitEvent : function(){
    	
    	this.addEvents('columnhiddenchange');
        this.getColumnModel().on('hiddenchange' , function(columnModel,columnIndex, hidden){
        	this.fireEvent('columnhiddenchange' , columnModel,columnIndex, hidden);
	    },this);
        
		//�༭ǰ�ж�,�õ�Ԫ���Ƿ���Ա༭
		this.on('beforeedit', 
				this.doBeforeEditCheck.createDelegate(this, [['WAREHOUSE_CODE','WAREHOUSE_NAME']], true), this);
    },
    
    doInitPlugin : function(){
    	this.createPlugin = new Rs.ext.gird.plugin.GridCreateRecordPlugin({
    		//validateEditors : [this.warehouseCodeEditor,'WAREHOUSE_NAME'], //��֤����Ψһ�Ե�
    		validateEditors : [this.warehouseCodeEditor],
    		createDefaultJson : {
    			MP_FLAG: 'P' ,
    			MANAGEMENT_FLAG: 'W',
    			TOTAL_QTY_FLAG: 'Y',
    			NEGATIVE_QTY_FLAG: 'Y',
    			CHECK_BILL_FLAG: 'N',
    			MONTH_CLOSE_FLAG: 'N',
    			LTK_FLAG: 'N'
		  	},
		  	listeners : {
		  		aftercreatenewline : this.doFocusFirstEnableEditor, //�����д�����
		  		validatenotpass: function(record, grid, plugin){//��֤����Ψһ�Բ���ͨ��
					record.set('WAREHOUSE_CODE' , '') ;
					record.commit();
				},
		  		scope : this
		  	}
	  	});
    	
        this.deletePlugin = new Rs.ext.gird.plugin.GridDeleteRecordPlugin({
        	fields:'WAREHOUSE_CODE',
     	    listeners : {
     	    	//ɾ���ɹ���
     	    	deletesuccess : function(grid , plugin){
     	    		grid.getStore().reload();
     	    	},
     	    	
     	    	deletefailure : function(grid , plugin){
     	    		grid.getStore().reload();
     	    	},
     	    	scope : this
     	    }
        });
        
    	//��֤�����ֶι���
		var rules = {
    		'WAREHOUSE_NAME' : '�ֿ�����',
    		'WAREHOUSE_ADDR' : '�ֿ��ַ'
    	};
		
        this.savePlugin = new Rs.ext.gird.plugin.GridSaveRecordPlugin({
        	//rules : rules,
     	    //uniqueFields : ['WAREHOUSE_CODE', 'WAREHOUSE_NAME'], //��֤��¼��Ψһ��
     	    modifyFields : ['WAREHOUSE_CODE'],
     	    listeners : {
     	    	//����ɹ���
     	    	modifysuccess: function(grid , plugin, result, hasCreateRecord){
     	    		if(!hasCreateRecord){
     	    			grid.getStore().reload();
     	    		}
     	    	},
     	    	//�����ɹ���
     	    	createsuccess: function(grid , plugin, result, hasCreateRecord){
     	    		grid.getStore().reload();
     	    	},
     		    scope: this
     	    }
        });
    } ,
    
    /**
     * @private
     * @method doFocusFirstEnableEditor
     * ��������ڵ�һ���ɱ༭����
     */
    doFocusFirstEnableEditor : function(){
    	var cm = this.getColumnModel() ;
    	var total = cm.getColumnCount();
    	var row = this.getStore().getCount() - 1 ;
    	for(var i=0;i<total;i++){
    		var result = cm.isCellEditable(i, row);
    		if(result){
    			this.startEditing(row , i);
    			break ;
    		}
    	}
    },
    
	/**
	 * @private
     * @method  ����ֶ��Ƿ���Ա༭ , �÷���ֻ��Ҫ��עfields���飬�Ѳ��ɱ༭���ֶ�dataIndex���ڸ����鼴��
     * �����������,����Ա༭
	 * �����������,���������ܱ༭
     * @params e �¼�����
     * @params fields ��Ų��ɱ༭�ֶε�dataIndex
     */
	doBeforeEditCheck : function(e , fields){
        var data = e.record.data ;
        //����������У�����Ա༭
        if(data['rowType'] && data['rowType'] == 'N'){
            return true ;
        } else {//�������������
        	//���������ֶ����ǲ��ɱ༭���ֶΣ��򷵻�false
        	if(fields.indexOf(e.field) > -1 ){
        		return false ;
        	}
            return true ;
        }
    }
});