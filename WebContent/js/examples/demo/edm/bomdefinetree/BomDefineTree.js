Rs.define('rs.edm.BomDefineTree',{    
	extend : Ext.tree.TreePanel, 
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		var lable = new Ext.form.Label({
            text : "*父项编码:"
		}) ;

		this.keyWordEl = new Rs.ext.form.Telescope({
            columnWidth : 1 ,
            enableKeyEvents : true ,
            singleSelect : true ,
            progCode : 'itemCode' ,
            valueField : 'ITEM_CODE' ,
            displayField : 'ITEM_NAME' ,
            listeners : {
                'keydown' : {
                    scope : this ,
                    fn : function(f , e){
                        if (e && e.keyCode == 13) {
                            this.doSearch() ;
                        }
                    }
                } ,
				select : {
					fn : this.doSearch ,
					scope : this
				}
            }
       }) ;
       
	    config = Rs.apply(config || {} , {
	    	collapsible : true , //True表示为面板是可收缩的，并自动渲染一个展开/收缩的轮换按钮在头部
	    	autoLoad : false ,
            useArrows : true ,//是否在树中使用Vista样式箭头，默认为false
            autoScroll : true ,
            animate : false ,
            containerScroll : true ,//是否将树形面板注册到滚动管理器ScrollManager中
            rootVisible : true ,//是否显示根节点
            bodyStyle : 'background-color:#FFFFFF' ,
            root : {//树的根节点
                noteType : 'async' ,
				expanded: true ,
				iconCls : 'rs-node-hide'
            } ,
            loader : this.treeloader = new Rs.ext.tree.TreeLoader({
                dataUrl : '/rsc/js/examples/demo/edm/bomdefinetree/BomDefineDataService.rsc' ,
                method : 'getSubMaterials' ,
                nodeAttrsParams : ['code'] 
            })  ,
            
            tbar : new Ext.Toolbar({
               layout : 'column' ,
               defaults : {
                   border : false
               } ,
               items : [lable ,this.keyWordEl , {
                    iconCls : 'rs-action-query' ,          
                    handler : this.doSearch ,
                    scope : this 
               }]
           }) 
	       
	    }) ;
		rs.edm.BomDefineTree.superclass.constructor.call(this , config) ;
	} ,
	
	/**
	 * @method doSearch
	 * 查询操作
	 */
	doSearch : function(){
	   var keyWord = this.keyWordEl.getValue() ;
	   var keyWordRawValule = this.keyWordEl.getRawValue() ;
	   var rootNode = this.getRootNode() ;
	   if((keyWord == "") && (keyWordRawValule == "")){
           Ext.Msg.alert("提示","父项编码必须输入");
           return ;
        } else {
			if(keyWord != ""){
                rootNode['attributes']['code'] = keyWord ;
			} else {
				rootNode['attributes']['code'] = keyWordRawValule ;
			}
            this.treeloader.load(rootNode);
        }
		rootNode.setText (keyWordRawValule) ;
		rootNode.setIconCls('.x-tree-node-expanded .x-tree-node-icon');
	}
}) ;