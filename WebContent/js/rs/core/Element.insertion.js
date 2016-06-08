/**
 * @class Rs.Element
 */
Rs.Element.addMethods(
function() {
	var GETDOM = Rs.getDom,
		GET = Rs.get,
		DH = Rs.DomHelper;
	
	return {
	    /**
	     * Appends the passed element(s) to this element
	     * @param {String/HTMLElement/Array/Element/CompositeElement} el
	     * @return {Rs.Element} this
	     */
	    appendChild: function(el){        
	        return GET(el).appendTo(this);        
	    },
	
	    /**
	     * Appends this element to the passed element
	     * @param {Mixed} el The new parent element
	     * @return {Rs.Element} this
	     */
	    appendTo: function(el){        
	        GETDOM(el).appendChild(this.dom);        
	        return this;
	    },
	
	    /**
	     * Inserts this element before the passed element in the DOM
	     * @param {Mixed} el The element before which this element will be inserted
	     * @return {Rs.Element} this
	     */
	    insertBefore: function(el){  	          
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
	        return this;
	    },
	
	    /**
	     * Inserts this element after the passed element in the DOM
	     * @param {Mixed} el The element to insert after
	     * @return {Rs.Element} this
	     */
	    insertAfter: function(el){
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el.nextSibling);
	        return this;
	    },
	
	    /**
	     * Inserts (or creates) an element (or DomHelper config) as the first child of this element
	     * @param {Mixed/Object} el The id or element to insert or a DomHelper config to create and insert
	     * @return {Rs.Element} The new child
	     */
	    insertFirst: function(el, returnDom){
            el = el || {};
            if(el.nodeType || el.dom || typeof el == 'string'){ // element
                el = GETDOM(el);
                this.dom.insertBefore(el, this.dom.firstChild);
                return !returnDom ? GET(el) : el;
            }else{ // dh config
                return this.createChild(el, this.dom.firstChild, returnDom);
            }
        },
	
	    /**
	     * Replaces the passed element with this element
	     * @param {Mixed} el The element to replace
	     * @return {Rs.Element} this
	     */
	    replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },
	
	    /**
	     * Replaces this element with the passed element
	     * @param {Mixed/Object} el The new element or a DomHelper config of an element to create
	     * @return {Rs.Element} this
	     */
	    replaceWith: function(el){
		    var me = this;
                
            if(el.nodeType || el.dom || typeof el == 'string'){
                el = GETDOM(el);
                me.dom.parentNode.insertBefore(el, me.dom);
            }else{
                el = DH.insertBefore(me.dom, el);
            }
	        
	        delete Rs.elCache[me.id];
	        Rs.removeNode(me.dom);      
	        me.id = Rs.id(me.dom = el);
	        Rs.Element.addToCache(me.isFlyweight ? new Rs.Element(me.dom) : me);     
            return me;
	    },
	    
		/**
		 * Creates the passed DomHelper config and appends it to this element or optionally inserts it before the passed child element.
		 * @param {Object} config DomHelper element config object.  If no tag is specified (e.g., {tag:'input'}) then a div will be
		 * automatically generated with the specified attributes.
		 * @param {HTMLElement} insertBefore (optional) a child element of this element
		 * @param {Boolean} returnDom (optional) true to return the dom node instead of creating an Element
		 * @return {Rs.Element} The new child element
		 */
		createChild: function(config, insertBefore, returnDom){
		    config = config || {tag:'div'};
		    return insertBefore ? 
		    	   DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},
		
		/**
		 * Creates and wraps this element with another element
		 * @param {Object} config (optional) DomHelper element config object for the wrapper element or null for an empty div
		 * @param {Boolean} returnDom (optional) True to return the raw DOM element instead of Rs.Element
		 * @return {HTMLElement/Element} The newly created wrapper element
		 */
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},
		
		/**
		 * Inserts an html fragment into this element
		 * @param {String} where Where to insert the html in relation to this element - beforeBegin, afterBegin, beforeEnd, afterEnd.
		 * @param {String} html The HTML fragment
		 * @param {Boolean} returnEl (optional) True to return an Rs.Element (defaults to false)
		 * @return {HTMLElement/Rs.Element} The inserted node (or nearest related if more than 1 inserted)
		 */
		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Rs.get(el) : el;
		}
	}
}());