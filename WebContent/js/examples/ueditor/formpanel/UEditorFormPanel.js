Rs.define('rs.examples.formpanel.UEditorFormPanel' , {
	
	extend : Ext.form.FormPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		Ext.QuickTips.init();
		
		this.title = new Ext.form.TextField({
			fieldLabel : '����'
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
				//�༭����С�����仯
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
	        title: "������Ϣ",
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
				text : '����' ,
				iconCls : 'rs-action-ok' ,
				scope : this ,
				handler : function(){
					
				}
			},{
                xtype : 'button' ,
                text : '��ݸ�' ,
                scope : this ,
                handler : function(){
                }
            },{
                xtype : 'button' ,
                text : '����ģ��' ,
                scope : this ,
                handler : function(){
                }
            },{
                xtype : 'button' ,
                text : '����' ,
                scope : this ,
                handler : function(){
                    
                }
            }]
		});
		rs.examples.formpanel.UEditorFormPanel.superclass.constructor.apply(this , arguments);
	}
});
