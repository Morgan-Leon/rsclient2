(function(){
    
    /**
     * ����ʽ����
     * @class Rs.app.WindowShell
     * @extend Rs.app.Shell
     * @constructor
     * @param {Object} config
     */
    Rs.app.WindowShell = Rs.extend(Rs.app.Shell, {
        
        //������
        frameTpl : ['<div class="rs-window-shell-background"></div>',
                    '<div class="rs-window-shell-taskbar"></div>'],
        
        //����������
        taskBarCfg : {},
        
        //��������λ��,��ѡ��λ����north south east west
        taskBarPosition : 'south',
        
        /**
         * @cfg {String} backgroundCls
         * ������ʽ
         */
        backgroundCls : 'rs-window-shell-background-1',
        
        //�����ڴ�С�����仯��ʱ��ִ�и÷���,�����������Ĵ�С��λ��
        onWindowResize : function(){
            Rs.app.WindowShell.superclass.onWindowResize.apply(this, arguments);
            //�����������Ĵ�С��λ��
            var taskbar = this.taskbar;
            if(taskbar){
                taskbar.doLayout();
            }
            //���������Ĵ�С����ʽ
            this.syncBackGround();
        },
        
        /**
         * ��дdoBuild����,����������������ʱ����ø÷���,����Ӧ�ó���
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.WindowShell.superclass.doBuild.apply(this, arguments);
            
            var frame = this.frame,
                taskBarEl = frame.child('.rs-window-shell-taskbar');
            
            //����������
            if(taskBarEl){
                var taskbar = this.taskbar,
                    xy, size;
                if(!taskbar){
                    taskbar = this.taskbar = new WindowShellTaskBar(this, 
                            this.taskBarPosition, this.taskBarCfg);
                    taskbar.renderTo(taskBarEl);
                }
            }
            //���ñ���
            this.backgroundEl = frame.child('.rs-window-shell-background');
            this.syncBackGround();
        },
        
        //���������Ĵ�С����ʽͼƬ
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
    
    //ע��window���͵�shell
    Rs.app.SHELL['window'] = Rs.app.WindowShell;
    
    /*
     * ������, ���а�����ʼ��ť,���û������Ӧ�ó����ʱ��
     * ����������ʾ�����Ѿ��򿪵ĳ���
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
         * ��ʼ�˵�����
         * @cfg {String} startButtonText 
         */
        startButtonText : '��ʼ',
        
        //private
        rendered : false,
        
        /**
         * ��Ⱦ��ʼ�˵�
         * @method renderTo
         * @param {Element} el
         */
        renderTo : function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el;
                this.rendered = true;
                //������ʽ
                this.targetEl.addClass('rs-window-shell-taskbar-' + this.position);
                
                //��ӿ�ʼ�˵���ť
                this.getStartButtonEl();
                
                //����������ϵİ�ťλ��
                this.getTaskButtonsEl();
                
                //��������������ť
                this.taskButtons = new Rs.util.MixedCollection();
                
                //��ʼ���¼�����
                this.initEvents();
                this.afterRender();
                this.syncPosSize();
            }
        },
        
        //��ȡ��ʼ�˵���ť
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
                
                //��ӿ�ʼ�˵�
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
        
        //���������Ѵ򿪳������ְ�ť
        getTaskButtonsEl : function(){
            var taskButtonsEl = this.taskButtonsEl;
            if(!taskButtonsEl){
                //λ��
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
        
        //�򿪹رտ�ʼ�˵�
        toggleStartMenu : function(){
            var startMenu = this.getStartMenu();
            if(startMenu){
                startMenu[startMenu.isVisible()?'hide':'show']();
            }
        },
        
        //��ʼ���¼�����
        initEvents : function(){
            var shell = this.shell,
                engine = shell.getEngine();
            engine.on('install', this.onAppInstall, this);
            engine.on('uninstall', this.onAppUninstall, this);
        },
        
        //��Ӧ�ó���װ��ʱ��ִ�и÷���
        onAppInstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppInstall(app);
            app.on('open', this.onAppOpen, this);
            app.on('close', this.onAppClose, this);
        },
        
        //��Ӧ�ó���ж�ص�ʱ��ִ�и÷���
        onAppUninstall : function(engine, app){
            var startMenu = this.getStartMenu();
            startMenu.onAppUninstall(app);
            app.un('open', this.onAppOpen, this);
            app.un('close', this.onAppClose, this);
        },
        
        //��Ӧ�ó���򿪵�ʱ��
        onAppOpen : function(app){
            var startMenu = this.getStartMenu();
            startMenu.onAppOpen(app);
            //������������ʾ��Ӧ�ó��������
            this.doAddTaskButton(app);
        },
        
        //��ӳ���ť
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
                
                //����ð�ť��ʾ������Ӧ�ó���
                button.on('click', this.toggleTaskButton.createDelegate(this, 
                    [app, region]), this);
                
                //����״̬�����仯ʱ�޸İ�ť��ʽ
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
                
                //������ʾ���ҹ�������ť
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
        
        //��Ӧ�ó���رյ�ʱ��
        onAppClose : function(app){
            //����������ɾ����������������
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
            
            //������ʾ���ҹ�������ť
            this.toggleLeftRightScroller();
            
            //ִ��startMenu��onAppClose����
            var startMenu = this.getStartMenu();
                startMenu.onAppClose(app);
        },
        
        //��Ⱦ���֮��ִ�и÷���
        afterRender : Rs.emptyFn,
        
        //ͬ���������Ĵ�С��λ��
        syncPosSize : function(){
            
            //����������������С
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
            
            //������ʾ���ҹ�������ť
            this.toggleLeftRightScroller();
            
            this.fireEvent('render', this);
        },
        
        //private ��ȡ�������Ŀ��,���������Ϊ��ֱģʽ�򷵻ص����������ĸ߶�
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
        
        //������������X����
        setX : function(x){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setX(x);
            }
        },
        
        //����������Y����
        setY : function(y){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setY(y);
            }
        },
        
        /**
         * ��ȡ��������λ��
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
        
        //�����������Ŀ��
        setWidth : function(w){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setWidth(w);
            }
        },
        
        //�����������߶�
        setHeight : function(h){
            var targetEl = this.targetEl;
            if(targetEl){
                targetEl.setHeight(h);
            }
        },
        
        /**
         * ��ȡ��ʼ�˵���С
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
        
        
        //�����������Լ����еĸ���Ԫ�ص�λ�úʹ�С
        doLayout : function(){
            this.syncPosSize();
        }, 
        
        //��ȡ��ʼ�˵�
        getStartMenu : function(){
            var startMenu = this.startMenu;
            if(!startMenu){
                startMenu = this.startMenu = new WindowShellStartMenu(this.shell, this, {});
            }
            return startMenu;
        }
        
    });
    
    /*
     * ��ʼ�˵���
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
        
        //������岿�ֵĿ��
        settingBodyWidth : 100,
        
        //private
        hidden : true,
        
        //��ʼ���˵���
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
        
        //��ʼ�˵�ͷ��   
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
        
        //��ʼ�˵����岿��
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
                //Ӧ�ó����б�
                this.appBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-app'
                });
                this.allAppEl = this.appBody.createChild({
                    tag : 'ul'
                });
                //�������
                this.settingBody = contentEl.createChild({
                    tag : 'div',
                    cls : 'rs-window-shell-start-menu-setting'
                });
                this.settingUl = this.settingBody.createChild({
                    tag : 'ul'
                });
                
                //�ײ��߿�
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
        
        //��Ӧ�ó���װ
        onAppInstall : function(app){
            
            //���Ӧ�ó�������
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
            
            //����꾭����Ӧ�ó����޸���ʽ
            item.on('mouseover', function(){
                item.addClass('rs-window-shell-start-menu-item-over');
                item.on('mouseleave', function(){
                    item.removeClass('rs-window-shell-start-menu-item-over');
                }, this, {
                    single : true
                });
            }, this);
            
            //���Ӧ�ó������ƴ򿪸ó���
            item.on('click', function(a){
                if(!a.isOpen()){
                    a.open();
                    (function(){
                        this.hide();
                    }).defer(100, this);
                }
            }.createDelegate(this, [app]), this);
        },
        
        //��Ӧ�ó���ж��
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
        
        //��Ӧ�ó����,�ڿ�ʼ�˵�����Ӧ�ó������ָ���
        onAppOpen : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && !appEl.hasClass(cls)){
                appEl.addClass(cls);
            }
        },
        
        //��Ӧ�ó���ر�,�ڿ�ʼ�˵�����Ӧ�ó�������ȡ������
        onAppClose : function(app){
            var appEls = this.appEls;
                id = app.getId(),
                appEl = appEls.get(id),
                cls = 'rs-window-shell-start-menu-app-opened';
            if(appEl && appEl.hasClass(cls)){
                appEl.removeClass(cls);
            }
        },
        
        //�Ƿ���ʾ
        isVisible : function(){
            return this.hidden === false;
        },
        
        //����λ�úʹ�С
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
            
            //body�Ĵ�С��λ��
            w = this.width;
            h = this.height;
            
            if(pos == 'north' || pos == 'south'){
                x = 3;
                y = y1 - (pos=='south'?h+3:(-1)*(3+wh1.height));
            }else if(pos == 'west' || pos == 'east'){
                x = x1 + (pos=='west'?(wh1.width+3):(-1)*(3+w));
                y = 3;
            }
            
            //�����Ĵ�С��λ��
            body.setX(x);
            body.setY(y);
            
            body.setWidth(w);
            body.setHeight(h);
            
            contentEl.setHeight(h - 26);
            
            //���򲿷ֵĴ�С��λ��
            appBody.setWidth(w - sbw -6);
            appBody.setHeight(h - 26);
            
            //�������Ĵ�С��λ��
            settingBody.setX(x + w - sbw);
            settingBody.setWidth(sbw);
            settingBody.setHeight(h - 26);
        },
        
        //��ʾ�˵���
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
        
        //���ز˵���
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