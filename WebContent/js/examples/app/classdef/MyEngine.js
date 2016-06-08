Rs.engine( {

	shell : 'window',

	onBeforeInitialize : function() {
		Rs.BASE_PATH = '/rsc/js/rs';
	},

	libraries : [ 'ext-3.3.1-debug' ],

	apps : [ {
		folder : 'app1',
		autoRun : true,
		region : {
			x : 150,
			y : 100,
			width : 300,
			height : 200
		}
	}, {
		folder : 'app2',
		autoRun : true,
		region : {
			x : 450,
			y : 100,
			width : 300,
			height : 200
		}
	}, {
		folder : 'app3',
		autoRun : true,
		region : {
			x : 750,
			y : 100,
			width : 300,
			height : 200
		}
	}, {
		folder : 'app4',
		autoRun : true,
		region : {
			x : 150,
			y : 350,
			width : 300,
			height : 200
		}
	} ]

});
