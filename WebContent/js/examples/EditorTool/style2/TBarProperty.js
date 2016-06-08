Rs.define('rs.tool.TBarProperty', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [ Rs.app.Main ],
    
    constructor: function(config){
        var store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'style2/dataService.rsc',
            idProperty: 'dataIndex',
            fields: ['text','tbaricon',
                 'tbarmethod','tbarscope']
        });
        
        var columnModel = new Rs.ext.grid.ColumnModel([{
            header: "按钮名",
            dataIndex: 'text',
            align: "center",
            editor : true
        },{
            header: "按钮图标icon",
            dataIndex: 'tbaricon',
            align: "center",
            editor : true
        },{
            header: "执行方法handler",
            dataIndex: 'tbarmethod',
            align : "center",
			width : 140,
            editor : true
        },{
            header: "作用域scope",
            dataIndex: 'tbarscope',
            align: "center",
			width : 140,
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//使用本地数据
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '表格面板',value: 'Y'},
                            {name: '按钮',value: 'N'}]
                })
            }),
            renderer : function(v){
                if(v == 'Y'){
                    return '表格面板this' ;
                } else if(v == 'N'){
                    return '按钮';
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
            }]
        });
        
        rs.tool.TBarProperty.superclass.constructor.call(this, config);
        this.store.on('load' , this.newAddLine.createDelegate(this,[5],0), this) ;
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
            record.data['tbarscope'] = 'Y' ;
            
            //新增行的默认值
            grid.stopEditing();
            record.dirty = false;
            record.phantom = false;
            ds.insert(ds.getCount(), record);   
        }
    }
});
