Rs.define('rs.demo.panel.AddPanel', {
   
    extend : Rs.ext.form.FormPanel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            url : '/rsc/js/examples/app/demo/panel/addPanel/dataservice.rsc',
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
        });
        
        rs.demo.panel.AddPanel.superclass.constructor.call(this, config);
        Rs.EventBus.register(this, 'acct', ['save']);
    }, 
    
    saveAcct : function(){
        this.fireEvent('save', this);
    },
    
    resetFields : function() {
        this.items.each(function(item) {
            item.reset();
        }, this);
    }

});