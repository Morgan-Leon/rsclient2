Rs.define('rs.buildinapp.monitor.Monitor', {

    mixins : [ Rs.app.Main ],

    statics : {
        TYPES : {
            store : {
                template : '<span class="{0}">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS </span>程序信息:{6}</span>',
                compile : function(cfg){
                    var cls = 'monitor-' + cfg.type,
                        start = cfg.start, startTime,
                        end = cfg.end, endTime,
                        duration, state,
                        name = cfg.name,
                        desc = cfg.desc;
                    
                    startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                    endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                    
                    duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                    state = (duration < 1000 ? '' : 'monitor-warning');
                    
                    return String.format(this.template, cls, 
                            name, startTime, endTime, state, duration, desc);
                }
            },
            service : {
                template : '<span class="{0}">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS </span>服务信息:{6}</span>',
                compile : function(cfg){
                    var cls = 'monitor-' + cfg.type,
                        start = cfg.start, startTime,
                        end = cfg.end, endTime,
                        duration, state,
                        name = cfg.name,
                        desc = cfg.desc;
                    
                    startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                    endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                    
                    duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                    state = (duration < 500 ? '' : 'monitor-warning');
                    
                    return String.format(this.template, cls, 
                            name, startTime, endTime, state, duration, desc);
                }
            },
            component : {
                template : '<span class="{0}">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS </span>程序信息:{6}</span>',
                compile : function(cfg){
                    var cls = 'monitor-' + cfg.type,
                        start = cfg.start, startTime,
                        end = cfg.end, endTime,
                        duration, state,
                        name = cfg.name,
                        desc = cfg.desc;
                    startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                    endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                    duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                    state = (duration < 100 ? '' : 'monitor-warning');
                    return String.format(this.template, cls,
                            name, startTime, endTime, state, duration, desc);
                }
            }, 
            engine : {
                template : '<span class="{0}">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS </span>引擎信息:{6}</span>',
                compile : function(cfg){
                    var cls = 'monitor-' + cfg.type,
                        start = cfg.start, startTime,
                        end = cfg.end, endTime,
                        duration, state,
                        name = cfg.name,
                        desc = cfg.desc;
                    startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                    endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                    duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                    state = (duration < 100 ? '' : 'monitor-warning');
                    return String.format(this.template, cls,
                            name, startTime, endTime, state, duration, desc);
                }
            },
            treeloader : {
                template : '<span class="{0}">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS </span>程序信息:{6}</span>',
                compile : function(cfg){
                    var cls = 'monitor-' + cfg.type,
                        start = cfg.start, startTime,
                        end = cfg.end, endTime,
                        duration, state,
                        name = cfg.name,
                        desc = cfg.desc;
                    startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                    endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                    duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                    state = (duration < 100 ? '' : 'monitor-warning');
                    return String.format(this.template, cls,
                            name, startTime, endTime, state, duration, desc);
                }
            }
        },
        DEFAULTTYPE : {
            template : '<span class="monitor-default">[{1}] 开始:<span class="monitor-time">{2}</span> 结束:<span class="monitor-time">{3}</span> <span class="{4}">持续:{5}MS</span>详细信息:{6}</span>',
            compile : function(cfg){
                var start = cfg.start, startTime,
                    end = cfg.end, endTime,
                    duration, state,
                    name = cfg.name,
                    desc = cfg.desc;
                
                startTime = Rs.isDate(start) ? start.toLocaleTimeString() : '';
                endTime = Rs.isDate(end) ? end.toLocaleTimeString() : '';
                
                duration = (Rs.isDate(start) && Rs.isDate(end)) ? (end.getTime() - start.getTime()) : 0;
                state = (duration < 1000 ? '' : 'monitor-warning');
                
                return String.format(this.template, name, startTime, endTime, state, duration, desc);
            }
        }
    },

    constructor : function(config) {
        Rs.apply(this, config);
    },

    render : function(domEl) {
        var ct = this.ct = Rs.get(domEl);
        ct.addClass('monitor');
    },

    setWidth : function(w) {
        this.ct.setWidth(w);
    },

    setHeight : function(h) {
        this.ct.setHeight(h);
    },

    update : function(story) {
        var TYPES = rs.buildinapp.monitor.Monitor.TYPES,
            DEFAULTTYPE = rs.buildinapp.monitor.Monitor.DEFAULTTYPE,
            type, msg = [], ct = this.ct;
        Rs.each(story, function(s){
            if(TYPES.hasOwnProperty(s.type)){
                type = TYPES[s.type];
            }else {
                type = DEFAULTTYPE;
            }
            msg.push(type.compile(s));
        }, this);
        ct.update(msg.join('<br/>'));
    }

});
