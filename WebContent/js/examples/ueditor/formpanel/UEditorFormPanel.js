Rs.define('rs.examples.formpanel.UEditorFormPanel' , {
	
	extend : Ext.form.FormPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		Ext.QuickTips.init();
		
		this.title = new Ext.form.TextField({
			fieldLabel : '标题'
		});
		
		this.ueditorPanel = new Rs.ext.form.UEditorPanel({
			width : 600  ,
			height : 500 ,
			imageUrl :  '/kanban/attachment?action=upload' ,
			imagePath : '/kanban/attachment?action=read&path=' ,
			fileUrl : '/kanban/attachment?action=upload' ,
			filePath: '/kanban/attachment?action=read&path=' ,
			editorToolBars : ['source' , '|', 'undo', 'redo', '|',
		                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 
		                'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset',
		                'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 
		                'insertunorderedlist', 'selectall', 'cleardoc', '|',
		                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
		                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
		                'directionalityltr', 'directionalityrtl', 'indent', '|',
		                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
		                'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
		                'insertimage', 'insertvideo',  'emotion' ,'pagebreak', 'template', 'background', '|',
		                'horizontal', 'date', 'time', 'spechars', '|',
		                'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow',
		                'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown',
		                'splittocells', 'splittorows', 'splittocols', '|',
		                'print','searchreplace' , 'dynamic'] ,
			listeners : {
				editorready : function(panel , eidtor){
				} ,
				//编辑器大小发生变化
				editorresize : function(panel , editor , eWidth , eHeight){
				} ,
				scope : this
			}
		});
		
		Rs.apply(config || {} , {
			//layout : 'fit',
			collapsible: false,
	        border: true,
	        encType: "multipart/form-data",
	        region: 'center',
	        title: "发送信息",
	        id: 'inputForm',
	        name: 'inputForm',
	        labelWidth: 50,
	        labelAlign: 'right',
	        bodyStyle: 'padding:5 5 0',
	        buttonAlign: 'center',
	        autoScroll: true,
	        fileUpload: true,
	        items: [this.title],
			
			tbar : ['->' ,{
                xtype : 'button' ,
				text : '保存' ,
				iconCls : 'rs-action-ok' ,
				scope : this ,
				handler : function(){
					
				}
			},{
                xtype : 'button' ,
                text : '存草稿' ,
                scope : this ,
                handler : function(){
                }
            },{
                xtype : 'button' ,
                text : '保存模版' ,
                scope : this ,
                handler : function(){
                }
            },{
                xtype : 'button' ,
                text : '返回' ,
                scope : this ,
                handler : function(){
                    
                }
            }]
		});
		rs.examples.formpanel.UEditorFormPanel.superclass.constructor.apply(this , arguments);
	}
});
