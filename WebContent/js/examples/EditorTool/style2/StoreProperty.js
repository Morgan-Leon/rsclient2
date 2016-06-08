Rs.define('rs.tool.StoreProperty', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        Ext.QuickTips.init();

        var materialData = [{
            layout: 'column',
			labelWidth: 150,
            xtype: 'fieldset',
            border: true,
            frame: true,
            items: [{
                columnWidth: 1 ,
                layout: 'form',
                labelAlign: 'right',
                items: [{
                    id: 'autoLoad',
                    name: 'autoLoad',
                    inputValue: 'Y',
                    xtype: 'checkbox',
                    checked: true,
                    fieldLabel: '�Զ���������'
                },
                {
                    id: 'autoDestroy',
                    name: 'autoDestroy',
                    xtype: 'checkbox',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '�Զ���������'
                },{
                    id : 'idProperty' ,
                    xtype: 'textfield',
                    name: 'idProperty',
                    msgTarget: 'side',
                    width : 200 ,
                    fieldLabel: '����'
                },{
                    id : 'sortfield' ,
                    xtype: 'textfield',
                    name: 'sortfield',
                    msgTarget: 'side',
                    width : 200 ,
                    fieldLabel: '�����ֶ�'
                },{
		            xtype: 'radiogroup',
		            fieldLabel: '����ʽ',
		            items: [
		                {boxLabel: 'ASC', name: 'sorttype', inputValue: 'ASC', checked: true},
		                {boxLabel: 'DESC', name: 'sorttype', inputValue: 'DESC'},
		            ]
		        },{
                    id : 'url' ,
                    xtype: 'textfield',
                    name: 'url',
                    msgTarget: 'side',
                    width : 500 ,
					value : 'dataservice.rsc' ,
                    fieldLabel: 'url��ַ(��.rsc��β,��ͬ��Ŀ¼������)'
                },{
					id : 'fields' ,
                    xtype: 'textarea',
                    name: 'fields',
                    msgTarget: 'side',
					width : 500 ,
                    fieldLabel: 'fields�ֶ�(���� , ����)'
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
        rs.tool.StoreProperty.superclass.constructor.call(this, config);
    }
});