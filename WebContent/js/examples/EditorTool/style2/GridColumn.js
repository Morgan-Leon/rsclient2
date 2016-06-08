Rs.define('rs.tool.GridColumn', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [ Rs.app.Main ],
    
    constructor: function(config){
        var store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'style2/dataService.rsc',
            idProperty: 'dataIndex',
            fields: ['header','dataIndex',
			     'align','sortable','editorType']
        });
		
        var columnModel = new Rs.ext.grid.ColumnModel([{
            header: "header",
            dataIndex: 'header',
            align: "center",
            editor : true
        },{
            header: "dataIndex",
            dataIndex: 'dataIndex',
            align: "center",
            editor : true
        },{
            header: "���뷽ʽ",
            dataIndex: 'align',
            align: "center",
            editor : new Ext.form.ComboBox({
	            triggerAction: 'all',
	            displayField: 'name',
	            valueField: 'value',
	            mode: 'local',//ʹ�ñ�������
	            store: new Ext.data.JsonStore({
	                fields: ['name', 'value'],
	                data: [ {name: '����',value: 'left'},
	                        {name: '����',value: 'center'},
	                        {name: '����',value: 'right'}]
	            })
	        }),
            renderer : function(v){
                if(v == 'left'){
                    return '����' ;
                } else if(v == 'center'){
                    return '����';
                } else if(v == 'right'){
                    return '����';
                }
            }
        },{
            header: "�Ƿ�����",
            dataIndex: 'sortable',
            align: "center",
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//ʹ�ñ�������
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '��',value: 'Y'},
                            {name: '��',value: 'N'}]
                })
            }),
            renderer : function(v){
                if(v == 'Y'){
                    return '������' ;
                } else if(v == 'N'){
                    return '��������';
                }
            }
        },{
            header: "�༭������",
            dataIndex: 'editorType',
			id : 'editorType' ,
            align: "center",
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//ʹ�ñ�������
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '�ı�',value: 'textfield'},
                            {name: '��Զ��',value: 'telescope'},
                            {name: '������',value: 'combox'},
                            {name: '����',value: 'datefield'},
                            {name: '����',value: 'numberfield'}]
                })
            }),
            renderer : function(v){
                if(v == 'textfield'){
                    return '�ı�' ;
                } else if(v == 'telescope'){
                    return '��Զ��';
                } else if(v == 'combox'){
                    return '������';
                } else if(v == 'datefield'){
                    return '����';
                } else if(v == 'numberfield'){
                    return '����';
                }
            }
        }]);
        
        config = Rs.apply(config || {}, {
            store: store,
            colModel : columnModel ,
			clicksToEdit: 1 ,
			tbar : [{
				text : '����һ��' ,
				scope : this ,
				handler : this.newAddLine.createDelegate(this,[1],0)
			},{
                text : '��������' ,
                scope : this ,
                handler : this.newAddLine.createDelegate(this,[5],0)
            }]
        });
		
        rs.tool.GridColumn.superclass.constructor.call(this, config);
		this.store.on('load' , this.newAddLine.createDelegate(this,[20],0), this) ;
    },
    
	/**
     * @method ������
     *
     * @params
     */
    newAddLine: function(size) {
		for(var k=0;k<size;k++){
	        var grid = this ,
	            ds = grid.getStore(),
	            record = new ds.recordType() ,
	            keys = ds.fields.keys;
	        record.data = {};
	        for (var i = 0,len = keys.length; i < len; i++) {
	            record.data[keys[i]] = '';
	        }
            //�����е�Ĭ��ֵ
			record.data['align'] = 'left' ;
			record.data['sortable'] = 'N' ;
			record.data['editorType'] = 'textfield' ;
			
	        grid.stopEditing();
	        record.dirty = false;
	        record.phantom = false;
		    ds.insert(ds.getCount(), record);	
		}
    }
});
