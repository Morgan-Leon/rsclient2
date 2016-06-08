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
                {header: '附件编码', width: 10, hidden: true,dataIndex: 'attachmentId', menuDisabled:true},
                {header: '附件索引', width: 10, hidden: true,dataIndex: 'attachmentIndex', menuDisabled:true},
                {header: '文件名', width: 190, sortable: true,dataIndex: 'name', menuDisabled:true},
                {header: '类型', width: 50, sortable: true,dataIndex: 'type', menuDisabled:true},
                {header: '大小', width: 80, sortable: true,dataIndex: 'size', menuDisabled:true,renderer:this.formatFileSize},
                {header: '进度', width: 150, sortable: true,dataIndex: 'percent', menuDisabled:true,renderer:this.formatProgressBar,scope:this},
                {header: '状态', width: 70, sortable: true,dataIndex: 'state', menuDisabled:true,renderer:this.formatFileState,scope:this},
                {header: '&nbsp;',width:200,dataIndex:'id', menuDisabled:true,renderer:this.formatDelBtn}
            ]
        });
        
        this.setting = {
            upload_url : this.uploadUrl, 
            flash_url : this.flashUrl,
            file_size_limit : this.fileSize || (1024*50) ,//上传文件体积上限，单位MB
            file_post_name : this.filePostName,
            file_types : this.fileTypes||"*.*",  //允许上传的文件类型 
            file_types_description : "All Files",  //文件类型描述
            file_upload_limit : this.uploadLimit ? (this.uploadLimit + '') : "0",  //限定用户一次性最多上传多少个文件，在上传过程中，该数字会累加，如果设置为“0”，则表示没有限制 
            file_queue_limit : "10",//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值              
            post_params : this.postParams ,
            use_query_string : true,
            debug : false,
            button_cursor : SWFUpload.CURSOR.HAND,
            button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
            custom_settings : {//自定义参数
                scope_handler : this
            },
            file_queued_handler : this.onFileQueued,
            swfupload_loaded_handler : function(){},// 当Flash控件成功加载后触发的事件处理函数
            file_dialog_start_handler : function(){},// 当文件选取对话框弹出前出发的事件处理函数
            file_dialog_complete_handler : this.onDiaogComplete,//当文件选取对话框关闭后触发的事件处理
            upload_start_handler : this.onUploadStart,// 开始上传文件前触发的事件处理函数
            upload_success_handler : this.onUploadSuccess,// 文件上传成功后触发的事件处理函数 
            swfupload_loaded_handler : function(){},// 当Flash控件成功加载后触发的事件处理函数  
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
            text:'添加文件',
            iconCls:'rs-action-addfile'
        }),
        this.uploadBtn = new Ext.Button({
            text:'上传文件',
            iconCls:'rs-action-uploadfile',
            handler:this.startUpload,
            scope:this
        });
        this.stopBtn = new Ext.Button({
            text:'停止上传',
            iconCls:'rs-action-stopfile',
            handler:this.stopUpload,
            scope:this
        });
        this.deleteBtn = new Ext.Button({
            text:'删除所有',
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
         * @event diaogcomplete 在文件选择框关闭后触发
         * @param {SimpleFileUploadPanel} this
         */
        'diaogcomplete' ,
        
        /**
         * @event uploadsuccess 文件上传完成后触发
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         * @param {Object} fileoption
         */
        'uploadsuccess' ,
        
        /**
         * @event deletefile 删除文件后触发
         * @param {SimpleFileUploadPanel} this
         * @param {Object} serverData
         */
        'deletefile'
        );
    }
    
    Ext.extend(Rs.ext.form.SimpleFileUploadPanel , Ext.Panel , {
	   
       //Myeclipse环境
       //flashUrl : '/rsc/js/rs/ext/resources/swfupload.swf' ,
       //标准环境
       flashUrl : '/com/rsc/rs/pub/rsclient2/rs/ext/resources/swfupload.swf' ,
       
	   /**
        * @cfg {Boolean} enableFile
        * 是否可以通过点击上传按钮上传文件，默认true
        */
	   enableFile : true ,
	   
	   /**
        * @cfg {Number} width
        * 宽度大小 最小是745
        */
       width : 745 ,
       
       /**
        * @cfg {String} fieldLabel
        * 上传组件的名字
        */
       fieldLabel: null,
       
	   /**
        * @cfg {Number} fileSize
        * 上传附件大小，单位KB
        * 默认50M
        */
       fileSize : 1024*50 ,//限制文件大小 MB
       
       /**
        * @cfg {String} uploadUrl
        * 文件上传路径.如/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa
        */
       uploadUrl : null ,
       
	   /**
        * @cfg {String} fileTypes
        * 上传附件类型
        * 可上传文件类型 该属性指定了允许上传的文件类型，当有多个类型时使用分号隔开，比如：*.jpg;*.png ,允许所有类型时请使用 *.*
        */
       fileTypes : '*.*',//
       
       /**
        * @cfg {String} uploadLimit
        * 限定用户一次性最多上传多少个文件.默认10个
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
           Ext.apply(post_params,{//处理中文参数问题
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
        
        formatFileState : function(n){//文件状态
            switch(n){
                case -1 : return '未上传';
                break;
                case -2 : return '正在上传';
                break;
                case -3 : return '<div style="color:red;">上传失败</div>';
                break;
                case -4 : return '上传成功';
                break;
                case -5 : return '取消上传';
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
        uploadProgress : function(file, bytesComplete, totalBytes){//处理进度条
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
                case -100 : tip('待上传文件列表数量超限，不能选择！');
                break;
                case -110 : tip('文件太大，不能选择！');
                break;
                case -120 : tip('该文件大小为0，不能选择！');
                break;
                case -130 : tip('该文件类型不可以上传！');
                break;
            }
            function tip(msg){
                Ext.Msg.show({
                    title : '提示',
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
            return "<a href='#' id='"+v+"'  style='color:red' class='link' ext:qtip='移除该文件'>移除</a>";
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
         * 更新文件队列状态,该状态影响文件上传个数的判断
         * @method updateQueuedStats
         * @param {Number} sta 当前文件的状态
         */
        updateQueuedStats: function(sta){
        	var stats = this.swfupload.getStats();
        	
        	var fileQueued = stats['files_queued'], //未上传-1
        		inProgress = stats['files_queued'], //正在上传-2
        		queueErrors = stats['queue_errors'], //队列错误
        		successfulUploads = stats['successful_uploads'], //长传成功-4
        		uploadCancelled = stats['upload_cancelled'], //取消  -5
        		uploadErrors = stats['upload_errors']; //上传错误 -3
        	
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