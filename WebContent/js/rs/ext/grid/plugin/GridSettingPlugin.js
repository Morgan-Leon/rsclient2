Ext.ns('Rs.ext.gird.plugin');
(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridSettingPlugin
	 * @extends Ext.util.Observable
	 * ������ò��
	 */
	Rs.ext.gird.plugin.GridSettingPlugin = function(config){
		Ext.apply(this, config);
		Rs.ext.gird.plugin.GridSettingPlugin.superclass.constructor.apply(this , arguments);
	};
	
	Ext.extend(Rs.ext.gird.plugin.GridSettingPlugin, Ext.util.Observable, {
		
		init: function(grid){
			this.grid = grid ;
			this.initSettingButton();
		},
		
		//��ʼ�����ð�ť
		initSettingButton: function(){
			var tbar = this.grid.getTopToolbar();
			this.settingButton = new Ext.Button({
				text: '����' ,
	            iconCls: 'rs-action-settings',
	            scope: this.grid ,
	            handler: this.doSetting
	        }) ;
			tbar.addButton(new Ext.Toolbar.Fill()) ;
			tbar.addButton(this.settingButton) ;
		} ,
		
		//�û��Զ�������
	    doSetting : function(){
	    	if(this.setWin){
	    		this.setWin.show();
	    	}else {
	    		this.position = new Ext.form.RadioGroup({
	    			fieldLabel : '������λ��' ,
	    			hidden : true ,
	    			items: [
	    			        /*{boxLabel: '��ҳ��һ��', name: 'position' , inputValue: 1},*/
	    			        {boxLabel: '��ҳ���һ��', name: 'position', inputValue: 2, checked: true}
	    			        ]
	    		});
	    		
	    		this.addColor = new Rs.ext.form.ColorPickerFieldPlus({
	    			fieldLabel : '�����б�����ɫ' ,
	    			value : 'CCC'
	    		});
	    		var hideAction = function(){
	    			this.setWin.hide();
	    		};
				this.setWin = new Ext.Window({
					autoDestroy : false ,
					closeAction : 'hide',
					width : 320 ,
					title : '����',
					height : 200 ,
					padding : 10 ,
					layout : 'form',
					modal : true ,
					labelAlign : 'right',
					buttonAlign : 'center',
					buttons : [{
						text : 'ȷ��',
						iconCls : 'rs-action-ok',
						handler : hideAction ,
						scope : this
					},{
						text : 'ȡ��',
						iconCls : 'rs-action-cancel',
						handler : hideAction ,
						scope : this
					}],
					items : [this.addColor, this.position]
				}).show();
	    	}
	    }
	});
})();
