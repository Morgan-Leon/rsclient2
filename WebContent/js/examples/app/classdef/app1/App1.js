Rs.define('rs.cd.App1', {
    
    extend : Ext.Panel,
    
    mixins: [Rs.app.Main],
    
    constructor : function(config) {
        rs.cd.App1.superclass.constructor.call(this, Rs.apply(config || {}, {
            html : '调用重写的父类方法',
            tbar : [{
            	text : 'User',
            	scope : this,
            	handler : function(){
            		var m = new My.own.User();
            	}
            }, {
            	text : 'Manager',
            	scope : this,
            	handler : function(){
            		var m = new My.own.Manager();
            	}
            }]
        }));
    }
    
});