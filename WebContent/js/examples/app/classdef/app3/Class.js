Rs.define('My.awesome.Class', {
	
	// The default config
	config : {
		name : 'Awesome',
		isAwesome : true
	},

	constructor : function(config) {
		this.initConfig(config);
		return this;
	}
	
});