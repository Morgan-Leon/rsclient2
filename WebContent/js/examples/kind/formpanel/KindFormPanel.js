Rs.define('rs.examples.formpanel.KindFormPanel' , {
	
	extend : Ext.form.FormPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		Ext.QuickTips.init();
		
		var title = new Ext.form.TextField({
			allowBlank : false , //不允许为空
            width : 800 ,
			fieldLabel : '模板名'			
		});
		
		var remark = new Ext.form.TextField({
            //allowBlank : false , //不允许为空
            anchor: '80%',
            fieldLabel : '备注'
        });
		
		
		var sf = new Rs.ext.form.SingleUploadField({
	        fieldLabel : '文件' ,
	        width : 500 ,
	        listeners : {
	            fileselected : function(field , v){
	                this.getForm().submit({
						 clientValidation : false , 
                         url: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa&Rs-accept=html',
                         waitMsg: '正在上传...',
                         success: function(fp, o){
                             Ext.MessageBox.alert('恭喜您', '上传成功！');
                         }
                     });
	            } ,
				beforeclick : function(){
					alert(2);
				} ,
				scope : this
	        }
	    });
		
		//形象图片上传
        var newsImage = new Rs.ext.form.SingleUploadField({
            fieldLabel : '形象图片' ,
            buttonText : '上传图片',
            width : 120 ,
            listeners : {
                fileselected : function(field , v){
                    this.getForm().submit({
                        clientValidation : false ,
                        url: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=hr&Rs-accept=html',
                        waitMsg: '正在上传...',
                        success: function(fp, o){
                        	alert(1);
                        }
                    });
                },
                beforeclick : function(suf){
                    if(Ext.getCmp('newsImagePanel').newsImageId){
                        Ext.Msg.alert('提示','请先删除形象图片再上传新图片!');
                        return false;
                    }
                },
                scope : this
            }
        });
		
		/**
		 * 上传组件
		 */
		var uploadfile = new Rs.ext.form.SimpleFileUploadPanel({
			//Myeclipse环境
            flashUrl : '/rsc/js/rs/ext/resources/swfupload.swf' ,
            //标准环境
            //flashUrl : '/com/rsc/rs/pub/rsclient2/rs/ext/resources/swfupload.swf' ,
			fieldLabel:'附件',
			enableFile : true ,
			width : 745 ,
			uploadLimit:3,
            fileSize : 1024*550,//限制文件大小
            uploadUrl : '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa',
            fileTypes : '*.*',//可上传文件类型
			listeners : {
                diaogcomplete : {
                    fn : function(){
						//alert("窗口关闭");
					} ,
					scope : this					
				} ,
				uploadsuccess : {
                    fn : function(panel , serverData , fileOption){
                        //alert("上传文件后");
                    } ,
                    scope : this                    
                } ,
				deletefile : {
                    fn : function(panel , serverData){
                        //alert("删除文件");
                    } ,
                    scope : this                    
                }
            }
		});
		/**
         * 获取草稿里面附件  将保存草稿的附件添加上上传组件的面板中
         */
        this.store = new Rs.ext.data.Store({
            autoLoad: false ,
            autoDestroy: true ,
            url: 'formpanel/dataService.rsc',
            fields:['attachmentId' , 'attachmentIndex' , 'id','name','type','size','state','percent']
        });
		
		/**
		 * KindEditor 编辑器
		 */
		var kindEditor = new Rs.ext.form.KindEditorPanel({
            fieldLabel:'信息',
            height: 400,
			width : '70%' ,
			//uploadJson : '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa' ,
			upload : {
				url : '/rsc/rsclient/attachment' ,
				method : 'upload',
				fileDir : 'oa'
			} ,
			resizeType : 1 , //2 或1 或0，2 时可以拖动改变宽度和高度，1 时只能改变高度，0 时不能拖动。
			editoritems : [
	            'source', '|', 'undo', 'redo', '|','preview','print', 'rstemplate', 'code', 'cut', 'copy',
	            'paste','plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
	            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
	            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
	            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
	            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
	            'flash', 'media','insertVideo' , 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
	            'anchor', 'link', 'unlink'
	        ] ,
			editorConfig : { //编辑器其他配置
			}
		});
		
		
		
        //获取草稿里面附件(用在栏目浏览里面)
        var attachmentStore = new Rs.ext.data.Store({
            autoLoad: false ,
            autoDestroy: true ,
            url: 'formpanel/dataService2.rsc',
            fields:['attachment_id' , 'attachment_index' ,'filename','ftype','fsize']
        });
		
		// 已经上传附件面板(用在栏目浏览里面)
		var attachmentGrid = new Ext.grid.GridPanel({
			fieldLabel : '已上传附件' ,
			width : 500 ,
            stripeRows :true ,
            autoHeight : true ,
            border :false,
            store: attachmentStore , 
            columns: [
                {header: '附件编码', width: 10, hidden: true,dataIndex: 'attachment_id', menuDisabled:true},
                {header: '附件索引', width: 10, hidden: true,dataIndex: 'attachment_index', menuDisabled:true},
                {header: '文件名', width: 190, sortable: true,dataIndex: 'filename', menuDisabled:true},
                {header: '类型', width: 50, sortable: true,dataIndex: 'ftype', menuDisabled:true},
                {header: '大小', width: 80, sortable: true,dataIndex: 'fsize', menuDisabled:true,renderer:this.formatFileSize},
                {
                    xtype : 'actioncolumn',
                    header : '下载',
                    width : 100,
                    //align : 'center',
                    items : [{
                        iconCls : 'rs-action-download-enable',
                        handler : this.downloadFile,
                        scope : this
                    } , {
                    	iconCls : 'rs-action-editfind',
                        handler : this.doPreviewAttachment,
                        scope : this
                    }]
                }
            ]
		});
		
		Rs.apply(config || {} , {
			layout : 'fit',
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
	        items: [{
	            layout: 'form',
	            labelWidth: 75,
	            border: false,
	            items: [title ,sf, newsImage , remark ,uploadfile , attachmentGrid ,{
	                layout: 'column',
	                items: [kindEditor]
	            }]
	        }],
			
			tbar : ['->' ,{
                xtype : 'button' ,
				text : '保存' ,
				iconCls : 'rs-action-ok' ,
				scope : this ,
				handler : function(){
					//alert(kindEditor.getValue());
					var store = uploadfile.gp.getStore() ;
					store.filterBy(function(record  , id){
						alert(record.get('state'));
						alert(record.data['state']);
					} , this);
				}
			},{
                xtype : 'button' ,
                text : '存草稿' ,
                scope : this ,
                handler : function(){
                    title.getValue();
                }
            },{
                xtype : 'button' ,
                text : '保存模版' ,
                scope : this ,
                handler : function(){
                    kindEditor.saveNewTemplate(title.getValue() , kindEditor.getValue());
                }
            },{
                xtype : 'button' ,
                text : '返回' ,
                scope : this ,
                handler : function(){
                    
                }
            }]
		});
		rs.examples.formpanel.KindFormPanel.superclass.constructor.apply(this , arguments);
		
		this.on("afterrender" , function(){
			
			var html = '<span style="color:red;font-size:18px;">'
				+ '注意：本例子中附件上传不了，原因是在com.rsc.rsclient.ftp.FtpConfig.java和com.rsc.rsclient.ftp.FtpOperatorConfig.java'
				+ '文件中的路径是按照标准版中的路径来添加的(加载upload.xml和ftpoperator.xml文件在eclipse和标准环境下路径不同)，如果需要在此演示，请将路径改为标准版,但在压缩的时候记得改回去。'
				+ '以及在Rs.ext.form.SimpleFileUploadPanel这个中的flashUrl的路径也区分标准版和eclipse环境的。</span>'
			
			kindEditor.setValue(html);
			
		    /**
		     * 草稿里面附件
		     */
			/*this.store.load({params : {bulletin_id : 1}});
			this.store.on('load' , function(store ,records , options){
				uploadfile.gp.getStore().add(records);
				uploadfile.linkBtnEvent();
				if(records.length > 0){
					uploadfile.attachmentIdTextField.setValue(records[0].get('attachmentId'));
				}
			} ,this);*/
			
			
			
			/**
			 * 附件列表，可供下载（用在栏目浏览里面）
			 */
			attachmentStore.load({params : {bulletin_id : 1}});
		} , this);
	} ,
	
	/**
	 * 下载附件操作
	 * @param {Object} grid
	 * @param {Object} rowIndex
	 * @param {Object} colIndex
	 */
	downloadFile : function(grid, rowIndex, colIndex) {
        var record = grid.getStore().getAt(rowIndex), 
			fname = record.get('filename') ,
			ftype = record.get('ftype') ,
			attachmentId = record.get('attachment_id') ,
			attachmentIndex = record.get('attachment_index') ,
			frame = Ext.fly(this.id + "-iframe");
        if (frame) {
            frame.remove();
        }
        frame = Ext.DomHelper.append(Ext.getBody(), {
            tag : "div",
            id : this.id + "-iframe",
            style : "display:none",
            html : "<iframe src='/rsc/rsclient/attachment?Rs-method=download&Rs-accept="
                    + ftype
                    + "&attachmentId="
                    + attachmentId
                    + "&attachmentIndex="
                    + attachmentIndex
                    + "&filename="
                    + encodeURIComponent(encodeURIComponent(fname))
                    + "'></iframe>"
        });
    } ,
    
    /**
     * 格式化附件大小
     * @param {Object} _v
     * @param {Object} celmeta
     * @param {Object} record
     */	
	formatFileSize : function(_v, celmeta, record) {
        return Ext.util.Format.fileSize(_v);
    } ,
    
    
    doPreviewAttachment : function(grid, rowIndex, colIndex){
    	var record = grid.getStore().getAt(rowIndex), 
			fname = record.get('filename') ,
			attachmentId = record.get('attachment_id') ,
			attachmentIndex = record.get('attachment_index')  ;
    	var url = "/rsc/rsclient/attachment?Rs-method=preview" + "&attachmentId="
			    	+ attachmentId
			        + "&attachmentIndex="
			        + attachmentIndex
			        + "&filename="
			        + encodeURIComponent(encodeURIComponent(fname)) ;
    	window.open(url);
    }
});
