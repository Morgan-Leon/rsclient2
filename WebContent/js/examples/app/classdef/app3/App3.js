Rs.define('rs.cd.App3', {
	
	extend : Ext.Panel,
	
	mixins : [ Rs.app.Main ] ,

	constructor : function(config) {
		rs.cd.App3.superclass.constructor.call(this, Rs.apply(config || {}, {
			html : 'ͨ���ڹ��췽���е���initConfig,������������Ե�getter��setter����',
			tbar : [{
				text : '����',
				scope : this,
				handler : function(){
					var awesome = new My.awesome.Class({
						name: 'Super Awesome'
					});
					alert(awesome.getName()); // 'Super Awesome'
				}
			}]
		}));
	}

});
