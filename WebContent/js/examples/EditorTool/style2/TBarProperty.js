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
            header: "��ť��",
            dataIndex: 'text',
            align: "center",
            editor : true
        },{
            header: "��ťͼ��icon",
            dataIndex: 'tbaricon',
            align: "center",
            editor : true
        },{
            header: "ִ�з���handler",
            dataIndex: 'tbarmethod',
            align : "center",
			width : 140,
            editor : true
        },{
            header: "������scope",
            dataIndex: 'tbarscope',
            align: "center",
			width : 140,
            editor : new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',//ʹ�ñ�������
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [ {name: '������',value: 'Y'},
                            {name: '��ť',value: 'N'}]
                })
            }),
            renderer : function(v){
                if(v == 'Y'){
                    return '������this' ;
                } else if(v == 'N'){
                    return '��ť';
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
            }]
        });
        
        rs.tool.TBarProperty.superclass.constructor.call(this, config);
        this.store.on('load' , this.newAddLine.createDelegate(this,[5],0), this) ;
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
            record.data['tbarscope'] = 'Y' ;
            
            //�����е�Ĭ��ֵ
            grid.stopEditing();
            record.dirty = false;
            record.phantom = false;
            ds.insert(ds.getCount(), record);   
        }
    }
});
