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
                    fieldLabel: '自动加载数据'
                },
                {
                    id: 'autoDestroy',
                    name: 'autoDestroy',
                    xtype: 'checkbox',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '自动销毁数据'
                },{
                    id : 'idProperty' ,
                    xtype: 'textfield',
                    name: 'idProperty',
                    msgTarget: 'side',
                    width : 200 ,
                    fieldLabel: '主键'
                },{
                    id : 'sortfield' ,
                    xtype: 'textfield',
                    name: 'sortfield',
                    msgTarget: 'side',
                    width : 200 ,
                    fieldLabel: '排序字段'
                },{
		            xtype: 'radiogroup',
		            fieldLabel: '排序方式',
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
                    fieldLabel: 'url地址(以.rsc结尾,在同级目录下生成)'
                },{
					id : 'fields' ,
                    xtype: 'textarea',
                    name: 'fields',
                    msgTarget: 'side',
					width : 500 ,
                    fieldLabel: 'fields字段(请以 , 隔开)'
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