Rs.define('rs.inv.Wark',{
    extend: Ext.grid.EditorGridPanel,
    mixins : [ Rs.app.Main ],
    constructor: function(config){
        this.store = new Rs.ext.data.Store({
            autoLoad: true ,
            autoDestroy: true ,
            url: 'dataservice2.rsc',
            idProperty: 'code',
            sortInfo : {
                field : 'code',
                direction : 'ASC'
            },
            fields: ['code']
        });
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({});
        var columnModel = new Rs.ext.grid.ColumnModel([sm,
        {
            header: 'code',
            dataIndex: 'code',
            align: 'left',
            editor : new Ext.form.TextField()
        }]);
        config = Rs.apply(config || {}, {
            title: '‘§¿¿',
            sm : sm,
            store: this.store,
            colModel : columnModel ,
            clicksToEdit: 1 
        });
        rs.inv.Wark.superclass.constructor.apply(this, arguments);
    }
});

