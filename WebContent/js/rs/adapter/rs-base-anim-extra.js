(function(){
	// shortcuts to aid compression
	var abs = Math.abs,
	 	pi = Math.PI,
	 	asin = Math.asin,
	 	pow = Math.pow,
	 	sin = Math.sin,
		RSLIB = Rs.lib;
	 	
    Rs.apply(RSLIB.Easing, {
        
        easeBoth: function (t, b, c, d) {
	        return ((t /= d / 2) < 1)  ?  c / 2 * t * t + b  :  -c / 2 * ((--t) * (t - 2) - 1) + b;               
        },
        
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },

        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },

        easeBothStrong: function (t, b, c, d) {
            return ((t /= d / 2) < 1)  ?  c / 2 * t * t * t * t + b  :  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },

        elasticIn: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b;
            	      
        }, 	
	
		elasticOut: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * pi) / p) + c + b;	 
        }, 	
	
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0 || (t /= d / 2) == 2) {
                return t == 0 ? b : b + c;
            }		         	
	            
            p = p || (d * (.3 * 1.5)); 	            

            var s;
            if (a >= abs(c)) {
	            s = p / (2 * pi) * asin(c / a);
            } else {
	            a = c;
                s = p / 4;
            }

            return t < 1 ?
            	   	-.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b :
                    a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p) * .5 + c + b;
        },

        backIn: function (t, b, c, d, s) {
            s = s ||  1.70158; 	            
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },


        backOut: function (t, b, c, d, s) {
            if (!s) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },


        backBoth: function (t, b, c, d, s) {
            s = s || 1.70158; 	            

            return ((t /= d / 2 ) < 1) ?
                    c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : 	            
            		c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },


        bounceIn: function (t, b, c, d) {
            return c - RSLIB.Easing.bounceOut(d - t, 0, c, d) + b;
        },


        bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },


        bounceBoth: function (t, b, c, d) {
            return (t < d / 2) ?
                   RSLIB.Easing.bounceIn(t * 2, 0, c, d) * .5 + b : 
            	   RSLIB.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})();

(function() {
    var RSLIB = Rs.lib;
	// Color Animation
	RSLIB.Anim.color = function(el, args, duration, easing, cb, scope) {
	    return RSLIB.Anim.run(el, args, duration, easing, cb, scope, RSLIB.ColorAnim);
	}
	
    RSLIB.ColorAnim = function(el, attributes, duration, method) {
        RSLIB.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };

    Rs.extend(RSLIB.ColorAnim, RSLIB.AnimBase);

    var superclass = RSLIB.ColorAnim.superclass,
    	colorRE = /color$/i,
    	transparentRE = /^transparent|rgba\(0, 0, 0, 0\)$/,
        rgbRE = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        hexRE= /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        hex3RE = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i,
        isset = function(v){
            return typeof v !== 'undefined';
        }
         	
   	// private	
    function parseColor(s) {	
        var pi = parseInt,
            base,
            out = null,
            c;
        
	    if (s.length == 3) {
            return s;
        }
		
        Rs.each([hexRE, rgbRE, hex3RE], function(re, idx){
            base = (idx % 2 == 0) ? 16 : 10;
            c = re.exec(s);
            if(c && c.length == 4){
                out = [pi(c[1], base), pi(c[2], base), pi(c[3], base)];
                return false;
            }
        });
        return out;
    }	

    Rs.apply(RSLIB.ColorAnim.prototype, {
        getAttr : function(attr) {
            var me = this,
                el = me.el,
                val;                
            if(colorRE.test(attr)){
                while(el && transparentRE.test(val = Rs.fly(el).getStyle(attr))){
                    el = el.parentNode;
                    val = "fff";
                }
            }else{
                val = superclass.getAttr.call(me, attr);
            }
            return val;
        },

        doMethod : function(attr, start, end) {
            var me = this,
            	val,
            	floor = Math.floor,
				i, 
                len,
                v;            

            if(colorRE.test(attr)){
                val = [];
				
				for(i = 0, len = start.length; i < len; i++) {
					v = start[i];
					val[i] = superclass.doMethod.call(me, attr, v, end[i]);
				}
                val = 'rgb(' + floor(val[0]) + ',' + floor(val[1]) + ',' + floor(val[2]) + ')';
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        setRunAttr : function(attr) {
            var me = this,
                a = me.attributes[attr],
                to = a.to,
                by = a.by,
                ra;
                
            superclass.setRunAttr.call(me, attr);
            ra = me.runAttrs[attr];
            if(colorRE.test(attr)){
                var start = parseColor(ra.start),
                    end = parseColor(ra.end);

                if(!isset(to) && isset(by)){
                    end = parseColor(by);
					for(var i=0,len=start.length; i<len; i++) {
						end[i] = start[i] + end[i];
					}
                }
                ra.start = start;
                ra.end = end;
            }
        }
	});
})();	

	
(function() {
	    // Scroll Animation	
    var RSLIB = Rs.lib;
	RSLIB.Anim.scroll = function(el, args, duration, easing, cb, scope) {	        
	    return RSLIB.Anim.run(el, args, duration, easing, cb, scope, RSLIB.Scroll);
	}
	
    RSLIB.Scroll = function(el, attributes, duration, method) {
        if(el){
            RSLIB.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Rs.extend(RSLIB.Scroll, RSLIB.ColorAnim);

    var superclass = RSLIB.Scroll.superclass,
    	SCROLL = 'scroll';

    Rs.apply(RSLIB.Scroll.prototype, {

        doMethod : function(attr, start, end) {
            var val,
            	me = this,
            	curFrame = me.curFrame,
            	totalFrames = me.totalFrames;

            if(attr == SCROLL){
                val = [me.method(curFrame, start[0], end[0] - start[0], totalFrames),
                       me.method(curFrame, start[1], end[1] - start[1], totalFrames)];
            }else{
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        getAttr : function(attr) {
            var me = this;

            if (attr == SCROLL) {
                return [me.el.scrollLeft, me.el.scrollTop];
            }else{
                return superclass.getAttr.call(me, attr);
            }
        },

        setAttr : function(attr, val, unit) {
            var me = this;

            if(attr == SCROLL){
                me.el.scrollLeft = val[0];
                me.el.scrollTop = val[1];
            }else{
                superclass.setAttr.call(me, attr, val, unit);
            }
        }
    });
})();