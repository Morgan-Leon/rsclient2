Rs.define('rs.demo.panel.FormPanel', {
   
    extend : Rs.ext.form.FormPanel, 
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            labelAlign : 'top',
            frame : true,
            bodyStyle : 'padding:5px 5px 0',
            items: [{
                layout:'column',
                items:[{
                    columnWidth:.5,
                    layout: 'form',
                    items: [{
                        xtype:'textfield',
                        fieldLabel: 'First Name',
                        name: 'first',
                        anchor:'95%'
                    }, {
                        xtype:'textfield',
                        fieldLabel: 'Company',
                        name: 'company',
                        anchor:'95%'
                    }]
                },{
                    columnWidth:.5,
                    layout: 'form',
                    items: [{
                        xtype:'textfield',
                        fieldLabel: 'Last Name',
                        name: 'last',
                        anchor:'95%'
                    },{
                        xtype:'textfield',
                        fieldLabel: 'Email',
                        name: 'email',
                        vtype:'email',
                        anchor:'95%'
                    }]
                }]
            },{
                xtype : 'htmleditor',
                id : 'bio',
                fieldLabel : 'Biography',
                height : 95,
                anchor : '98%'
            }],
            buttons: [{
                text: 'Save'
            },{
                text: 'Cancel'
            }]
        });
        rs.demo.panel.FormPanel.superclass.constructor.call(this, config);
    }
});