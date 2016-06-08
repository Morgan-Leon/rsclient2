
Ext.ns('Rs.ext.form');

/**
 * @class Rs.ext.form.SingleUploadField
 * @extends Ext.form.TextField
 * Creates a file upload field.
 * @xtype rs-ext-singleuploadfield
 */
(function(){
	Rs.ext.form.SingleUploadField = Ext.extend(Ext.form.TextField,  {
	    /**
	     * @cfg {String} buttonText The button text to display on the upload button (defaults to
	     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
	     * value will be used instead if available.
	     */
	    buttonText: '上传文件',
	    /**
	     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
	     * text field (defaults to false).  If true, all inherited TextField members will still be available.
	     */
	    buttonOnly: false,
	    /**
	     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
	     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
	     */
	    buttonOffset: 3,
	
	    // private
	    readOnly: true,
	
	    /**
	     * @hide
	     * @method autoSize
	     */
	    autoSize: Ext.emptyFn,
	
	    // private
	    initComponent: function(){
			Rs.ext.form.SingleUploadField.superclass.initComponent.call(this);
	
	        this.addEvents(
	            /**
	             * @event fileselected
	             * Fires when the underlying file input field's value has changed from the user
	             * selecting a new file from the system file selection dialog.
	             * @param {Rs.ext.form.SingleUploadField} this
	             * @param {String} value The file value returned by the underlying file input field
	             */
	            'fileselected' ,
				
				/**
				 * @param {Rs.ext.form.SingleUploadField} this
				 */
				'beforeclick' 
	        );
	    },
	
	    // private
	    onRender : function(ct, position){
	    	Rs.ext.form.SingleUploadField.superclass.onRender.call(this, ct, position);
	
	        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'});
	        this.el.addClass('x-form-file-text');
	        this.el.dom.removeAttribute('name');
	        this.createFileInput();
	
	        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
	            text: this.buttonText
	        });
	        this.button = new Ext.Button(Ext.apply(btnCfg, {
	            renderTo: this.wrap,
	            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
	        }));
	
	        if(this.buttonOnly){
	            this.el.hide();
	            this.wrap.setWidth(this.button.getEl().getWidth());
	        }
	
	        this.bindListeners();
	        this.resizeEl = this.positionEl = this.wrap;
	    },
	    
	    bindListeners: function(){
	        this.fileInput.on({
	            scope: this,
	            mouseenter: function() {
	                this.button.addClass(['x-btn-over','x-btn-focus']);
	            },
	            mouseleave: function(){
	                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
	            },
	            mousedown: function(){
	                this.button.addClass('x-btn-click');
	            },
	            mouseup: function(){
	                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
	            },
	            change: function(){
	                var v = this.fileInput.dom.value;
					if(v){
    	                this.setValue(v);
	                    this.fireEvent('fileselected', this, v);    
					}
	            }
	        });
			
			this.wrap.on('click' , function(){
                this.fireEvent('beforeclick' , this);
            } , this);
	    },
	    
	    createFileInput : function() {
	        this.fileInput = this.wrap.createChild({
	            id: this.getFileInputId(),
	            name: this.name||this.getId(),
	            cls: 'x-form-file',
	            tag: 'input',
	            type: 'file',
	            size: 1
	        });
	    },
	    
	    reset : function(){
	        this.fileInput.remove();
	        this.createFileInput();
	        this.bindListeners();
	        Rs.ext.form.SingleUploadField.superclass.reset.call(this);
	    },
	
	    // private
	    getFileInputId: function(){
	        return this.id + '-file';
	    },
	
	    // private
	    onResize : function(w, h){
	    	Rs.ext.form.SingleUploadField.superclass.onResize.call(this, w, h);
	
	        this.wrap.setWidth(w);
	
	        if(!this.buttonOnly){
	            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
	            this.el.setWidth(w);
	        }
	    },
	
	    // private
	    onDestroy: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onDestroy.call(this);
	        Ext.destroy(this.fileInput, this.button, this.wrap);
	    },
	    
	    onDisable: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onDisable.call(this);
	        this.doDisable(true);
	    },
	    
	    onEnable: function(){
	    	Rs.ext.form.SingleUploadField.superclass.onEnable.call(this);
	        this.doDisable(false);
	    },
	    
	    // private
	    doDisable: function(disabled){
	        this.fileInput.dom.disabled = disabled;
	        this.button.setDisabled(disabled);
	    },
	
	
	    // private
	    preFocus : Ext.emptyFn,
	
	    // private
	    alignErrorIcon : function(){
	        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
	    } ,
	    
		getUploadPanel : function(){
            return this.uppanel ;			
		}
	});
	Ext.reg('rs-ext-singleuploadfield', Rs.ext.form.SingleUploadField);
})();

