Rs.define('rs.demo.template.form.FormPanel', {
   
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
                        xtype:'numberfield',
                        fieldLabel: 'ƽ��������(��)',
                        labelStyle: 'text-align:right;',
                        value : 5,
                        width : 200,
                        name: 'first'//,
                        //anchor:'95%'
                    }, {
                        xtype:'numberfield',
                        fieldLabel: '����������(��)',
                        labelStyle: 'text-align:right;',
                        value : 5,
                        name: 'last',
                        width : 200//,
                        //anchor:'95%'
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'numberfield',
                            fieldLabel : '������Ч�ڣ��죩',
                            value : 365,
                            name: 'validterm',
                            width : 200
                            //anchor:'95%'
                        },{
                            xtype:'textfield',
                            fieldLabel : '��������Ʒ���۷�ʽ',
                            value : '����BOM',
                            name: 'offermanner',
                            width : 200
                            //anchor:'95%'
                        }]
                    }]
                },{
                    columnWidth:.5,
                    layout: 'form',
                    items: [{
                        xtype:'checkbox',
                        checked : true,
                        boxLabel : '����嵥��˱��',
                        name: 'listcheck',
                        anchor:'95%'
                    },{
                        xtype:'checkbox',
                        checked : true,
                        boxLabel : '��ʱ/����/��������˱��',
                        name: 'checkmark',
                        anchor:'95%'
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'checkbox',
                            checked : true,
                            boxLabel : '���ϼ۸���˱��',
                            name: 'mprice',
                            anchor:'95%'
                        },{
                            xtype:'checkbox',
                            checked : true,
                            boxLabel : '���÷�����˱��',
                            name: 'feeprice',
                            anchor:'95%'
                        }]
                    }]
                }]
            },{
                xtype : 'textfield',
                id : 'bio',
                fieldLabel : '��ע',
                height : 195,
                anchor : '98%'
            }],
            buttons: [{
                text: '����'
            },{
                text: 'ȡ��'
            }]
        });
        rs.demo.template.form.FormPanel.superclass.constructor.call(this, config);
    }
});