Rs.define('rs.examples.formpanel.KindFormPanel' , {
	
	extend : Ext.form.FormPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		Ext.QuickTips.init();
		
		var title = new Ext.form.TextField({
			allowBlank : false , //������Ϊ��
            width : 800 ,
			fieldLabel : 'ģ����'			
		});
		
		var remark = new Ext.form.TextField({
            //allowBlank : false , //������Ϊ��
            anchor: '80%',
            fieldLabel : '��ע'
        });
		
		
		var sf = new Rs.ext.form.SingleUploadField({
	        fieldLabel : '�ļ�' ,
	        width : 500 ,
	        listeners : {
	            fileselected : function(field , v){
	                this.getForm().submit({
						 clientValidation : false , 
                         url: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa&Rs-accept=html',
                         waitMsg: '�����ϴ�...',
                         success: function(fp, o){
                             Ext.MessageBox.alert('��ϲ��', '�ϴ��ɹ���');
                         }
                     });
	            } ,
				beforeclick : function(){
					alert(2);
				} ,
				scope : this
	        }
	    });
		
		//����ͼƬ�ϴ�
        var newsImage = new Rs.ext.form.SingleUploadField({
            fieldLabel : '����ͼƬ' ,
            buttonText : '�ϴ�ͼƬ',
            width : 120 ,
            listeners : {
                fileselected : function(field , v){
                    this.getForm().submit({
                        clientValidation : false ,
                        url: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=hr&Rs-accept=html',
                        waitMsg: '�����ϴ�...',
                        success: function(fp, o){
                        	alert(1);
                        }
                    });
                },
                beforeclick : function(suf){
                    if(Ext.getCmp('newsImagePanel').newsImageId){
                        Ext.Msg.alert('��ʾ','����ɾ������ͼƬ���ϴ���ͼƬ!');
                        return false;
                    }
                },
                scope : this
            }
        });
		
		/**
		 * �ϴ����
		 */
		var uploadfile = new Rs.ext.form.SimpleFileUploadPanel({
			//Myeclipse����
            flashUrl : '/rsc/js/rs/ext/resources/swfupload.swf' ,
            //��׼����
            //flashUrl : '/com/rsc/rs/pub/rsclient2/rs/ext/resources/swfupload.swf' ,
			fieldLabel:'����',
			enableFile : true ,
			width : 745 ,
			uploadLimit:3,
            fileSize : 1024*550,//�����ļ���С
            uploadUrl : '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa',
            fileTypes : '*.*',//���ϴ��ļ�����
			listeners : {
                diaogcomplete : {
                    fn : function(){
						//alert("���ڹر�");
					} ,
					scope : this					
				} ,
				uploadsuccess : {
                    fn : function(panel , serverData , fileOption){
                        //alert("�ϴ��ļ���");
                    } ,
                    scope : this                    
                } ,
				deletefile : {
                    fn : function(panel , serverData){
                        //alert("ɾ���ļ�");
                    } ,
                    scope : this                    
                }
            }
		});
		/**
         * ��ȡ�ݸ����渽��  ������ݸ�ĸ���������ϴ�����������
         */
        this.store = new Rs.ext.data.Store({
            autoLoad: false ,
            autoDestroy: true ,
            url: 'formpanel/dataService.rsc',
            fields:['attachmentId' , 'attachmentIndex' , 'id','name','type','size','state','percent']
        });
		
		/**
		 * KindEditor �༭��
		 */
		var kindEditor = new Rs.ext.form.KindEditorPanel({
            fieldLabel:'��Ϣ',
            height: 400,
			width : '70%' ,
			//uploadJson : '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa' ,
			upload : {
				url : '/rsc/rsclient/attachment' ,
				method : 'upload',
				fileDir : 'oa'
			} ,
			resizeType : 1 , //2 ��1 ��0��2 ʱ�����϶��ı��Ⱥ͸߶ȣ�1 ʱֻ�ܸı�߶ȣ�0 ʱ�����϶���
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
			editorConfig : { //�༭����������
			}
		});
		
		
		
        //��ȡ�ݸ����渽��(������Ŀ�������)
        var attachmentStore = new Rs.ext.data.Store({
            autoLoad: false ,
            autoDestroy: true ,
            url: 'formpanel/dataService2.rsc',
            fields:['attachment_id' , 'attachment_index' ,'filename','ftype','fsize']
        });
		
		// �Ѿ��ϴ��������(������Ŀ�������)
		var attachmentGrid = new Ext.grid.GridPanel({
			fieldLabel : '���ϴ�����' ,
			width : 500 ,
            stripeRows :true ,
            autoHeight : true ,
            border :false,
            store: attachmentStore , 
            columns: [
                {header: '��������', width: 10, hidden: true,dataIndex: 'attachment_id', menuDisabled:true},
                {header: '��������', width: 10, hidden: true,dataIndex: 'attachment_index', menuDisabled:true},
                {header: '�ļ���', width: 190, sortable: true,dataIndex: 'filename', menuDisabled:true},
                {header: '����', width: 50, sortable: true,dataIndex: 'ftype', menuDisabled:true},
                {header: '��С', width: 80, sortable: true,dataIndex: 'fsize', menuDisabled:true,renderer:this.formatFileSize},
                {
                    xtype : 'actioncolumn',
                    header : '����',
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
	        title: "������Ϣ",
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
				text : '����' ,
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
                text : '��ݸ�' ,
                scope : this ,
                handler : function(){
                    title.getValue();
                }
            },{
                xtype : 'button' ,
                text : '����ģ��' ,
                scope : this ,
                handler : function(){
                    kindEditor.saveNewTemplate(title.getValue() , kindEditor.getValue());
                }
            },{
                xtype : 'button' ,
                text : '����' ,
                scope : this ,
                handler : function(){
                    
                }
            }]
		});
		rs.examples.formpanel.KindFormPanel.superclass.constructor.apply(this , arguments);
		
		this.on("afterrender" , function(){
			
			var html = '<span style="color:red;font-size:18px;">'
				+ 'ע�⣺�������и����ϴ����ˣ�ԭ������com.rsc.rsclient.ftp.FtpConfig.java��com.rsc.rsclient.ftp.FtpOperatorConfig.java'
				+ '�ļ��е�·���ǰ��ձ�׼���е�·������ӵ�(����upload.xml��ftpoperator.xml�ļ���eclipse�ͱ�׼������·����ͬ)�������Ҫ�ڴ���ʾ���뽫·����Ϊ��׼��,����ѹ����ʱ��ǵøĻ�ȥ��'
				+ '�Լ���Rs.ext.form.SimpleFileUploadPanel����е�flashUrl��·��Ҳ���ֱ�׼���eclipse�����ġ�</span>'
			
			kindEditor.setValue(html);
			
		    /**
		     * �ݸ����渽��
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
			 * �����б��ɹ����أ�������Ŀ������棩
			 */
			attachmentStore.load({params : {bulletin_id : 1}});
		} , this);
	} ,
	
	/**
	 * ���ظ�������
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
     * ��ʽ��������С
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
