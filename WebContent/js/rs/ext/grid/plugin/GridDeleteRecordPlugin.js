Ext.ns('Rs.ext.gird.plugin');


/**
 * @class Rs.ext.gird.plugin.GridDeleteRecordPlugin
 * @extends Ext.util.Observable
 * 表格删除插件
 */
Rs.ext.gird.plugin.GridDeleteRecordPlugin = function(config){
	Ext.apply(this, config);
	this.addEvents(
	/**
	 * @event beforedelete
	 * 删除之前
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 */
	'beforedelete',
	
	/**
	 * @event deletefailure
	 * 删除失败
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 * @param {Object} result 返回结果
	 */
	'deletefailure',
	
	/**
	 * @event deletesuccess
	 * 删除成功
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 * @param {Object} result 返回结果
	 */
	'deletesuccess'
	);
	Rs.ext.gird.plugin.GridDeleteRecordPlugin.superclass.constructor.apply(this , arguments);
};

Ext.extend(Rs.ext.gird.plugin.GridDeleteRecordPlugin, Ext.util.Observable, {
	
	/**
	 * @cfg {Number} buttonPosition
	 * 新增按钮位置序号 默认 1
	 */
	buttonPosition : 1 ,
	
	/**
	 * @cfg {String} destroyMethod
	 * 删除默认调用的方法 默认destroy
	 */
	destroyMethod : 'destroy',
	
	/**
	 * @cfg {String/Array} fields
	 * 删除的时候除了主键外,还需要额外传递记录中的数据的字段
	 * 默认取store的idProperty
	 */
	fields: null,
	
	/**
	 * @cfg {String} deleteMsg
	 * 删除数据的时候提示的信息(在没有数据被修改的情况)
	 */
	deleteMsg: '您确定要删除选中的记录吗?',
	
	/**
	 * @cfg {String} noSavaMsg
	 * 删除数据的时候提示的信息(在有数据被修改且未保存情况的提示信息)
	 */
	noSavaMsg: '您有数据尚未保存，是否继续删除操作?',
	
	init: function(grid){
		this.grid = grid ;
		var self = this ;
		var map = new Ext.KeyMap(Ext.getBody() , {
			key: [68],
            ctrl:false,
            alt : false,
            shift:true,
		    fn: this.deleteRecord.createDelegate(this.grid , [self] , 0),
		    scope: this
		});
		this.initDeleteButton();
	},
	
	//初始化删除按钮
	initDeleteButton: function(){
		var tbar = this.grid.getTopToolbar();
		var self = this ;
		this.deleteButton = new Ext.Button({
            text: '删除',
            iconCls: 'rs-action-remove',
			tooltip: "删除操作",
            tooltipType: "qtip" ,
            handler: this.deleteRecord.createDelegate(this.grid , [self] , 0),
            scope: this
        }) ;
		tbar.insert(1, this.deleteButton) ;
	} ,
	
	//删除记录
    deleteRecord: function(plugin) {
    	var self = plugin ;
		var selects = this.getSelectionModel().getSelections(),
		    ds = this.getStore();
        if (!selects || selects.length < 1) {
        	Ext.MessageBox.show({
    			title: '错误',
    			msg: '请先选择要删除的数据行',
    			buttons: Ext.MessageBox.OK,
    			icon: Ext.MessageBox.ERROR
    		});
            return;
        }
        var callBackFunction = function(buttonId , text , option){
        	if(buttonId === 'ok'){
        		var callFn = self.doDeleteAction ;
        		if(self.fireEvent('beforedelete', this , self, callFn) !== false){
        			self.doDeleteAction(this, self);
        		}
        	}
        };
        
    	var modifyRecords = this.getStore().getModifiedRecords();
    	if(!Ext.isEmpty(modifyRecords)){ //有修改的数据
    		Ext.MessageBox.show({
    			title: '提示',
    			msg: plugin.noSavaMsg + '<br/>选择【确定】则执行删除操作，且删除的数据不可恢复。<br/>选择【取消】则返回',
    			buttons: Ext.MessageBox.OKCANCEL,
    			fn: callBackFunction,
    			icon: Ext.MessageBox.QUESTION,
    			scope : this
    		});
    		return ;
    	}
        Ext.Msg.show({
            title: '提示',
            msg: plugin.deleteMsg + "<br/>选择【确定】则执行删除操作，且删除的数据不可恢复。<br/>选择【取消】则返回",
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: callBackFunction,
            scope : this
        });
    },
    
    /**
     * 删除记录的操作
     * @method doModifyAction
     * @param {Ext.grid.GridPanel} grid
     * @param {Rs.ext.gird.plugin.GridSaveRecordPlugin} plugin
     */
    doDeleteAction: function(grid, self){
		var selects = grid.getSelectionModel().getSelections(),
		    ds = grid.getStore();
    	ds.remove(selects);
		ds.modified = [] ;
		var removeRecords = ds.removed ;
		var data = [];
		var fields = self.fields ;
		
		Ext.each(removeRecords, function(record, index, removeRecords){
			if(Ext.isArray(fields)){
				var param = {};
				Ext.each(fields, function(field, index, fields){
					param[field] = record.get(field);
					param[ds.writer.meta.idProperty] = record['id'];
				});
				data.push(param);
			} else if(!Ext.isEmpty(fields)){
				var param = {};
				param[fields] = record.get(fields);
				param[ds.writer.meta.idProperty] = record['id'];
				data.push(param);
			} else {
				var param = {};
				param[ds.writer.meta.idProperty] = record['id'];
				data.push(param);
			}
		}, this);
		
		var params = {} ;
		Rs.apply(params, ds.baseParams,{
			xaction : self.destroyMethod,
			data : data
		});
		
		Rs.Service.call({
			url : ds.url,
			method : self.destroyMethod,
			params : {
				params : params
			}
		}, function(result){
			if(result['success'] == false){
				self.fireEvent('deletefailure', grid, self, result);
			} else {
				self.fireEvent('deletesuccess', grid, self, result);
			}
			ds.removed = [] ;
		}, this);
    }
});
