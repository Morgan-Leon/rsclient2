Rs.ns('Rs.ux');

Rs.ux.JSONP = (function(){
    var _queue = [],
        _current = null,
        _nextRequest = function() {
            _current = null;
            if(_queue.length) {
                _current = _queue.shift();
    			_current.script.src = _current.url + '?' + _current.params;
    			document.getElementsByTagName('head')[0].appendChild(_current.script);
            }
        };

    return {
        request: function(url, o) {
            if(!url) {
                return;
            }
            var me = this;

            o.params = o.params || {};
            if(o.callbackKey) {
                o.params[o.callbackKey] = 'Rs.ux.JSONP.callback';
            }
            var params = Rs.urlEncode(o.params);

            var script = document.createElement('script');
			script.type = 'text/javascript';

            if(o.isRawJSON) {
                if(Rs.isIE) {
                    Rs.fly(script).on('readystatechange', function() {
                        if(script.readyState == 'complete') {
                            var data = script.innerHTML;
                            if(data.length) {
                                me.callback(Rs.decode(data));
                            }
                        }
                    });
                }
                else {
                     Rs.fly(script).on('load', function() {
                        var data = script.innerHTML;
                        if(data.length) {
                            me.callback(Rs.decode(data));
                        }
                    });
                }
            }

            _queue.push({
                url: url,
                script: script,
                callback: o.callback || function(){},
                scope: o.scope || window,
                params: params || null
            });

            if(!_current) {
                _nextRequest();
            }
        },

        callback: function(json) {
            _current.callback.apply(_current.scope, [json]);
            Rs.fly(_current.script).removeAllListeners();
            document.getElementsByTagName('head')[0].removeChild(_current.script);
            _nextRequest();
        }
    }
})();