Rs.define('rs.cd.App2', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ],

	constructor : function(config) {
		rs.cd.App2.superclass.constructor.call(this, Rs.apply(config || {},{
			html : '���Create��ť����һ��My.Cat����, ���Cone��ť��¡һ��My.Cat����,'
				+'���SnowLeopard����һ��SnowLeopard����',
			tbar : [{
				text : 'Create Cat',
				scope : this,
				handler : function(){
					var cat = new My.Cat();
				}
			}, {
				text : 'Clone Cat', 
				scope : this,
				handler : function(){
					var cat = new My.Cat();
					cat.clone();
				}
			}, {
				text : 'Create SnowLeopard',
				scope : this,
				handler : function(){
					//var cat = new My.Cat(); // alerts 'Cat'
					var snowLeopard = new My.SnowLeopard(); // alerts 'Snow Leopard'
					var clone = snowLeopard.clone();
					alert(Rs.getClassName(clone));
				}
			}]
		}));
	}
});