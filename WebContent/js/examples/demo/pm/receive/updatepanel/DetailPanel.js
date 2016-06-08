Rs.define('rs.pm.DetailPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    	var dgrid = this.dgrid = new rs.pm.DetailGrid({region:'center'})
    	var dhead = this.dhead = new rs.pm.DocumentHead({region:'north' , grid : dgrid}) ;
        config = Rs.apply(config || {}, {
            layout : 'border',
            items : [dgrid , dhead]
        });
        rs.pm.DetailPanel.superclass.constructor.call(this, config);
        Rs.EventBus.on('meterialgrid-detail',this.doProcessingRecord,this);
        Rs.EventBus.on('documenthead-resetdata', this.resetData, this);
		
    },
    /**
     * 通过点击修改或者新增触发的操作
     * @param {} params 包括当前app , 以及行号, 当前记录
     * 通过判断行号来区别新增或者修改操作
     */
    doProcessingRecord : function(params){
    	var store = this.dgrid.store ;
    	params.app.on('beforeclose' , function(){
    		var modifyRecord = store.getModifiedRecords();
            if(modifyRecord.length > 0){
                Ext.Msg.show({
                    title : '提示' ,
                    msg: "有数据尚未保存,需要先保存吗?",
                    buttons: Ext.Msg.OKCANCEL,
                    fn: function(b){
                        if(b=='ok'){
                            this.dgrid.doUpdate() ; //选择了确定就先保存
                        }
                        store.clearModified(modifyRecord) ;
                        params.app.close() ;
                    },
                    scope : this,
                    icon: Ext.MessageBox.QUESTION
                }) ;
                return false ;
            } else {
                return true ;
            }
    	} ,this);
    	
        if(isNaN(params.rowIndex)){ //新增操作
        	this.dhead.rn.setReadOnly(false);//新增操作,需要将接收单号输入框置为可读可写
			var record = new store.recordType() ,
                keys = store.fields.keys;
	        record.data = {};
	        for (var i = 0,len = keys.length; i < len; i++) {
	            record.data[keys[i]] = '';
	        }
			this.showData(record) ;
        } else { //修改
            this.showData(params.record) ; //需改需要将传递过来的记录传进去
        	this.dhead.rn.setReadOnly(true);
        }
    } ,
    
	/**
	 * @method setData
	 * 加载数据
	 * @param {Object} rec
	 */
    setData : function(rec){
        if(this.rendered){
            this.showData(rec);
        } else{
            this.on('render', this.showData.createDelegate(this,[rec]), this);
        }
    },
    
    /**
     * @method resetData
     * 重置操作以及页面初始化加载数据的操作,分别调用
     */
    resetData : function(){
        if(this.rendered){
            this.dhead.resetData();
            this.dgrid.resetData();
        } else{
            this.on('render', this.resetData, this);
        }
    },
    
    /**
     * @method showData 
     * 修改操作触发,将记录的接收单号传递给grid,根据接收单号去数据库中查询数据,
     * 同时将记录的值显示在head中
     * @param {Object} rec
     */
    showData : function(rec){
        this.dhead.setData(rec);
        this.dgrid.setData(rec.get('receive_no'));
    }
});