Ext.ns('Rs.ext.gird.plugin');


/**
 * @class Rs.ext.gird.plugin.GridDeleteRecordPlugin
 * @extends Ext.util.Observable
 * ���ɾ�����
 */
Rs.ext.gird.plugin.GridDeleteRecordPlugin = function(config){
	Ext.apply(this, config);
	this.addEvents(
	/**
	 * @event beforedelete
	 * ɾ��֮ǰ
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 */
	'beforedelete',
	
	/**
	 * @event deletefailure
	 * ɾ��ʧ��
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 * @param {Object} result ���ؽ��
	 */
	'deletefailure',
	
	/**
	 * @event deletesuccess
	 * ɾ���ɹ�
	 * @param {Ext.grid.EditorGridPanel} grid
	 * @param {Rs.ext.gird.plugin.GridDeleteRecordPlugin} plugin
	 * @param {Object} result ���ؽ��
	 */
	'deletesuccess'
	);
	Rs.ext.gird.plugin.GridDeleteRecordPlugin.superclass.constructor.apply(this , arguments);
};

Ext.extend(Rs.ext.gird.plugin.GridDeleteRecordPlugin, Ext.util.Observable, {
	
	/**
	 * @cfg {Number} buttonPosition
	 * ������ťλ����� Ĭ�� 1
	 */
	buttonPosition : 1 ,
	
	/**
	 * @cfg {String} destroyMethod
	 * ɾ��Ĭ�ϵ��õķ��� Ĭ��destroy
	 */
	destroyMethod : 'destroy',
	
	/**
	 * @cfg {String/Array} fields
	 * ɾ����ʱ�����������,����Ҫ���⴫�ݼ�¼�е����ݵ��ֶ�
	 * Ĭ��ȡstore��idProperty
	 */
	fields: null,
	
	/**
	 * @cfg {String} deleteMsg
	 * ɾ�����ݵ�ʱ����ʾ����Ϣ(��û�����ݱ��޸ĵ����)
	 */
	deleteMsg: '��ȷ��Ҫɾ��ѡ�еļ�¼��?',
	
	/**
	 * @cfg {String} noSavaMsg
	 * ɾ�����ݵ�ʱ����ʾ����Ϣ(�������ݱ��޸���δ�����������ʾ��Ϣ)
	 */
	noSavaMsg: '����������δ���棬�Ƿ����ɾ������?',
	
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
	
	//��ʼ��ɾ����ť
	initDeleteButton: function(){
		var tbar = this.grid.getTopToolbar();
		var self = this ;
		this.deleteButton = new Ext.Button({
            text: 'ɾ��',
            iconCls: 'rs-action-remove',
			tooltip: "ɾ������",
            tooltipType: "qtip" ,
            handler: this.deleteRecord.createDelegate(this.grid , [self] , 0),
            scope: this
        }) ;
		tbar.insert(1, this.deleteButton) ;
	} ,
	
	//ɾ����¼
    deleteRecord: function(plugin) {
    	var self = plugin ;
		var selects = this.getSelectionModel().getSelections(),
		    ds = this.getStore();
        if (!selects || selects.length < 1) {
        	Ext.MessageBox.show({
    			title: '����',
    			msg: '����ѡ��Ҫɾ����������',
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
    	if(!Ext.isEmpty(modifyRecords)){ //���޸ĵ�����
    		Ext.MessageBox.show({
    			title: '��ʾ',
    			msg: plugin.noSavaMsg + '<br/>ѡ��ȷ������ִ��ɾ����������ɾ�������ݲ��ɻָ���<br/>ѡ��ȡ�����򷵻�',
    			buttons: Ext.MessageBox.OKCANCEL,
    			fn: callBackFunction,
    			icon: Ext.MessageBox.QUESTION,
    			scope : this
    		});
    		return ;
    	}
        Ext.Msg.show({
            title: '��ʾ',
            msg: plugin.deleteMsg + "<br/>ѡ��ȷ������ִ��ɾ����������ɾ�������ݲ��ɻָ���<br/>ѡ��ȡ�����򷵻�",
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: callBackFunction,
            scope : this
        });
    },
    
    /**
     * ɾ����¼�Ĳ���
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
