/**
 * @class Rs.CompositeElementLite
 * <p>This class encapsulates a <i>collection</i> of DOM elements, providing methods to filter
 * members, or to perform collective actions upon the whole set.</p>
 * <p>Although they are not listed, this class supports all of the methods of {@link Rs.Element} and
 * {@link Rs.Fx}. The methods from these classes will be performed on all the elements in this collection.</p>
 * Example:<pre><code>
var els = Rs.select("#some-el div.some-class");
// or select directly from an existing element
var el = Rs.get('some-el');
el.select('div.some-class');

els.setWidth(100); // all elements become 100 width
els.hide(true); // all elements fade out and hide
// or
els.setWidth(100).hide(true);
</code>
 */
Rs.CompositeElementLite = function(els, root){
    /**
     * <p>The Array of DOM elements which this CompositeElement encapsulates. Read-only.</p>
     * <p>This will not <i>usually</i> be accessed in developers' code, but developers wishing
     * to augment the capabilities of the CompositeElementLite class may use it when adding
     * methods to the class.</p>
     * <p>For example to add the <code>nextAll</code> method to the class to <b>add</b> all
     * following siblings of selected elements, the code would be</p><code><pre>
Rs.override(Rs.CompositeElementLite, {
    nextAll: function() {
        var els = this.elements, i, l = els.length, n, r = [], ri = -1;

//      Loop through all elements in this Composite, accumulating
//      an Array of all siblings.
        for (i = 0; i < l; i++) {
            for (n = els[i].nextSibling; n; n = n.nextSibling) {
                r[++ri] = n;
            }
        }

//      Add all found siblings to this Composite
        return this.add(r);
    }
});</pre></code>
     * @type Array
     * @property elements
     */
    this.elements = [];
    this.add(els, root);
    this.el = new Rs.Element.Flyweight();
};

Rs.CompositeElementLite.prototype = {
    isComposite: true,    
    
    // private
    getElement : function(el){
        // Set the shared flyweight dom property to the current element
        var e = this.el;
        e.dom = el;
        e.id = el.id;
        return e;
    },
    
    // private
    transformElement : function(el){
        return Rs.getDom(el);
    },
    
    /**
     * Returns the number of elements in this Composite.
     * @return Number
     */
    getCount : function(){
        return this.elements.length;
    },    
    /**
     * Adds elements to this Composite object.
     * @param {Mixed} els Either an Array of DOM elements to add, or another Composite object who's elements should be added.
     * @return {CompositeElement} This Composite object.
     */
    add : function(els, root){
        var me = this,
            elements = me.elements;
        if(!els){
            return this;
        }
        if(Rs.isString(els)){
            els = Rs.Element.selectorFunction(els, root);
        }else if(els.isComposite){
            els = els.elements;
        }else if(!Rs.isIterable(els)){
            els = [els];
        }
        
        for(var i = 0, len = els.length; i < len; ++i){
            elements.push(me.transformElement(els[i]));
        }
        return me;
    },
    
    invoke : function(fn, args){
        var me = this,
            els = me.elements,
            len = els.length, 
            e, 
            i;
            
        for(i = 0; i < len; i++) {
            e = els[i];
            if(e){
                Rs.Element.prototype[fn].apply(me.getElement(e), args);
            }
        }
        return me;
    },
    /**
     * Returns a flyweight Element of the dom element object at the specified index
     * @param {Number} index
     * @return {Rs.Element}
     */
    item : function(index){
        var me = this,
            el = me.elements[index],
            out = null;

        if(el){
            out = me.getElement(el);
        }
        return out;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        var els = this.elements,
            len = els.length,
            i, e;
        
        for(i = 0; i<len; i++) {
            e = els[i];
            if(e) {
                Rs.EventManager.on(e, eventName, handler, scope || e, opt);
            }
        }
        return this;
    },
    /**
     * <p>Calls the passed function for each element in this composite.</p>
     * @param {Function} fn The function to call. The function is passed the following parameters:<ul>
     * <li><b>el</b> : Element<div class="sub-desc">The current Element in the iteration.
     * <b>This is the flyweight (shared) Rs.Element instance, so if you require a
     * a reference to the dom node, use el.dom.</b></div></li>
     * <li><b>c</b> : Composite<div class="sub-desc">This Composite object.</div></li>
     * <li><b>idx</b> : Number<div class="sub-desc">The zero-based index in the iteration.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<i>this</i> reference) in which the function is executed. (defaults to the Element)
     * @return {CompositeElement} this
     */
    each : function(fn, scope){       
        var me = this,
            els = me.elements,
            len = els.length,
            i, e;
        
        for(i = 0; i<len; i++) {
            e = els[i];
            if(e){
                e = this.getElement(e);
                if(fn.call(scope || e, e, me, i)){
                    break;
                }
            }
        }
        return me;
    },
    
    /**
    * Clears this Composite and adds the elements passed.
    * @param {Mixed} els Either an array of DOM elements, or another Composite from which to fill this Composite.
    * @return {CompositeElement} this
    */
    fill : function(els){
        var me = this;
        me.elements = [];
        me.add(els);
        return me;
    },
    
    /**
     * Filters this composite to only elements that match the passed selector.
     * @param {String/Function} selector A string CSS selector or a comparison function.
     * The comparison function will be called with the following arguments:<ul>
     * <li><code>el</code> : Rs.Element<div class="sub-desc">The current DOM element.</div></li>
     * <li><code>index</code> : Number<div class="sub-desc">The current index within the collection.</div></li>
     * </ul>
     * @return {CompositeElement} this
     */
    filter : function(selector){
        var els = [],
            me = this,
            elements = me.elements,
            fn = Rs.isFunction(selector) ? selector
                : function(el){
                    return el.is(selector);
                };
                
        
        me.each(function(el, self, i){
            if(fn(el, i) !== false){
                els[els.length] = me.transformElement(el);
            }
        });
        me.elements = els;
        return me;
    },
    
    /**
     * Find the index of the passed element within the composite collection.
     * @param el {Mixed} The id of an element, or an Rs.Element, or an HtmlElement to find within the composite collection.
     * @return Number The index of the passed Rs.Element in the composite collection, or -1 if not found.
     */
    indexOf : function(el){
        return this.elements.indexOf(this.transformElement(el));
    },
    
    /**
    * Replaces the specified element with the passed element.
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * to replace.
    * @param {Mixed} replacement The id of an element or the Element itself.
    * @param {Boolean} domReplace (Optional) True to remove and replace the element in the document too.
    * @return {CompositeElement} this
    */    
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
            d;
        if(index > -1){
            replacement = Rs.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Rs.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },
    
    /**
     * Removes all elements.
     */
    clear : function(){
        this.elements = [];
    }
};

Rs.CompositeElementLite.prototype.on = Rs.CompositeElementLite.prototype.addListener;

(function(){
var fnName,
    ElProto = Rs.Element.prototype,
    CelProto = Rs.CompositeElementLite.prototype;
    
for(fnName in ElProto){
    if(Rs.isFunction(ElProto[fnName])){
        (function(fnName){ 
            CelProto[fnName] = CelProto[fnName] || function(){
                return this.invoke(fnName, arguments);
            };
        }).call(CelProto, fnName);
        
    }
}
})();

if(Rs.DomQuery){
    Rs.Element.selectorFunction = Rs.DomQuery.select;
} 

/**
 * Selects elements based on the passed CSS selector to enable {@link Rs.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Rs.CompositeElement CompositeElement} or
 * {@link Rs.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Rs.Element
 * @method select
 */
Rs.Element.select = function(selector, root){
    var els;
    if(typeof selector == "string"){
        els = Rs.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Rs.CompositeElementLite(els);
};
/**
 * Selects elements based on the passed CSS selector to enable {@link Rs.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Rs.CompositeElement CompositeElement} or
 * {@link Rs.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Rs
 * @method select
 */
Rs.select = Rs.Element.select;