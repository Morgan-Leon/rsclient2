Ext.ns("Rs.ext.form");
(function(){
	Rs.ext.form.SlidePanel = function(config){
		this.toolPanel = new Ext.Panel({
			border : false ,
			region : 'north' ,
			hideBorders : true ,
			split : true , //���÷ָ��ߵ�����
			collapseMode : "mini",//������ť��mini��
			animCollapse : false,//��������Ƿ񸽴�����Ч��
			autoHeight : true
		}) ;
		this.editorId = Ext.id() ;
		this.contentPanel = new Ext.Panel({
			autoScroll : true ,
			region : 'center' ,
			border : false ,
			margins : '10px',
			hidden : true,
			html : "<div id='" + this.editorId + "'></div>"
		}) ;
		this.slideStore = new Ext.data.SimpleStore({
	        fields : [{
	            name:'name', mapping:'name'
	        }]
	    }) ;
		this.slideNo = 0;
		this.contextMenu = new Ext.menu.Menu({
			defaults:{
				hideDelay:1
			},
			items:[{
				text:'�½��õ�Ƭ',
				handler:this.addSlide,
				scope:this
			}]
		});
		this.slideContextMenu = new Ext.menu.Menu({
			defaults:{
				hideDelay:1
			},
			items:[{
				text:'�½��õ�Ƭ',
				handler:this.addSlide,
				scope:this
			},{
				text:'ɾ���õ�Ƭ',
				handler:this.removeSlide,
				scope:this
			}]
		});
		this.indexPanel = new Ext.Panel({
			region : 'west',
			border : true,
			width : 140,
			autoScroll : true,
			items : [new Ext.DataView({
				store : this.slideStore,
				itemSelector : 'div.kb-set-slide',
				selectedClass : 'kb-set-slide-over',
				singleSelect : true,
				tpl : new Ext.XTemplate(
			            '<tpl for=".">',
			                '<div class="kb-set-slide">',
			                    '<div class="kb-slide-icon icon" ></div>',
			                    '<div class="kb-set-slide-label" >{name}</div>',
			                '</div>',
			            '</tpl>'
			    ),
				listeners : {
				  	contextmenu : {
				  		fn : this.onSlideRightClick,
				  		scope : this
				  	},
				  	click : {
				  		fn : this.onSlideSelect,
				  		scope : this
				  	}
				}
			})]
		});
		Rs.apply(config , {
			layout : 'border' ,
			items : [this.toolPanel , 
			         new Ext.Panel({
			        	 region : 'center',
			        	 layout : 'border',
			        	 items : [
			        	      this.indexPanel,
			        	      this.contentPanel]
			         })]
		});
		Rs.ext.form.SlidePanel.superclass.constructor.apply(this, arguments);
		this.contentPanel.on('afterrender' , this.doAfterRender ,this );
		this.addEvents(['editorready' , 'editorresize' , 'dynamicclick', 
		                'addslide', 'removeslide', 'select']);
	} ;
	
	Ext.extend(Rs.ext.form.SlidePanel , Ext.Panel , {
		imageUrl :  '/kanban/attachment?action=upload' ,
		imagePath : '/kanban/attachment?action=read&path=' ,
		fileUrl : '/kanban/attachment?action=upload' ,
		filePath: '/kanban/attachment?action=read&path=' ,
		width : '765' ,
		height : '540' ,
		editorToolBars : [] ,
		doAfterRender : function(c){
			var editorConfig = {
				toolbars : this.toolbars ,
				imageUrl : this.imageUrl ,
				imagePath : this.imagePath ,
				fileUrl : this.fileUrl ,
				filePath : this.filePath ,
				autoClearinitialContent:true,//focusʱ�Զ���ճ�ʼ��ʱ������
				wordCount:false,//�ر�����ͳ��
				elementPathEnabled:false,//�ر�elementPath
				initialFrameWidth : this.width - 175 ,
				initialFrameHeight: this.height - 130//Ĭ�ϵı༭����߶�
			};
			if(this.editorToolBars.length > 0){
				Rs.apply(editorConfig || {} , {
					toolbars : [this.editorToolBars]
				});
			}
			this.editor =  UE.getEditor(this.editorId ,editorConfig) ;
			this.editor.panel = this ;
			this.editor.addListener("editorsizechange", this.doEditorSizeChange.createDelegate(this) ,this) ;
			//����������ϵĶ�̬���ݰ�ť
			this.editor.addListener("dynamicclick", this.doDynamicClick.createDelegate(this) ,this) ;
			this.editor.ready(this.doEditorReady.createDelegate(this));
			this.indexPanel.body.on('contextmenu', this.onRightClick, this);
		} ,
		
		/**
		 * @method getEditor
		 * ���Ueditor�༭��ʵ��
		 */
        getEditor : function(){
        	return this.editor ;
        } ,
        
        doEditorSizeChange : function(eventName , editor){
        	var c = Ext.get(editor.container) , //�����༭���Ĵ�С
				eWidth = c.getWidth() ,
				eHeight = c.getHeight() ;
	    	this.contentPanel.setWidth(eWidth + 20); // 20Ϊ���������
	    	this.fireEvent('editorresize' , this , editor , eWidth , eHeight);
        } ,
        
        /**
         * @method getEditorValue
         * ��ñ༭������,���������е�html���
         */
        getEditorValue : function(){
        	return this.editor.getContent() ;
        } ,
        
        /**
         * ���༭������ֵ
         * @method setEditorValue
         * @params value ֵ
         */
        setEditorValue : function(value){
        	this.editor.setContent(value) ;
        } ,
        
        doEditorReady : function(){
        	//��Editorͷ���Ƶ��Ϸ������
        	var el = Ext.get(this.editorId).select('.edui-editor-toolbarbox') ;
        	var toolEl = Ext.get(el.elements[0]) ;
        	var toolHtml = toolEl.dom.innerHTML ;
        	toolEl.remove();
        	this.toolPanel.el.select('.x-panel-body').elements[0].innerHTML = toolHtml ;
        	this.fireEvent('editorready' , this , this.editor );
        } ,
        
        doDynamicClick : function(e , fn ){
        	this.fireEvent('dynamicclick' , this , fn , this.editor );
        } ,
        
        /**
         * @method getToolPanel
         * ��ñ༭����幤�����
         */
        getToolPanel : function(){
        	return this.toolPanel ;
        } ,
        
        /**
         * @method getToolPanel
         * ��ñ༭������������
         */
        getContentPanel : function(){
        	return this.contentPanel ;
        },
        
        addSlide : function(){
        	if(!this.contentPanel.isVisible()){
        		this.contentPanel.show();
        	}
        	this.slideStore.loadData([{name : '�õ�Ƭ'+(++this.slideNo)}], true);
        	this.fireEvent('addslide', this.slideNo);
        },
        
        removeSlide : function(){
        	this.slideNo--;
        	var ss = this.slideStore;
        	ss.removeAt(ss.getCount()-1);
        	this.fireEvent('removeslide', this.currentSlide);
        },
        
        onRightClick : function(e){
        	this.contextMenu.showAt(e.getXY());
        	e.stopEvent();
        },
        
        onSlideRightClick : function(dataView,index,node,e) {
        	this.currentSlide = index;
        	this.slideContextMenu.showAt(e.getXY());
        	e.stopEvent();
        },
        
        onSlideSelect : function(node, index){
        	this.fireEvent('select', index);
        }
	}) ;
})();