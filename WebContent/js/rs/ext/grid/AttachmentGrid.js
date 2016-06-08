Ext.ns("Rs.ext.grid");

(function() {

	Rs.ext.grid.AttachmentGrid = Ext.extend(Ext.Panel, {

		fileList : null,

		swfupload : null,

		progressBar : null,

		progressInfo : null,

		uploadInfoPanel : null,

		/**
		 * @cfg {Array} attachments 业务数据对应的已上传附件,格式如下
		 * 
		 * <pre><code>
		 * [{
		 * 			fileName : &quot;name&quot;,
		 * 			filePath : &quot;path&quot;,
		 * 			fileType : &quot;type&quot;
		 * 		}]
		 * </code>
		 */
		attachments : [],

		// newAdds : [],

		/**
		 * @cfg {Boolean} downloadenable 是否允许下载附件
		 */
		downloadenable : true,

		downloadEnableCls : 'rs-action-download-enable',

		downloadDisableCls : 'rs-action-download-disable',

		constructor : function(config) {
			this.progressInfo = {
				filesTotal : 0,
				filesUploaded : 0,
				bytesTotal : 0,
				bytesUploaded : 0,
				currentCompleteBytes : 0,
				lastBytes : 0,
				lastElapsed : 1,
				lastUpdate : null,
				timeElapsed : 1
			};
			this.uploadInfoPanel = new Ext.Panel({
				region : 'north',
				height : 65,
				baseCls : '',
				collapseMode : 'mini',
				split : true,
				border : false
			});
			this.progressBar = new Ext.ProgressBar({
				text : '等待中 0 %',
				animate : true
			});
			var autoExpandColumnId = Ext.id('fileName');
			this.uploadInfoPanel.on('render', function() {
				this.getProgressTemplate().overwrite(
						this.uploadInfoPanel.body, {
							filesUploaded : 0,
							filesTotal : 0,
							bytesUploaded : '0 bytes',
							bytesTotal : '0 bytes',
							timeElapsed : '00:00:00',
							timeLeft : '00:00:00',
							speedLast : '0 bytes/s',
							speedAverage : '0 bytes/s'
						});
			}, this);
			var sm = new Ext.grid.CheckboxSelectionModel({});
			var downloadcls = this.downloadenable
					? this.downloadEnableCls
					: this.downloadDisableCls;
			this.fileList = new Ext.grid.GridPanel({
				border : false,
				enableColumnMove : false,
				enableHdMenu : false,
				sm : sm,
				columns : [sm, {
							header : '文件名',
							width : 60,
							dataIndex : 'fileName',
							sortable : false,
							fixed : true,
							renderer : this.formatFileName,
							id : autoExpandColumnId
						}, {
							header : '状态',
							width : 50,
							dataIndex : 'fileState',
							renderer : this.formatState,
							sortable : false,
							fixed : true,
							align : 'center'
						}, {
							xtype : 'actioncolumn',
							header : '下载',
							width : 50,
							align : 'center',
							items : [{
								iconCls : downloadcls,
								handler : this.downloadFile,
								scope : this
							}]
						}],
				autoExpandColumn : autoExpandColumnId,
				ds : new Ext.data.SimpleStore({
    					fields : ['fileName', 'filePath', 'fileState',
    							'fileType']
    				}),
				bbar : [this.progressBar],
				tbar : [{
							text : '添加文件',
							iconCls : 'db-icn-add'
						}, {
							text : '开始上传',
							iconCls : 'db-icn-upload_',
							handler : this.startUpload,
							scope : this
						}, {
							text : '停止上传',
							iconCls : 'db-icn-stop',
							handler : this.stopUpload,
							scope : this
						}, {
							text : '取消队列',
							iconCls : 'db-icn-cross',
							handler : this.cancelQueue,
							scope : this
						}, {
							text : '删除',
							iconCls : 'rs-action-documents-remove',
							handler : this.deleteFiles,
							scope : this
						}],

				listeners : {
					cellclick : {
						fn : function(grid, rowIndex, columnIndex, e) {
							if (columnIndex == 5) {
								var record = grid.getSelectionModel()
										.getSelected();
								var fileId = record.data.fileId;
								var file = this.swfupload.getFile(fileId);
								if (file) {
									if (file.filestatus != SWFUpload.FILE_STATUS.CANCELLED) {
										this.swfupload.cancelUpload(fileId);
										if (record.data.fileState != SWFUpload.FILE_STATUS.CANCELLED) {
											record.set('fileState',SWFUpload.FILE_STATUS.CANCELLED);
											record.commit();
											this.onCancelQueue(record.data.filePath);
										}
									}
								}
							}
						},
						scope : this
					},
					'afterrender' : {// render : {
						fn : function() {
							var grid = this.get(1).get(0);
							var em = grid.getTopToolbar().get(0).el.child('em');
							var placeHolderId = Ext.id();
							em.setStyle({
								position : 'relative',
								display : 'block'
							});
							em.createChild({
								tag : 'div',
								id : placeHolderId
							});
							var settings = {
								upload_url : this.uploadUrl,
								post_params : Ext.isEmpty(this.postParams)
										? {}
										: this.postParams,
								flash_url : Ext.isEmpty(this.flashUrl)
										? 'http://www.swfupload.org/swfupload.swf'
										: this.flashUrl,
								file_post_name : Ext.isEmpty(this.filePostName)
										? 'myUpload'
										: this.filePostName,
								file_size_limit : Ext.isEmpty(this.fileSize)
										? '100 MB'
										: this.fileSize,
								file_types : Ext.isEmpty(this.fileTypes)
										? '*.*'
										: this.fileTypes,
								file_types_description : this.fileTypesDescription,
								use_query_string : true,
								debug : true,
								button_width : em.getWidth(),
								button_height : em.getHeight(),
								button_cursor : SWFUpload.CURSOR.HAND,
								button_placeholder_id : placeHolderId,
								button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
								button_cursor : SWFUpload.CURSOR.HAND,
								custom_settings : {
									scope_handler : this
								},
								file_queued_handler : this.onFileQueued,
								file_queue_error_handler : this.onFileQueueError,
								file_dialog_start_handler : function() {
								},
								file_dialog_complete_handler : this.onFileDialogComplete,
								upload_start_handler : this.onUploadStart,
								upload_progress_handler : this.onUploadProgress,
								upload_error_handler : this.onUploadError,
								upload_success_handler : this.onUploadSuccess,
								upload_complete_handler : this.onUploadComplete
							};
							this.swfupload = new SWFUpload(settings);
							this.swfupload.uploadStopped = false;
							Ext.get(this.swfupload.movieName).setStyle({
								position : 'absolute',
								left : 0
							});
							this.resizeProgressBar();
							this.on('resize', this.resizeProgressBar, this);
						},
						scope : this,
						delay : 100
					}
				}

			});
			Rs.ext.grid.AttachmentGrid.superclass.constructor.call(this, Ext.applyIf(config || {}, {
    			layout : 'border',
    			width : 500,
    			height : 500,
    			minWidth : 450,
    			minHeight : 500,
    			split : true,
    			items : [this.uploadInfoPanel, {
    						region : 'center',
    						layout : 'fit',
    						margins : '0 -1 -1 -1',
    						items : [this.fileList]
    					}]
    		}));

			if (this.attachments.length > 0) {
				for (var i = 0; i < this.attachments.length; i++) {
					this.fileList.getStore().add(new Rs.ext.form.MultiUploadPanel.FileRecord(Rs.apply(this.attachments[i], {
						fileState : SWFUpload.FILE_STATUS.COMPLETE
					})));
				}
			}
		},
		resizeProgressBar : function() {
			this.progressBar.setWidth(this.el.getWidth() - 5);
		},

		selectFile : function() {
			if (this.swfupload) {
				this.swfupload.selectFile();
			}
		},

		startUpload : function() {
			if (this.swfupload) {
				this.swfupload.uploadStopped = false;
				var post_params = this.swfupload.settings.post_params;
				this.swfupload.startUpload();
			}
		},
		stopUpload : function() {
			if (this.swfupload) {
				this.swfupload.uploadStopped = true;
				this.swfupload.stopUpload();
			}
		},

		cancelQueue : function() {
			if (this.swfupload) {
				this.swfupload.stopUpload();
				var stats = this.swfupload.getStats();
				while (stats.files_queued > 0) {
					this.swfupload.cancelUpload();
					stats = this.swfupload.getStats();
				}
				this.fileList.getStore().each(function(record) {
					switch (record.data.fileState) {
						case SWFUpload.FILE_STATUS.QUEUED :
						case SWFUpload.FILE_STATUS.IN_PROGRESS :
							record.set('fileState',SWFUpload.FILE_STATUS.CANCELLED);
							record.commit();
							this.onCancelQueue(record.data.filePath);
							break;
						default :
							break;
					}
				}, this);
			}
		},

		deleteFiles : function() {
			var selected = this.fileList.getSelectionModel().getSelections();
			if (!selected || selected.length < 1) {
				Ext.Msg.alert("提示", "请选择要删除的数据行");
				return;
			}
			Ext.Msg.show({
				title : '提示',
				msg : '确定要删除选中的记录吗?',
				buttons : Ext.Msg.OKCANCEL,
				fn : function(b) {
					if (b == 'cancel') {
						return;
					}
					for (var rowIndex = 0; rowIndex < selected.length; rowIndex++) {
						var record = selected[rowIndex].data;
						var fname = record.fileName;
						var path = record.filePath;
						var ftype = record.fileType;
						frame = Ext.DomHelper.append(Ext.getBody(), {
							tag : "div",
							id : this.id + "-iframe",
							style : "display:none",
							html : "<iframe src='/rsc/rsclient/attachment?Rs-method=deleteFile&Rs-accept="
									+ ftype
									+ "&filepath="
									+ encodeURIComponent(encodeURIComponent(path))
									+ "&filename="
									+ encodeURIComponent(encodeURIComponent(fname))
									+ "'></iframe>"
						});
					}
					this.fileList.store.remove(selected);
					this.fileList.store.save();
				},
				animEl : 'elId',
				scope : this,
				icon : Ext.MessageBox.QUESTION
			});
		},

		downloadFile : function(grid, rowIndex, colIndex) {
			var record = grid.getStore().getAt(rowIndex), path = record.data.filePath, fname = record.data.fileName, ftype = record.data.fileType, frame = Ext
					.fly(this.id + "-iframe");
			if (frame) {
				frame.remove();
			}
			frame = Ext.DomHelper.append(Ext.getBody(), {
				tag : "div",
				id : this.id + "-iframe",
				style : "display:none",
				html : "<iframe src='/rsc/rsclient/attachment?Rs-method=download&Rs-accept="
						+ ftype
						+ "&filepath="
						+ encodeURIComponent(encodeURIComponent(path))
						+ "&filename="
						+ encodeURIComponent(encodeURIComponent(fname))
						+ "'></iframe>"
			});
		},
		getProgressTemplate : function() {
			var tpl = new Ext.Template(
					'<table class="upload-progress-table"><tbody>',
					'<tr><td class="upload-progress-label"><nobr>已上传数:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{filesUploaded} / {filesTotal}</nobr></td>',
					'<td class="upload-progress-label"><nobr>上传状态:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{bytesUploaded} / {bytesTotal}</nobr></td></tr>',
					'<tr><td class="upload-progress-label"><nobr>已用时间:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{timeElapsed}</nobr></td>',
					'<td class="upload-progress-label"><nobr>剩余时间:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{timeLeft}</nobr></td></tr>',
					'<tr><td class="upload-progress-label"><nobr>当前速度:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{speedLast}</nobr></td>',
					'<td class="upload-progress-label"><nobr>平均速度:</nobr></td>',
					'<td class="upload-progress-value"><nobr>{speedAverage}</nobr></td></tr>',
					'</tbody></table>');
			tpl.compile();
			return tpl;
		},
		updateProgressInfo : function() {
			this.getProgressTemplate().overwrite(this.uploadInfoPanel.body,
					this.formatProgress(this.progressInfo));
		},
		formatProgress : function(info) {
			var r = {};
			r.filesUploaded = String.leftPad(info.filesUploaded, 3, '&nbsp;');
			r.filesTotal = info.filesTotal;
			r.bytesUploaded = String.leftPad(Ext.util.Format
							.fileSize(info.bytesUploaded), 6, '&#160;');
			r.bytesTotal = Ext.util.Format.fileSize(info.bytesTotal);
			r.timeElapsed = this.formatTime(info.timeElapsed);
			r.speedAverage = Ext.util.Format.fileSize(Math.ceil(1000
					* info.bytesUploaded / info.timeElapsed))
					+ '/s';
			r.timeLeft = this.formatTime((info.bytesUploaded === 0)
					? 0
					: info.timeElapsed * (info.bytesTotal - info.bytesUploaded)
							/ info.bytesUploaded);
			var caleSpeed = 1000 * info.lastBytes / info.lastElapsed;
			r.speedLast = Ext.util.Format.fileSize(caleSpeed < 0
					? 0
					: caleSpeed)
					+ '/s';
			var p = info.bytesUploaded / info.bytesTotal;
			p = p || 0;
			this.progressBar.updateProgress(p, "上传中 " + Math.ceil(p * 100)
							+ " %");
			return r;
		},
		formatTime : function(milliseconds) {
			var seconds = parseInt(milliseconds / 1000, 10);
			var s = 0;
			var m = 0;
			var h = 0;
			if (3599 < seconds) {
				h = parseInt(seconds / 3600, 10);
				seconds -= h * 3600;
			}
			if (59 < seconds) {
				m = parseInt(seconds / 60, 10);
				seconds -= m * 60;
			}
			m = String.leftPad(m, 2, '0');
			h = String.leftPad(h, 2, '0');
			s = String.leftPad(seconds, 2, '0');
			return h + ':' + m + ':' + s;
		},
		formatFileName : function(_v, cellmeta, record) {
			return '<div id="fileName_' + record.data.filePath + '">' + _v
					+ '</div>';
		},
		formatState : function(_v, cellmeta, record) {
			var returnValue = '';
			switch (_v) {
				case SWFUpload.FILE_STATUS.QUEUED :
					returnValue = '<div id="' + record.id + '"><div id="fileId_' + record.data.filePath
							+ '" class="ux-cell-icon-delete"/></div></div>';
					break;
				case SWFUpload.FILE_STATUS.CANCELLED :
					returnValue = '<div id="' + record.id + '"><div id="fileId_' + record.data.filePath
							+ '" class="ux-cell-icon-clear"/></div></div>';
					break;
				case SWFUpload.FILE_STATUS.COMPLETE :
					returnValue = '<div id="' + record.id + '"><div id="fileId_' + record.data.filePath
							+ '" class="ux-cell-icon-completed"/></div></div>';
					break;
				default :
					alert('没有设置图表状态');
					break;
			}
			return returnValue;
		},
		onClose : function() {
			this.close();
		},
		onCancelQueue : function(filePath) {
			Ext.getDom('fileName_' + filePath).className = 'ux-cell-color-gray';// 设置文字颜色为灰色
		},
		onFileQueued : function(file) {
			var thiz = this.customSettings.scope_handler;

			var filePath = thiz.postParams.fileDir + '\\'
					+ encodeURIComponent(encodeURIComponent(file.name));

			var el = Ext.getDom('fileId_' + filePath);
			if (el) {
				var record = thiz.fileList.getStore().getById(el.parentNode.id);
				record.set('fileState', file.filestatus);
				record.commit();
			} else {
				thiz.fileList.getStore()
						.add(new Rs.ext.form.MultiUploadPanel.FileRecord({
							fileName : file.name,
							filePath : thiz.postParams.fileDir
									+ '\\'
									+ encodeURIComponent(encodeURIComponent(file.name)),
							fileState : file.filestatus,
							fileType : file.type
						}));
			}
			thiz.progressInfo.filesTotal += 1;
			thiz.progressInfo.bytesTotal += file.size;
			thiz.updateProgressInfo();
		},
		onQueueError : function(file, errorCode, message) {
			var thiz = this.customSettings.scope_handler;
			try {
				if (errorCode != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
					thiz.progressInfo.filesTotal -= 1;
					thiz.progressInfo.bytesTotal -= file.size;
				}
				thiz.progressInfo.bytesUploaded -= fpg.getBytesCompleted();
				thiz.updateProgressInfo();
			} catch (ex) {
				this.debug(ex);
			}
		},
		onFileDialogComplete : function(selectedFilesCount, queuedFilesCount) {
			// alert("selectedFilesCount:" + selectedFilesCount + "
			// queuedFilesCount:" + queuedFilesCount );
		},
		onUploadStart : function(file) {
			var post_params = this.settings.post_params;
			Ext.apply(post_params, {
						'fileName' : encodeURIComponent(encodeURIComponent(file.name))
					});
			this.setPostParams(post_params);
		},
		onUploadProgress : function(file, completeBytes, bytesTotal) {
			var percent = Math.ceil((completeBytes / bytesTotal) * 100);
			var thiz = this.customSettings.scope_handler;
			var bytes_added = completeBytes
					- thiz.progressInfo.currentCompleteBytes;
			thiz.progressInfo.bytesUploaded += Math.abs(bytes_added < 0
					? 0
					: bytes_added);
			thiz.progressInfo.currentCompleteBytes = completeBytes;
			if (thiz.progressInfo.lastUpdate) {
				thiz.progressInfo.lastElapsed = thiz.progressInfo.lastUpdate
						.getElapsed();
				thiz.progressInfo.timeElapsed += thiz.progressInfo.lastElapsed;
			}
			thiz.progressInfo.lastBytes = bytes_added;
			thiz.progressInfo.lastUpdate = new Date();
			thiz.updateProgressInfo();
		},
		onUploadError : function(file, errorCode, message) {
			var thiz = this.customSettings.scope_handler;
			switch (errorCode) {
				case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED :
					thiz.progressInfo.filesTotal -= 1;
					thiz.progressInfo.bytesTotal -= file.size;
					thiz.updateProgressInfo();
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED :
			}
		},
		onUploadSuccess : function(file, serverData) {
			var thiz = this.customSettings.scope_handler;
			if (Ext.util.JSON.decode(serverData).success) {
				var record = thiz.fileList
						.getStore()
						.getById(Ext
								.getDom('fileId_'
										+ thiz.postParams.fileDir
										+ '\\'
										+ encodeURIComponent(encodeURIComponent(file.name))).parentNode.id);
				record.set('fileState', file.filestatus);
				record.commit();
			}
			thiz.progressInfo.filesUploaded += 1;
			thiz.updateProgressInfo();
		},
		onUploadComplete : function(file) {
			if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
				this.startUpload();
			}
		}
	});

	Rs.ext.form.MultiUploadPanel.FileRecord = Ext.data.Record.create([{
		name : 'fileName'
	}, {
		name : 'filePath'
	}, {
		name : 'fileState'
	}, {
		name : 'fileType'
	}]);
	Ext.reg('rs-ext-multiuploadpanel', Rs.ext.form.MultiUploadPanel);

})();
