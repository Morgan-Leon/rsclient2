Rs.define('rs.tool.GridProperty', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        Ext.QuickTips.init();

        var materialData = [{
            layout: 'column',
            xtype: 'fieldset',
            border: true,
            frame: true,
            items: [{
                columnWidth: 1 ,
                layout: 'form',
                labelAlign: 'right',
                items: [{
                    id : 'classname' ,
                    xtype: 'textfield',
                    name: 'classname',
					allowBlank: false ,
                    msgTarget: 'side',
                    fieldLabel: '*完整类名'
                },{
					id : 'title' ,
                    xtype: 'textfield',
                    name: 'title',
                    msgTarget: 'side',
                    fieldLabel: '表格标题'
                },
                this.a = {
                    id: 'editorable',
                    name: 'editorable',
                    inputValue: 'Y',
                    xtype: 'checkbox',
                    checked: true,
                    fieldLabel: '表格是否可编辑'
                },
                {
                    id: 'checkboxable',
                    name: 'checkboxable',
                    xtype: 'checkbox',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '是否需要选择框'
                }]
            }]
        }];

        config = Rs.apply(config || {},
        {
            autoDestroy: true,
            frame: true,
            border: false,
            labelAlign: 'right',
            autoScroll: true,
            items: [materialData]
        });
        rs.tool.GridProperty.superclass.constructor.call(this, config);
    }
});