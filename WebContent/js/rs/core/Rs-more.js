/**
 * @class Function
 * These functions are available on every Function object (any JavaScript function).
 */
Rs.apply(Function.prototype, {
    
	 /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

// create a new function that validates input without
// directly modifying the original function:
var sayHiToFriend = sayHi.createInterceptor(function(name){
    return name == 'Brian';
});

sayHiToFriend('Fred');  // no alert
sayHiToFriend('Brian'); // alerts "Hi, Brian"
</code></pre>
     * @param {Function} fcn The function to call before the original
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @return {Function} The new function
     */
	createInterceptor : function(fcn, scope){
        var method = this;
        return !Rs.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },

    /**
     * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
     * Call directly on any function. Example: <code>myFunction.createCallback(arg1, arg2)</code>
     * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
     * callback, use {@link #createDelegate} instead.</b> The function returned by createCallback always
     * executes in the window scope.
     * <p>This method is required when you want to pass arguments to a callback function.  If no arguments
     * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
     * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
     * would simply execute immediately when the code is parsed. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// clicking the button alerts "Hi, Fred"
new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody(),
    handler: sayHi.createCallback('Fred')
});
</code></pre>
     * @return {Function} The new function
    */
    createCallback : function(/*args...*/){
        // make args available, in function below
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    /**
     * Creates a delegate (callback) that sets the scope to obj.
     * Call directly on any function. Example: <code>this.myFunction.createDelegate(this, [arg1, arg2])</code>
     * Will create a function that is automatically scoped to obj so that the <tt>this</tt> variable inside the
     * callback points to obj. Example usage:
     * <pre><code>
var sayHi = function(name){
    // Note this use of "this.text" here.  This function expects to
    // execute within a scope that contains a text property.  In this
    // example, the "this" variable is pointing to the btn object that
    // was passed in createDelegate below.
    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
}

var btn = new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody()
});

// This callback will execute in the scope of the
// button instance. Clicking the button alerts
// "Hi, Fred. You clicked the "Say Hi" button."
btn.on('click', sayHi.createDelegate(btn, ['Fred']));
</code></pre>
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (Rs.isNumber(appendArgs)){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    /**
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// executes immediately:
sayHi('Fred');

// executes after 2 seconds:
sayHi.defer(2000, this, ['Fred']);

// this syntax is sometimes useful for deferring
// execution of an anonymous function:
(function(){
    alert('Anonymous');
}).defer(100);
</code></pre>
     * @param {Number} millis The number of milliseconds for the setTimeout call (if less than or equal to 0 the function is executed immediately)
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis > 0){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});

/**
 * @class String
 * These functions are available on every String object.
 */
Rs.applyIf(String, {
	
	/**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
// s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
     * </code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     * @static
     */
    format : function(format){
        var args = Rs.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },
    
    /**
     * 字符串首尾去空格
     *  
     * @param {String} text
     */
    trim : function(text){
        return Rs.isString(text) ? text.replace(/(^\s*)|(\s*$)/g, "") : '';
    },
    
	/**
	 * 字符串包含字符串判断
	 * 
	 * @method contains
	 * @param {Stirng} substr
	 */ 
    contains : function(sub) {  
		return this.indexOf(sub) != -1;  
	}
});

Rs.trim = String.trim;

/**
 * @class Array
 */
Rs.applyIf(Array.prototype, {

	/**
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o The object to check for
     * @param {Number} from (Optional) The index at which to begin the search
     * @return {Number} The index of o in the array (or -1 if it is not found)
     */
	/*indexOf : function(o, from){
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    },*/

    /**
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o The object to remove
     * @return {Array} this array
     */
    remove : function(o){
        var index = this.indexOf(o);
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    },
    
    /**
	 * 扩展基础类 克隆复制（简单copy而已）
	 * 
	 * @method clone
	 */ 
    clone : function(){  
        var arr = [];  
        var i = 0;  
        for(; i < this.length; i++){  
            switch(typeof this[i]){  
                case 'object':  
                    var obj = {};  
                    for(key in this[i])  
                        obj[key] = this[i][key];  
                    arr.push(obj);  
                    break;  
                default:  
                    arr.push(this[i]);  
                    break;  
            }  
        }  
        return arr;  
    },
    
    /**
	 * 扩展基础类 数组添加数组
	 * 
	 * @method merge
	 */
    merge : function(arr) {  
        if(arr){  
            var i;  
            for(i = 0; i < arr.length; i++) {    
                this.push(arr[i]);  
            }    
        }  
    },
    
    /**
	 * 扩展基础类 根据值和属性获取到数组的对象下标
	 * 
	 * @method indexOf
	 * @param {value} val
	 * @param {String} field
	 */ 
    indexOf : function(val, field){  
        var i = 0;  
        for(; i < this.length; i++){  
            if(this[i] && (field ? this[i][field] == val : this[i] == val)){  
                return i;  
            }  
        }  
        return -1;  
    },
    
    /**
	 * 扩展基础类 最后一个下标
	 * 
	 * @method lastIndexOf
	 * @param {Mixed} val
	 * @param {String} field
	 */
    lastIndexOf : function(val, field){  
        var i = 0;  
        var max = -1;  
        for(; i < this.length; i++){  
            if(this[i] && (field ? this[i][field] == val : this[i] == val)){  
                max = i;  
            }  
        }  
        return max;  
    }
});

/**
 * @class Date
 */
Rs.applyIf(Date, {
	
    /**
	 * 日期相差天数
	 * 
	 * @method diff
	 * @param {Date} date
	 */
    diff : function(date){  
        return Math.ceil((this - date) / (1000 * 60 * 60 * 24));  
    },
    
    /**
     * 日期加减计算
     * 
     * @method add
     * @param {Number} days
     */
    add : function(days){  
        return new Date(this.getTime() + days * (1000 * 60 * 60 * 24));  
    },
    
    /**
     * 日期加减计算
     * 
     * @method addMonth
     * @param {Number} months
     */
    addMonth : function(months){  
        var day = this.getDate();  
        var month = this.getMonth() + 1;  
        var year = this.getFullYear();  
        month += months;    
        if(month > 12){  
            year += Math.floor(month / 12);  
            month = month % 12;  
        }  
        return Date.parse(month + '/' + day + '/' + year);  
    },
    
    getElapsed : function(A) {
    	return Math.abs((A || new Date()).getTime() - this.getTime())
    }
});

