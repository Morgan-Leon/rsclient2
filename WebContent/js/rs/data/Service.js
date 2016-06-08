(function(){
	var RS_METHOD = 'Rs-method',
		RS_DATATYPE = 'Rs-dataType',
		RS_ACCEPT = 'Rs-accept',
		BEFORECALL = "beforecall",
    	//BEFOREREQUEST = "beforerequest",	
    	REQUESTCOMPLETE = "requestcomplete",
    	//REQUESTEXCEPTION = "requestexception",
    	BEFORECALLCOMPLATE = 'beforecallcomplate',
        CALLCOMPLATE = "callcomplete",
        CALLEXCEPTION = "callexception",
        UNDEFINED = undefined,
        LOAD = 'load',
        POST = 'POST',
        GET = 'GET',
        WINDOW = window,
    	DOC = document,
    	rvalidchars = /^[\],:{}\s]*$/,
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    	rnotwhite = /\S/;
    
	/**
	 * 
	 * 
	 * 
	 */
	var DATATYPES = {
		json : 'json',
		xml : 'xml'
	};
	
    /**
     *  key   Ҫ��ȡ�����ݵ�����
     *  value �ɱ��϶�Ϊ���������ݵ���Ӧcontent-type
     */ 
    var ACCEPTS = {
    	xml : /xml/,
		html: /html/,
		text: /plain/,
		json: /[json,javascript]/,
		script: /javascript/,
		"*" : /\*/
    };
    
	var CONVERTERS = {
		"* text": WINDOW.String,
		"text html": true,
		"text json": function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			data = Rs.trim( data );
			data = data == "" ? "{}" : data;
			try{
				return Rs.decode(data);
			}catch(e){
				if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ) {
					return WINDOW.JSON && WINDOW.JSON.parse ? WINDOW.JSON.parse( data ) : (new Function("return " + data))();
				} else {
					Rs.error( "Invalid JSON: " + data );
				}
			}
		},
		"text xml": function( data , xml , tmp ) {
			if ( WINDOW.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
			tmp = xml.documentElement;
			if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
				Rs.error( "Invalid XML: " + data );
			}
			return xml;
		},
		"text script": function( text ) {
			(function( data ) {
				if ( data && rnotwhite.test(data) ) {
					var head = DOC.getElementsByTagName("head")[0] || DOC.documentElement,
						script = DOC.createElement("script");
					script.type = "text/javascript";
					if (Rs.isSupportScriptEval) {
						script.appendChild( DOC.createTextNode( data ) );
					} else {
						script.text = data;
					}
					head.insertBefore( script, head.firstChild );
					head.removeChild( script );
				}
			})(text);
			return text;
		}
	};
    
	/**
     * @class Rs.data.Service
     * @extends Rs.util.Observable
     * <p>�����װ�˶Ժ�̨ҵ�񷽷��ĵ��ã�
     * <pre><code>
//����һ��service����,��ָ����̨ҵ���URL��ҵ�񷽷����� 
var service = new Rs.data.Service({
    url : 'service.jsp',
    method : 'getJSON',
    accept : 'json'    
});
//���ø�ҵ�񷽷�
service.call( {
    params : { id : 101},
    success : function(sheet) {
        Rs.fly('out').update(sheet);
    }
});
	 * </code></pre> 
     * </p>
     * <p></p>
     * @constructor
     * @param {Object} config a configuration object.
     */
    Rs.data.Service = function(config){
        Rs.apply(this, config);
        this.addEvents(
            
        	/**
        	 * @event beforecall  �ڵ��ú�̨ҵ�񷽷�֮ǰ���ø÷���������ص���������Ϊfalse,����ִֹ�е��ú�̨ҵ�񷽷�.
             * @param {Service} service
             * @param {Object} options
             */
            BEFORECALL,
            
            /**
             * @event beforecallcomplate  �ڵ��ûص�����֮ǰ���������¼�����ͨ������beforecallcomplate�¼�, ʵ�ֶ�Ajaxԭ�����ݵ�Ԥ����
             * @param {Service} service 
             * @param {Object} response The XHR object containing the response data.
             * See <a href="http://www.w3.org/TR/XMLHttpRequest/">The XMLHttpRequest Object</a>
             * for details.
             */
            BEFORECALLCOMPLATE,
            
            /**
             * @event callcomplate  ���ûص�����ʱ�������¼�
             * @param {Service} service
             * @param {Mixed} data
             * @param {Object} options
             */
            CALLCOMPLATE,
            
            /**
             * @event callexception  �����쳣ʱ�������¼�
             * @param {Service} service
             * @param {Object} response
             * @param {Object} options
             * @param {String} exception
             */
            CALLEXCEPTION
        );
        Rs.data.Service.superclass.constructor.call(this);
    };

    Rs.extend(Rs.data.Service, Rs.util.Observable, {
        
    	/**
         * @cfg {String} url ��̨ҵ��URL 
         */
    	
    	/**
         * @cfg {String} method ��̨ҵ�񷽷�����
         */
        
    	/**
         * @cfg {Number} timeout (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
         */
        timeout : 30000,
        
        /**
         * @cfg {Boolean} autoAbort (Optional) Whether this request should abort any pending requests. (defaults to false)
         * @type Boolean
         */
        autoAbort : false,
        
        
        /**
         * @cfg {String} dataType
         * ����Ĳ������������ͣ� Ĭ����json
         * 
         */
        dataType : 'json',
        
    	/**
		 * @cfg {String} accept 
    	 * <p>Ԥ�ڷ��������ص���������, Ĭ�ϵ�ֵΪjson</p>
    	 * <p>
    	 * ����ֵ:
    	 * xml   : ���� XML �ĵ�������Rs.Service����.
    	 * html  : ���ش��ı� HTML ��Ϣ������ script Ԫ��.
    	 * script: ���ش��ı� JavaScript ����,�����Զ�������,����������"cache"����.
    	 * json  : ���� JSON ����
    	 * text  : ���ش��ı��ַ���
    	 * </p>
    	 * @type String
    	 */
    	accept : 'json',
    	
    	/**
    	 * �������
    	 */
    	taskQueue : [],
    	
        /**
         * ���ú�̨��ҵ�񷽷�, �����ǰ����ִ�к�̨ҵ�񷽷�����δ���յ���Ӧ����ʱ��
         * ����call���������������У�����һ�ε��÷��غ󷽿�ִ����һ�ε��á�
         * <b>Important:</b>�������󵽺�ִ̨��ҵ�񷽷�����ͨ������accept ��ָ
         * ��Ҫ��ȡ�����ݵ����� ��xml, html, script, json, text
         * 
         * @param {Object} params
         * @param [Function callback]
         * @param [Object scope]
         */
        call : function(o, callback, scope){
            var me = this;
            if(me.isLoading(me.transId) == true){ //������ڷ��������򽫲�������
    			me.taskQueue.push({
            		options : o,
    				callback : callback,
    				scope : scope
    			});
    			return null;
            }
            if(Rs.isFunction(callback)){
            	o.success = callback;
            }
            if(Rs.isDefined(scope)){
            	o.scope = scope;
            }
            if(me.fireEvent(BEFORECALL, me, o)){
                var ep = o.extraParams || me.extraParams || {},
                	m = o.method || me.method || '',
                	dt = o.dataType || me.dataType,
                    ac = o.accept || me.accept,
                	p = o.params,
                    url = o.url || me.url,
                    cb = {success: me.handleResponse,
                          failure: me.handleFailure,
                          scope: me,
                          argument: {options: o},
                          timeout : o.timeout || me.timeout
                    },
                    form,
                    serForm;
                
                if (Rs.isFunction(p)) {
                    p = p.call(o.scope||WINDOW, o);
                }
                p = Rs.urlEncode(ep, Rs.isObject(p) ? Rs.urlEncode(p) : p);
                if (Rs.isFunction(url)) {
                    url = url.call(o.scope || WINDOW, o);
                }
                o.dataType = DATATYPES[dt] != undefined ? dt : "json";
                o.accept = ACCEPTS[ac] != undefined ? ac : "*";
                if((form = Rs.getDom(o.form))){
                    url = url || form.action;
                     if(o.isUpload || (/multipart\/form-data/i.test(form.getAttribute("enctype")))) {
                         return me.doFormUpload.call(me, o, p, url);
                     }
                    serForm = Rs.lib.Ajax.serializeForm(form);
                    p = p ? (p + '&' + serForm) : serForm;
                }
                o.headers = o.headers || {};
                o.headers[RS_METHOD] = m;
                o.headers[RS_DATATYPE] = o.dataType;
                o.headers[RS_ACCEPT] = o.accept;
                if(o.autoAbort === true || me.autoAbort) {
                    me.abort();
                }
                return (me.transId = Rs.lib.Ajax.request('POST', url, cb, p, o));
            }else {
                return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
            }
        },

        /**
         * Determine whether this object has a request outstanding.
         * 
         * @param {Number} transactionId (Optional) defaults to the last transaction
         * @return {Boolean} True if there is an outstanding request.
         */
        isLoading : function(transId){
            return transId ? Rs.lib.Ajax.isCallInProgress(transId) : !! this.transId;
        },

        /**
         * Aborts any outstanding request.
         * 
         * @param {Number} transactionId (Optional) defaults to the last transaction
         */
        abort : function(transId){
            if(transId || this.isLoading()){
                Rs.lib.Ajax.abort(transId || this.transId);
            }
        },
        
        //private
        ajaxConvert : function(response, options){
        	var ct = response.getResponseHeader('Content-type'),
	        	data = response.responseText || response.responseXML,
	        	prev, 
	        	current,
	        	conversion;
	        
        	//ʵ����������
        	/*
        	for(var dt in ACCEPTS){
	        	if(ACCEPTS[dt].test(ct)){
	        		prev = dt;
	        		break;
	        	}
	        }
        	prev = prev == undefined ? '*' : prev;
	        */
        	prev = 'text';
        	
        	//������������
        	current = options && ACCEPTS[options.accept] ? options.accept : '*';
			
	        if(current == '*'){
	        	current = prev;
	        }else if(prev !== '*' && prev !== current){
	        	var conv = CONVERTERS[ prev + " " + current ] || CONVERTERS[ "* " + current ],
	        		conv1,
	        		conv2, 
	        		tmp;
				if ( !conv ) {
					conv2 = undefined;
					for( conv1 in CONVERTERS ) {
						tmp = conv1.split( " " );
						if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
							conv2 = CONVERTERS[ tmp[1] + " " + current ];
							if ( conv2 ) {
								conv1 = CONVERTERS[ conv1 ];
								if ( conv1 === true ) {
									conv = conv2;
								} else if ( conv2 === true ) {
									conv = conv1;
								}
								break;
							}
						}
					}
				}
				// If we found no converter, dispatch an error
				if ( !( conv || conv2 ) ) {
					Rs.error( "No conversion from " + prev + " to " + current);
				}
				// If found converter is not an equivalence
				if ( conv !== true ) {
					// Convert with 1 or 2 converters accordingly
					data = conv ? conv( data ) : conv2( conv1(data) );
				}
	        }
        	return data;
        },
        
        // private
        handleResponse : function(response){
            
        	this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            if(this.fireEvent(BEFORECALLCOMPLATE, this, response, options) !== false){
            	if(options.success){
            		var data = this.ajaxConvert(response, options);
                	this.fireEvent(CALLCOMPLATE, this, data, options);
                    options.success.call(options.scope, data, options);
                }
                if(options.callback){
                    options.callback.call(options.scope, response, true, options);
                }
            }
            this.nextTask();
        },

        // private
        handleFailure : function(response, e){
            this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            this.fireEvent(CALLEXCEPTION, this, response, options, e);
            if(options.failure){
                options.failure.call(options.scope, response, options);
            }
            if(options.callback){
                options.callback.call(options.scope, response, false, options);
            }
            this.nextTask();
        },
        
        //private
        nextTask : function(){
        	if (this.taskQueue.length > 0) {
				var task = this.taskQueue.shift();
				this.call(task.options, task.callback, task.scope);
			}
        },
        
        // private
        doFormUpload : function(o, ps, url){
            var id = Rs.id(),
                doc = document,
                frame = doc.createElement('iframe'),
                form = Rs.getDom(o.form),
                hiddens = [],
                hd,
                encoding = 'multipart/form-data',
                buf = {
                    target: form.target,
                    method: form.method,
                    encoding: form.encoding,
                    enctype: form.enctype,
                    action: form.action
                },
                action = url || buf.action;

            Rs.fly(frame).set({
                id: id,
                name: id,
                cls: 'x-hidden',
                src : Rs.SSL_SECURE_URL
            });

            doc.body.appendChild(frame);

            // This is required so that IE doesn't pop the response up in a new window.
            if(Rs.isIE){
               document.frames[id].name = id;
            }
            
            //ҵ�񷽷����ƺ�������������׷����action������Ϊ�������룬
            //������̨�Ϳ���ͨ��request.getParameter(��Rs-method��)
            //��request.getParameter(��Rs-accept��)��ȡ������
            action += ("?" + RS_METHOD + "=" + o.method + "&" + RS_DATATYPE + "=" + o.dataType + "&" + RS_ACCEPT + "=" + o.accept);
            
            Rs.fly(form).set({
                target: id,
                method: POST,
                enctype: encoding,
                encoding: encoding,
                action: action
            });
            
            // add dynamic params
            Rs.iterate(Rs.urlDecode(ps, false), function(k, v){
                hd = doc.createElement('input');
                Rs.fly(hd).set({
                    type: 'hidden',
                    value: v,
                    name: k
                });
                form.appendChild(hd);
                hiddens.push(hd);
            });
            
            function cb(){
                var me = this,
                    // bogus response object
                    r = {responseText : '',
                         responseXML : null,
                         argument : o.argument},
                    doc,
                    firstChild;

                try{
                    doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
                    if(doc){
                        if(doc.body){
                            if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ // json response wrapped in textarea
                                r.responseText = firstChild.value;
                            }else{
                                r.responseText = doc.body.innerHTML;
                            }
                        }
                        //in IE the document may still have a body even if returns XML.
                        r.responseXML = doc.XMLDocument || doc;
                    }
                }
                catch(e) {}

                Rs.EventManager.removeListener(frame, LOAD, cb, me);

                me.fireEvent(REQUESTCOMPLETE, me, r, o);

                function runCallback(fn, scope, args){
                    if(Rs.isFunction(fn)){
                        fn.apply(scope, args);
                    }
                }

                runCallback(o.success, o.scope, [r, o]);
                runCallback(o.callback, o.scope, [o, true, r]);

                if(!me.debugUploads){
                    setTimeout(function(){Rs.removeNode(frame);}, 100);
                }
            }

            Rs.EventManager.on(frame, LOAD, cb, this);
            
            form.submit();

            Rs.fly(form).set(buf);
            Rs.each(hiddens, function(h) {
                Rs.removeNode(h);
            });
        }
        
    });
})();

/**
 * @class Rs.Service
 * A static {@link Rs.data.Service} instance that can be used to call services.  See
 * {@link Rs.data.Service} for supported methods.
 * <pre><code>
Rs.Service.call({
	url : 'service.jsp',
	method : 'getJSON',
	accept : 'json',
	params : { id : 100},
	success : function(sheet) {
		Rs.fly('out').update(sheet);
	}
});
</code></pre>
 * @singleton
 */
Rs.Service = new Rs.data.Service({
    autoAbort : false
});

/**
 * ���ú�̨��ҵ�񷽷�, �����ǰ����ִ�к�̨ҵ�񷽷�����δ���յ���Ӧ����ʱ��
 * ����call���������������У�����һ�ε��÷��غ󷽿�ִ����һ�ε��á�
 * <b>Important:</b>�������󵽺�ִ̨��ҵ�񷽷�����ͨ������accept ��ָ
 * ��Ҫ��ȡ�����ݵ����� ��xml, html, script, json, text
 * @method call
 * @member Rs.Service
 * @param {Object} params
 * @param [{Function} callback]
 */