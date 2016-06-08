Rs.define('rs.tool.panel.LayoutPanel', {

    extend : Ext.grid.GridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
    
        var store = this.store = this.store = new Ext.data.ArrayStore({
            proxy   : new Ext.data.MemoryProxy(),
            fields  : ['name'],
            sortInfo: {
                field    : 'name',
                direction: 'ASC'
            }
        });
        
        store.loadData([
            ['1'],
            ['2'],
            ['3']
        ]);
		
		var columnModel = new Rs.ext.grid.ColumnModel([{
            header: "Ä£°æÑ¡Ôñ",
            dataIndex: 'name',
            align: "center",
            editable: false,
            sortable: true,
			width : 700 ,
			renderer : function(v){
				return "<img src='layoutpanel/images/phones/" + v + ".png'/>"
			}
        }]);
		
        config = Rs.apply(config || {}, {
			store: store,
            colModel : columnModel ,
			viewConfig : {
				forceFit : true
			}			
        });
        rs.tool.panel.LayoutPanel.superclass.constructor.call(this, config);
		this.on('rowclick' , function(grid , rowIndex, e){
			var name = this.store.getAt(rowIndex).get('name');
			var eng = Rs.getAppEngine() ,
			    //app = eng.getAppById(name) ;
			    app = eng.getAppById("2") ;
			app.run() ;
			app.open();	
		} , this);
    }
});