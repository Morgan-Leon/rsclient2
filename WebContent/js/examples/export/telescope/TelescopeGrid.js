Rs.define('rs.exp.telescope', {

			extend : Rs.ext.grid.GeneralselPanel,

			// extend : Ext.Panel,

			mixins : [Rs.app.Main],
			constructor : function(config) {

				config = Rs.apply(config || {}, {
							progCode : 'billType',
							tbar : []
						});
						
				rs.exp.telescope.superclass.constructor.call(this, config);
				
				this.topToolbar.addButton(new Rs.ext.grid.ExportButton({
							grid : this.getGrid(),
							filename : "文件"
						}));

			} /*,

			initComponent : function() {
				rs.exp.telescope.superclass.initComponent
						.apply(this, arguments);

				this.topToolbar.addButton(new Rs.ext.grid.ExportButton({
							grid : this.grid,
							filename : "文件"
						}));
			}*/

		});