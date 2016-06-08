Rs.define('rs.edm.BomDefineTree',{    
	extend : Ext.tree.TreePanel, 
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		var lable = new Ext.form.Label({
            text : "*�������:"
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
	    	collapsible : true , //True��ʾΪ����ǿ������ģ����Զ���Ⱦһ��չ��/�������ֻ���ť��ͷ��
	    	autoLoad : false ,
            useArrows : true ,//�Ƿ�������ʹ��Vista��ʽ��ͷ��Ĭ��Ϊfalse
            autoScroll : true ,
            animate : false ,
            containerScroll : true ,//�Ƿ��������ע�ᵽ����������ScrollManager��
            rootVisible : true ,//�Ƿ���ʾ���ڵ�
            bodyStyle : 'background-color:#FFFFFF' ,
            root : {//���ĸ��ڵ�
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
	 * ��ѯ����
	 */
	doSearch : function(){
	   var keyWord = this.keyWordEl.getValue() ;
	   var keyWordRawValule = this.keyWordEl.getRawValue() ;
	   var rootNode = this.getRootNode() ;
	   if((keyWord == "") && (keyWordRawValule == "")){
           Ext.Msg.alert("��ʾ","��������������");
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