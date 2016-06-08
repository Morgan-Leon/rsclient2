/**
 * @class Rs.EventManager
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Rs.EventObject} for more details on normalized event objects.
 * @singleton
 */
Rs.EventManager = function(){
    var docReadyEvent,
        docReadyProcId,
        docReadyState = false,
        E = Rs.lib.Event,
        D = Rs.lib.Dom,
        DOC = document,
        WINDOW = window,
        IEDEFERED = "ie-deferred-loader",
        DOMCONTENTLOADED = "DOMContentLoaded",
        propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
        
        specialElCache = [];

     function getId(el){
        var id = false,
            i = 0,
            len = specialElCache.length,
            id = false,
            skip = false,
            o;
        if(el){
            if(el.getElementById || el.navigator){
                // look up the id
                for(; i < len; ++i){
                    o = specialElCache[i];
                    if(o.el === el){
                        id = o.id;
                        break;
                    }
                }
                if(!id){
                    // for browsers that support it, ensure that give the el the same id
                    id = Rs.id(el);
                    specialElCache.push({
                        id: id,
                        el: el
                    });
                    skip = true;
                }
            }else{
                id = Rs.id(el);
            }
            if(!Rs.elCache[id]){
                Rs.Element.addToCache(new Rs.Element(el), id);
                if(skip){
                    Rs.elCache[id].skipGC = true;
                }
            }
        }
        return id;
     };

    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, task, wrap, scope){
        el = Rs.getDom(el);
        var id = getId(el),
            es = Rs.elCache[id].events,
            wfn;

        wfn = E.on(el, ename, wrap);
        es[ename] = es[ename] || [];

        /* 0 = Original Function,
           1 = Event Manager Wrapped Function,
           2 = Scope,
           3 = Adapter Wrapped Function,
           4 = Buffered Task
        */
        es[ename].push([fn, wrap, scope, wfn, task]);


        // this is a workaround for jQuery and should somehow be removed from Ext Core in the future
        // without breaking ExtJS.
        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
            var args = ["DOMMouseScroll", wrap, false];
            el.addEventListener.apply(el, args);
            Rs.EventManager.addListener(WINDOW, 'unload', function(){
                el.removeEventListener.apply(el, args);
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Rs.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    };

    function fireDocReady(){
        if(!docReadyState){
            Rs.isReady = docReadyState = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Rs.isGecko || Rs.isOpera) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Rs.isIE){
                var defer = DOC.getElementById(IEDEFERED);
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.listeners = []; // clearListeners no longer compatible.  Force single: true?
            }
        }
    };

    function initDocReady(){
        var COMPLETE = "complete";

        docReadyEvent = new Rs.util.Event();
        if (Rs.isGecko || Rs.isOpera) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        } else if (Rs.isIE){
            DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");
            DOC.getElementById(IEDEFERED).onreadystatechange = function(){
                if(this.readyState == COMPLETE){
                    fireDocReady();
                }
            };
        } else if (Rs.isWebKit){
            docReadyProcId = setInterval(function(){
                if(DOC.readyState == COMPLETE) {
                    fireDocReady();
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    };

    function createTargeted(h, o){
        return function(){
            var args = Rs.toArray(arguments);
            if(o.target == Rs.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    };

    function createBuffered(h, o, task){
        return function(e){
            // create new event object impl so new events don't wipe out properties
            task.delay(o.buffer, h, null, [new Rs.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Rs.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o, fn){
        return function(e){
            var task = new Rs.util.DelayedTask(h);
            if(!fn.tasks) {
                fn.tasks = [];
            }
            fn.tasks.push(task);
            task.delay(o.delay || 10, h, null, [new Rs.EventObjectImpl(e)]);
        };
    };

    function listen(element, ename, opt, fn, scope){
        var o = !Rs.isObject(opt) ? {} : opt,
            el = Rs.getDom(element), task;

        fn = fn || o.fn;
        scope = scope || o.scope;

        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Rs){// !window[xname]){  ==> can't we do this?
                return;
            }
            e = Rs.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o, fn);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            task = new Rs.util.DelayedTask(h);
            h = createBuffered(h, o, task);
        }

        addListener(el, ename, fn, task, h, scope);
        return h;
    };

    var pub = {

		/**
         * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
         * use {@link Rs.Element#addListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The html element or id to assign the event handler to.
         * @param {String} eventName The name of the event to listen for.
         * @param {Function} handler The handler function the event invokes. This function is passed
         * the following parameters:<ul>
         * <li>evt : EventObject<div class="sub-desc">The {@link Rs.EventObject EventObject} describing the event.</div></li>
         * <li>t : Element<div class="sub-desc">The {@link Rs.Element Element} which was the target of the event.
         * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
         * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
         * </ul>
         * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
         * @param {Object} options (optional) An object containing handler configuration properties.
         * This may contain any of the following properties:<ul>
         * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
         * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
         * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
         * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
         * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
         * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
         * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
         * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
         * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
         * by the specified number of milliseconds. If the event fires again within that time, the original
         * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
         * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
         * </ul><br>
         * <p>See {@link Rs.Element#addListener} for examples of how to use these options.</p>
         */
        addListener : function(element, eventName, fn, scope, options){
            if(Rs.isObject(eventName)){
                var o = eventName, e, val;
                for(e in o){
                    val = o[e];
                    if(!propRe.test(e)){
                        if(Rs.isFunction(val)){
                            // shared options
                            listen(element, e, o, val, o.scope);
                        }else{
                            // individual options
                            listen(element, e, val);
                        }
                    }
                }
            } else {
                listen(element, eventName, options, fn, scope);
            }
        },

        /**
         * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
         * you will use {@link Rs.Element#removeListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove the listener.
         * @param {String} eventName The name of the event.
         * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
         * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
         * then this must refer to the same object.
         */
        removeListener : function(el, eventName, fn, scope){
            el = Rs.getDom(el);
            var id = getId(el),
                f = el && (Rs.elCache[id].events)[eventName] || [],
                wrap, i, l, k, wf, len, fnc;

            for (i = 0, len = f.length; i < len; i++) {

                /* 0 = Original Function,
                   1 = Event Manager Wrapped Function,
                   2 = Scope,
                   3 = Adapter Wrapped Function,
                   4 = Buffered Task
                */
                if (Rs.isArray(fnc = f[i]) && fnc[0] == fn && (!scope || fnc[2] == scope)) {
                    if(fnc[4]) {
                        fnc[4].cancel();
                    }
                    k = fn.tasks && fn.tasks.length;
                    if(k) {
                        while(k--) {
                            fn.tasks[k].cancel();
                        }
                        delete fn.tasks;
                    }
                    wf = wrap = fnc[1];
                    if (E.extAdapter) {
                        wf = fnc[3];
                    }
                    E.un(el, eventName, wf);
                    f.splice(i,1);
                    if (f.length === 0) {
                        delete Rs.elCache[id].events[eventName];
                    }
                    for (k in Rs.elCache[id].events) {
                        return false;
                    }
                    Rs.elCache[id].events = {};
                    return false;
                }
            }

            // jQuery workaround that should be removed from Ext Core
            if(eventName == "mousewheel" && el.addEventListener && wrap){
                el.removeEventListener("DOMMouseScroll", wrap, false);
            }

            if(eventName == "mousedown" && el == DOC && wrap){ // fix stopped mousedowns on the document
                Rs.EventManager.stoppedMouseDownEvent.removeListener(wrap);
            }
        },

        /**
         * Removes all event handers from an element.  Typically you will use {@link Ext.Element#removeAllListeners}
         * directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
         */
        removeAll : function(el){
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                f, i, len, ename, fn, k;

            for(ename in es){
                if(es.hasOwnProperty(ename)){
                    f = es[ename];
                    /* 0 = Original Function,
                       1 = Event Manager Wrapped Function,
                       2 = Scope,
                       3 = Adapter Wrapped Function,
                       4 = Buffered Task
                    */
                    for (i = 0, len = f.length; i < len; i++) {
                        fn = f[i];
                        if(fn[4]) {
                            fn[4].cancel();
                        }
                        if(fn[0].tasks && (k = fn[0].tasks.length)) {
                            while(k--) {
                                fn[0].tasks[k].cancel();
                            }
                            delete fn.tasks;
                        }
                        E.un(el, ename, E.extAdapter ? fn[3] : fn[1]);
                    }
                }
            }
            if (Rs.elCache[id]) {
                Rs.elCache[id].events = {};
            }
        },

        getListeners : function(el, eventName) {
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                results = [];
            if (es && es[eventName]) {
                return es[eventName];
            } else {
                return null;
            }
        },

        purgeElement : function(el, recurse, eventName) {
            el = Rs.getDom(el);
            var id = getId(el),
                ec = Rs.elCache[id] || {},
                es = ec.events || {},
                i, f, len;
            if (eventName) {
                if (es && es.hasOwnProperty(eventName)) {
                    f = es[eventName];
                    for (i = 0, len = f.length; i < len; i++) {
                        Rs.EventManager.removeListener(el, eventName, f[i][0]);
                    }
                }
            } else {
                Rs.EventManager.removeAll(el);
            }
            if (recurse && el && el.childNodes) {
                for (i = 0, len = el.childNodes.length; i < len; i++) {
                    Rs.EventManager.purgeElement(el.childNodes[i], recurse, eventName);
                }
            }
        },

        _unload : function() {
            var el;
            for (el in Rs.elCache) {
                Rs.EventManager.removeAll(el);
            }
        },

        /**
         * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Can be
         * accessed shorthanded as Rs.onReady().
         * @param {Function} fn The method the event invokes.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
         * @param {boolean} options (optional) Options object as passed to {@link Rs.Element#addListener}. It is recommended that the options
         * <code>{single: true}</code> be used so that the handler is removed on first invocation.
         */
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.listeners = []; // clearListeners no longer compatible.  Force single: true?
            } else {
                if(!docReadyEvent) initDocReady();
                options = options || {};
                options.delay = options.delay || 1;
                docReadyEvent.addListener(fn, scope, options);
            }
        }
    };
    
    /**
     * Appends an event handler to an element.  Shorthand for {@link #addListener}.
     * @param {String/HTMLElement} el The html element or id to assign the event handler to
     * @param {String} eventName The name of the event to listen for.
     * @param {Function} handler The handler function the event invokes.
     * @param {Object} scope (optional) (<code>this</code> reference) in which the handler function executes. <b>Defaults to the Element</b>.
     * @param {Object} options (optional) An object containing standard {@link #addListener} options
     * @member Rs.EventManager
     * @method on
     */
    pub.on = pub.addListener;

    /**
     * Removes an event handler from an element.  Shorthand for {@link #removeListener}.
     * @param {String/HTMLElement} el The id or html element from which to remove the listener.
     * @param {String} eventName The name of the event.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #on} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @member Rs.EventManager
     * @method un
     */
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Rs.util.Event();
    return pub;
}();

/**
 * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Shorthand of {@link Ext.EventManager#onDocumentReady}.
 * @param {Function} fn The method the event invokes.
 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
 * @param {boolean} options (optional) Options object as passed to {@link Rs.Element#addListener}. It is recommended that the options
 * <code>{single: true}</code> be used so that the handler is removed on first invocation.
 * @member Rs
 * @method onReady
 */
Rs.onReady = Rs.EventManager.onDocumentReady;

/**
 * @class Rs.EventObject
 * Just as {@link Rs.Element} wraps around a native DOM node, Ext.EventObject
 * wraps the browser's native event-object normalizing cross-browser differences,
 * such as which mouse button is clicked, keys pressed, mechanisms to stop
 * event-propagation along with a method to prevent default actions from taking place.
 * <p>For example:</p>
 * <pre><code>
function handleClick(e, t){ // e is not a standard event object, it is a Rs.EventObject
    e.preventDefault();
    var target = e.getTarget(); // same as t (the target HTMLElement)
    ...
}
var myDiv = {@link Rs#get Rs.get}("myDiv");  // get reference to an {@link Rs.Element}
myDiv.on(         // 'on' is shorthand for addListener
    "click",      // perform an action on click of myDiv
    handleClick   // reference to the action handler
);
// other methods to do the same:
Rs.EventManager.on("myDiv", 'click', handleClick);
RS.EventManager.addListener("myDiv", 'click', handleClick);
 </code></pre>
 * @singleton
 */
Rs.EventObject = function(){
    var E = Rs.lib.Event,
        // safari keypress events for special keys return bad keycodes
        safariKeys = {
            3 : 13, // enter
            63234 : 37, // left
            63235 : 39, // right
            63232 : 38, // up
            63233 : 40, // down
            63276 : 33, // page up
            63277 : 34, // page down
            63272 : 46, // delete
            63273 : 36, // home
            63275 : 35  // end
        },
        // normalize button clicks
        btnMap = Rs.isIE ? {1:0,4:1,2:2} :
                (Rs.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Rs.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Rs.EventObjectImpl.prototype = {
           /** @private */
        setEvent : function(e){
            var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(e.type == 'click' && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey || false;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        /**
         * Stop the event (preventDefault and stopPropagation)
         */
        stopEvent : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Rs.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        /**
         * Prevents the browsers default handling of the event.
         */
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        /**
         * Cancels bubbling of the event.
         */
        stopPropagation : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Rs.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        /**
         * Gets the character code for the event.
         * @return {Number}
         */
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        /**
         * Returns a normalized keyCode for the event.
         * @return {Number} The key code
         */
        getKey : function(){
            return this.normalizeKey(this.keyCode || this.charCode)
        },

        // private
        normalizeKey: function(k){
            return Rs.isSafari ? (safariKeys[k] || k) : k;
        },

        /**
         * Gets the x coordinate of the event.
         * @return {Number}
         */
        getPageX : function(){
            return this.xy[0];
        },

        /**
         * Gets the y coordinate of the event.
         * @return {Number}
         */
        getPageY : function(){
            return this.xy[1];
        },

        /**
         * Gets the page coordinates of the event.
         * @return {Array} The xy values like [x, y]
         */
        getXY : function(){
            return this.xy;
        },

        /**
         * Gets the target for the event.
         * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
         * @param {Number/Mixed} maxDepth (optional) The max depth to
                search as a number or element (defaults to 10 || document.body)
         * @param {Boolean} returnEl (optional) True to return a RS.Element object instead of DOM node
         * @return {HTMLelement}
         */
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Rs.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Rs.get(this.target) : this.target);
        },

        /**
         * Gets the related target.
         * @return {HTMLElement}
         */
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        /**
         * Normalizes mouse wheel delta across browsers
         * @return {Number} The delta
         */
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta/120;
            }else if(e.detail){ /* Mozilla case. */
                delta = -e.detail/3;
            }
            return delta;
        },

        /**
         * Returns true if the target of this event is a child of el.  Unless the allowEl parameter is set, it will return false if if the target is el.
         * Example usage:<pre><code>
         // Handle click on any child of an element
         Rs.getBody().on('click', function(e){
             if(e.within('some-el')){
                 alert('Clicked on a child of some-el!');
             }
         });

         // Handle click directly on an element, ignoring clicks on child nodes
         Rs.getBody().on('click', function(e,t){
             if((t.id == 'some-el') && !e.within(t, true)){
                 alert('Clicked directly on some-el!');
             }
         });
         </code></pre>
          * @param {Mixed} el The id, DOM element or Rs.Element to check
          * @param {Boolean} related (optional) true to test if the related target is within el instead of the target
          * @param {Boolean} allowEl {optional} true to also check if the passed element is the target or related target
          * @return {Boolean}
          */
        within : function(el, related, allowEl){
            if(el){
                var t = this[related ? "getRelatedTarget" : "getTarget"]();
                return t && ((allowEl ? (t == Rs.getDom(el)) : false) || Rs.fly(el).contains(t));
            }
            return false;
        }
     };

    return new Rs.EventObjectImpl();
}();

/////////////////////////////////////////////////////////// 
///
///    Rs.EventManager more...
///
///////////////////////////////////////////////////////////

Rs.apply(Rs.EventManager, function(){
	   var resizeEvent,
	       resizeTask,
	       textEvent,
	       textSize,
	       D = Rs.lib.Dom,
	       propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
	       curWidth = 0,
	       curHeight = 0,
	       // note 1: IE fires ONLY the keydown event on specialkey autorepeat
	       // note 2: Safari < 3.1, Gecko (Mac/Linux) & Opera fire only the keypress event on specialkey autorepeat
	       // (research done by @Jan Wolter at http://unixpapa.com/js/key.html)
	       useKeydown = Rs.isWebKit ?
	                   Rs.num(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1]) >= 525 :
	                   !((Rs.isGecko && !Rs.isWindows) || Rs.isOpera);

	   return {
	       // private
	       doResizeEvent: function(){
	           var h = D.getViewHeight(),
	               w = D.getViewWidth();

	            //whacky problem in IE where the resize event will fire even though the w/h are the same.
	            if(curHeight != h || curWidth != w){
	               resizeEvent.fire(curWidth = w, curHeight = h);
	            }
	       },

	       /**
	        * Adds a listener to be notified when the browser window is resized and provides resize event buffering (100 milliseconds),
	        * passes new viewport width and height to handlers.
	        * @param {Function} fn      The handler function the window resize event invokes.
	        * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
	        * @param {boolean}  options Options object as passed to {@link Rs.Element#addListener}
	        */
	       onWindowResize : function(fn, scope, options){
	           if(!resizeEvent){
	               resizeEvent = new Rs.util.Event();
	               resizeTask = new Rs.util.DelayedTask(this.doResizeEvent);
	               Rs.EventManager.on(window, "resize", this.fireWindowResize, this);
	           }
	           resizeEvent.addListener(fn, scope, options);
	       },

	       // exposed only to allow manual firing
	       fireWindowResize : function(){
	           if(resizeEvent){
	               resizeTask.delay(100);
	           }
	       },

	       /**
	        * Adds a listener to be notified when the user changes the active text size. Handler gets called with 2 params, the old size and the new size.
	        * @param {Function} fn      The function the event invokes.
	        * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
	        * @param {boolean}  options Options object as passed to {@link Rs.Element#addListener}
	        */
	       onTextResize : function(fn, scope, options){
	           if(!textEvent){
	               textEvent = new Rs.util.Event();
	               var textEl = new Rs.Element(document.createElement('div'));
	               textEl.dom.className = 'x-text-resize';
	               textEl.dom.innerHTML = 'X';
	               textEl.appendTo(document.body);
	               textSize = textEl.dom.offsetHeight;
	               setInterval(function(){
	                   if(textEl.dom.offsetHeight != textSize){
	                       textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
	                   }
	               }, this.textResizeInterval);
	           }
	           textEvent.addListener(fn, scope, options);
	       },

	       /**
	        * Removes the passed window resize listener.
	        * @param {Function} fn        The method the event invokes
	        * @param {Object}   scope    The scope of handler
	        */
	       removeResizeListener : function(fn, scope){
	           if(resizeEvent){
	               resizeEvent.removeListener(fn, scope);
	           }
	       },

	       // private
	       fireResize : function(){
	           if(resizeEvent){
	               resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
	           }
	       },

	        /**
	        * The frequency, in milliseconds, to check for text resize events (defaults to 50)
	        */
	       textResizeInterval : 50,

	       /**
	        * Url used for onDocumentReady with using SSL (defaults to Rs.SSL_SECURE_URL)
	        */
	       ieDeferSrc : false,
	       
	       // protected, short accessor for useKeydown
	       getKeyEvent : function(){
	           return useKeydown ? 'keydown' : 'keypress';
	       },

	       // protected for use inside the framework
	       // detects whether we should use keydown or keypress based on the browser.
	       useKeydown: useKeydown
	   };
	}());

	Rs.EventManager.on = Rs.EventManager.addListener;

	Rs.apply(Rs.EventObjectImpl.prototype, {
	   /** Key constant @type Number */
	   BACKSPACE: 8,
	   /** Key constant @type Number */
	   TAB: 9,
	   /** Key constant @type Number */
	   NUM_CENTER: 12,
	   /** Key constant @type Number */
	   ENTER: 13,
	   /** Key constant @type Number */
	   RETURN: 13,
	   /** Key constant @type Number */
	   SHIFT: 16,
	   /** Key constant @type Number */
	   CTRL: 17,
	   CONTROL : 17, // legacy
	   /** Key constant @type Number */
	   ALT: 18,
	   /** Key constant @type Number */
	   PAUSE: 19,
	   /** Key constant @type Number */
	   CAPS_LOCK: 20,
	   /** Key constant @type Number */
	   ESC: 27,
	   /** Key constant @type Number */
	   SPACE: 32,
	   /** Key constant @type Number */
	   PAGE_UP: 33,
	   PAGEUP : 33, // legacy
	   /** Key constant @type Number */
	   PAGE_DOWN: 34,
	   PAGEDOWN : 34, // legacy
	   /** Key constant @type Number */
	   END: 35,
	   /** Key constant @type Number */
	   HOME: 36,
	   /** Key constant @type Number */
	   LEFT: 37,
	   /** Key constant @type Number */
	   UP: 38,
	   /** Key constant @type Number */
	   RIGHT: 39,
	   /** Key constant @type Number */
	   DOWN: 40,
	   /** Key constant @type Number */
	   PRINT_SCREEN: 44,
	   /** Key constant @type Number */
	   INSERT: 45,
	   /** Key constant @type Number */
	   DELETE: 46,
	   /** Key constant @type Number */
	   ZERO: 48,
	   /** Key constant @type Number */
	   ONE: 49,
	   /** Key constant @type Number */
	   TWO: 50,
	   /** Key constant @type Number */
	   THREE: 51,
	   /** Key constant @type Number */
	   FOUR: 52,
	   /** Key constant @type Number */
	   FIVE: 53,
	   /** Key constant @type Number */
	   SIX: 54,
	   /** Key constant @type Number */
	   SEVEN: 55,
	   /** Key constant @type Number */
	   EIGHT: 56,
	   /** Key constant @type Number */
	   NINE: 57,
	   /** Key constant @type Number */
	   A: 65,
	   /** Key constant @type Number */
	   B: 66,
	   /** Key constant @type Number */
	   C: 67,
	   /** Key constant @type Number */
	   D: 68,
	   /** Key constant @type Number */
	   E: 69,
	   /** Key constant @type Number */
	   F: 70,
	   /** Key constant @type Number */
	   G: 71,
	   /** Key constant @type Number */
	   H: 72,
	   /** Key constant @type Number */
	   I: 73,
	   /** Key constant @type Number */
	   J: 74,
	   /** Key constant @type Number */
	   K: 75,
	   /** Key constant @type Number */
	   L: 76,
	   /** Key constant @type Number */
	   M: 77,
	   /** Key constant @type Number */
	   N: 78,
	   /** Key constant @type Number */
	   O: 79,
	   /** Key constant @type Number */
	   P: 80,
	   /** Key constant @type Number */
	   Q: 81,
	   /** Key constant @type Number */
	   R: 82,
	   /** Key constant @type Number */
	   S: 83,
	   /** Key constant @type Number */
	   T: 84,
	   /** Key constant @type Number */
	   U: 85,
	   /** Key constant @type Number */
	   V: 86,
	   /** Key constant @type Number */
	   W: 87,
	   /** Key constant @type Number */
	   X: 88,
	   /** Key constant @type Number */
	   Y: 89,
	   /** Key constant @type Number */
	   Z: 90,
	   /** Key constant @type Number */
	   CONTEXT_MENU: 93,
	   /** Key constant @type Number */
	   NUM_ZERO: 96,
	   /** Key constant @type Number */
	   NUM_ONE: 97,
	   /** Key constant @type Number */
	   NUM_TWO: 98,
	   /** Key constant @type Number */
	   NUM_THREE: 99,
	   /** Key constant @type Number */
	   NUM_FOUR: 100,
	   /** Key constant @type Number */
	   NUM_FIVE: 101,
	   /** Key constant @type Number */
	   NUM_SIX: 102,
	   /** Key constant @type Number */
	   NUM_SEVEN: 103,
	   /** Key constant @type Number */
	   NUM_EIGHT: 104,
	   /** Key constant @type Number */
	   NUM_NINE: 105,
	   /** Key constant @type Number */
	   NUM_MULTIPLY: 106,
	   /** Key constant @type Number */
	   NUM_PLUS: 107,
	   /** Key constant @type Number */
	   NUM_MINUS: 109,
	   /** Key constant @type Number */
	   NUM_PERIOD: 110,
	   /** Key constant @type Number */
	   NUM_DIVISION: 111,
	   /** Key constant @type Number */
	   F1: 112,
	   /** Key constant @type Number */
	   F2: 113,
	   /** Key constant @type Number */
	   F3: 114,
	   /** Key constant @type Number */
	   F4: 115,
	   /** Key constant @type Number */
	   F5: 116,
	   /** Key constant @type Number */
	   F6: 117,
	   /** Key constant @type Number */
	   F7: 118,
	   /** Key constant @type Number */
	   F8: 119,
	   /** Key constant @type Number */
	   F9: 120,
	   /** Key constant @type Number */
	   F10: 121,
	   /** Key constant @type Number */
	   F11: 122,
	   /** Key constant @type Number */
	   F12: 123,

	   /** @private */
	   isNavKeyPress : function(){
	       var me = this,
	           k = this.normalizeKey(me.keyCode);
	       return (k >= 33 && k <= 40) ||  // Page Up/Down, End, Home, Left, Up, Right, Down
	       k == me.RETURN ||
	       k == me.TAB ||
	       k == me.ESC;
	   },

	   isSpecialKey : function(){
	       var k = this.normalizeKey(this.keyCode);
	       return (this.type == 'keypress' && this.ctrlKey) ||
	       this.isNavKeyPress() ||
	       (k == this.BACKSPACE) || // Backspace
	       (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
	       (k >= 44 && k <= 46);   // Print Screen, Insert, Delete
	   },

	   getPoint : function(){
	       return new Rs.lib.Point(this.xy[0], this.xy[1]);
	   },

	   /**
	    * Returns true if the control, meta, shift or alt key was pressed during this event.
	    * @return {Boolean}
	    */
	   hasModifier : function(){
	       return ((this.ctrlKey || this.altKey) || this.shiftKey);
	   }
	});
