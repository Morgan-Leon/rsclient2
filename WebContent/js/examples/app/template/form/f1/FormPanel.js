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
                        fieldLabel: '平均价区间(次)',
                        labelStyle: 'text-align:right;',
                        value : 5,
                        width : 200,
                        name: 'first'//,
                        //anchor:'95%'
                    }, {
                        xtype:'numberfield',
                        fieldLabel: '换新率区间(次)',
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
                            fieldLabel : '报价有效期（天）',
                            value : 365,
                            name: 'validterm',
                            width : 200
                            //anchor:'95%'
                        },{
                            xtype:'textfield',
                            fieldLabel : '新造成熟产品报价方式',
                            value : '制造BOM',
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
                        boxLabel : '物耗清单审核标记',
                        name: 'listcheck',
                        anchor:'95%'
                    },{
                        xtype:'checkbox',
                        checked : true,
                        boxLabel : '工时/定额/换新率审核标记',
                        name: 'checkmark',
                        anchor:'95%'
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'checkbox',
                            checked : true,
                            boxLabel : '物料价格审核标记',
                            name: 'mprice',
                            anchor:'95%'
                        },{
                            xtype:'checkbox',
                            checked : true,
                            boxLabel : '费用方案审核标记',
                            name: 'feeprice',
                            anchor:'95%'
                        }]
                    }]
                }]
            },{
                xtype : 'textfield',
                id : 'bio',
                fieldLabel : '备注',
                height : 195,
                anchor : '98%'
            }],
            buttons: [{
                text: '保存'
            },{
                text: '取消'
            }]
        });
        rs.demo.template.form.FormPanel.superclass.constructor.call(this, config);
    }
});