Rs.define('rs.ext.chart.Table', {


	extend : Ext.grid.EditorGridPanel,
	
	mixins : [Rs.app.Main],
	
	constructor : function(config) {
		
		var store = new Rs.ext.data.Store({
			autoLoad : true,
			autoDestroy : true,
			idProperty: 'month',
			url : '/rsc/js/examples/fusioncharts/mscolumn3dlinedy/dataservice.rsc',
			fields : ['v1', 'v2', 'v3', 'month']
		});
		
		Ext.apply(store.baseParams.metaData, {
		    limit : 20
		});
		
		config = Rs.apply(config || {}, {
	        store: store,
	        columns: [
	        	{
	                header   : 'Month', 
	                width    : 75,
	                dataIndex: 'month'
	            },
	            {
	                header   : 'Product A Sales', 
	                width    : 100, 
	                sortable : true, 
	                dataIndex: 'v1',
	                editor : new Ext.form.NumberField()
	            },
	            {
                    header   : 'Product B Sales', 
                    width    : 100, 
                    sortable : true, 
	                editor : new Ext.form.NumberField(),
                    dataIndex: 'v2'
                },
	            {
	                header   : 'Total Downloads', 
	                width    : 75,
	                sortable : true, 
	                editor : new Ext.form.NumberField(),
	                dataIndex: 'v3'
	            }
	        ],
	        tbar : [
				new Ext.Button({
	                text : '±£´æ',
	                iconCls : 'rs-action-save',
	                handler : function(){
	                	store.save();
	                },
	                scope : this
	            })
	        ] ,
	        bbar : new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : true,
                displayMsg: '¹²{2}Ìõ'
            })
	    });
		rs.ext.chart.Table.superclass.constructor.call(this, config);
	}
});