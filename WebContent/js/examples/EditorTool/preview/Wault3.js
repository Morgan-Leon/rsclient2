Rs.define('rs.inv.Wault3',{
    extend: Ext.grid.GridPanel,
    mixins : [ Rs.app.Main ],
    constructor: function(config){
        this.store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'dataservice.rsc',
            idProperty: 'code',
            sortInfo : {
                field : 'code',
                direction : 'ASC'
            },
            fields: ['code','name','order']
        });
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({});
        var columnModel = new Rs.ext.grid.ColumnModel([sm,
        {
            header: '±àÂë',
            dataIndex: 'code',
            align: 'left',
            editor : new Ext.form.TextField()
        },
        {
            header: 'Ãû³Æ',
            dataIndex: 'name',
            align: 'left',
            editor : new Ext.form.TextField()
        },
        {
            header: '¶©µ¥',
            dataIndex: 'order',
            align: 'left',
            editor : new Ext.form.TextField()
        },
        {
            header: '¼ì²â',
            dataIndex: 'abv',
            align: 'left',
            editor : new Ext.form.TextField()
        }]);
        config = Rs.apply(config || {}, {
            title: 'Ô¤ÀÀ',
            sm : sm,
            store: this.store,
            colModel : columnModel ,
            clicksToEdit: 1 
        });
        rs.inv.Wault3.superclass.constructor.apply(this, arguments);
    }
});

