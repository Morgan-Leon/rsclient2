/**
 * 组合应用程序引擎,在定义组合应用程序时,在其描述文件中objCfg属性使用该类，如下示例：
 * @class Rs.app.LittleEngine
 * @extends Rs.app.Engine 
 * <pre><code>
    R = (function() {
        return {
            id : 'all_in_one_app',
            name : '组合程序',
            objCfg : {
                clazz : 'Rs.app.LittleEngine', //声明该应用程序类
                cfg : {
                    shell : 'border', //声明该组合程序的布局方式
                    apps : [ { //配置该组合程序要引入的应用程序
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
     * 重写Rs.app.Engine的main方法，传入参数为页面程序引擎,和该小引擎所在位置
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

    // 重写父类方法
    getContainer : function() {
        var container = this.container, region = this.region;
        if (!container && region) {
            container = this.container = region.getTargetEl();
        }
        return container;
    },

    /**
     * 设置位置
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
     * 获取坐标
     * 
     * @method getXY
     * @return {Array} xy
     */
    getXY : function() {
        var x = this.x, y = this.y;
        return [ x, y ];
    },

    /**
     * 设置宽高
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
     * 获取的宽高
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
    
    //重写父类方法,该小引擎不支持单独设置主题
    applyTheme : function(theme, callback, scope){
        if(Rs.isFunction(callback)){
            callback.call(scope || this);
        }
    }

});