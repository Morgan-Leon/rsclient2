Rs.define('rs.ext.chart.Mscolumn3DLinedy', {

	extend : Rs.ext.chart.ChartPanel,
	
	mixins : [Rs.app.Main],
	constructor : function(config) {

		var store = new Rs.ext.data.Store({
			autoLoad : true,
			autoDestroy : true,
			url : '/rsc/js/examples/fusioncharts/mscolumn3dlinedy/dataservice.rsc',
			fields : ['v1', 'v2', 'v3', 'month']
		});
		var json1 = new Rs.ext.chart.Chart2D({
					store : store,
					refreshTime : 10000,
					viewfields : ['v1', 'v2', 'v3'],
					chartType : 'mscolumn3dlinedy'
				});
		config = Rs.apply(config || {}, {
					width : 600,
					height : 500,
					chart : json1
				});
				
		Ext.apply(store.baseParams.metaData, {
		    limit : 20
		});
		
	    var grid = new Ext.grid.EditorGridPanel({
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
	                text : '保存',
	                iconCls : 'rs-action-save',
	                handler : function(){
	                	store.updateRecord();
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
                displayMsg: '共{2}条'
            }),
	        stripeRows: true,
	        height: 350,
	        width: 400,
	        title: '表格'
	    });
	    grid.render('div1');
		rs.ext.chart.Mscolumn3DLinedy.superclass.constructor.call(this, config);
	}
});