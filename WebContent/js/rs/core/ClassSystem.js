(function() {

    var global = this,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        i;
    
    for (i in enumerablesTest) {
        enumerables = null;
    }
    
    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }
    
    if (typeof Rs === 'undefined') {
        global.Rs = {};
    }
    
    Rs.global = global;
    
    /**
     * @property Rs.enumerables
     * An array containing extra enumerables for old browsers
     * @type Array
     */
    Rs.enumerables = enumerables;

    /*
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for `name` and `value`.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * - `name` and `value` as 2 arguments
     * - one single object argument with multiple key - value pairs
     */
    function flexSetter(fn) {
        return function(a, b) {
            var k, i;
            if (a === null) {
                return this;
            }
            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }
                if (Rs.enumerables) {
                    for (i = Rs.enumerables.length; i--;) {
                        k = Rs.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }
            return this;
        };
    };
    
    /*
     * Merges any number of objects recursively without referencing them or their children.
     */
    function mergeObj(source, key, value) {
        if (typeof key === 'string') {
            if (value && value.constructor === Object) {
                if (source[key] && source[key].constructor === Object) {
                    mergeObj(source[key], value);
                } else {
                    source[key] =  (function(array) {
                        return slice.call(array);
                    })(value); //Ext.clone(value);
                }
            } else {
                source[key] = value;
            }
            return source;
        }
        var i = 1, ln = arguments.length, object, property;
        for (; i < ln; i++) {
            object = arguments[i];
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    mergeObj(source, property, object[property]);
                }
            }
        }
        return source;
    };
    
    /*
     * Capitalize the given string 
     */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    };
    
    /*
     * Converts any iterable (numeric indices and a length property) into a true array.
     */
    function toArray(iterable, start, end){
        if (!iterable || !iterable.length) {
            return [];
        }
        if (typeof iterable === 'string') {
            iterable = iterable.split('');
        }
        if (supportsSliceOnNodeList) {
            return slice.call(iterable, start || 0, end || iterable.length);
        }
        var array = [],
            i;
        start = start || 0;
        end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;
        for (i = start; i < end; i++) {
            array.push(iterable[i]);
        }
        return array;
    };
    
    /*
     * Converts a value to an array if it's not already an array; returns:
     * - An empty array if given value is `undefined` or `null`
     * - Itself if given value is already an array
     * - An array copy if given value is {@link Rs#isIterable iterable} (arguments, NodeList and alike)
     * - An array with one item which is the given value, otherwise
     */
    function fromArray(value, newReference) {
        if (value === undefined || value === null) {
            return [];
        }
        if (Rs.isArray(value)) {
            return (newReference) ? slice.call(value) : value;
        }
        if (value && value.length !== undefined && typeof value !== 'string') {
        	return toArray(value);
        }
        return [value];
	};
        
    /*
     * Get the index of the provided `item` in the given `array`, a supplement for the 
     * missing arrayPrototype.indexOf in Internet Explorer.
     */
	function indexOfArray(array, item, from) {
        if (supportsIndexOf) {
            return array.indexOf(item, from);
        }
        var i, length = array.length;
        for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    };
    
    /*
     * Replaces items in an array. This is equivalent to the splice method of Array, but
     * works around bugs in IE8's splice method. The signature is exactly the same as the
     * splice method except that the array is the first argument. All arguments following
     * removeCount are inserted in the array at index.
     */
    function splice(array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    };
        
    /*
     * Iterates through an object and invokes the given callback function for each iteration.
     * The iteration can be stopped by returning `false` in the callback function.
     */
    function eachObj(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    };
        
    /*
     * Adds behavior to an existing method that is executed before the
     * original behavior of the function.
     */
    function interceptBefore(object, methodName, fn) {
        var method = object[methodName] || Rs.emptyFn;
        return object[methodName] = function() {
            var ret = fn.apply(this, arguments);
            method.apply(this, arguments);

            return ret;
        };
    };
        
   
    /*
     * Create an alias to the provided method property with name `methodName` of `object`.
     * Note that the execution scope will still be bound to the provided `object` itself.
     */
    function aliasMethod(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    };
    
    /*
     * Returns true if this element is an ancestor of the passed element
     */
    function contains(array, item) {
        if (supportsIndexOf) {
            return array.indexOf(item) !== -1;
        }
        var i, ln;
        for (i = 0, ln = array.length; i < ln; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    };

    /*
     * Push an item into the array only if the array doesn't contain it yet
     */
    function includeArray(array, item) {
        if (!contains(array, item)) {
            array.push(item);
        }
    };
    
    /*
     * 	@class Rs.Base
     * 	The root of all classes created with {@link Rs#define}.
     * 	Rs.Base is the building block of all Rs classes. All classes in Rs inherit from Rs.Base.
     * 	All prototype and static members of this class are inherited by all other classes.
     */
    var Base = Rs.Base = function() {};

    Base.prototype = {

        $className : 'Rs.Base',

        $class : Base,

        /**
         * Get the reference to the current class from which this object was instantiated. Unlike {@link Rs.Base#statics},
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link Rs.Base#statics}
         * for a detailed comparison
         *
         *     Rs.define('My.Cat', {
         *         statics: {
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             alert(this.self.speciesName); / dependent on 'this'
         *
         *             return this;
         *         },
         *
         *         clone: function() {
         *             return new this.self();
         *         }
         *     });
         *
         *
         *     Rs.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *         statics: {
         *             speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         }
         *     });
         *
         *     var cat = new My.Cat();                     // alerts 'Cat'
         *     var snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Rs.getClassName(clone));             // alerts 'My.SnowLeopard'
         *
         * @type Rs.Class
         * @protected
         */
        self : Base,

        // Default constructor, simply returns `this`
        constructor : function() {
            return this;
        },

        //<feature classSystem.config>
        /**
         * Initialize configuration for this class. a typical example:
         *
         *     Rs.define('My.awesome.Class', {
         *         // The default config
         *         config: {
         *             name: 'Awesome',
         *             isAwesome: true
         *         },
         *
         *         constructor: function(config) {
         *             this.initConfig(config);
         *
         *             return this;
         *         }
         *     });
         *
         *     var awesome = new My.awesome.Class({
         *         name: 'Super Awesome'
         *     });
         *
         *     alert(awesome.getName()); // 'Super Awesome'
         *
         * @protected
         * @param {Object} config
         * @return {Object} mixins The mixin prototypes as key - value pairs
         */
        initConfig : function(config) {
            if (!this.$configInited) {
                this.config = mergeObj({}, this.config || {}, config || {});
                this.applyConfig(this.config);
                this.$configInited = true;
            }
            return this;
        },

        /**
         * @private
         */
        setConfig : function(config){
            this.applyConfig(config || {});
            return this;
        },
        
        /**
         * 初始化配置
         * @private
         */
        applyConfig : flexSetter(function(name, value) {
            var setter = 'set' + capitalize(name);
            if (typeof this[setter] === 'function') {
                this[setter].call(this, value);
            }
            return this;
        }),
        
        /**
         * Call the parent's overridden method. For example:
         *
         *     Rs.define('My.own.A', {
         *         constructor: function(test) {
         *             alert(test);
         *         }
         *     });
         *
         *     Rs.define('My.own.B', {
         *         extend: 'My.own.A',
         *
         *         constructor: function(test) {
         *             alert(test);
         *
         *             this.callParent([test + 1]);
         *         }
         *     });
         *
         *     Rs.define('My.own.C', {
         *         extend: 'My.own.B',
         *
         *         constructor: function() {
         *             alert("Going to call parent's overriden constructor...");
         *
         *             this.callParent(arguments);
         *         }
         *     });
         *
         *     var a = new My.own.A(1); // alerts '1'
         *     var b = new My.own.B(1); // alerts '1', then alerts '2'
         *     var c = new My.own.C(2); // alerts "Going to call parent's overriden constructor..."
         *                              // alerts '2', then alerts '3'
         *
         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callParent(arguments)`
         * @return {Object} Returns the result from the superclass' method
         */
        callParent : function(args) {
            var method = this.callParent.caller, 
                parentClass, 
                methodName;
            if (!method.$owner) {
                if (!method.caller) {
                    Rs.error("Attempting to call a protected method from the public scope, which is not allowed");
                }
                method = method.caller;
            }
            parentClass = method.$owner.superclass;
            methodName = method.$name;
            if (!(methodName in parentClass)) {
                Rs.error("this.callParent() was called but there's no such method (" + methodName
                	   + ") found in the parent class (" + (Rs.getClassName(parentClass) || 'Object'));
            }
            return parentClass[methodName].apply(this, args || []);
        },
        
        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Rs.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during run-time
         *
         *     Rs.define('My.Cat', {
         *         statics: {
         *             totalCreated: 0,
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             var statics = this.statics();
         *
         *             alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
         *                                             // equivalent to: My.Cat.speciesName
         *
         *             alert(this.self.speciesName);   // dependent on 'this'
         *
         *             statics.totalCreated++;
         *
         *             return this;
         *         },
         *
         *         clone: function() {
         *             var cloned = new this.self;                      // dependent on 'this'
         *
         *             cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName
         *
         *             return cloned;
         *         }
         *     });
         *
         *
         *     Rs.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *
         *         statics: {
         *             speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         },
         *
         *         constructor: function() {
         *             this.callParent();
         *         }
         *     });
         *
         *     var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'
         *
         *     var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Rs.getClassName(clone));         // alerts 'My.SnowLeopard'
         *     alert(clone.groupName);                 // alerts 'Cat'
         *
         *     alert(My.Cat.totalCreated);             // alerts 3
         *
         * @protected
         * @return {Rs.Class}
         */
        statics : function(){
            var method = this.statics.caller, self = this.self;
            if (!method) {
                return self;
            }
            return method.$owner;
        },

        /**
         * Call the original method that was previously overridden with {@link Rs.Base#override}
         *
         *     Rs.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *
         *             return this;
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callOverridden();
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * @return {Object} Returns the result after calling the overridden method
         * @protected
         */
        callOverridden : function(args) {
            var method = this.callOverridden.caller;
            if (!method.$owner) {
                Rs.error("Attempting to call a protected method from the public scope, which is not allowed");
            }
            if (!method.$previous) {
                Rs.error("this.callOverridden was called in '" + method.$name
                       + "' but this method has never been overridden");
            }
            return method.$previous.apply(this, args || []);
        },

        destroy : function() {}
    };

    // These static properties will be copied to every newly created class with {@link Rs#define}
    Rs.apply(Rs.Base, {
	    
    	/**
         * Create a new instance of this Class.
         *
         *     Rs.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.create({
         *         someConfig: true
         *     });
         *
         * All parameters are passed to the constructor of the class.
         *
         * @return {Object} the created instance.
         * @static
         * @inheritable
         */
        create : function() {
            return Rs.create.apply(Rs, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        /**
         * @private
         * @inheritable
         */
        own : function(name, value) {
            if (typeof value == 'function') {
                this.ownMethod(name, value);
            } else {
                this.prototype[name] = value;
            }
        },

        /**
         * @private
         * @inheritable
         */
        ownMethod : function(name, fn) {
            var originalFn;
            if (typeof fn.$owner !== 'undefined' && fn !== Rs.emptyFn) {
                originalFn = fn;
                fn = function() {
                    return originalFn.apply(this, arguments);
                };
            }
            var className;
            className = Rs.getClassName(this);
            if (className) {
                fn.displayName = className + '#' + name;
            }
            fn.$owner = this;
            fn.$name = name;
            this.prototype[name] = fn;
        },
        
        /**
         * Add / override static properties of this class.
         *
         *     Rs.define('My.cool.Class', {
         *         ...
         *     });
         *
         *     My.cool.Class.addStatics({
         *         someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
         *         method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
         *         method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
         *     });
         *
         * @param {Object} members
         * @return {Rs.Base} this
         * @static
         * @inheritable
         */
        addStatics : function(members) {
            for ( var name in members) {
                if (members.hasOwnProperty(name)) {
                    this[name] = members[name];
                }
            }
            return this;
        },
        
        /**
         * @private
         * @param {Object} members
         */
        addInheritableStatics : function(members) {
            var inheritableStatics,
                hasInheritableStatics, 
                prototype = this.prototype, 
                name, member;
            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;
            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }
            var className = Rs.getClassName(this);
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.displayName = className + '.' + name;
                    }
                    this[name] = member;
                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }
            return this;
        },

        /**
         * Add methods / properties to the prototype of this class.
         *
         *     Rs.define('My.awesome.Cat', {
         *         constructor: function() {
         *             ...
         *         }
         *     });
         *
         *      My.awesome.Cat.implement({
         *          meow: function() {
         *             alert('Meowww...');
         *          }
         *      });
         *
         *      var kitty = new My.awesome.Cat;
         *      kitty.meow();
         *
         * @param {Object} members
         * @static
         * @inheritable
         */
        implement : function(members) {
            var prototype = this.prototype, 
                enumerables = Rs.enumerables, 
                name, i, member;
            var className = Rs.getClassName(this);
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member === 'function') {
                        member.$owner = this;
                        member.$name = name;
                        if (className) {
                            member.displayName = className + '#' + name;
                        }
                    }
                    prototype[name] = member;
                }
            }
            if (enumerables) {
                for (i = enumerables.length; i--;) {
                    name = enumerables[i];
                    if (members.hasOwnProperty(name)) {
                        member = members[name];
                        member.$owner = this;
                        member.$name = name;
                        prototype[name] = member;
                    }
                }
            }
        },
        
        /**
         * Borrow another class' members to the prototype of this class.
         *
         *     Rs.define('Bank', {
         *         money: '$$$',
         *         printMoney: function() {
         *             alert('$$$$$$$');
         *         }
         *     });
         *
         *     Rs.define('Thief', {
         *         ...
         *     });
         *
         *     Thief.borrow(Bank, ['money', 'printMoney']);
         *
         *     var steve = new Thief();
         *
         *     alert(steve.money); // alerts '$$$'
         *     steve.printMoney(); // alerts '$$$$$$$'
         *
         * @param {Rs.Base} fromClass The class to borrow members from
         * @param {String/String[]} members The names of the members to borrow
         * @return {rs.Base} this
         * @static
         * @inheritable
         */
        borrow : function(fromClass, members) {
            var fromPrototype = fromClass.prototype, 
                i, ln, member;
            members = fromArray(members);
            for (i = 0, ln = members.length; i < ln; i++) {
                member = members[i];
                this.own(member, fromPrototype[member]);
            }
            return this;
        },
        
        /**
         * Override prototype members of this class. Overridden methods can be invoked via
         * {@link Rs.Base#callOverridden}
         *
         *     Rs.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *
         *             return this;
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callOverridden();
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * @param {Object} members
         * @return {Rs.Base} this
         * @static
         * @inheritable
         */
        override : function(members) {
            var prototype = this.prototype, 
                enumerables = Rs.enumerables, 
                name, i, member, previous;
            if (arguments.length === 2) {
                name = members;
                member = arguments[1];
                if (typeof member == 'function') {
                    if (typeof prototype[name] == 'function'){
                        previous = prototype[name];
                        member.$previous = previous;
                    }
                    this.ownMethod(name, member);
                } else {
                    prototype[name] = member;
                }
                return this;
            }
            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member === 'function') {
                        if (typeof prototype[name] === 'function') {
                            previous = prototype[name];
                            member.$previous = previous;
                        }
                        this.ownMethod(name, member);
                    } else {
                        prototype[name] = member;
                    }
                }
            }
            if (enumerables) {
                for (i = enumerables.length; i--;) {
                    name = enumerables[i];
                    if (members.hasOwnProperty(name)) {
                        if (typeof prototype[name] !== 'undefined') {
                            previous = prototype[name];
                            members[name].$previous = previous;
                        }
                        this.ownMethod(name, members[name]);
                    }
                }
            }
            return this;
        },

        //<feature classSystem.mixins>
        /**
         * Used internally by the mixins pre-processor
         * @private
         * @inheritable
         */
        mixin : function(name, cls) {
            var mixin = cls.prototype, 
                my = this.prototype, key, fn;
            for (key in mixin) {
                if (mixin.hasOwnProperty(key)) {
                    if (typeof my[key] === 'undefined'
                            && key !== 'mixins'
                            && key !== 'mixinId') {
                        if (typeof mixin[key] === 'function') {
                            fn = mixin[key];
                            if (typeof fn.$owner === 'undefined') {
                                this.ownMethod(key, fn);
                            } else {
                                my[key] = fn;
                            }
                        } else {
                            my[key] = mixin[key];
                        }
                    }
                    else if (key === 'config' && my.config && mixin.config) {
                        mergeObj(my.config, mixin.config);
                    }
                }
            }
            if (typeof mixin.onClassMixedIn !== 'undefined') {
                mixin.onClassMixedIn.call(cls, this);
            }
            if (!my.hasOwnProperty('mixins')) {
                if ('mixins' in my) {
                    my.mixins = mergeObj( {}, my.mixins);
                } else {
                    my.mixins = {};
                }
            }
            my.mixins[name] = mixin;
        },
        // </feature>

        /**
         * Get the current class' name in string format.
         *
         *     Rs.define('My.cool.Class', {
         *         constructor: function() {
         *             alert(this.self.getName()); // alerts 'My.cool.Class'
         *         }
         *     });
         *
         *     My.cool.Class.getName(); // 'My.cool.Class'
         *
         * @return {String} className
         * @static
         * @inheritable
         */
        getName : function() {
            return Rs.getClassName(this);
        },

        /**
         * Create aliases for existing prototype methods. Example:
         *
         *     Rs.define('My.cool.Class', {
         *         method1: function() { ... },
         *         method2: function() { ... }
         *     });
         *
         *     var test = new My.cool.Class();
         *
         *     My.cool.Class.createAlias({
         *         method3: 'method1',
         *         method4: 'method2'
         *     });
         *
         *     test.method3(); // test.method1()
         *
         *     My.cool.Class.createAlias('method5', 'method3');
         *
         *     test.method5(); // test.method3() -> test.method1()
         *
         * @param {String/Object} alias The new method name, or an object to set multiple aliases
         * @param {String/Object} origin The original method name
         * @static
         * @inheritable
         * @method
         */
        createAlias : flexSetter(function(alias, origin) {
            this.prototype[alias] = function() {
                return this[origin].apply(this, arguments);
            };
        })
    });
    
    /**
     * @class Rs.Class
     */
    var Class,
        Base = Rs.Base,
        baseStaticProperties = [],
        baseStaticProperty;
    
    for (baseStaticProperty in Base) {
        if (Base.hasOwnProperty(baseStaticProperty)) {
            baseStaticProperties.push(baseStaticProperty);
        }
    }
    
    /**
     * @method constructor
     * Creates new class.
     * @param {Object} classData An object represent the properties of this class
     * @param {Function} createdFn (Optional) The callback function to be 
     * executed when this class is fully created.
     * Note that the creation process can be asynchronous depending on the pre-processors used.
     * @return {Rs.Base} The newly created class
     */
    Rs.Class = Class = function(newClass, classData, onClassCreated) {
        if (typeof newClass != 'function') {
            onClassCreated = classData;
            classData = newClass;
            newClass = function() {
                return this.constructor.apply(this, arguments);
            };
        }
        if (!classData) {
            classData = {};
        }
        var preprocessorStack = classData.preprocessors || Class.getDefaultPreprocessors(),
            registeredPreprocessors = Class.getPreprocessors(),
            index = 0,
            preprocessors = [],
            preprocessor, staticPropertyName, process, i, j, ln;
        for (i = 0, ln = baseStaticProperties.length; i < ln; i++) {
            staticPropertyName = baseStaticProperties[i];
            newClass[staticPropertyName] = Base[staticPropertyName];
        }
        delete classData.preprocessors;
        for (j = 0, ln = preprocessorStack.length; j < ln; j++) {
            preprocessor = preprocessorStack[j];
            if (typeof preprocessor == 'string') {
                preprocessor = registeredPreprocessors[preprocessor];
                if (!preprocessor.always) {
                    if (classData.hasOwnProperty(preprocessor.name)) {
                        preprocessors.push(preprocessor.fn);
                    }
                }
                else {
                    preprocessors.push(preprocessor.fn);
                }
            }
            else {
                preprocessors.push(preprocessor);
            }
        }
        classData.onClassCreated = onClassCreated || Rs.emptyFn;
        classData.onBeforeClassCreated = function(cls, data) {
            onClassCreated = data.onClassCreated;
            delete data.onBeforeClassCreated;
            delete data.onClassCreated;
            cls.implement(data);
            onClassCreated.call(cls, cls);
        };
        process = function(cls, data) {
            preprocessor = preprocessors[index++];
            if (!preprocessor) {
                data.onBeforeClassCreated.apply(this, arguments);
                return;
            }
            if (preprocessor.call(this, cls, data, process) !== false) {
                process.apply(this, arguments);
            }
        };
        process.call(Class, newClass, classData);
        return newClass;
    };
    
    
    
    Rs.apply(Class, {
    
        /** @private */
        preprocessors: {},
    
        /**
         * Register a new pre-processor to be used during the class creation process
         * @member Rs.Class
         * @param {String} name The pre-processor's name
         * @param {Function} fn The callback function to be executed. Typical format:
         *
         *     function(cls, data, fn) {
         *         // Your code here
         *
         *         // Execute this when the processing is finished.
         *         // Asynchronous processing is perfectly ok
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     });
         *
         * @param {Function} fn.cls The created class
         * @param {Object} fn.data The set of properties passed in {@link Rs.Class} constructor
         * @param {Function} fn.fn The callback function that **must** to be 
         * executed when this pre-processor finishes,
         * regardless of whether the processing is synchronous or aynchronous
         *
         * @return {Rs.Class} this
         * @static
         */
        registerPreprocessor: function(name, fn, always) {
            this.preprocessors[name] = {
                name: name,
                always: always ||  false,
                fn: fn
            };
            return this;
        },
    
        /**
         * Retrieve a pre-processor callback function by its name, which has been registered before
         *
         * @param {String} name
         * @return {Function} preprocessor
         * @static
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },
        
        getPreprocessors: function() {
        	return this.preprocessors;
        },
        
        /**
         * Retrieve the array stack of default pre-processors
         *
         * @return {Function[]} defaultPreprocessors
         * @static
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors || [];
        },
    
        /**
         * Set the default array stack of default pre-processors
         *
         * @param {Function/Function[]} preprocessors
         * @return {Rs.Class} this
         * @static
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = fromArray(preprocessors);
            return this;
        },

        /**
         * Inserts this pre-processor at a specific position in the stack, optionally relative to
         * any existing pre-processor. For example:
         *
         *     Rs.Class.registerPreprocessor('debug', function(cls, data, fn) {
         *         // Your code here
         *
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     }).setDefaultPreprocessorPosition('debug', 'last');
         *
         * @param {String} name The pre-processor name. Note that it needs to be registered with
         * {@link #registerPreprocessor registerPreprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Rs.Class} this
         * @static
         */
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;
            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPreprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }
            index = indexOfArray(defaultPreprocessors, relativeName);
            if (index !== -1) {
                splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        }
    });
    
    /**
     * @cfg {String} extend
     * The parent class that this class extends. For example:
     *
     *     Rs.define('Person', {
     *         say: function(text) { alert(text); }
     *     });
     *
     *     Rs.define('Developer', {
     *         extend: 'Person',
     *         say: function(text) { this.callParent(["print "+text]); }
     *     });
     */
    Class.registerPreprocessor('extend', function(cls, data) {
        var extend = data.extend,
            base = Rs.Base,
            basePrototype = base.prototype,
            prototype = function() {},
            parent, i, k, ln, staticName, parentStatics,
            parentPrototype, clsPrototype;
        if (extend && extend !== Object) {
            parent = extend;
        } else {
            parent = base;
        }
        parentPrototype = parent.prototype;
        prototype.prototype = parentPrototype;
        clsPrototype = cls.prototype = new prototype();
        if (!('$class' in parent)) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }
        clsPrototype.self = cls;
        cls.superclass = clsPrototype.superclass = parentPrototype;
        delete data.extend;
        
        // <feature classSystem.inheritableStatics>
        // Statics inheritance
        parentStatics = parentPrototype.$inheritableStatics;
        if (parentStatics) {
            for (k = 0, ln = parentStatics.length; k < ln; k++) {
                staticName = parentStatics[k];
                if (!cls.hasOwnProperty(staticName)) {
                    cls[staticName] = parent[staticName];
                }
            }
        }
        // </feature>
        // <feature classSystem.config>
        // Merge the parent class' config object without referencing it
        if (parentPrototype.config) {
            clsPrototype.config = mergeObj({}, parentPrototype.config);
        } else {
            clsPrototype.config = {};
        }
        // </feature>
        // <feature classSystem.onClassExtended>
        if (clsPrototype.$onExtended) {
            clsPrototype.$onExtended.call(cls, cls, data);
        }
        if (data.onClassExtended) {
            clsPrototype.$onExtended = data.onClassExtended;
            delete data.onClassExtended;
        }
        // </feature>
    }, true);
    
    
    /**
     * @cfg {Object} statics
     * List of static methods for this class. For example:
     *
     *     Rs.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                  // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() { ... }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     */
    Class.registerPreprocessor('statics', function(cls, data) {
        cls.addStatics(data.statics);
        delete data.statics;
    });
    
    //<feature classSystem.inheritableStatics>
    /**
     * @cfg {Object} inheritableStatics
     * List of inheritable static methods for this class.
     * Otherwise just like {@link #statics} but subclasses inherit these methods.
     */
    Class.registerPreprocessor('inheritableStatics', function(cls, data) {
        cls.addInheritableStatics(data.inheritableStatics);
        delete data.inheritableStatics;
    });
    
    //<feature classSystem.config>
    /**
     * @cfg {Object} config
     * List of configuration options with their default values, for which automatically
     * accessor methods are generated.  For example:
     *
     *     Rs.define('SmartPhone', {
     *          config: {
     *              hasTouchScreen: false,
     *              operatingSystem: 'Other',
     *              price: 500
     *          },
     *          constructor: function(cfg) {
     *              this.initConfig(cfg);
     *          }
     *     });
     *
     *     var iPhone = new SmartPhone({
     *          hasTouchScreen: true,
     *          operatingSystem: 'iOS'
     *     });
     *
     *     iPhone.getPrice(); // 500;
     *     iPhone.getOperatingSystem(); // 'iOS'
     *     iPhone.getHasTouchScreen(); // true;
     *     iPhone.hasTouchScreen(); // true
     */
    Class.registerPreprocessor('config', function(cls, data) {
        var prototype = cls.prototype;
        eachObj(data.config, function(name) {
            var cName = name.charAt(0).toUpperCase() + name.substr(1),
                pName = name,
                apply = 'apply' + cName,
                setter = 'set' + cName,
                getter = 'get' + cName;
            if (!(apply in prototype) && !data.hasOwnProperty(apply)) {
                data[apply] = function(val) {
                    return val;
                };
            }
            if (!(setter in prototype) && !data.hasOwnProperty(setter)) {
                data[setter] = function(val) {
                    var ret = this[apply].call(this, val, this[pName]);
                    if (typeof ret != 'undefined') {
                        this[pName] = ret;
                    }
                    return this;
                };
            }
            if (!(getter in prototype) && !data.hasOwnProperty(getter)) {
                data[getter] = function() {
                    return this[pName];
                };
            }
        });
        mergeObj(prototype.config, data.config);
        delete data.config;
    });
    
    
    //<feature classSystem.mixins>
    /**
     * @cfg {Object} mixins
     * List of classes to mix into this class. For example:
     *
     *     Rs.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...")
     *          }
     *     });
     *
     *     Rs.define('Musician', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canSing: 'CanSing'
     *          }
     *     })
     */
    Class.registerPreprocessor('mixins', function(cls, data) {
        var mixins = data.mixins,
            name, mixin, i, ln;
        delete data.mixins;
        interceptBefore(data, 'onClassCreated', function(cls) {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;
                    cls.mixin(name, mixin);
                }
            } else {
                for (name in mixins) {
                    if (mixins.hasOwnProperty(name)) {
                        cls.mixin(name, mixins[name]);
                    }
                }
            }
        });
    });
    // </feature>
    
    Class.setDefaultPreprocessors([
        'extend'
        // <feature classSystem.statics>
        ,'statics'
        // </feature>
        // <feature classSystem.inheritableStatics>
        ,'inheritableStatics'
        // </feature>
        // <feature classSystem.config>
        ,'config'
        // </feature>
        // <feature classSystem.mixins>
        ,'mixins'
        // </feature>
    ]);
    
    // <feature classSystem.backwardsCompatible>
    // Backwards compatible
    /*
    Rs.extend = function(subclass, superclass, members) {
        if (arguments.length === 2 && Rs.isObject(superclass)) {
            members = superclass;
            superclass = subclass;
            subclass = null;
        }
        var cls;
    
        if (!superclass) {
            Rs.error("Attempting to extend from a class which has not been loaded on the page.");
        }
    
        members.extend = superclass;
        members.preprocessors = [
            'extend'
            // <feature classSystem.statics>
            ,'statics'
            // </feature>
            // <feature classSystem.inheritableStatics>
            ,'inheritableStatics'
            // </feature>
            // <feature classSystem.mixins>
            ,'mixins'
            // </feature>
            // <feature classSystem.config>
            ,'config'
            // </feature>
        ];
    
        if (subclass) {
            cls = new Class(subclass, members);
        }
        else {
            cls = new Class(members);
        }
    
        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };
    
        return cls;
    };
    */
    
    /**
     * @class Ext.ClassManager
     */
    /**
     * @author Jacky Nguyen <jacky@sencha.com>
     * @docauthor Jacky Nguyen <jacky@sencha.com>
     * @class Rs.ClassManager
     *
     * Rs.ClassManager manages all classes and handles mapping from string class name to
     * actual class objects throughout the whole framework. It is not generally accessed directly, rather through
     * these convenient shorthands:
     *
     * - {@link Rs#define Rs.define}
     * - {@link Rs#create Rs.create}
     * - {@link Rs#getClass Rs.getClass}
     * - {@link Rs#getClassName Rs.getClassName}
     *
     * # Basic syntax:
     *
     *     Rs.define(className, properties);
     *
     * in which `properties` is an object represent a collection of properties that apply to the class. See
     * {@link Rs.ClassManager#create} for more detailed instructions.
     *
     *     Rs.define('Person', {
     *          name: 'Unknown',
     *
     *          constructor: function(name) {
     *              if (name) {
     *                  this.name = name;
     *              }
     *
     *              return this;
     *          },
     *
     *          eat: function(foodType) {
     *              alert("I'm eating: " + foodType);
     *
     *              return this;
     *          }
     *     });
     *
     *     var aaron = new Person("Aaron");
     *     aaron.eat("Sandwich"); // alert("I'm eating: Sandwich");
     *
     * Rs.Class has a powerful set of extensible {@link Rs.Class#registerPreprocessor pre-processors} which takes care of
     * everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.
     *
     * # Inheritance:
     *
     *     Rs.define('Developer', {
     *          extend: 'Person',
     *
     *          constructor: function(name, isGeek) {
     *              this.isGeek = isGeek;
     *
     *              // Apply a method from the parent class' prototype
     *              this.callParent([name]);
     *
     *              return this;
     *
     *          },
     *
     *          code: function(language) {
     *              alert("I'm coding in: " + language);
     *
     *              this.eat("Bugs");
     *
     *              return this;
     *          }
     *     });
     *
     *     var jacky = new Developer("Jacky", true);
     *     jacky.code("JavaScript"); // alert("I'm coding in: JavaScript");
     *                               // alert("I'm eating: Bugs");
     *
     * See {@link Rs.Base#callParent} for more details on calling superclass' methods
     *
     * # Mixins:
     *
     *     Rs.define('CanPlayGuitar', {
     *          playGuitar: function() {
     *             alert("F#...G...D...A");
     *          }
     *     });
     *
     *     Rs.define('CanComposeSongs', {
     *          composeSongs: function() { ... }
     *     });
     *
     *     Rs.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...")
     *          }
     *     });
     *
     *     Rs.define('Musician', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canPlayGuitar: 'CanPlayGuitar',
     *              canComposeSongs: 'CanComposeSongs',
     *              canSing: 'CanSing'
     *          }
     *     })
     *
     *     Rs.define('CoolPerson', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canPlayGuitar: 'CanPlayGuitar',
     *              canSing: 'CanSing'
     *          },
     *
     *          sing: function() {
     *              alert("Ahem....");
     *
     *              this.mixins.canSing.sing.call(this);
     *
     *              alert("[Playing guitar at the same time...]");
     *
     *              this.playGuitar();
     *          }
     *     });
     *
     *     var me = new CoolPerson("Jacky");
     *
     *     me.sing(); // alert("Ahem...");
     *                // alert("I'm on the highway to hell...");
     *                // alert("[Playing guitar at the same time...]");
     *                // alert("F#...G...D...A");
     *
     * # Config:
     *
     *     Rs.define('SmartPhone', {
     *          config: {
     *              hasTouchScreen: false,
     *              operatingSystem: 'Other',
     *              price: 500
     *          },
     *
     *          isExpensive: false,
     *
     *          constructor: function(config) {
     *              this.initConfig(config);
     *
     *              return this;
     *          },
     *
     *          applyPrice: function(price) {
     *              this.isExpensive = (price > 500);
     *
     *              return price;
     *          },
     *
     *          applyOperatingSystem: function(operatingSystem) {
     *              if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
     *                  return 'Other';
     *              }
     *
     *              return operatingSystem;
     *          }
     *     });
     *
     *     var iPhone = new SmartPhone({
     *          hasTouchScreen: true,
     *          operatingSystem: 'iOS'
     *     });
     *
     *     iPhone.getPrice(); // 500;
     *     iPhone.getOperatingSystem(); // 'iOS'
     *     iPhone.getHasTouchScreen(); // true;
     *     iPhone.hasTouchScreen(); // true
     *
     *     iPhone.isExpensive; // false;
     *     iPhone.setPrice(600);
     *     iPhone.getPrice(); // 600
     *     iPhone.isExpensive; // true;
     *
     *     iPhone.setOperatingSystem('AlienOS');
     *     iPhone.getOperatingSystem(); // 'Other'
     *
     * # Statics:
     *
     *     Rs.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                 // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() { ... }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     *
     * Also see {@link Rs.Base#statics} and {@link Rs.Base#self} for more details on accessing
     * static properties within class methods
     *
     * @singleton
     */
    var slice = Array.prototype.slice;

    var Manager = Rs.ClassManager = {

		/**
		 * @property {Object} classes
		 * All classes which were defined through the ClassManager. Keys are the
		 * name of the classes and the values are references to the classes.
		 * @private
		 */
        classes: {},

        /**
         * @private
         */
        existCache: {},
        
        /**
         * @private
         */
        namespaceRewrites: [{
            from: 'rs.',
            to: {}
        }],

        /**
         * @private
         */
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {}
        },

        /** @private */
        instantiators: [],

        // <debug>
        /** @private */
        instantiationCounts: {},

        /**
         * Checks if a class has already been created.
         *
         * @param {String} className
         * @return {Boolean} exist
         */
        isCreated: function(className) {
            var i, ln, part, root, parts;
            if (typeof className !== 'string' || className.length < 1) {
                Rs.error("Invalid classname, must be a string and must not be empty");
            }
            if (this.classes.hasOwnProperty(className) || this.existCache.hasOwnProperty(className)) {
                return true;
            }
            root = Rs.global;
            parts = this.parseNamespace(className);
            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];
                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }
                    root = root[part];
                }
            }
            this.existCache[className] = true;
            return true;
        },

        /**
         * Supports namespace rewriting
         * @private
         */
        parseNamespace: function(namespace) {
            if (typeof namespace !== 'string') {
                Rs.error("Invalid namespace, must be a string");
            }
            var parts = [];
            parts = parts.concat(namespace.split('.'));
            return parts;
        },

        /**
         * Creates a namespace and assign the `value` to the created object
         *
         *     Rs.ClassManager.setNamespace('MyCompany.pkg.Example', someObject);
         *
         *     alert(MyCompany.pkg.Example === someObject); // alerts true
         *
         * @param {String} name
         * @param {Object} value
         */
        setNamespace: function(name, value) {
            var root = Rs.global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;
            for (i = 0; i < ln; i++) {
                part = parts[i];
                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }
                    root = root[part];
                }
            }
            root[leaf] = value;
            return root[leaf];
        },

        /**
         * The new Rs.ns, supports namespace rewriting
         * @private
         */
        createNamespaces: function() {
            var root = Rs.global,
                parts, part, i, j, ln, subLn;
            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);
                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];
                    if (typeof part !== 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }
                        root = root[part];
                    }
                }
            }
            return root;
        },

        /**
         * Sets a name reference to a class.
         * 
         * @param {String}
         *            name
         * @param {Object}
         *            value
         * @return {Rs.ClassManager} this
         */
        set: function(name, value) {
            var targetName = this.getName(value);
            this.classes[name] = this.setNamespace(name, value);
            if (targetName && targetName !== name) {
                this.maps.alternateToName[name] = targetName;
            }
            return this;
        },

        /**
         * Retrieve a class by its name.
         * 
         * @param {String}
         *            name
         * @return {Rs.Class} class
         */
        get: function(name) {
            if (this.classes.hasOwnProperty(name)) {
                return this.classes[name];
            }
            //TODO: 考虑对未通过Rs.define方法定义的类的支持
            Rs.error('undefined class:' + name);
        },

        /**
         * Register the alias for a class.
         * 
         * @param {Rs.Class/String}
         *            cls a reference to a class or a className
         * @param {String}
         *            alias Alias to use when referring to this class
         */
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;
            if (typeof cls === 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }
            if (alias && aliasToNameMap[alias] !== className) {
                if (aliasToNameMap.hasOwnProperty(alias) && Rs.isDefined(Rs.global.console)){
                    Rs.global.console.log("[Rs.ClassManager] Overriding existing alias: '" + alias + "' " +
                        "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }
                aliasToNameMap[alias] = className;
            }
            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }
            if (alias) {
                includeArray(nameToAliasesMap[className], alias);
            }
            return this;
        },

        /**
         * Get a reference to the class by its alias.
         * 
         * @param {String}
         *            alias
         * @return {Rs.Class} class
         */
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        /**
         * Get the name of a class by its alias.
         * 
         * @param {String}
         *            alias
         * @return {String} className
         */
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        /**
         * Get the name of a class by its alternate name.
         * 
         * @param {String}
         *            alternate
         * @return {String} className
         */
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        /**
         * Get the aliases of a class by the class name
         * 
         * @param {String}
         *            name
         * @return {String[]} aliases
         */
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        /**
         * Get the name of the class by its reference or its instance.
         * 
         * {@link Rs#getClassName Rs.getClassName} is alias for
         * {@link Rs.ClassManager#getName Rs.ClassManager.getName}.
         * 
         * @param {Rs.Class/Object}
         *            object
         * @return {String} className
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * Get the class of the provided object; returns null if it's not an
         * instance of any class created with Rs.define.
         * 
         * {@link Rs#getClass Rs.getClass} is alias for
         * {@link Rs.ClassManager#getClass Rs.ClassManager.getClass}.
         * 
         * @param {Object}
         *            object
         * @return {Rs.Class} class
         */
        getClass: function(object) {
            return object && object.self || null;
        },

        /**
         * Defines a class.
         * 定义一个类
         *
         * {@link Rs#define Rs.define} and {@link Rs.ClassManager#create Rs.ClassManager.create} are almost aliases
         * of each other, with the only exception that Ext.define allows definition of {@link Rs.Class#override overrides}.
         * To avoid trouble, always use Ext.define.
         *
         *     Rs.define('My.awesome.Class', {
         *         someProperty: 'something',
         *         someMethod: function() { ... }
         *         ...
         *
         *     }, function() {
         *         alert('Created!');
         *         alert(this === My.awesome.Class); // alerts true
         *
         *         var myInstance = new this();
         *     });
         *
         * @param {String} className The class name to create in string dot-namespaced format, for example:
         * `My.very.awesome.Class`, `FeedViewer.plugin.CoolPager`. It is highly recommended to follow this simple convention:
         *
         * - The root and the class name are 'CamelCased'
         * - Everything else is lower-cased
         *
         * @param {Object} data The key-value pairs of properties to apply to this class. Property names can be of any valid
         * strings, except those in the reserved list below:
         *
         * - {@link Rs.Base#self self}
         * - {@link Rs.Class#alias alias}
         * - {@link Rs.Class#alternateClassName alternateClassName}
         * - {@link Rs.Class#config config}
         * - {@link Rs.Class#extend extend}
         * - {@link Rs.Class#inheritableStatics inheritableStatics}
         * - {@link Rs.Class#mixins mixins}
         * - {@link Rs.Class#override override} (only when using {@link Ext#define Ext.define})
         * - {@link Rs.Class#requires requires}
         * - {@link Rs.Class#singleton singleton}
         * - {@link Rs.Class#statics statics}
         * - {@link Rs.Class#uses uses}
         *
         * @param {Function} [createdFn] callback to execute after the class is created, the execution scope of which
         * (`this`) will be the newly created class itself.
         *
         * @return {Rs.Base}
         */
        create: function(className, data, createdFn) {
            var manager = this;
            if (typeof className !== 'string') {
                Rs.error("Invalid class name '" + className + "' specified, must be a non-empty string");
            }
            data.$className = className;
            return new Class(data, function() {
                var postprocessorStack = data.postprocessors || manager.defaultPostprocessors,
                    registeredPostprocessors = manager.postprocessors,
                    index = 0,
                    postprocessors = [],
                    postprocessor, process, i, ln;
                delete data.postprocessors;
                for (i = 0, ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];
                    if (typeof postprocessor === 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        if (!postprocessor.always) {
                            if (data[postprocessor.name] !== undefined) {
                                postprocessors.push(postprocessor.fn);
                            }
                        } else {
                            postprocessors.push(postprocessor.fn);
                        }
                    } else {
                        postprocessors.push(postprocessor);
                    }
                }
                process = function(clsName, cls, clsData) {
                    postprocessor = postprocessors[index++];
                    if (!postprocessor) {
                        manager.set(className, cls);
                        if (createdFn) {
                            createdFn.call(cls, cls);
                        }
                        return;
                    }
                    if (postprocessor.call(this, clsName, cls, clsData, process) !== false) {
                        process.apply(this, arguments);
                    }
                };
                process.call(manager, className, this, data);
            });
        },
        
        /**
         * Instantiate a class by its alias.
         * 
         * {@link Rs#createByAlias Rs.createByAlias} is alias for 
         * {@link Rs.ClassManager#instantiateByAlias Rs.ClassManager.instantiateByAlias}.
         *
         * @param {String} alias
         * @param {Object...} args Additional arguments after the alias will be passed to the
         * class constructor.
         * @return {Object} instance
         */
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = slice.call(arguments),
                className = this.getNameByAlias(alias);
            if (!className) {
                className = this.maps.aliasToName[alias];
                if (!className) {
                    Rs.error("Cannot create an instance of unrecognized alias: " + alias);
                }
            }
            args[0] = className;
            return this.instantiate.apply(this, args);
        },
       
        /**
         * Instantiate a class by either full name, alias or alternate name.
         * 
         * {@link Rs#create Rs.create} is alias for {@link Rs.ClassManager#instantiate Rs.ClassManager.instantiate}.
         *
         * @param {String} name
         * @param {Object...} args Additional arguments after the name will be passed to the class' constructor.
         * @return {Object} instance
         */
        instantiate: function(){
            var name = arguments[0],
                args = slice.call(arguments, 1),
                alias = name,
                possibleName, cls;
            if (typeof name !== 'function') {
                if ((typeof name !== 'string' || name.length < 1)) {
                    Rs.error("Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                cls = this.get(name);
            } else {
                cls = name;
            }
            // No record of this class name, it's possibly an alias, so look it up
            if (!cls) {
                possibleName = this.getNameByAlias(name);
                if (possibleName) {
                    name = possibleName;
                    cls = this.get(name);
                }
            }
            // Still no record of this class name, it's possibly an alternate name, so look it up
            if (!cls) {
                possibleName = this.getNameByAlternate(name);
                if (possibleName) {
                    name = possibleName;
                    cls = this.get(name);
                }
            }
            if (!cls) {
                Rs.error("Cannot create an instance of unrecognized class name / alias: " + alias);
            }
            if (typeof cls !== 'function') {
                Rs.error("'" + name + "' is a singleton and cannot be instantiated");
            }
            //记录该类实例个数
            if (!this.instantiationCounts[name]) {
                this.instantiationCounts[name] = 0;
            }
            this.instantiationCounts[name]++;
            return this.getInstantiator(args.length)(cls, args);
        },

        /**
         * @private
         * @param name
         * @param args
         */
        dynInstantiate: function(name, args) {
            args = fromArray(args, true);
            args.unshift(name);
            return this.instantiate.apply(this, args);
        },

        /**
         * @private
         * @param length
         */
        getInstantiator: function(length) {
            if (!this.instantiators[length]) {
                var i = length,
                    args = [];

                for (i = 0; i < length; i++) {
                    args.push('a['+i+']');
                }

                this.instantiators[length] = new Function('c', 'a', 'return new c('+args.join(',')+')');
            }

            return this.instantiators[length];
        },

        /**
         * @private
         */
        postprocessors: {},

        /**
         * @private
         */
        defaultPostprocessors: [],

        /**
         * Register a post-processor function.
         * 
         * @param {String}
         *            name
         * @param {Function}
         *            postprocessor
         */
        registerPostprocessor: function(name, fn, always) {
            this.postprocessors[name] = {
                name: name,
                always: always ||  false,
                fn: fn
            };
            return this;
        },

        /**
         * Set the default post processors array stack which are applied to
         * every class.
         * 
         * @param {String/String[]}
         *            The name of a registered post processor or an array of
         *            registered names.
         * @return {Rs.ClassManager} this
         */
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = fromArray(postprocessors);
            return this;
        },

        /**
         * Insert this post-processor at a specific position in the stack,
         * optionally relative to any existing post-processor
         * 
         * @param {String}
         *            name The post-processor name. Note that it needs to be
         *            registered with
         *            {@link Rs.ClassManager#registerPostprocessor} before this
         * @param {String}
         *            offset The insertion position. Four possible values are:
         *            'first', 'last', or: 'before', 'after' (relative to the
         *            name provided in the third argument)
         * @param {String}
         *            relativeName
         * @return {Rs.ClassManager} this
         */
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;
            if (typeof offset === 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPostprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }
            index = indexOfArray(defaultPostprocessors, relativeName);
            if (index !== -1) {
                splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

       
        /**
         * Converts a string expression to an array of matching class names. An expression can either refers to class aliases
         * or class names. Expressions support wildcards:
         *
         * @param {String} expression
         * @return {String[]} classNames
         */
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;
            if (typeof expression !== 'string' || expression.length < 1) {
                Rs.error("Expression " + expression + " is invalid, must be a non-empty string");
            }
            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');
                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];
                        if (name.search(regex) !== -1) {
                            names.push(name);
                        } else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];
                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                possibleName = this.getNameByAlias(expression);
                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);
                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }
            return names;
        }
    };

    var defaultPostprocessors = Manager.defaultPostprocessors;
    // <feature classSystem.alias>

    /**
     * @cfg {String[]} alias
     * @member Rs.Class
     * List of short aliases for class names.
     */
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;
        delete data.alias;
        for (i = 0, ln = aliases.length; i < ln; i++) {
            alias = aliases[i];
            this.setAlias(cls, alias);
        }
    });

    /**
     * @cfg {Boolean} singleton
     * @member Rs.Class
     * When set to true, the class will be instantiated as singleton.  For example:
     *
     *     Rs.define('Logger', {
     *         singleton: true,
     *         log: function(msg) {
     *             console.log(msg);
     *         }
     *     });
     *
     *     Logger.log('Hello');
     */
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });

    /**
     * @cfg {String/String[]} alternateClassName
     * @member Rs.Class
     * Defines alternate names for this class.  For example:
     *
     *     Rs.define('Developer', {
     *         alternateClassName: ['Coder', 'Hacker'],
     *         code: function(msg) {
     *             alert('Typing... ' + msg);
     *         }
     *     });
     *
     *     var joe = Rs.create('Developer');
     *     joe.code('stackoverflow');
     *
     *     var rms = Rs.create('Hacker');
     *     rms.code('hack hack');
     */
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        var alternates = data.alternateClassName,
            i, ln, alternate;
        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }
        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];
            if (typeof alternate !== 'string') {
                Rs.error("Invalid alternate of: '" + alternate 
                		+ "' for class: '" + name + "'; must be a valid string");
            }
            this.set(alternate, cls);
        }
    });

    Manager.setDefaultPostprocessors(['alias', 'singleton', 'alternateClassName']);

    Rs.apply(Rs, {

    	/**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#instantiate
         */
        create: aliasMethod(Manager, 'instantiate'),

        /**
         * @private
         * API to be stablized
         *
         * @param {Object} item
         * @param {String} namespace
         */
        factory: function(item, namespace) {
            if (item instanceof Array) {
                var i, ln;
                for (i = 0, ln = item.length; i < ln; i++) {
                    item[i] = Rs.factory(item[i], namespace);
                }
                return item;
            }
            var isString = (typeof item === 'string');
            if (isString || (item instanceof Object && item.constructor === Object)) {
                var name, config = {};
                if (isString) {
                    name = item;
                } else {
                    name = item.className;
                    config = item;
                    delete config.className;
                }
                if (namespace !== undefined && name.indexOf(namespace) === -1) {
                    name = namespace + '.' + capitalize(name);
                }
                return Rs.create(name, config);
            }
            if (typeof item === 'function') {
                return Rs.create(item);
            }
            return item;
        },


        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#instantiateByAlias
         */
        createByAlias: aliasMethod(Manager, 'instantiateByAlias'),

        /**
         * @cfg {String} override
         * @member Rs.Class
         * 
         * Defines an override applied to a class. Note that **overrides can only be created using
         * {@link Rs#define}.** {@link Rs.ClassManager#create} only creates classes.
         * 
         * To define an override, include the override property. The content of an override is
         * aggregated with the specified class in order to extend or modify that class. This can be
         * as simple as setting default property values or it can extend and/or replace methods.
         * This can also extend the statics of the class.
         *
         * One use for an override is to break a large class into manageable pieces.
         *
         *      Rs.define('My.app.Panel', {
         *          
         *          extend: 'Ext.Panel',
         *          
         *          constructor: function (config) {
         *              this.callSuper(arguments); // calls Ext.panel.Panel's constructor
         *              //...
         *          },
         *
         *          statics: {
         *              method: function () {
         *                  return 'abc';
         *              }
         *          }
         *      });
         *
         *      Rs.define('My.app.PanelPart2', {
         *          
         *          override: 'My.app.Panel',
         *
         *          constructor: function (config) {
         *              this.callSuper(arguments); // calls My.app.Panel's constructor
         *              //...
         *          }
         *      });
         *
         */
        
        /**
         * @method
         *
         * @member Rs
         * @alias Rs.ClassManager#create
         */
        define: function (className, data, createdFn) {
            if (!data.override) {
                return Manager.create.apply(Manager, arguments);
            }
            var overrideName = className;
            data = Rs.apply({}, data);
            delete data.override;
            return Manager.create(overrideName, {
                    isPartial: true,
                    constructor: function () {
                        throw new Error("Cannot create override '" + overrideName + "'");
                    }
                }, function () {
                    var cls = Manager.get(className);
                    if (cls.override) { // if (normal class)
                        cls.override(data);
                    } else { // else (singleton)
                        cls.self.override(data);
                    }
                    if (createdFn) {
                        // called once the override is applied and with the
                        // context of the
                        // overridden class (the override itself is a
                        // meaningless, name-only
                        // thing).
                        createdFn.call(cls);
                    }
                });
        },

        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#getName
         */
        getClassName: aliasMethod(Manager, 'getName'),

        /**
         * Returns the displayName property or className or object.
         * When all else fails, returns "Anonymous".
         * @param {Object} object
         * @return {String}
         */
        getDisplayName: function(object) {
            if (object.displayName) {
                return object.displayName;
            }
            if (object.$name && object.$class) {
                return Rs.getClassName(object.$class) + '#' + object.$name;
            }
            if (object.$className) {
                return object.$className;
            }
            return 'Anonymous';
        },

        /**
         * @method
         * @member Rs
         * @alias Rs.ClassManager#getClass
         */
        getClass: aliasMethod(Manager, 'getClass')//,

    });

    Class.registerPreprocessor('className', function(cls, data) {
        if (data.$className) {
            cls.$className = data.$className;
            cls.displayName = cls.$className;
        }
    }, true);

    Class.setDefaultPreprocessorPosition('className', 'first');

    Class.registerPreprocessor('xtype', function(cls, data) {
        var xtypes = fromArray(data.xtype),
            aliases = fromArray(data.alias),
            i, ln, xtype;
        data.xtype = xtypes[0];
        data.xtypes = xtypes;
        aliases = data.alias = fromArray(data.alias);
        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];
            if (typeof xtype != 'string' || xtype.length < 1) {
                throw new Error("[Rs.define] Invalid xtype of: '" + xtype + "' for class: '" + name + "'; must be a valid non-empty string");
            }
        }
        data.alias = aliases;
    });

    Class.setDefaultPreprocessorPosition('xtype', 'last');

    Class.registerPreprocessor('alias', function(cls, data) {
        var aliases = fromArray(data.alias),
            xtypes = fromArray(data.xtypes),
            i, ln, alias, xtype;
        for (i = 0, ln = aliases.length; i < ln; i++) {
            alias = aliases[i];
            if (typeof alias != 'string') {
                throw new Error("[Rs.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
            }
        }
        data.alias = aliases;
        data.xtypes = xtypes;
    });

    Class.setDefaultPreprocessorPosition('alias', 'last');
    
})(Rs);
