Rs.define('rs.app.template.maintenance.AddLinePanel', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
        var store = new Ext.data.SimpleStore({
            fields: [
              {name: 'company'},
              {name: 'price', type: 'float'},
              {name: 'change', type: 'float'}
            ]
          });
        
        //store.loadData({'items':[['','','',''],['','','',''],['','','',''],['','','','']]},true);

        for(var i = 0; i< 5;i++){
            store.insert(store.getCount(), new store.recordType({}));
        }
        
        config = Rs.apply(config || {}, {
            store : store,
            columns : [ new Ext.grid.RowNumberer(),
                        {id:'company',header: "��˾", width: 160, sortable: true, dataIndex: 'company', editor : new Ext.form.TextField({})},
                        {header: "����", width: 75, sortable: true, dataIndex: 'price',
                         editor: new Ext.form.NumberField({allowDecimals: true})},
                        {header: "������", width: 100, sortable: true, dataIndex: 'change',editor: new Ext.form.NumberField({allowDecimals: true})}
                      ],
            tbar : [{
                text : '����',
                iconCls : "rs-action-save",
                handler : function(){
                        this.fireEvent('addnew',store.getRange());
                        store.removeAll();
                        for(var i = 0; i< 5;i++){
                            store.insert(store.getCount(), new store.recordType({}));
                        }
                },
                scope : this
                },{
                text:"����",
                iconCls : "rs-action-reset", 
                handler : function(){
                    store.removeAll();
                    for(var i = 0; i< 5;i++){
                        store.insert(store.getCount(), new store.recordType({}));
                    }
                }, scope : this}],
            
            viewConfig : {forceFit : true}
        });
        this.addEvents([
                        /**
                         * @event adddim
                         * �������Ӱ�ťʱ����.
                         */
                         "addnew"]);

        rs.app.template.maintenance.AddLinePanel.superclass.constructor.call(this, config);
        
        Rs.EventBus.register(this, 'addlinepanel', ['addnew']);

    }

});
