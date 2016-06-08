/**
 * ���Ӧ�ó�������,�ڶ������Ӧ�ó���ʱ,���������ļ���objCfg����ʹ�ø��࣬����ʾ����
 * @class Rs.app.LittleEngine
 * @extends Rs.app.Engine 
 * <pre><code>
    R = (function() {
        return {
            id : 'all_in_one_app',
            name : '��ϳ���',
            objCfg : {
                clazz : 'Rs.app.LittleEngine', //������Ӧ�ó�����
                cfg : {
                    shell : 'border', //��������ϳ���Ĳ��ַ�ʽ
                    apps : [ { //���ø���ϳ���Ҫ�����Ӧ�ó���
                        folder : 'acctTree',
                        id : 'all_in_one_acct_tree',
                        region : {
                            rid : 'west',
                            width : 200,
                            collapsible : true
                        }
                    }, {
                        folder : 'acctGrid',
                        id : 'all_in_one_acct_grid',
                        region : 'center'
                    }, {
                        folder : 'acctCreate',
                        id : 'all_in_one_acct_create_panel',
                        region : {
                            rid : 'east',
                            width : 220,
                            collapsible : true
                        }
                    }]
                }
            }
        };
    })();
 * 
 * </code></pre>
 * @constructor
 * @param {Object} config
 */
Rs.define('Rs.app.LittleEngine', {

    extend : Rs.app.Engine,

    constructor : function(config) {
        config = Rs.apply(config || {}, {
            width : 0,
            height : 0
        });
        Rs.app.LittleEngine.superclass.constructor.call(this, config);
    },

    /**
     * ��дRs.app.Engine��main�������������Ϊҳ���������,�͸�С��������λ��
     * 
     * @param {Rs.app.Engine} engine
     * @param {Rs.app.Region} region
     */
    main : function(engine, region) {
        this.engine = engine;
        this.region = region;
        Rs.app.LittleEngine.superclass.main.call(this);
        var callback = function(w, h, x, y) {
            this.setSize( {
                width : w,
                height : h
            });
            this.setXY( [ x, y ]);
        };
        region.addResizeListener(callback, this, {
            delay : 100,
            buffer : 100
        });
        region.addMoveListener(callback, this, {
            delay : 100,
            buffer : 100
        });
        return this;
    },

    // ��д���෽��
    getContainer : function() {
        var container = this.container, region = this.region;
        if (!container && region) {
            container = this.container = region.getTargetEl();
        }
        return container;
    },

    /**
     * ����λ��
     * 
     * @method setXY
     * @param {Array} xy
     */
    setXY : function(xy) {
        var x = xy[0], y = xy[1];
        if (Rs.isNumber(x)) {
            this.x = x;
        }
        if (Rs.isNumber(y)) {
            this.y = y;
        }
        this.shell.reBuild();
    },

    /**
     * ��ȡ����
     * 
     * @method getXY
     * @return {Array} xy
     */
    getXY : function() {
        var x = this.x, y = this.y;
        return [ x, y ];
    },

    /**
     * ���ÿ��
     * 
     * @method setSize
     * @param {Object} box
     */
    setSize : function(box) {
        if (box) {
            var w = box.width, h = box.height;
            if (Rs.isNumber(w) && w > 0) {
                this.width = w;
            }
            if (Rs.isNumber(h) && h > 0) {
                this.height = h;
            }
            if (this.shell && Rs.isFunction(this.shell.reBuild)) {
                this.shell.reBuild();
            }
        }
    },

    /**
     * ��ȡ�Ŀ��
     * 
     * @method getSize
     * @return {Object}
     */
    getSize : function() {
        return {
            width : this.width,
            height : this.height
        };
    }, 
    
    //��д���෽��,��С���治֧�ֵ�����������
    applyTheme : function(theme, callback, scope){
        if(Rs.isFunction(callback)){
            callback.call(scope || this);
        }
    }

});