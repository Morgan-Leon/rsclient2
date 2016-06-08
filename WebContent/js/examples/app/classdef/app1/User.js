Rs.define('My.own.User', {

	config : {
		name : 'NONAME'
	},

	constructor : function(config) {
		this.initConfig(config);
		alert(this.getName());
	}

});

Rs.define('My.own.Manager', {

	extend : My.own.User,

	config : {
		name : 'MANAGER'
	},

	constructor : function() {
		this.callParent(arguments);
	}

});