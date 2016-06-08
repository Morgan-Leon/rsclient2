Ext.ns("Rs.ext.form");

(function(){

	var ActionLoad = function(){
		ActionLoad.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(ActionLoad, Ext.form.Action.Load, {
		// private
	    run : function(){
	        var o = this.options,
	        	url = o.url || this.form.url || this.form.el.dom.action;
	        Rs.Service.call({
	        	url : url,
	        	method : 'load',
	        	scope : this,
	        	accept : 'html',
	        	params:this.getParams(),
	        	success: this.success,
	            failure: this.failure,
	            timeout: (o.timeout*1000) || (this.form.timeout*1000),
	            upload: this.form.fileUpload ? this.success : undefined
	        }, this);
	    },
	    
	    // private
	    getParams : function(){
	        var bp = this.form.baseParams;
	        var p = this.options.params;
	        if(p){
	            if(typeof p == "object"){
	                p = Rs.urlEncode(Rs.applyIf(p, bp));
	            }else if(typeof p == 'string' && bp){
	                p += '&' + Rs.urlEncode(bp);
	            }
	        }else if(bp){
	            p = Rs.urlEncode(bp);
	        }
	        return p;
	    }
		
	});
	
	var ActionSubmit = function(){
		ActionSubmit.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(ActionSubmit, Ext.form.Action.Submit, {
		
		run : function(){
	        var o = this.options;
	        if(o.clientValidation === false || this.form.isValid()){
	            if (o.submitEmptyText === false) {
	                var fields = this.form.items,
	                    emptyFields = [],
	                    setupEmptyFields = function(f){
	                        if (f.el.getValue() == f.emptyText) {
	                            emptyFields.push(f);
	                            f.el.dom.value = "";
	                        }
	                        if(f.isComposite && f.rendered){
	                            f.items.each(setupEmptyFields);
	                        }
	                    };
	                    
	                fields.each(setupEmptyFields);
	            }
	            
	            var url = o.url || this.form.url || this.form.el.dom.action;
	            Rs.Service.call({
	            		form : this.form.el.dom,
						url : url,
						accept : 'html',
						method : o.method,
						params : this.getParams(),
						success : this.success,
			            failure : this.failure,
			            scope : this,
			            timeout : (o.timeout*1000) || (this.form.timeout*1000),
			            upload : this.form.fileUpload ? this.success : undefined,
						isUpload : this.form.fileUpload
					});
	            if (o.submitEmptyText === false) {
	                Ext.each(emptyFields, function(f) {
	                    if (f.applyEmptyText) {
	                        f.applyEmptyText();
	                    }
	                });
	            }
	        }else if (o.clientValidation !== false){ // client validation failed
	            this.failureType = Ext.form.Action.CLIENT_INVALID;
	            this.form.afterAction(this, false);
	        }
	    }, 
	    
	    // private
	    getParams : function(){
	        var bp = this.form.baseParams;
	        var p = this.options.params;
	        if(p){
	            if(typeof p == "object"){
	                p = Rs.urlEncode(Rs.applyIf(p, bp));
	            }else if(typeof p == 'string' && bp){
	                p += '&' + Rs.urlEncode(bp);
	            }
	        }else if(bp){
	            p = Rs.urlEncode(bp);
	        }
	        return p;
	    }
		
	});
	
	
	var ACTION_TYPES = {
		'load' : ActionLoad,
	    'submit' : ActionSubmit
	};
	
	/**
	 * @class Rs.ext.form.BasicForm
	 * @extends Ext.util.Observable
	 * @constructor
	 * @param {Mixed} el The form element or its id
	 * @param {Object} config Configuration options
	 */
	Rs.ext.form.BasicForm = function(){
		Rs.ext.form.BasicForm.superclass.constructor.apply(this, arguments);
	};

	Ext.extend(Rs.ext.form.BasicForm, Ext.form.BasicForm, {

		/**
		 * 默认值为load
		 * @cfg {String} loadMethod 
		 */
		loadMethod : 'load',
		
		/**
		 * 提交到后台的业务方法名称，默认的方法名称是submit
		 * 
		 * @cfg {String} submitMethod 
		 */
		submitMethod : 'submit',
		
	    /**
	     * @cfg {String} waitTitle
	     * The default title to show for the waiting message box (defaults to <tt>'Please Wait...'</tt>)
	     */
	    waitTitle: '请稍等...',
	    
	    //private
	    doAction : function(action, options){
	        if(Ext.isString(action)){
	            action = new ACTION_TYPES[action](this, options);
	        }
	        if(this.fireEvent('beforeaction', this, action) !== false){
	            this.beforeAction(action);
	            action.run.defer(100, action);
	        }
	        return this;
    	},
	    
	    /**
	     * Shortcut to {@link #doAction do} a {@link Ext.form.Action.Submit submit action}.
	     * @param {Object} options The options to pass to the action (see {@link #doAction} for details).<br>
	     * @return {BasicForm} this
	     */
	    submit : function(options){
	        options = options || {};
	        Ext.apply(options, {
				method : this.submitMethod
			});
	        if(this.standardSubmit){
	            var v = options.clientValidation === false || this.isValid();
	            if(v){
	                var el = this.el.dom;
	                if(this.url && Ext.isEmpty(el.action)){
	                    el.action = this.url;
	                }
	                el.submit();
	            }
	            return v;
	        }
	        this.doAction('submit', options);
	        return this;
	    },

	    /**
	     * Shortcut to {@link #doAction do} a {@link Ext.form.Action.Load load action}.
	     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
	     * @return {BasicForm} this
	     */
	    load : function(options){
	    	Ext.apply(options, {
				method : this.loadMethod
			});
	        this.doAction('load', options);
	        return this;
	    }
	  
	});

})();