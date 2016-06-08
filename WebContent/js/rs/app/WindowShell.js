(function(){
    
    /**
     * 窗口式界面
     * @class Rs.app.WindowShell
     * @extend Rs.app.Shell
     * @constructor
     * @param {Object} config
     */
    Rs.app.WindowShell = Rs.extend(Rs.app.Shell, {
        
        //整体框架
        frameTpl : ['<div class="rs-window-shell-background"></div>',
                    '<div class="rs-window-shell-taskbar"></div>'],
        
        //任务栏配置
        taskBarCfg : {},
        
        //任务栏的位置,可选的位置有north south east west
        taskBarPosition : 'south',
        
        /**
         * @cfg {String} backgroundCls
         * 背景样式
         */
        backgroundCls : 'rs-window-shell-background-1',
        
        //当窗口大小发生变化的时候执行该方法,调整任务栏的大小和位置
        onWindowResize : function(){
            Rs.app.WindowShell.superclass.onWindowResize.apply(this, arguments);
            //调整任务栏的大小和位置
            var taskbar = this.taskbar;
            if(taskbar){
                taskbar.doLayout();
            }
            //调整背景的大小和样式
            this.syncBackGround();
        },
        
        /**
         * 重写doBuild方法,当程序引擎启动的时候调用该方法,构建应用程序
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.WindowShell.superclass.doBuild.apply(this, arguments);
            
            var frame = this.frame,
                taskBarEl = frame.child('.rs-window-shell-taskbar');
            
            //创建任务栏
            if(taskBarEl){
                var taskbar = this.taskbar,
                    xy, size;
                if(!taskbar){
                    taskbar = this.taskbar = new WindowShellTaskBar(this, 
                            this.taskBarPosition, this.taskBarCfg);
                    taskbar.renderTo(taskBarEl);
                }
            }
            //设置背景
            this.backgroundEl = frame.child('.rs-window-shell-background');
            this.syncBackGround();
        },
        
        //调整背景的大小和样式图片
        syncBackGround : function(){
            var backgroundEl = this.backgroundEl;
            if(backgroundEl){
                var size = this.getSize();
                backgroundEl.setX(0);
                backgroundEl.setY(0);
                backgroundEl.setWidth(size.width);
                backgroundEl.setHeight(size.height);
                
                backgroundEl.addClass(this.backgroundCls);
            }
        }
        
    });
    
    //注册window类型的shell
    Rs.app.SHELL['window'] = Rs.app.WindowShell;
    
    /*
     * 任务栏, 其中包括开始按钮,当用户点击打开应用程序的时候
     * 在任务栏显示所有已经打开的程序
     */
    var WindowShellTaskBar = function(shell, position, config){
        this.shell = shell;
        this.position = position || 'south';
        Rs.apply(this, config);
        WindowShellTaskBar.superclass.constructor.call(this);
    };

    Rs.extend(WindowShellTaskBar, Rs.util.Observable, {
        
        /**
         * @cfg {Number} width default 50
         */
        width : 30,
        
        /**
         * @cfg {Number} height defualt 30
         */
        height : 30,
        
        /**
         * 开始菜单名字
         * @cfg {String} startButtonText 
         */
        startButtonText : '开始',
        
        //private
        rendered : false,
        
        /**
         * 渲染开始菜单
         * @method renderTo
         * @param {Element} el
         */
        renderTo : function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el;
                this.rendered = true;
                //设置样式
                this.targetEl.addClass('rs-window-shell-taskbar-' + this.position);
                
                //添加开始菜单按钮
                this.getStartButtonEl();
                
                //添加任务栏上的按钮位置
                this.getTaskButtonsEl();
                
                //保存任务栏程序按钮
                this.taskButtons = new Rs.util.MixedCollection();
                
                //初始化事件设置
                this.initEvents();
                this.afterRender();
                this.syncPosSize();
            }
        },
        
        //获取开始菜单按钮
        getStartButtonEl : function(){
            var pos = this.position,
                startButtonEl = this.startButtonEl,
                innerHTML ;
            if(!startButtonEl){
                if(pos == 'north' || pos == 'south'){
                    innerHTML = '<table><tr>'
                        +'<td class="rs-window-shell-start-left-h"><i>&#160;</i></td>'
                        +'<td class="rs-window-shell-start-center-h">'
                        +'<button id="rs-window-shell-start-button" class="rs-window-shell-start-text start"'
                        +'type="button" style="height:28px;">' + this.startButtonText + '</button></td>'
                        +'<td class="rs-window-shell-start-right-h"><i>&#160;</i></td>'
                        +'<td><i>&#160;</i></td>'
                        +'<td class="rs-window-shell-start-split-h"><i></i></td>'
                        +'</tr></table>';
                }else if(pos == 'west' || pos == 'east'){
                    innerHTML = '<table><tr>'
                        +'<td class="rs-window-shell-start-left-v"><i>&#160;</i></td></tr><tr>'
                        +'<td class="rs-window-shell-start-center-v">'
                        +'<button id="rs-window-shell-start-button" class="rs-window-shell-start-text start" '
                        +'type="button" style="height:30px;"></button></td></tr><tr>'
                        +'<td class="rs-window-shell-start-right-v"><i>&#160;</i></td></tr><tr>'
                        +'<td><i>&#160;</i></td></tr><tr>'
                        +'<td class="rs-window-shell-start-split-v"><i></i></td></tr><tr>'
                        +'</table>';
                }
                
                //添加开始菜单
                startButtonEl = this.startButtonEl = this.targetEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start',
                    html : innerHTML
                });
                startButtonEl.addClass('rs-window-shell-start-' + pos);
                startButtonEl.unselectable();
                
                var startButton = this.startButton = Rs.get('rs-window-shell-start-button');
                if(startButton){
                    startButton.on('click', this.toggleStartMenu, this);
                }
                var body = Rs.getBody();
                body && body.on('keydown', function(k, el){
                    if(k && k.ctrlKey === true && k.getKey() == 91){
                        this.toggleStartMenu();
                    }
                }, this);
            }
            return startButtonEl;
        },
        
        //任务栏上已打开程序名字按钮
        getTaskButtonsEl : function(){
            var taskButtonsEl = this.taskButtonsEl;
            if(!taskButtonsEl){
                //位置
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    strip = this.targetEl.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-strip' + (v?'-vertical':'')
                    }), wrap = this.taskButtonsWrap = strip.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-strip-wrap' + (v?'-vertical':'')
                    }), leftScroller = this.leftScroller = wrap.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-scroller-left' + (v?'-vertical':'')
                    }), taskButtonsEl = this.taskButtonsEl = wrap.createChild({
                        tag : 'ul'
                    }), rightScroller = this.rightScroller = wrap.createChild({
                        tag : 'div',
                        cls : 'rs-window-shell-taskbuttons-scroller-right' + (v?'-vertical':'')
                    });
                
                leftScroller.on('mousedown', function(){
                    var id = setInterval((function(){
                        if(this.scrollerToLeft() !== true){
                            clearInterval(id);
                        }
                    }).createDelegate(this), 15);
                    leftScroller.on('mouseup', function(){
                        clearInterval(id);    
                    }, this, {
                        single : true
                    });
                }, this);
                rightScroller.on('mousedown', function(){
                    var id = setInterval((function(){
                        if(this.scrollerToRight() !== true){
                            clearInterval(id);
                        }
                    }).createDelegate(this), 15);
                    rightScroller.on('mouseup', function(){
                        clearInterval(id);
                    }, this, {
                        single : true
                    });
                }, this);

                leftScroller.hide();
                rightScroller.hide();
                
                leftScroller.unselectable();
                rightScroller.unselectable();
                taskButtonsEl.unselectable();
            }
            return taskButtonsEl;
        },
        
        //private
        scrollerToLeft : function(){
            var taskButtonsEl = this.taskButtonsEl,
                last = taskButtonsEl.last('li'),
                rightScroller = this.rightScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getRight = v?'getBottom':'getRight',
                getLeft = v?'getTop':'getLeft',
                setX = v?'setY':'setX',
                getX = v?'getY':'getX'; 
            if(last){
                var r = last[getRight](),
                    o = rightScroller[getLeft]();
                if(r > o){
                    taskButtonsEl[setX](taskButtonsEl[getX]() - 5);
                    return true;
                }
            }
        },
        
        //private
        scrollerToRight : function(){
            var taskButtonsEl = this.taskButtonsEl,
                first = taskButtonsEl.first('li'),
                leftScroller = this.leftScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getRight = v?'getBottom':'getRight',
                getLeft = v?'getTop':'getLeft',
                setX = v?'setY':'setX',
                getX = v?'getY':'getX'; 
            if(first){
                var r = first[getLeft](),
                    o = leftScroller[getRight]();
                if(r < o){
                    taskButtonsEl[setX](taskButtonsEl[getX]() + 5);
                    return true;
                }
            }
        },
        
        //打开关闭开始菜单
        toggleStartMenu : function(){
            var startMenu = this.getStartMenu();
            if(startMenu){
                startMenu[startMenu.isVisible()?'hide':'show']();
            }
        },
        
        //初始化事件设置
        initEvents : function(){
            var shell = this.shell,
                engine = shell.getEngine();
            engine.on('install', this.onAppInstall, this);
            engine.on('uninstall', this.onAppUninstall, this);
        },
        
        //当应用程序安装的时候执行该方法
        onAppInstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppInstall(app);
            app.on('open', this.onAppOpen, this);
            app.on('close', this.onAppClose, this);
        },
        
        //当应用程序卸载的时候执行该方法
        onAppUninstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppUninstall(app);
            app.un('open', this.onAppOpen, this);
            app.un('close', this.onAppClose, this);
        },
        
        //当应用程序打开的时候
        onAppOpen : function(app){
            var startMenu = this.getStartMenu();
            startMenu.onAppOpen(app);
            //在任务栏上显示该应用程序的名字
            this.doAddTaskButton(app);
        },
        
        //添加程序按钮
        doAddTaskButton : function(app){
            var taskButtonsEl = this.taskButtonsEl;
            if(taskButtonsEl){
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    startButtonEl = this.startButtonEl,
                    last = taskButtonsEl.last('li'),
                    offset = (last?last:startButtonEl)[v?'getBottom':'getRight']() + 3,
                    region = app.region,
                    id = 'taskbutton-' + app.getId(),
                    name = app.getName() || '',
                    icon = app.getIcon16(),
                    innerHTML, name_v = [];
                
                if(v){
                    for(var i = 0, len = name.length; i < len; i++){
                        name_v.push((i==0?'':'<br/>')+name.charAt(i));
                    }
                }
                innerHTML = v ? '<table class="rs-window-shell-taskbuttons-activate"><tr>'
                        +'<td class="rs-window-shell-taskbutton-left-vertical"><i></i></td>'
                        +'</tr><tr><td class="rs-window-shell-taskbutton-center-vertical">'
                        +'<div class="rs-window-shell-taskbutton-text-vertical rs-window-shell-taskbutton-icon-vertical '+ icon +'">'
                        + name_v.join('')
                        +'</div></td></tr><tr>'
                        +'<td class="rs-window-shell-taskbutton-right-vertical"><i></i></td>'
                        +'</tr></table>' : '<table class="rs-window-shell-taskbuttons-activate"><tr>'
                            +'<td class="rs-window-shell-taskbutton-left"><i></i></td>' //&#160;
                            +'<td class="rs-window-shell-taskbutton-center">'
                            +'<button class="rs-window-shell-taskbutton-text rs-window-shell-taskbutton-icon '+ icon +'"'
                            +'type="button">' + name + '</button></td>'
                            +'<td class="rs-window-shell-taskbutton-right"><i></i></td>' //&#160;
                            +'</tr></table>';
                
                var button = this.taskButtons.add(taskButtonsEl.createChild({
                    tag : 'li',
                    id : id,
                    html : innerHTML
                }));
                
                button[v?'setY':'setX'](offset);
                
                //点击该按钮显示或隐藏应用程序
                button.on('click', this.toggleTaskButton.createDelegate(this, 
                    [app, region]), this);
                
                //窗口状态发生变化时修改按钮样式
                var table = button.first('table'),
                    cls = 'rs-window-shell-taskbuttons-activate';
                region.on('activate', function(){
                    if(table && !table.hasClass(cls)){
                        table.addClass(cls);
                    }
                }, this);
                region.on('deactivate', function(){
                    if(table && table.hasClass(cls)){
                        table.removeClass(cls);
                    }
                }, this);
                
                //调整显示左右滚动条按钮
                this.toggleLeftRightScroller();
            }
        },
        
        //private
        toggleLeftRightScroller : function(){
            var wrap = this.taskButtonsWrap,
                taskButtonsEl = this.taskButtonsEl,
                first = taskButtonsEl.first('li'),
                last = taskButtonsEl.last('li'),
                leftScroller = this.leftScroller,
                rightScroller = this.rightScroller,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                get = v?'getY':'getX',
                set = v?'setY':'setX',
                getLeft = v?'getTop':'getLeft',
                getRight = v?'getBottom':'getRight',
                moveToLeft = function(m){
                    var btns = this.taskButtons, btn,
                        i = 0, len = btns.length;
                    for(; i < len; i++){
                        btn = btns.get(i);
                        btn[set](btn[get]() - m);
                    }
                }, moveToRight = function(m){
                    var btns = this.taskButtons, btn,
                        i = 0, len = btns.length;
                    for(; i < len; i++){
                        btn = btns.get(i);
                        btn[set](btn[get]() + m);
                    }
                }, showScroller = function(){
                    if(!leftScroller.isVisible()){
                        leftScroller.show();
                        moveToRight.call(this, 19);
                    }
                    if(!rightScroller.isVisible()){
                        rightScroller.show();
                    }
                }, hiddenScroller = function(){
                    if(leftScroller.isVisible()){
                        leftScroller.hide();
                        moveToLeft.call(this, 19);
                    }
                    if(rightScroller.isVisible()){
                        rightScroller.hide();
                    }
                };
            if(last){
                var l = wrap[getLeft](),
                    r = wrap[getRight](),
                    a = first[getLeft](),
                    b = last[getRight]();
                if(Math.abs(b - a) > Math.abs(r - l)){
                    showScroller.call(this);
                    if(r > b){
                        moveToRight.call(this, r - b);
                    }else if(l < a - 19){
                        moveToLeft.call(this, a - 19 - l);
                    }
                }else {
                    hiddenScroller.call(this);
                }
            }else {
                hiddenScroller.call(this);
            }
        },
        
        
        //private
        toggleTaskButton : function(app, region){
            if(region){
                if(Rs.app.WindowRegionMgr.getActive() != region){
                    region.show();
                }else {
                    region[region.isVisible()?'hide':'show']();
                }
            }
        },
        
        //当应用程序关闭的时候
        onAppClose : function(app){
            //在任务栏上删除该任务栏的名字
            var taskButtons = this.taskButtons,
                id = 'taskbutton-' + app.getId(),
                startButtonEl = this.startButtonEl,
                left = startButtonEl.getRight() + 3,
                found = false, button,
                pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                getLeft = v?'getTop':'getLeft',
                getRight = v?'getBottom':'getRight',
                setX = v?'setY':'setX';
            for(var i = 0; i < taskButtons.length; i++){
                button = taskButtons.itemAt(i);
                if(id == button.id){
                    left = button[getLeft]();
                    found = true;
                    button.remove();
                    taskButtons.remove(button); 
                    i--;
                }else if(found === true){
                    button[setX](left);
                    left = button[getRight]() + 3;
                }
            }
            
            //调整显示左右滚动条按钮
            this.toggleLeftRightScroller();
            
            //执行startMenu的onAppClose方法
            var startMenu = this.getStartMenu();
                startMenu.onAppClose(app);
        },
        
        //渲染完成之后执行该方法
        afterRender : Rs.emptyFn,
        
        //同步任务栏的大小和位置
        syncPosSize : function(){
            
            //设置整体任务栏大小
            var xy = this.getXY(),
                size = this.getSize();
            this.setX(xy[0]);
            this.setY(xy[1]);
            this.setWidth(size.width);
            this.setHeight(size.height);
            
            var wrap = this.taskButtonsWrap;
            if(wrap){
                var pos = this.position,
                    v = (pos == 'west' || pos == 'east'),
                    w = this.getTaskButtonsWrapWidth();
                wrap[v?'setHeight':'setWidth'](w);
            }
            
            //调整显示左右滚动条按钮
            this.toggleLeftRightScroller();
            
            this.fireEvent('render', this);
        },
        
        //private 获取任务栏的宽度,如果任务栏为垂直模式则返回的是任务栏的高度
        getTaskButtonsWrapWidth : function(){
            var pos = this.position,
                v = (pos == 'west' || pos == 'east'),
                shell = this.shell,
                size = shell.getSize(),
                startBtn = this.getStartButtonEl();
            if(v == true){
                return size.height - startBtn.getHeight();
            }else {
                return size.width - startBtn.getWidth();
            }
        },
        
        //设置任务栏的X坐标
        setX : function(x){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setX(x);
            }
        },
        
        //设置任务栏Y坐标
        setY : function(y){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setY(y);
            }
        },
        
        /**
         * 获取任务栏的位置
         * @method getXY
         * @return {Array} pos
         */
        getXY : function(){
            var shell = this.shell,
                size = shell.getSize(),
                pos = this.position,
                b = this.getSize(),
                x, y;
            if(pos == 'north' || pos == 'south'){
                x = 0;
                y = size.height - (pos=='north'?size.height:b.height);
            }else if(pos == 'west' || pos == 'east'){
                y = 0;
                x = size.width - (pos=='west'?size.width:b.width); 
            }
            return [x, y];
        },
        
        //设置任务栏的宽度
        setWidth : function(w){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setWidth(w);
            }
        },
        
        //设置任务栏高度
        setHeight : function(h){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setHeight(h);
            }
        },
        
        /**
         * 获取开始菜单大小
         * <pre><code> 
          return {
             width : 1024,
             height : 30
          }
         </code></pre>
         * @method getSize
         * @return {Object} size
         */
        getSize : function(){
            var shell = this.shell,
                size = shell.getSize(),    
                pos = this.position,
                w, h;
            if(pos == 'north' || pos == 'south'){
                w = size.width;
                h = this.height;
            }else if(pos == 'east' || pos == 'west'){
                w = this.width;
                h = size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        
        //调整任务栏以及其中的各个元素的位置和大小
        doLayout : function(){
            this.syncPosSize();
        }, 
        
        //获取开始菜单
        getStartMenu : function(){
            var startMenu = this.startMenu;
            if(!startMenu){
                startMenu = this.startMenu = new WindowShellStartMenu(this.shell, this, {});
            }
            return startMenu;
        }
        
    });
    
    /*
     * 开始菜单栏
     */
    var WindowShellStartMenu = function(shell, taskbar, config){
        
        this.shell = shell;
        
        this.taskbar = taskbar;
        
        Rs.apply(this, config);
        
        this.appEls = new Rs.util.MixedCollection();

        this.settings = new Rs.util.MixedCollection();
        
        WindowShellStartMenu.superclass.constructor.call(this);
        
        this.init();
    };
    
    Rs.extend(WindowShellStartMenu, Rs.util.Observable, {
        
        width : 300,
        
        height : 400,
        
        //设置面板部分的宽度
        settingBodyWidth : 100,
        
        //private
        hidden : true,
        
        //初始化菜单栏
        init : function(){
            this.body = Rs.getBody().createChild({
               tag : 'div',
               cls : 'rs-window-shell-start-menu'
            });
            this.body.addClass('rs-window-shell-start-menu-hidden');
            
            var focusEl = this.focusEl = this.body.insertFirst({
                tag: 'a',
                href:'#',
                cls:'rs-app-window-focus',
                tabIndex:'-1',
                html: '&#160;'
            });
            focusEl.swallowEvent('click', true);
            focusEl.on('blur', function(e, a, b){
                this.hide();
            }, this, {
                delay : 300,
                scope : this
            });
            this.getHeaderEl();
            this.getContentEl();
        },
        
        //开始菜单头部   
        getHeaderEl : function(){
            var body = this.body,
                headerEl = this.headerEl;
            if(!headerEl){
                var hl = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hl'
                }), hr = hl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hr'
                }), hc = hr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-hc'
                }), headerEl = this.headerEl = hc.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-header'
                });
                headerEl.addClass('user');
                headerEl.createChild({
                    html : '<span class="rs-window-shell-start-menu-user">' 
                        + (USERINFO && USERINFO.USERNAME ? USERINFO.USERNAME : '')
                        + '</span>'
                });
            }
            return headerEl;
        },
        
        //开始菜单主体部分
        getContentEl : function(){
            var body = this.body,
                contentEl = this.contentEl;
            if(!contentEl){
                var cb = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cb'
                }), cl = cb.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cl'
                }), cr = cl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-cr'
                }), contentEl = this.contentEl = cr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-content'
                });
                //应用程序列表
                this.appBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-app'
                });
                this.allAppEl = this.appBody.createChild({
                    tag : 'ul'
                });
                //设置面板
                this.settingBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-setting'
                });
                this.settingUl = this.settingBody.createChild({
                    tag : 'ul'
                });
                
                //底部边框
                var fb = this.footerEl = body.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fb'
                }), fl = fb.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fl'
                }), fr = fl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-fr'
                }), fc = fr.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-footer'
                });
            }
            return contentEl;
        },
        
        //当应用程序安装
        onAppInstall : function(app){
            
            //添加应用程序名称
            var id = app.getId(), 
                name = app.getName() || '',
                item = this.appEls.add(id, this.allAppEl.createChild({
                    tag : 'li',
                    cls : 'rs-window-shell-start-menu-item'
                }));
            
            item.createChild({
                cls :  app.getIcon16() || 'rs-window-shell-default-app-icon',
                html : '<span class="rs-window-shell-start-menu-app-name">' + name + '</span>' 
            });
            
            //当鼠标经过该应用程序修改样式
            item.on('mouseover', function(){
                item.addClass('rs-window-shell-start-menu-item-over');
                item.on('mouseleave', function(){
                    item.removeClass('rs-window-shell-start-menu-item-over');
                }, this, {
                    single : true
                });
            }, this);
            
            //点击应用程序名称打开该程序
            item.on('click', function(a){
                if(!a.isOpen()){
                    a.open();
                    (function(){
                        this.hide();
                    }).defer(100, this);
                }
            }.createDelegate(this, [app]), this);
        },
        
        //当应用程序卸载
        onAppUninstall : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id);
            if(appEl){
                appEl.removeAllListeners();
                appEl.remove();
                appEls.removeKey(id);
            }
        }, 
        
        //当应用程序打开,在开始菜单将该应用程序名字高亮
        onAppOpen : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && !appEl.hasClass(cls)){
                appEl.addClass(cls);
            }
        },
        
        //当应用程序关闭,在开始菜单将该应用程序名字取消高亮
        onAppClose : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && appEl.hasClass(cls)){
                appEl.removeClass(cls);
            }
        },
        
        //是否显示
        isVisible : function(){
            return this.hidden === false;
        },
        
        //调整位置和大小
        syncPosSize : function(){
            var body = this.body,
                contentEl = this.getContentEl(),
                sbw = this.settingBodyWidth,
                
                taskbar = this.taskbar,
                appBody = this.appBody,
                settingBody = this.settingBody,
                
                pos = taskbar.position,
                xy1 = taskbar.getXY(),
                x1 = xy1[0], y1 = xy1[1],
                wh1 = taskbar.getSize(),
                x, y, w, h;
            
            //body的大小和位置
            w = this.width;
            h = this.height;
            
            if(pos == 'north' || pos == 'south'){
                x = 3;
                y = y1 - (pos=='south'?h+3:(-1)*(3+wh1.height));
            }else if(pos == 'west' || pos == 'east'){
                x = x1 + (pos=='west'?(wh1.width+3):(-1)*(3+w));
                y = 3;
            }
            
            //主面板的大小和位置
            body.setX(x);
            body.setY(y);
            
            body.setWidth(w);
            body.setHeight(h);
            
            contentEl.setHeight(h - 26);
            
            //程序部分的大小和位置
            appBody.setWidth(w - sbw -6);
            appBody.setHeight(h - 26);
            
            //设置面板的大小和位置
            settingBody.setX(x + w - sbw);
            settingBody.setWidth(sbw);
            settingBody.setHeight(h - 26);
        },
        
        //显示菜单栏
        show : function(){
            var f = this.focusEl;
            if(f){
                f.focus.defer(10, f);
            }
            this.hidden = false;
            var cls = 'rs-window-shell-start-menu-hidden',
                body = this.body;
            if(body.hasClass(cls)){
                body.removeClass(cls);
            }
            this.syncPosSize();
        },
        
        //隐藏菜单栏
        hide : function(){
            this.hidden = true;
            var cls = 'rs-window-shell-start-menu-hidden',
                body = this.body;
            if(!body.hasClass(cls)){
                body.addClass(cls);
            }
        }
         
    });
    
})();