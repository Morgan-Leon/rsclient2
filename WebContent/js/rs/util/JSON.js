/**
 * @class Rs.util.JSON
 * @singleton <br/>
 */
Rs.util.JSON = new (function() {
	var useHasOwn = !! {}.hasOwnProperty, isNative = function() {
		var useNative = null;
		return function() {
			if (useNative === null) {
				useNative = Rs.USE_NATIVE_JSON && window.JSON
						&& JSON.toString() == '[object JSON]';
			}
			return useNative;
		};
	}(), pad = function(n) {
		return n < 10 ? "0" + n : n;
	}, doDecode = function(json) {
		return eval("(" + decodeURIComponent(decodeURIComponent(json)) + ")");
	}, doEncode = function(o) {
		if (!Rs.isDefined(o) || o === null) {
			return "null";
		} else if (Rs.isArray(o)) {
			return encodeArray(o);
		} else if (Rs.isDate(o)) {
			return Rs.util.JSON.encodeDate(o);
		} else if (Rs.isString(o)) {
			return encodeString(o);
		} else if (typeof o == "number") {
			// don't use isNumber here, since finite checks happen inside
			// isNumber
			return isFinite(o) ? String(o) : "null";
		} else if (Rs.isBoolean(o)) {
			return String(o);
		} else {
			var a = [ "{" ], b, i, v;
			for (i in o) {
				// don't encode DOM objects
				if (!o.getElementsByTagName) {
					if (!useHasOwn || o.hasOwnProperty(i)) {
						v = o[i];
						switch (typeof v) {
						case "undefined":
						case "function":
						case "unknown":
							break;
						default:
							if (b) {
								a.push(',');
							}
							a.push(doEncode(i), ":", v === null ? "null"
									: doEncode(v));
							b = true;
						}
					}
				}
			}
			a.push("}");
			return a.join("");
		}
	}, m = {
		"\b" : '\\b',
		"\t" : '\\t',
		"\n" : '\\n',
		"\f" : '\\f',
		"\r" : '\\r',
		'"' : '\\"',
		"\\" : '\\\\'
	}, encodeString = function(s) {
		if (/["\\\x00-\x1f]/.test(s)) {
			s = s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
				var c = m[b];
				if (c) {
					return c;
				}
				c = b.charCodeAt();
				return "\\u00" + Math.floor(c / 16).toString(16)
						+ (c % 16).toString(16);
			});
		}
		return '"' + encodeURIComponent(encodeURIComponent(s)) + '"';
	}, encodeArray = function(o) {
		var a = [ "[" ], b, i, l = o.length, v;
		for (i = 0; i < l; i += 1) {
			v = o[i];
			switch (typeof v) {
			case "undefined":
			case "function":
			case "unknown":
				break;
			default:
				if (b) {
					a.push(',');
				}
				a.push(v === null ? "null" : Rs.util.JSON.encode(v));
				b = true;
			}
		}
		a.push("]");
		return a.join("");
	};
	
	this.encodeDate = function(o) {
		return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-"
				+ pad(o.getDate()) + "T" + pad(o.getHours()) + ":"
				+ pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
	};

	/**
	 * Encodes an Object, Array or other value
	 * @param {Mixed}
	 *            o The variable to encode
	 * @return {String} The JSON string
	 */
	this.encode = function() {
		var ec;
		return function(o) {
			if (!ec) {
				// setup encoding function on first access
				ec = isNative() ? JSON.stringify : doEncode;
			}
			return ec(o);
		};
	}();

	/**
	 * Decodes (parses) a JSON string to an object. If the JSON is invalid, this
	 * function throws a SyntaxError unless the safe option is set.
	 * @param {String}
	 *            json The JSON string
	 * @return {Object} The resulting object
	 */
	this.decode = function() {
		var dc;
		return function(json) {
			if (!dc) {
				// setup decoding function on first access
				dc = isNative() ? JSON.parse : doDecode;
			}
			return dc(json);
		};
	}();

})();


/**
 * Shorthand for {@link Rs.util.JSON#encode}
 * @param {Mixed} o The variable to encode
 * @return {String} The JSON string
 * @member Rs
 * @method encode
 */
Rs.encode = Rs.util.JSON.encode;

/**
 * Shorthand for {@link Rs.util.JSON#decode}
 * @param {String} json The JSON string
 * @param {Boolean} safe (optional) Whether to return null or throw an exception if the JSON is invalid.
 * @return {Object} The resulting object
 * @member Rs
 * @method decode
 */
Rs.decode = Rs.util.JSON.decode;
