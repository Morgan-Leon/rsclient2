Rs.ns("Rs.app");

(function() {
    
    /**
     * @class Rs.app.EventBus
     * @extends Rs.util.Observable
     * ���𴫵�app�¼���������Ӧ���׳�
     * ��Rs.app.EventBusע���¼�ʾ����
     * <pre><code>
        Rs.EventBus.register(this, 'addwindow', ['adddim']);
     * </code></pre>
     * ����Rs.app.EventBus�¼�ʾ����
     * <pre><code>
        Rs.EventBus.on('addwindow-adddim', this.onAddDim, this);
     * </code></pre>
     * @constructor
     * @param {Object} config
     */
    Rs.app.EventBus = function(config) {
        config = config || {};
        Rs.apply(this, config);
        Rs.app.EventBus.superclass.constructor.call(this);
        this.bus = new Rs.util.MixedCollection();
    };

    Rs.extend(Rs.app.EventBus, Rs.util.Observable, {

        /**
         * @cfg {String} separator
         * �ָ���
         */
        separator : '-',

        /**
         * ע����ӵ�BUS�ϵĶ���
         * @method register
         * @param {Object} o
         * @param {String} prefix
         * @param {Array} events 
         */
        register : function(o, prefix, events) {
            prefix = (Rs.isString(prefix) ? prefix : '') + this.separator;
            this.relayBusEvents(o, prefix, events);
            this.bus.add(prefix, o);
        },

        //private
        relayBusEvents : function(o, prefix, events) {
            var me = this;
            function createHandler(ename) {
                return function() {
                    return me.fireEvent.apply(me, [ ename ]
                            .concat(Array.prototype.slice.call(arguments, 0)));
                };
            }
            for ( var i = 0, len = events.length; i < len; i++) {
                var ename = events[i],
                    ename2 = prefix + ename;
                me.events[ename2] = me.events[ename2] || true;
                o.on(ename, createHandler(ename2), me);
            }
        },

        //ȡ��ע��
        unregister : function(c) {
            this.bus.remove(c);
        }

    });

    /**
     * @class Rs.EventBus 
     * �¼�����
     */
    Rs.EventBus = new Rs.app.EventBus({});

})();