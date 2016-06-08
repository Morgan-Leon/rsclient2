Rs.define('My.Cat', {

	statics : {
		totalCreated : 0,
		speciesName : 'Cat' // My.Cat.speciesName = 'Cat'
	},

	constructor : function() {
		var statics = this.statics();
		alert(statics.speciesName);
		alert(this.self.speciesName);
		statics.totalCreated++;
		alert(statics.totalCreated);
		return this;
	},

	clone : function() {
		var cloned = new this.self;
		cloned.groupName = this.statics().speciesName;
		return cloned;
	}
});

Rs.define('My.SnowLeopard', {
	
	extend : My.Cat,
	
	statics : {
		speciesName : 'Snow Leopard'
	    // My.SnowLeopard.speciesName = 'Snow Leopard'
	}
});

