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
                fieldLabel : '编码',
                name : 'id',
                allowBlank : false
            }, {
                fieldLabel : '名称',
                name : 'name'
            }, {
                fieldLabel : '类型',
                name : 'type'
            } ],
            buttons : [ {
                text : '保存',
                scope : this,
                handler : this.saveAcct
            }, {
                text : '重置',
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