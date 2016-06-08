Rs.define('rs.exp.GroupSummary',{

		extend : Ext.grid.GridPanl ,

		mixins : [Rs.app.Main] ,

		constructor : function(){

			Ext.QuickTips.init();

			var store = new Rs.ext.data.store({
				autoLoad : true ,
				autoDestroy : true ,
				url : ,
				fields : [] ,
				baseParams : {
					pm_flag : 'Y'
				}
			}) ;

			config = Rs.apply(config || {},{

				store : stroe ,

				columns : [
					{
						dataIndex : '' ,
						header : '' ,
						align : 'left',
						width : 130 ,
						sortable : true ,
					},
					{
						dataIndex : '' ,
						header : '' ,
						align : 'left',
						width : 130 ,
						sortable : true ,
					}
				],

				view : new Ext.grid.GroupingView({
					forceFit : true ,
					showGroupName : false ,
					enableNoGroups : false ,
					enableGroupingMenu : false ,
					hideGroupedColum : false 
				}),

				tbar : [
					new Rs.ext.grid.ExportButton({
						grid : this,
						file : '文件'
					}) 
				]
			});

			rs.exp.GroupSummary.superclass.constructor.call(this.config);
		}

}) ;