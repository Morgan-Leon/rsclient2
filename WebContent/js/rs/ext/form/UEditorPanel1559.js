Ext.ns("Rs.ext.form");
(function(){
	Rs.ext.form.UEditorPanel = function(config){
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
					autoClearinitialContent:true,//focusʱ�Զ���ճ�ʼ��ʱ������
					wordCount:false,//�ر�����ͳ��
					elementPathEnabled:false,//�ر�elementPath
					initialFrameWidth : this.width - 25 ,
					initialFrameHeight: this.height - 79//Ĭ�ϵı༭����߶�
				}
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
        }
	}) ;
})();