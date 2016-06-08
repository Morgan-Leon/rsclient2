Rs.define('rs.acct.CreatePanel', {
	
	extend : Rs.ext.form.FormPanel,
	
	mixins : [Rs.app.Main],
	
	constructor : function(config){
		rs.acct.CreatePanel.superclass.constructor.call(this, Rs.apply(config || {}, {
			url : '/rsc/js/examples/app/windowApp/acctCreatePanel/dataservice.rsc',
            submitMethod : 'submit',
            defaultType : 'textfield',
            labelWidth : 40,
            labelAlign : 'right',
            bodyStyle : 'padding:5px 5px 0',
            defaults : {
                width : 140
            },
            items : [ {
                fieldLabel : '����',
                name : 'id',
                allowBlank : false
            }, {
                fieldLabel : '����',
                name : 'name'
            }, {
                fieldLabel : '����',
                name : 'type'
            } ],
            buttons : [ {
                text : '����',
                scope : this,
                handler : this.saveAcct
            }, {
                text : '����',
                scope : this,
                handler : this.resetFields
            } ]
		}));
		
		Rs.EventBus.register(this, 'acct', ['save']);
	},
	
	saveAcct : function(){
        this.fireEvent('save', this);
    },
    
    resetFields : function(){
        
    }
});