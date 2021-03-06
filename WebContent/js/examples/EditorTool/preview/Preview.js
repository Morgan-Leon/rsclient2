Rs.define('rs.inv.Wault',{
    extend: Ext.grid.GridPanel,
    mixins : [ Rs.app.Main ],
    constructor: function(config){
        this.store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'datasergic.rsc',
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
            header: '����',
            dataIndex: 'code',
            align: 'left',
            editor : new Ext.form.TextField()
        },
        {
            header: '����',
            dataIndex: 'name',
            align: 'left',
            editor : new Ext.form.TextField()
        },
        {
            header: '����',
            dataIndex: 'order',
            align: 'left',
            editor : new Ext.form.TextField()
        }]);
        config = Rs.apply(config || {}, {
            title: 'Ԥ��',
            sm : sm,
            store: this.store,
            colModel : columnModel ,
            clicksToEdit: 1 
        });
        rs.inv.Wault.superclass.constructor.apply(this, arguments);
    }
});

