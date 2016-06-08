Rs.define('My.own.Cat2', {

	constructor : function() {
		alert("I'm a cat2!");
		return this;
	}

});

My.own.Cat2.override( {

	constructor : function() {
		alert("I'm going to be a cat2!");
		var instance = this.callOverridden();
		alert("Meeeeoooowwww");
		return instance;
	}

});

Rs.define('rs.cd.App4', {

	extend : Ext.Panel,

	mixins : [ Rs.app.Main ] ,
	
	constructor : function(config) {
		rs.cd.App4.superclass.constructor.call(this, Rs.apply(config || {}, {
			html : 'Call the original method that was previously overridden with {@link Rs.Base#override}',
			tbar : [ {
				text : 'callOverridden',
				scope : this,
				handler : function(){
					var cat = new My.own.Cat2();
				}
			} ]
		}));
	}

});