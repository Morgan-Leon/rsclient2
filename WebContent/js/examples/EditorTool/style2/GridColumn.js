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
            header: "对齐方式",
            dataIndex: 'align',
            align: "center",
            editor : new Ext.form.ComboBox({
	            triggerAction: 'all',
	            displayField: 'name',
	            valueField: 'value',
	            mode: 'local',//使用本地数据
	            store: new Ext.data.JsonStore({
	                fields: ['name', 'value'],
	                data: [ {name: '居左',value: 'left'},
	                        {name: '居中',value: 'center'},
	                        {name: '居右',value: 'right'}]
	            })
	        }),
            renderer : function(v){
                if(v == 'left'){
                    return '居左' ;
                } else if(v == 'center'){
                    return '居中';
                } else if(v == 'right'){
                    return '居右';
                }
            }
        },{
            header: "是否排序",
            dataIndex: 'sortable',
            align: "center",
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//使用本地数据
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '是',value: 'Y'},
                            {name: '否',value: 'N'}]
                })
            }),
            renderer : function(v){
                if(v == 'Y'){
                    return '可排序' ;
                } else if(v == 'N'){
                    return '不可排序';
                }
            }
        },{
            header: "编辑器类型",
            dataIndex: 'editorType',
			id : 'editorType' ,
            align: "center",
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//使用本地数据
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '文本',value: 'textfield'},
                            {name: '望远镜',value: 'telescope'},
                            {name: '下拉框',value: 'combox'},
                            {name: '日期',value: 'datefield'},
                            {name: '数字',value: 'numberfield'}]
                })
            }),
            renderer : function(v){
                if(v == 'textfield'){
                    return '文本' ;
                } else if(v == 'telescope'){
                    return '望远镜';
                } else if(v == 'combox'){
                    return '下拉框';
                } else if(v == 'datefield'){
                    return '日期';
                } else if(v == 'numberfield'){
                    return '数字';
                }
            }
        }]);
        
        config = Rs.apply(config || {}, {
            store: store,
            colModel : columnModel ,
			clicksToEdit: 1 ,
			tbar : [{
				text : '新增一行' ,
				scope : this ,
				handler : this.newAddLine.createDelegate(this,[1],0)
			},{
                text : '新增五行' ,
                scope : this ,
                handler : this.newAddLine.createDelegate(this,[5],0)
            }]
        });
		
        rs.tool.GridColumn.superclass.constructor.call(this, config);
		this.store.on('load' , this.newAddLine.createDelegate(this,[20],0), this) ;
    },
    
	/**
     * @method 新增行
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
            //新增行的默认值
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
