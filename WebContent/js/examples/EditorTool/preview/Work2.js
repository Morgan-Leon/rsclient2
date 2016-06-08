Rs.define('rs.inv.Work2',{
    extend: Ext.grid.EditorGridPanel,
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
        var columnModel = new Rs.ext.grid.ColumnModel([
        {
            header: 'ba',
            dataIndex: 'sdf',
            align: 'left',
            editor : new Ext.form.TextField()
        }]);
        config = Rs.apply(config || {}, {
            title: 'นคื๗',
            store: this.store,
            colModel : columnModel ,
            clicksToEdit: 1 
        });
        rs.inv.Work2.superclass.constructor.apply(this, arguments);
    }
});

