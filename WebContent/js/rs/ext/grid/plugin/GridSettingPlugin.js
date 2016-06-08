Ext.ns('Rs.ext.gird.plugin');
(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridSettingPlugin
	 * @extends Ext.util.Observable
	 * 表格设置插件
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
		
		//初始化设置按钮
		initSettingButton: function(){
			var tbar = this.grid.getTopToolbar();
			this.settingButton = new Ext.Button({
				text: '设置' ,
	            iconCls: 'rs-action-settings',
	            scope: this.grid ,
	            handler: this.doSetting
	        }) ;
			tbar.addButton(new Ext.Toolbar.Fill()) ;
			tbar.addButton(this.settingButton) ;
		} ,
		
		//用户自定义设置
	    doSetting : function(){
	    	if(this.setWin){
	    		this.setWin.show();
	    	}else {
	    		this.position = new Ext.form.RadioGroup({
	    			fieldLabel : '新增行位置' ,
	    			hidden : true ,
	    			items: [
	    			        /*{boxLabel: '单页第一行', name: 'position' , inputValue: 1},*/
	    			        {boxLabel: '单页最后一行', name: 'position', inputValue: 2, checked: true}
	    			        ]
	    		});
	    		
	    		this.addColor = new Rs.ext.form.ColorPickerFieldPlus({
	    			fieldLabel : '新增行背景颜色' ,
	    			value : 'CCC'
	    		});
	    		var hideAction = function(){
	    			this.setWin.hide();
	    		};
				this.setWin = new Ext.Window({
					autoDestroy : false ,
					closeAction : 'hide',
					width : 320 ,
					title : '设置',
					height : 200 ,
					padding : 10 ,
					layout : 'form',
					modal : true ,
					labelAlign : 'right',
					buttonAlign : 'center',
					buttons : [{
						text : '确定',
						iconCls : 'rs-action-ok',
						handler : hideAction ,
						scope : this
					},{
						text : '取消',
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
