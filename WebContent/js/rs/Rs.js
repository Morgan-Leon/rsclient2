/**
 * @class Rs
 * Rs core utilities and functions.
 * @singleton
 */
Rs = {
	 /**
	 * The version of the framework
	 * @type String
	 */
    version : '0.1'
};

/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member Rs apply
 */
Rs.apply = function(o, c, defaults){
    if(defaults){
        Rs.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0,
        toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE6 = isIE && !isIE7 && !isIE8,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol),
        isSupportScriptEval = null;

    // remove css image flicker
    if(isIE6){
        try{
            DOC.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    //check is support script eval
    (function(){
    	var root = DOC.documentElement,
			script = DOC.createElement("script"),
			id = "script" + (new Date()).getTime();
		script.type = "text/javascript";
		try {
			script.appendChild( DOC.createTextNode( "window." + id + "=1;" ) );
		} catch(e) {}
		root.insertBefore( script, root.firstChild );
		if ( window[ id ] ) {
			isSupportScriptEval = true;
			delete window[ id ];
		} else {
			isSupportScriptEval = false;
		}
		root.removeChild( script );
		root = script = id  = null;
    })(this);
    
    Rs.apply(Rs, {
    	
        
    	/** 
    	 * 本框架所处绝对位置
    	 */
    	BASE_PATH : "/com/rsc/rs/pub/rsclient2/rs",
    	
    	/**
    	 * 框架的望远镜请求地址
    	 * @cfg {String} BASE_GENERALSEL_PATH
    	 */
    	BASE_GENERALSEL_PATH: '/rsc/rsclient/generalsel',
    	
    	/**
    	 * 框架的用户偏好信息请求地址
    	 * @cfg {String} BASE_GENERALSEL_PATH
    	 */
    	BASE_STATE_MANAGER_PATH : '/rsc/rsclient/statemanager',
    	
    	/**
         * URL to a blank file used by Rs when in secure mode for iframe src and onReady src to prevent
         * the IE insecure content warning (<tt>'about:blank'</tt>, except for IE in secure mode, which is <tt>'javascript:""'</tt>).
         * @type String
         */
    	SSL_SECURE_URL : isSecure && isIE ? 'javascript:""' : 'about:blank',
        
		/**
	     * True if the browser is in strict (standards-compliant) mode, as opposed to quirks mode
	     * @type Boolean
	     */
        isStrict : isStrict,
        
        /**
         * True if the page is running over SSL
         * @type Boolean
         */
        isSecure : isSecure,
        
        /**
         * True when the document is fully initialized and ready for action
         * @type Boolean
         */
        isReady : false,

        /**
         * True to automatically uncache orphaned Rs.Elements periodically (defaults to true)
         * @type Boolean
         */
        enableGarbageCollector : true,

        /**
         * True to automatically purge event listeners during garbageCollection (defaults to false).
         * @type Boolean
         */        
        enableListenerCollection : false,

        /**
         * EXPERIMENTAL - True to cascade listener removal to child elements when an element is removed.
         * Currently not optimized for performance.
         * @type Boolean
         */        
        enableNestedListenerRemoval : false,

        /**
         * Indicates whether to use native browser parsing for JSON methods.
         * This option is ignored if the browser does not support native JSON methods.
         * <b>Note: Native JSON methods will not work with objects that have functions.
         * Also, property names must be quoted, otherwise the data will not parse.</b> (Defaults to false)
         * @type Boolean
         */
        USE_NATIVE_JSON : false,

        /**
         * Copies all the properties of config to obj if they don't already exist.
         * @param {Object} obj The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(!Rs.isDefined(o[p])){
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        
        /**
         * Generates unique ids. If the element already has an id, it is unchanged
         * @param {Mixed} el (optional) The element to generate an id for
         * @param {String} prefix (optional) Id prefix (defaults "ext-gen")
         * @return {String} The generated Id.
         */
        id : function(el, prefix){
            return (el = Rs.getDom(el) || {}).id = el.id || (prefix || "rs-gen") + (++idSeed);
        },

        /**
         * A reusable empty function
         * @property
         * @type Function
         */
        emptyFn : function(){},
        
        
        /**
         * Utility method for validating that a value is numeric, returning the specified default value if it is not.
         * @param {Mixed} value Should be a number, but any type will be handled appropriately
         * @param {Number} defaultValue The value to return if the original value is non-numeric
         * @return {Number} Value, if numeric, else defaultValue
         */
        num : function(v, defaultValue){
            v = Number(Rs.isEmpty(v) || Rs.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && v.trim().length == 0) ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },
        
        /**
         * <p>Extends one class to create a subclass and optionally overrides members with the passed literal. This method
         * also adds the function "override()" to the subclass that can be used to override members of the class.</p>
         * <p>This function also supports a 3-argument call in which the subclass's constructor is
         * passed as an argument. In this form, the parameters are as follows:</p>
         * <div class="mdetail-params"><ul>
         * <li><code>subclass</code> : Function <div class="sub-desc">The subclass constructor.</div></li>
         * <li><code>superclass</code> : Function <div class="sub-desc">The constructor of class being extended</div></li>
         * <li><code>overrides</code> : Object <div class="sub-desc">A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.</div></li>
         * </ul></div>
         *
         * @param {Function} superclass The constructor of class being extended.
         * @param {Object} overrides <p>A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.</p>
         * <p>This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p>
         * <p><b>It is essential that you call the superclass constructor in any provided constructor. See example code.</b></p>
         * @return {Function} The subclass constructor from the <code>overrides</code> parameter, or a generated one if not provided.
         */
        extend : function(){
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(Rs.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Rs.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Rs.override(sb, overrides);
                sb.extend = function(o){return Rs.extend(sb, o);};
                return sb;
            };
        }(),
        
        /**
         * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
         * Usage:<pre><code>
Ext.override(MyClass, {
    newMethod1: function(){
        // etc.
    },
    newMethod2: function(foo){
        // etc.
    }
});
</code></pre>
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Rs.apply(p, overrides);
                if(Rs.isIE && overrides.hasOwnProperty('toString')){
                    p.toString = overrides.toString;
                }
            }
        },
        
        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
         * <pre><code>
Rs.namespace('Company', 'Company.data');
Rs.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
         * @method namespace
         */
        namespace : function(){
            var o, d;
            Rs.each(arguments, function(v) {
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                Rs.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },

		/**
		 * Takes an object and converts it to an encoded URL.
		 *         注意：此方法和Ext.urlEncode不同，该方法只是将传入对象的第一层属性编码。 e.g.
		 *         Rs.urlEncode({foo: 1, bar: 2, books:[1,2,3,4]}); would return
		 *         "foo=1&bar=2&books=[1,2,3,4]".
		 * 
		 * Ext.urlEncode({foo: 1, bar: 2, books:[1,2,3,4]}) would return
		 * "foo=1&bar=2&books=1&books=2&books=3&books=4".
		 * 
		 * @method urlEncode 
		 * @param {Object} o
		 * @param {String} pre (optional) A prefix to add to the url encoded string
		 * @return {String}
		 */
        urlEncode : function(o, pre) {
			var empty, buf = [],  e = encodeURIComponent; //e = encodeURI;
			Rs.iterate(o, function(key, item) {
				if((Rs.isObject(item) || Rs.isArray(item))){
					buf.push('&', e(e(key)), '=', Rs.encode(item));
				}else {
					empty = Rs.isEmpty(item);
					Rs.each(empty ? key : item, function(val) {
						if(!Rs.isEmpty(val) && (val != key || !empty)){
							if(Rs.isDate(val) || Rs.isString(val)){
								buf.push('&', e(e(key)), '=', Rs.encode(val).replace(/"/g,''));
							}else {
								buf.push('&', e(e(key)), '=', e(val));
							}
						}else {
							buf.push('&', e(e(key)), '=', '');
						}
					});
				}
			});
			if (!pre) {
				buf.shift();
				pre = '';
			}
			return pre + buf.join('');
		},
        
		 /**
         * Takes an encoded URL and and converts it to an object. Example: <pre><code>
Rs.urlDecode("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Rs.urlDecode("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
</code></pre>
         * @param {String} string
         * @param {Boolean} overwrite (optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
         * @return {Object} A literal with members
         */
        urlDecode : function(string, overwrite){
            if(Rs.isEmpty(string)){
                return {};
            }
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Rs.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(d(pair[0]));
                value = d(d(pair[1]));
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },
        
        /**
         * Appends content to the query string of a URL, handling logic for whether to place
         * a question mark or ampersand.
         * @param {String} url The URL to append to.
         * @param {String} s The content to append to the URL.
         * @return (String) The resulting URL
         */
        urlAppend : function(url, s){
            if(!Rs.isEmpty(s)){
                return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
            }
            return url;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array
         * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
         * For strings, use this instead: "abc".match(/./g) => [a,b,c];
         * @param {Iterable} the iterable object to be turned into a true Array.
         * @return (Array) array
         */
        toArray : function(){
             return isIE ?
                function(a, i, j, res){
                    res = [];
                    for(var x = 0, len = a.length; x < len; x++) {
                        res.push(a[x]);
                    }
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j){
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                };
        }(),

        
        isIterable : function(v){
            //check for array or arguments
            if(Rs.isArray(v) || v.callee){
                return true;
            }
            //check for node list type
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && Rs.isNumber(v.length));
        },

        /**
         * Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <code>index</code>. This function is called with
         * the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><code>item</code> : <i>Mixed</i>
         * <div class="sub-desc">The item at the current <code>index</code>
         * in the passed <code>array</code></div></li>
         * <li><code>index</code> : <i>Number</i>
         * <div class="sub-desc">The current index within the array</div></li>
         * <li><code>allItems</code> : <i>Array</i>
         * <div class="sub-desc">The <code>array</code> passed as the first
         * argument to <code>Ext.each</code>.</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * Defaults to the <code>item</code> at the current <code>index</code>
         * within the passed <code>array</code>.
         * @return See description for the fn parameter.
         */
        each : function(array, fn, scope){
            if(Rs.isEmpty(array, true)){
                return;
            }
            if(!Rs.isIterable(array) || Rs.isPrimitive(array)){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){
                    return i;
                };
            }
        },

        /**
         * Iterates either the elements in an array, or each of the properties in an object.
         * <b>Note</b>: If you are only iterating arrays, it is better to call {@link #each}.
         * @param {Object/Array} object The object or array to be iterated
         * @param {Function} fn The function to be called for each iteration.
         * The iteration will stop if the supplied function returns false, or
         * all array elements / object properties have been covered. The signature
         * varies depending on the type of object being interated:
         * <div class="mdetail-params"><ul>
         * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
         * <div class="sub-desc">
         * When iterating an array, the supplied function is called with each item.</div></li>
         * <li>Objects : <tt>(String key, Object value, Object)</tt>
         * <div class="sub-desc">
         * When iterating an object, the supplied function is called with each key-value pair in
         * the object, and the iterated object</div></li>
         * </ul></div>
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
         * the <code>object</code> being iterated.
         */
        iterate : function(obj, fn, scope){
            if(Rs.isEmpty(obj)){
                return;
            }
            if(Rs.isIterable(obj)){
                Rs.each(obj, fn, scope);
                return;
            }else if(Rs.isObject(obj)){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        };
                    }
                }
            }
        },

        /**
         * Return the dom node for the passed String (id), dom node, or Ext.Element.
         * Here are some examples:
         * <pre><code>
// gets dom node based on id
var elDom = Rs.getDom('elId');
// gets dom node based on the dom node
var elDom1 = Rs.getDom(elDom);

// If we don&#39;t know if we are working with an
// Ext.Element or a dom node use Ext.getDom
function(el){
    var dom = Ext.getDom(el);
    // do something with the dom node
}
         * </code></pre>
         * <b>Note</b>: the dom node to be found actually needs to exist (be rendered, etc)
         * when this method is called to be successful.
         * @param {Mixed} el
         * @return HTMLElement
         */
        getDom : function(el){
            if(!el || !DOC){
                return null;
            }
            return el.dom ? el.dom : (Rs.isString(el) ? DOC.getElementById(el) : el);
        },
        
        /**
         * Returns the current document body as an {@link Ext.Element}.
         * @return Rs.Element The document body
         */
        getBody : function(){
            return Rs.get(DOC.body || DOC.documentElement);
        },

        /**
         * Removes a DOM node from the document.
         * 
         * <p>Removes this element from the document, removes all DOM event listeners, and deletes the cache reference.
         * All DOM event listeners are removed from this element. If {@link Ext#enableNestedListenerRemoval} is
         * <code>true</code>, then DOM event listeners are also removed from all child nodes. The body node
         * will be ignored if passed in.</p>
         * @param {HTMLElement} node The node to remove
         */
        removeNode : isIE && !isIE8 ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Rs.enableNestedListenerRemoval) ? Rs.EventManager.purgeElement(n, true) : Rs.EventManager.removeAll(n);
                    d = d || DOC.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                    delete Rs.elCache[n.id];
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                (Rs.enableNestedListenerRemoval) ? Rs.EventManager.purgeElement(n, true) : Rs.EventManager.removeAll(n);
                n.parentNode.removeChild(n);
                delete Rs.elCache[n.id];
            }
        },
        
        /**
         * 抛出错误信息
         * 
         * @method error
         * @param {msg}
         */
        error : function(msg){
        	throw msg;
        },
        
        /**
         * <p>Returns true if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Rs.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },

        /**
         * Returns true if the passed value is a JavaScript array, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isArray : function(v){
            return toString.apply(v) === '[object Array]';
        },

        /**
         * Returns true if the passed object is a JavaScript date object, otherwise false.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate : function(v){
            return toString.apply(v) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isObject : function(v){
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isPrimitive : function(v){
            return Rs.isString(v) || Rs.isNumber(v) || Rs.isBoolean(v);
        },

        /**
         * Returns true if the passed value is a JavaScript Function, otherwise false.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isFunction : function(v){
            return toString.apply(v) === '[object Function]';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isNumber : function(v){
            return typeof v === 'number' && isFinite(v);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isString : function(v){
            return typeof v === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isBoolean : function(v){
            return typeof v === 'boolean';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isElement : function(v) {
            return !!v && v.tagName;
        },

        /**
         * Returns true if the passed value is not undefined.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isDefined : function(v){
            return typeof v !== 'undefined';
        },
        
        /**
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,

        /**
         * True if the detected browser uses WebKit.
         * @type Boolean
         */
        isWebKit : isWebKit,
        
        /**
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,
        
        /**
         * True if the detected browser is Safari.
         * @type Boolean
         */
        isSafari : isSafari,
        
        /**
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,
        /**
         * True if the detected browser is Safari 4.x.
         * @type Boolean
         */
        isSafari4 : isSafari4,
        /**
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari2,
        /**
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,
        /**
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE6,
        /**
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,
        /**
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,
        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,
        /**
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
         * @type Boolean
         */
        isGecko2 : isGecko2,
        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,
        /**
         * True if the detected browser is Internet Explorer running in non-strict mode.
         * @type Boolean
         */
        isBorderBox : isBorderBox,
        /**
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,
        /**
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,
        /**
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,
        /**
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir,
        
        /**
         * True if support script eval.
         * 
         */
        isSupportScriptEval : isSupportScriptEval
    });

    /**
     * Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
     * <pre><code>
RS.namespace('Company', 'Company.data');
Rs.namespace('Company.data'); // equivalent and preferable to above syntax
Company.Widget = function() { ... }
Company.data.CustomStore = function(config) { ... }
</code></pre>
     * @param {String} namespace1
     * @param {String} namespace2
     * @param {String} etc
     * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
     * @method ns
     */
    Rs.ns = Rs.namespace;
})();

Rs.apply(Rs, function() {

	var DOC = document;
	
	var _isobject = function(v){
		return !!v && Object.prototype.toString.call(v) === '[object Object]';
	};
	
	var _isarray = function(v){
		return v instanceof Array;
	};
	
	var _isfunction = function(v){
		return typeof v == "function";
	};
	
	var _sortarray = function(array){
		return array.sort(function(a, b){
			return _hashcode(a) > _hashcode(b) ? 1 : -1;
		});
	};
	
	var _sortobject = function(obj){
		var ks = [], k, v, i, l, obj2 = {};
		for(k in obj){
			if(_isfunction(obj[k]) == false){
				ks.push(k);
			}
		}
		ks = ks.sort();
		for(i = 0, l = ks.length; i < l; i++){
			k = ks[i]; v = obj[k];
			obj2[k] = _sortproperty(v);
		}
		return obj2;
	};
	
	var _sortproperty = function(obj){
		if(_isarray(obj)){
			return _sortarray(obj); 
		}else if(_isobject(obj)){
			return _sortobject(obj);
		}else {
			return obj;
		}
	};
	
	var _hashcode = function(obj){
		obj = _sortproperty(obj);
		var str = JSON.stringify(obj),
			hc = _hashcodestr((typeof obj)+str);
		return hc;
	};
	
	var _hashcodestr = function(str){
		var h = 0, off = 0;
		for(var i = 0, l = str.length; i < l; i++){  
			h = 31 * h  + str.charCodeAt(off++); 
			if(h > 0x7fffffff || h < 0x80000000){
				h = h & 0xffffffff;
			}
		}
		return h;
	};
	
	//已加载资源记录缓存
	var loadedResourceCache = {};
	
	return {
		
	    /**
         * 加载js 和 css文件
         * 
         * @method loadResource
         * 
         * @param {String} src 文件资源地址，
         *          例如：src='http://pagead2.googlesyndication.com/pagead/expansion_embed.js'; 
         * 
         * @param {Function} callback
         *          资源文件加载完调用的回调方法
         *          
         * @param {Object} scope
         * 
         * @param {boolean} disableCache 是否关闭缓存
         */
        loadResource: function(url, callback, scope, disableCache) {
            var onLoad = (function(el, url, callback, scope){
                loadedResourceCache[url] = el;
                if(Rs.isFunction(callback)){
                    callback.call(scope, this);
                }
            }).createDelegate(this, [url, callback, scope], 2);
            if (url.length > 4
                && url.substring(url.length - 4) == ".css") {
                this.injectCssElement(url, onLoad, scope, disableCache);
            }else {
                this.injectScriptElement(url, onLoad, scope, disableCache);
            }
        },
        
        //private 任务队列
        taskQueue : [],
        
         //private 加载JS文件, 如果当前正在加载JS则将本次调用放入队列中,等执行加载完毕后在加载该JS
        injectScriptElement: function(url, onLoad, scope, disableCache){
            //如果是IE浏览器,则逐个加载
            if(Rs.isIE && this.loading === true){
                this.taskQueue.push({
                    url : url,
                    callback : onLoad,
                    scope : scope
                });
                return ;
            }
            
            var DOC = document,
                HEAD = DOC.getElementsByTagName("head")[0],
                script = DOC.createElement('script'),
                me = this,
                onLoadFn = function() {
                    me.cleanupScriptElement(script);
                    onLoad.call(scope, script);
                    me.loading = false;
                    me.nextTask();
                };
            script.type = 'text/javascript';
            script.src = disableCache === true?url + "?t=" + new Date().getTime():url;
            script.onload = onLoadFn;
            script.onerror = onLoadFn;
            script.onreadystatechange = function() {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    onLoadFn();
                }
            };
            this.loading = true;
            HEAD.appendChild(script);
        },
        
        //private 从队列里取出一项任务并执行
        nextTask : function(){
            if (this.taskQueue.length > 0) {
                var task = this.taskQueue.shift();
                this.injectScriptElement(task.url, task.callback, task.scope);
            }
        },
        
         //private
        cleanupScriptElement : function(script) {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;
            return this;
        },
        
        //private
        injectCssElement : function(url, onLoad, scope, disableCache){
            var DOC = document,
                HEAD = DOC.getElementsByTagName("head")[0],
                link = DOC.createElement("link"),
                me = this,
                onLoadFn = function() {
                    me.cleanupCssElement(link);
                    onLoad.call(scope, link);
                };
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = disableCache === true?url + "?t=" + new Date().getTime():url;
            if(( 1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent)) == 2){
                var intervalID = setInterval(function() {
                    try {
                        clearInterval(intervalID);
                        onLoadFn();
                    }catch (ex) {}
                }, 100);
            }else {
                link.onload = onLoadFn;
            }
            HEAD.appendChild(link);
            return link;
        },
        
        //private
        cleanupCssElement : function(link){
            link.onload = null;
            return this;
        },
        
        /**
         * 删除引入的资源文件节点，如下图所示删除引入的样式文件的节点。
         * <pre><code>
    var Themes = Rs.Themes,
        oldThemeUrls, newThemeUrls;
    
    //删除原有主题样式
    oldThemeUrls = this.getThemeCssUrls(this.theme);
    Rs.each(oldThemeUrls, function(url){
        Rs.removeResource(url);
    }, this);
         * 
         * </code></pre>
         * @method removeResource
         * @param {String} url
         */
        removeResource : function(url){
            if(loadedResourceCache && loadedResourceCache[url]){
                var el = Rs.get(loadedResourceCache[url]);
                el && el.remove();
                delete loadedResourceCache[url];
            }
        },
	    
		/**
		 * 对比两个json块是否相当
		 * 
		 * @method equals
		 * 
		 * @param {Mixed} json1  第一个json块
		 * @param {Minex} json2  第二个json块
		 */
		equals : function(json1, json2){
			var hashcode1 = this.hashCode(json1),
				hashcode2 = this.hashCode(json2);
			return hashcode1 == hashcode2;
		},
		
		/**
		 * 对传入的json块求hashCode, 第一个参数为要求hashcode的对象，第二个参数以及之后的参数都是要计算hashcode的属性名称.
		 * 
		 * @method hashCode  
		 * @param {Mixed} json  要计算HashCode的对象
		 * @param {String} property1 计算hashCode的第一个属性名称，如果不存在该属性则忽略
		 * @param {String} property2 计算hashCode的第二个属性名称，如果不存在该属性则忽略
		 * @param {String} property3 计算hashCode的第三个属性名称，如果不存在该属性则忽略
<pre><code>
   var a = {
	       id : 100,
	       name : "tiger",
	       books : [{id: 120, name : 'C编程', code : 'C'},{id: 120, name : 'C++编程', code : 'c++'}]
	   }
   var b = {
		   books : [{id: 120, name : 'C++编程', code : 'c++'},{id: 120, name : 'C编程', code : 'C'}],
		   name : 'tiger',
           id : 100,
           fn : function(){
                return 1 == 1;
	       }
       }
       
 	var aa, 
 		bb;
 		
	aa = TEMP.hashcode(a);
	bb = TEMP.hashcode(b); 
   
	alert(aa == bb);
</code></pre>
		 * ...
		 */
		hashCode : function(json){
			var ids = [], k;
			for(var i = 1, l = arguments.length; i < l; i++){
				k = arguments[i];
				(json[k])?(ids.push(k)):null;
			}
			if(ids.length > 0){
				var obj = {};
				ids = ids.sort();
				for(var i = 0, l = ids.length; i < l; i++){
					k = ids[i];
					obj[k] = json[k];
				}
				return _hashcode(obj);
			}else {
				return _hashcode(json);
			}
		}
		
	};

}());

Rs.lr = Rs.loadResource;

Rs.ns("Rs.util", "Rs.lib", "Rs.data", "Rs.lib");

Rs.elCache = {};