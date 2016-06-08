Rs.define('rs.inv.Work',{
    extend: Ext.grid.GridPanel,
    mixins : [ Rs.app.Main ],
    constructor: function(config){
        this.store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'aa',
            idProperty: 'aaa',
            sortInfo : {
                field : 'aa',
                direction : 'ASC'
            },
            fields: ['aa']
        });
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({});
        var columnModel = new Rs.ext.grid.ColumnModel([sm,
        {
            header: 'ba',
            dataIndex: 'sdf',
            align: 'left',
            editor : new Ext.form.TextField()
        }]);
        config = Rs.apply(config || {}, {
            title: 'นคื๗',
            sm : sm,
            store: this.store,
            colModel : columnModel ,
            clicksToEdit: 1 
        });
        rs.inv.Work.superclass.constructor.apply(this, arguments);
    }
});

