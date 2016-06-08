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
     * ͨ������޸Ļ������������Ĳ���
     * @param {} params ������ǰapp , �Լ��к�, ��ǰ��¼
     * ͨ���ж��к����������������޸Ĳ���
     */
    doProcessingRecord : function(params){
    	var store = this.dgrid.store ;
    	params.app.on('beforeclose' , function(){
    		var modifyRecord = store.getModifiedRecords();
            if(modifyRecord.length > 0){
                Ext.Msg.show({
                    title : '��ʾ' ,
                    msg: "��������δ����,��Ҫ�ȱ�����?",
                    buttons: Ext.Msg.OKCANCEL,
                    fn: function(b){
                        if(b=='ok'){
                            this.dgrid.doUpdate() ; //ѡ����ȷ�����ȱ���
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
    	
        if(isNaN(params.rowIndex)){ //��������
        	this.dhead.rn.setReadOnly(false);//��������,��Ҫ�����յ����������Ϊ�ɶ���д
			var record = new store.recordType() ,
                keys = store.fields.keys;
	        record.data = {};
	        for (var i = 0,len = keys.length; i < len; i++) {
	            record.data[keys[i]] = '';
	        }
			this.showData(record) ;
        } else { //�޸�
            this.showData(params.record) ; //�����Ҫ�����ݹ����ļ�¼����ȥ
        	this.dhead.rn.setReadOnly(true);
        }
    } ,
    
	/**
	 * @method setData
	 * ��������
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
     * ���ò����Լ�ҳ���ʼ���������ݵĲ���,�ֱ����
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
     * �޸Ĳ�������,����¼�Ľ��յ��Ŵ��ݸ�grid,���ݽ��յ���ȥ���ݿ��в�ѯ����,
     * ͬʱ����¼��ֵ��ʾ��head��
     * @param {Object} rec
     */
    showData : function(rec){
        this.dhead.setData(rec);
        this.dgrid.setData(rec.get('receive_no'));
    }
});