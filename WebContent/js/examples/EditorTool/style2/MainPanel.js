Rs.define('rs.tool.MainPanel', {

    extend: Ext.TabPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        config = Rs.apply(config || {},
        {
            autoDestroy: true,
            deferredRender: false,
            activeTab: 0,
            plain: true,
            border: false,
            frame: true,
            items: [{
                title: 'Grid属性配置',
                border: false,
                layout: 'fit',
                items: [this.gridProperty = new rs.tool.GridProperty()]
            },{
                title: 'Store数据源配置',
                border: false,
                layout: 'fit',
                items: [this.storeProperty = new rs.tool.StoreProperty()]
            },{
                title: 'Grid列配置',
                border: false,
                layout: 'fit',
                items: [this.gridColumn = new rs.tool.GridColumn()]
            },{
                title: '头部TopBar配置',
                border: false,
                layout: 'fit',
                items: [this.tBarProperty = new rs.tool.TBarProperty()]
            }] ,
			tbar : [{
				text : '生成代码' ,
				scope : this ,
				handler : this.doCreate
			},{
                text : '预览' ,
                scope : this ,
                handler : this.doPreview
            }]
        });
        rs.tool.MainPanel.superclass.constructor.call(this, config);
		var edit = Ext.getCmp('editorable');
        edit.on('check' , function(checkbox,checked){
			if(!checked){
				this.gridColumn.getColumnModel().setHidden(4,true);
			} else {
				this.gridColumn.getColumnModel().setHidden(4,false);
			}
        } , this);
    } ,
	
	doCreate : function(){
		var params = this.getParams();
		Rs.Service.call({
			url: 'style2/dataService.rsc',
			method : 'doCreateCode' ,
			params : {
				params : params
			}
		} , this.goBackFunction , this);
	} ,
	
	getParams : function(){
	   	var params = [] ,data = {} , datasource = [];
		
		data = this.gridProperty.getForm().getValues();
		params.push(data);
		
		data = this.storeProperty.getForm().getValues();
        params.push(data);
		
		var records = this.gridColumn.getStore().getModifiedRecords() ;
		
		for(var i=0,len=records.length;i<len;i++){
			data = records[i].data ;
			datasource.push(data);
		}
		params.push(datasource);
		return params ;
	} ,
	
	goBackFunction : function(success){
	   	
	} ,
	
	doPreview : function(){
		
	}
});