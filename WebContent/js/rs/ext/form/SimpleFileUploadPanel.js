Ext.ns("Rs.ext.form");
(function(){
    /**
     * @class Rs.ext.form.SimpleFileUploadPanel
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config Configuration options
     * @xtype rs-ext-simplefileuploadpanel
     */
    Rs.ext.form.SimpleFileUploadPanel =  function(config){
        
    	if(config.width && config.width <745){
    		config.width = 745 ;
    	}
    	
        Ext.apply(this,config);
        
        this.attachmentIdTextField = new Ext.form.TextField({
            dataIndex : 'attachmentIdTextField',
            hidden : true ,
            value : -1
        });
        this.gp = new Ext.grid.GridPanel({
            stripeRows :true ,
            autoHeight : true ,
            border :false,
            hideHeaders : true ,
            store: new Ext.data.Store({
                fields:['attachmentId' , 'attachmentIndex' , 'id','name','type','size','state','percent']
            }),
            columns: [
                {header: '��������', width: 10, hidden: true,dataIndex: 'attachmentId', menuDisabled:true},
                {header: '��������', width: 10, hidden: true,dataIndex: 'attachmentIndex', menuDisabled:true},
                {header: '�ļ���', width: 190, sortable: true,dataIndex: 'name', menuDisabled:true},
                {header: '����', width: 50, sortable: true,dataIndex: 'type', menuDisabled:true},
                {header: '��С', width: 80, sortable: true,dataIndex: 'size', menuDisabled:true,renderer:this.formatFileSize},
                {header: '����', width: 150, sortable: true,dataIndex: 'percent', menuDisabled:true,renderer:this.formatProgressBar,scope:this},
                {header: '״̬', width: 70, sortable: true,dataIndex: 'state', menuDisabled:true,renderer:this.formatFileState,scope:this},
                {header: '&nbsp;',width:200,dataIndex:'id', menuDisabled:true,renderer:this.formatDelBtn}
            ]
        });
        
        this.setting = {
            upload_url : this.uploadUrl, 
            flash_url : this.flashUrl,
            file_size_limit : this.fileSize || (1024*50) ,//�ϴ��ļ�������ޣ���λMB
            file_post_name : this.filePostName,
            file_types : this.fileTypes||"*.*",  //�����ϴ����ļ����� 
            file_types_description : "All Files",  //�ļ���������
            file_upload_limit : this.uploadLimit ? (this.uploadLimit + '') : "0",  //�޶��û�һ��������ϴ����ٸ��ļ������ϴ������У������ֻ��ۼӣ��������Ϊ��0�������ʾû������ 
            file_queue_limit : "10",//�ϴ������������ƣ�����ͨ���������ã������file_upload_limit�Զ���ֵ              
            post_params : this.postParams ,
            use_query_string : true,
            debug : false,
            button_cursor : SWFUpload.CURSOR.HAND,
            button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
            custom_settings : {//�Զ������
                scope_handler : this
            },
            file_queued_handler : this.onFileQueued,
            swfupload_loaded_handler : function(){},// ��Flash�ؼ��ɹ����غ󴥷����¼�������
            file_dialog_start_handler : function(){},// ���ļ�ѡȡ�Ի��򵯳�ǰ�������¼�������
            file_dialog_complete_handler : this.onDiaogComplete,//���ļ�ѡȡ�Ի���رպ󴥷����¼�����
            upload_start_handler : this.onUploadStart,// ��ʼ�ϴ��ļ�ǰ�������¼�������
            upload_success_handler : this.onUploadSuccess,// �ļ��ϴ��ɹ��󴥷����¼������� 
            swfupload_loaded_handler : function(){},// ��Flash�ؼ��ɹ����غ󴥷����¼�������  
            upload_progress_handler : this.uploadProgress,
            upload_complete_handler : this.onUploadComplete,
            upload_error_handler : this.onUploadError,
            file_queue_error_handler : this.onFileError
        };
        this.uppanel = new Ext.Panel({
			hidden : true ,
            autoHeight:true ,
            items :[this.attachmentIdTextField , this.gp] ,
            border : false
        });
        
        Ext.apply(this.listeners || {} , {
            'afterrender':function(){
                    var em = this.getTopToolbar().get(0).el.child('em');
                    var placeHolderId = Ext.id();
                    em.setStyle({
                        position : 'relative',
                        display : 'block' ,
                        'z-index' : 1
                    });
                    
                    em.createChild({
                        tag : 'div',
                        id : placeHolderId
                    });
                    
                    this.swfupload = new SWFUpload(Ext.apply(this.setting,{
                        button_width : em.getWidth(),
                        button_height : em.getHeight(),
                        button_placeholder_id :placeHolderId
                    }));
                    this.swfupload.uploadStopped = false;
                    Ext.get(this.swfupload.movieName).setStyle({
                        position : 'absolute',
                        top : '0px' ,
                        left : '-2px' ,
                        'z-index' : 2
                    });
                },
                scope : this,
                delay : 100
        });
		
        this.addBtn = new Ext.Button({
            text:'����ļ�',
            iconCls:'rs-action-addfile'
        }),
        this.uploadBtn = new Ext.Button({
            text:'�ϴ��ļ�',
            iconCls:'rs-action-uploadfile',
            handler:this.startUpload,
            scope:this
        });
        this.stopBtn = new Ext.Button({
            text:'ֹͣ�ϴ�',
            iconCls:'rs-action-stopfile',
            handler:this.stopUpload,
            scope:this
        });
        this.deleteBtn = new Ext.Button({
            text:'ɾ������',
            iconCls:'rs-action-cleanfile',
            handler:this.deleteAll,
            scope:this
        });
        var btns = [this.addBtn, '-'];
        if(this.enableFile){
            btns.push(this.uploadBtn);
            btns.push('-');
            btns.push(this.stopBtn);
            btns.push('-');
        }
        btns.push(this.deleteBtn);
        
        Rs.ext.form.SimpleFileUploadPanel.superclass.constructor.call(this, {
            border : false ,
            tbar : new Ext.Toolbar({
                hideBorders : true ,
                style: 'background-color:#FFFFFF; background-image:url();', 
                items: [btns]
            }),
            layout : 'fit' ,
            items : [this.uppanel]
        });
		
        this.addEvents(
        /**
         * @event diaogcomplete ���ļ�ѡ���رպ󴥷�
         * @param {SimpleFileUploadPanel} this
         */
        'diaogcomplete' ,
        
        /**
         * @event uploadsuccess �ļ��ϴ���ɺ󴥷�
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         * @param {Object} fileoption
         */
        'uploadsuccess' ,
        
        /**
         * @event deletefile ɾ���ļ��󴥷�
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         */
        'deletefile'
        );
    }
    
    Ext.extend(Rs.ext.form.SimpleFileUploadPanel , Ext.Panel , {
	   
       //Myeclipse����
       //flashUrl : '/rsc/js/rs/ext/resources/swfupload.swf' ,
       //��׼����
       flashUrl : '/com/rsc/rs/pub/rsclient2/rs/ext/resources/swfupload.swf' ,
       
	   /**
        * @cfg {Boolean} enableFile
        * �Ƿ����ͨ������ϴ���ť�ϴ��ļ���Ĭ��true
        */
	   enableFile : true ,
	   
	   /**
        * @cfg {Number} width
        * ��ȴ�С ��С��745
        */
       width : 745 ,
       
       /**
        * @cfg {String} fieldLabel
        * �ϴ����������
        */
       fieldLabel: null,
       
	   /**
        * @cfg {Number} fileSize
        * �ϴ�������С����λKB
        * Ĭ��50M
        */
       fileSize : 1024*50 ,//�����ļ���С MB
       
       /**
        * @cfg {String} uploadUrl
        * �ļ��ϴ�·��.��/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa
        */
       uploadUrl : null ,
       
	   /**
        * @cfg {String} fileTypes
        * �ϴ���������
        * ���ϴ��ļ����� ������ָ���������ϴ����ļ����ͣ����ж������ʱʹ�÷ֺŸ��������磺*.jpg;*.png ,������������ʱ��ʹ�� *.*
        */
       fileTypes : '*.*',//
       
       /**
        * @cfg {String} uploadLimit
        * �޶��û�һ��������ϴ����ٸ��ļ�.Ĭ��10��
        */
       uploadLimit : '10',//
       
       postParams : {
       
       } ,

       toggleBtn :function(bl){
            this.addBtn.setDisabled(bl);
            if(this.uploadBtn){
                this.uploadBtn.setDisabled(bl);
            }
            if(this.stopBtn){
                this.stopBtn.setDisabled(!bl);
            }
            this.deleteBtn.setDisabled(bl);
            this.gp.getColumnModel().setHidden(6,bl);
        },
        onUploadStart : function(file) {  
           var post_params = this.settings.post_params;  
           Ext.apply(post_params,{//�������Ĳ�������
                //fileName : file.name,
                fileName : encodeURIComponent(file.name) ,
                attachmentId : this.customSettings.scope_handler.attachmentIdTextField.getValue(),
                uploadType : 'simplePanel'
           });  
           this.setPostParams(post_params);  
        },
        startUpload : function() {
            if (this.swfupload) {
                if (this.swfupload.getStats().files_queued > 0) {
                    this.swfupload.uploadStopped = false;
                    this.toggleBtn(true);
                    this.swfupload.startUpload();
                }
            }
        },
        
        formatFileSize : function(_v, celmeta, record) {
            return Ext.util.Format.fileSize(_v);
        },
        
        formatFileState : function(n){//�ļ�״̬
            switch(n){
                case -1 : return 'δ�ϴ�';
                break;
                case -2 : return '�����ϴ�';
                break;
                case -3 : return '<div style="color:red;">�ϴ�ʧ��</div>';
                break;
                case -4 : return '�ϴ��ɹ�';
                break;
                case -5 : return 'ȡ���ϴ�';
                break;
                default: return n;
            }
        },
        
        formatProgressBar : function(v){
            var progressBarTmp = this.getTplStr(v);
            return progressBarTmp;
        },
        
        getTplStr : function(v){
            var bgColor = "#6593CF";
            var borderColor = "#7FA9E4";
            return String.format(
                '<div>'+
                    '<div style="border:1px solid {0};height:10px;width:{1}px;margin:4px 0px 1px 0px;float:left;">'+        
                        '<div style="float:left;background:{2};width:{3}%;height:10px;"><div></div></div>'+
                    '</div>'+
                '<div style="text-align:center;float:right;width:40px;margin:3px 0px 1px 0px;height:10px;font-size:12px;">{3}%</div>'+          
            '</div>', borderColor,(90),bgColor, v);
        } ,
        onUploadComplete : function(file) {
            var me = this.customSettings.scope_handler;
            if(file.filestatus==-4){
                var ds = me.gp.store;
                for(var i=0;i<ds.getCount();i++){
                    var record =ds.getAt(i);
                    if(record.get('id')==file.id){
                        record.set('percent', 100);
                        if(record.get('state')!=-3){
                            record.set('state', file.filestatus);
                        }
                        record.commit();
                    }
                }
            }
            if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
                this.startUpload();
            } else {          
                me.toggleBtn(false);
                me.linkBtnEvent();
            }
        },
        
        onFileQueued : function(file) {
        	var me = this.customSettings.scope_handler;
            var rec = new Ext.data.Record({
                id : file.id,
                name : file.name,
                size : file.size,
                type : file.type,
                state : file.filestatus,
                percent : 0
            })
            me.gp.getStore().add(rec);
            
        },
        
        onUploadSuccess : function(file, serverData) {
            var me = this.customSettings.scope_handler;
            var ds = me.gp.store;
            if (Ext.util.JSON.decode(serverData).success) {         
                for(var i=0;i<ds.getCount();i++){
                    var rec =ds.getAt(i);
                    if(rec.get('id')==file.id){
                        rec.set('state', file.filestatus);
                        rec.set('attachmentId', Ext.util.JSON.decode(serverData).attachmentId);
                        rec.set('attachmentIndex', Ext.util.JSON.decode(serverData).attachmentIndex);
                        me.attachmentIdTextField.setValue(Ext.util.JSON.decode(serverData).attachmentId);
                        rec.commit();
                    }
                }          
            }else{
                for(var i=0;i<ds.getCount();i++){
                    var rec =ds.getAt(i);
                    if(rec.get('id')==file.id){
                        rec.set('percent', 0);
                        rec.set('state', -3);
                        rec.commit();
                    }
                }
            }
            me.linkBtnEvent();
            me.fireEvent('uploadsuccess' , me , Ext.util.JSON.decode(serverData) , file);
        },
        uploadProgress : function(file, bytesComplete, totalBytes){//���������
            var me = this.customSettings.scope_handler;
            var percent = Math.ceil((bytesComplete / totalBytes) * 100);
            percent = percent == 100? 99 : percent;
            var ds = me.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var record =ds.getAt(i);
                if(record.get('id')==file.id){
                    record.set('percent', percent);
                    record.set('state', file.filestatus);
                    record.commit();
                }
            }
        },
        onUploadError : function(file, errorCode, message) {
            var me = this.customSettings.scope_handler;
            me.linkBtnEvent();
            var ds = me.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var rec =ds.getAt(i);
                if(rec.get('id')==file.id){
                    rec.set('percent', 0);
                    rec.set('state', file.filestatus);
                    rec.commit();
                }
            }
        },
        onFileError : function(file,n){
            switch(n){
                case -100 : tip('���ϴ��ļ��б��������ޣ�����ѡ��');
                break;
                case -110 : tip('�ļ�̫�󣬲���ѡ��');
                break;
                case -120 : tip('���ļ���СΪ0������ѡ��');
                break;
                case -130 : tip('���ļ����Ͳ������ϴ���');
                break;
            }
            function tip(msg){
                Ext.Msg.show({
                    title : '��ʾ',
                    msg : msg,
                    width : 280,
                    icon : Ext.Msg.WARNING,
                    buttons :Ext.Msg.OK
                });
            }
        },
        onDiaogComplete : function(){
            var me = this.customSettings.scope_handler;
            me.linkBtnEvent();
			me.uppanel.show() ;
            me.fireEvent('diaogcomplete' , me);
        },
        stopUpload : function() {
            if (this.swfupload) {
                this.swfupload.uploadStopped = true;
                this.swfupload.stopUpload();
            }
            var me = this.customSettings.scope_handler;
            me.fireEvent('stopupload' , me);
        },
        deleteAll : function(){
            var ds = this.gp.store;
            for(var i=0;i<ds.getCount();i++){
                var record =ds.getAt(i);
                var file_id = record.get('id');
                this.deleteFile(record.get('attachmentId') , record.get('attachmentIndex') , record.get('state'));
                this.swfupload.cancelUpload(file_id,false);
                
                this.updateQueuedStats(record.get('state'));
            }
            ds.removeAll();
            this.swfupload.uploadStopped = false;
            this.fireEvent('removeall' , this);
			this.uppanel.hide();
			this.uppanel.doLayout();
        },
        formatDelBtn : function(v){
            return "<a href='#' id='"+v+"'  style='color:red' class='link' ext:qtip='�Ƴ����ļ�'>�Ƴ�</a>";
        },
        linkBtnEvent : function(){
        	this.gp.on('cellclick' , function(grid, rowIndex, columnIndex, e){
                var dataIndex = this.gp.getColumnModel().getDataIndex(columnIndex);
                if(dataIndex == 'id' && e.getTarget().tagName == 'A'){
                    var ds = this.gp.store;
                    for(var i=0;i<ds.getCount();i++){
                        var rec =ds.getAt(i);
                        if(rec.get('id')== e.getTarget().id){
                        	this.swfupload.cancelUpload(rec.get('id'),false) ;
                        	this.updateQueuedStats(rec.get('state'));
                            ds.remove(rec);
                            this.deleteFile(rec.get('attachmentId') , rec.get('attachmentIndex') , rec.get('state'));
                        }
                    }           
                }
            } , this);
        } ,
        
        /**
         * @private
         * �����ļ�����״̬,��״̬Ӱ���ļ��ϴ��������ж�
         * @method updateQueuedStats
         * @param {Number} sta ��ǰ�ļ���״̬
         */
        updateQueuedStats: function(sta){
        	var stats = this.swfupload.getStats();
        	
        	var fileQueued = stats['files_queued'], //δ�ϴ�-1
        		inProgress = stats['files_queued'], //�����ϴ�-2
        		queueErrors = stats['queue_errors'], //���д���
        		successfulUploads = stats['successful_uploads'], //�����ɹ�-4
        		uploadCancelled = stats['upload_cancelled'], //ȡ��  -5
        		uploadErrors = stats['upload_errors']; //�ϴ����� -3
        	
        	if(sta == -1){
        		fileQueued -= 1;
        	} else if(sta == -2){
        		fileQueued -= 1;
        		inProgress -= 1;
        	} else if(sta == -3){
        		uploadErrors -= 1;
        	} else if(sta == -4){
        		successfulUploads -= 1;
        	} else if(sta == -5){
        		uploadCancelled -= 1;
        	}
        	
        	this.swfupload.setStats({
        		files_queued: fileQueued,
        		in_progress: inProgress,
        		queue_errors: queueErrors,
        		successful_uploads: successfulUploads,
        		upload_cancelled: uploadCancelled,
        		upload_errors: uploadErrors
        	});
        },
        
        deleteFile : function(attachmentId , attachmentIndex , statu){
            if(statu != -4){
               return ;
            }
            Rs.Service.call({
                url : '/rsc/rsclient/attachment' ,
                method : 'deleteFile' ,
                params : {
                    attachmentId : attachmentId ,
                    attachmentIndex : attachmentIndex
                }
            } , function(result){
                this.fireEvent('deletefile' , this , result);
            } , this );
        }
    });
    Ext.reg('rs-ext-simplefileuploadpanel', Rs.ext.form.SimpleFileUploadPanel);
})();