Ext.ns("Rs.ext.form");
(function(){
	Rs.ext.form.UEditorPanel = function(config){
		this.toolPanel = new Ext.Panel({
			border : false ,
			region : 'north' ,
			hideBorders : true ,
			split : true , //启用分割线的收缩
			collapseMode : "mini",//收缩按钮是mini的
			animCollapse : false,//收缩面板是否附带动画效果
			autoHeight : true
		}) ;
		this.editorId = Ext.id() ;
		this.contentPanel = new Ext.Panel({
			autoScroll : true ,
			region : 'center' ,
			border : false ,
			hideBorders : true ,
			html : "<div id='" + this.editorId + "'></div>"
		}) ;
		Rs.apply(config , {
			layout : 'border' ,
			items : [this.toolPanel , this.contentPanel]
		});
		Rs.ext.form.UEditorPanel.superclass.constructor.apply(this, arguments);
		this.contentPanel.on('afterrender' , this.doAfterRender ,this );
		this.addEvents(['editorready' , 'editorresize' , 'dynamicclick']);
	} ;
	
	Ext.extend(Rs.ext.form.UEditorPanel , Ext.Panel , {
		imageUrl :  '/kanban/attachment?action=upload' ,
		imagePath : '/kanban/attachment?action=read&path=' ,
		fileUrl : '/kanban/attachment?action=upload' ,
		filePath: '/kanban/attachment?action=read&path=' ,
		width : '600' ,
		height : '300' ,
		editorToolBars : [] ,
		doAfterRender : function(c){
			var editorConfig = {
					toolbars : this.toolbars ,
					imageUrl : this.imageUrl ,
					imagePath : this.imagePath ,
					fileUrl : this.fileUrl ,
					filePath : this.filePath ,
					autoClearinitialContent:true,//focus时自动清空初始化时的内容
					wordCount:false,//关闭字数统计
					elementPathEnabled:false,//关闭elementPath
					initialFrameWidth : this.width - 25 ,
					initialFrameHeight: this.height - 79//默认的编辑区域高度
				}
			   if(this.editorToolBars.length > 0){
				   Rs.apply(editorConfig || {} , {
					   toolbars : [this.editorToolBars]
				   });
			   }
			   this.editor =  UE.getEditor(this.editorId ,editorConfig) ;
			   this.editor.panel = this ;
			   this.editor.addListener("editorsizechange", this.doEditorSizeChange.createDelegate(this) ,this) ;
			   //点击工具栏上的动态数据按钮
			   this.editor.addListener("dynamicclick", this.doDynamicClick.createDelegate(this) ,this) ;
			   this.editor.ready(this.doEditorReady.createDelegate(this));
		} ,
		
		/**
		 * @method getEditor
		 * 获得Ueditor编辑器实例
		 */
        getEditor : function(){
        	return this.editor ;
        } ,
        
        doEditorSizeChange : function(eventName , editor){
        	var c = Ext.get(editor.container) , //整个编辑器的大小
			eWidth = c.getWidth() ,
			eHeight = c.getHeight() ;
	    	this.contentPanel.setWidth(eWidth + 20); // 20为滚动条宽度
	    	this.fireEvent('editorresize' , this , editor , eWidth , eHeight);
        } ,
        
        /**
         * @method getEditorValue
         * 获得编辑器内容,不包含其中的html标记
         */
        getEditorValue : function(){
        	return this.editor.getContent() ;
        } ,
        
        /**
         * 给编辑器设置值
         * @method setEditorValue
         * @params value 值
         */
        setEditorValue : function(value){
        	this.editor.setContent(value) ;
        } ,
        
        doEditorReady : function(){
        	//将Editor头复制到上方面板中
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
         * 获得编辑器面板工具面板
         */
        getToolPanel : function(){
        	return this.toolPanel ;
        } ,
        
        /**
         * @method getToolPanel
         * 获得编辑器面板内容面板
         */
        getContentPanel : function(){
        	return this.contentPanel ;
        }
	}) ;
})();