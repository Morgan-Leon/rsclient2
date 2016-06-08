Rs.define('rs.cd.App3', {
	
	extend : Ext.Panel,
	
	mixins : [ Rs.app.Main ] ,

	constructor : function(config) {
		rs.cd.App3.superclass.constructor.call(this, Rs.apply(config || {}, {
			html : '通过在构造方法中调用initConfig,给该类添加属性的getter和setter方法',
			tbar : [{
				text : '测试',
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
