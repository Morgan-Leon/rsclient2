(function(){
    
    /**
     * @class Rs.app.TabShell
     * @extends Rs.app.Shell
     * 标签页式框架
     * @constructor
     * @param {Object} config
     */
    Rs.app.TabShell = Rs.extend(Rs.app.Shell, {
        
        //整体框架
        frameTpl : ['<div onselectstart="return false;" class="rs-tab-shell-tabheader x-tab-shell-tabheader"></div>',
                    '<div class="rs-tab-shell-tabbody-wrap"></div>'],
        
        //标签栏配置
        tabBarCfg : {},
        
        //标签栏的位置,可选的位置有top
        tabBarPosition : 'top',
        
        /**
         * 标签宽度，缺省值为135
         * @cfg {Number} tabWidth default 135
         */
        tabWidth : 135,
        

        enableTabScroll : true,
        
        /**
         * 重写doBuild方法,当程序引擎启动的时候调用该方法,构建应用程序
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.TabShell.superclass.doBuild.apply(this, arguments);
            
            var frame = this.frame,
                tabHeaderEl = frame.child('.rs-tab-shell-tabheader'),
                tabBodyEl = frame.child('.rs-tab-shell-tabbody-wrap');
            
            //创建标签栏
            if(tabHeaderEl){
                var tabheader = this.tabheader;
                if(!tabheader){
                    tabheader = this.tabheader = new TabShellTabbar(this, 
                            this.tabBarPosition, Rs.apply(this.tabBarCfg,{
                                tabWidth : this.tabWidth, 
                                enableTabScroll : this.enableTabScroll}));
                    tabheader.renderTo(tabHeaderEl);
                }
            }
            //创建程序区域
            if(tabBodyEl){
                var tabbody = this.tabbody;
                if(!tabbody){
                    tabbody = this.tabbody = new TabShellTabbody(this, this.tabBarPosition);
                    tabbody.renderTo(tabBodyEl);
                }
            }
        }, 
        
        /**
         * 重写方法reBuildRegions,重构shell
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app 
         */
        doReBuild : function(region, app){
            Rs.app.TabShell.superclass.doReBuild.apply(this, arguments);
            //调整标签栏的大小和位置
            var tabheader = this.tabheader;
            var tabbody = this.tabbody;
            if(tabheader){
                tabheader.doLayout();
            }
            //调整程序区域的大小和样式
            if(tabbody){
                tabbody.doLayout();
            }
        },
        /**
         * 获取应用程序位置
         * @method getRegion
         * @param {String} id (optional) App存放位置id
         * @return {Object} 
         */
        getRegion : function(id){
            if(id == "tab"){
                region = new Rs.app.TabRegion(this, {});
                return region;
            }else {
                region = new Rs.app.WindowRegion(this, {});
                return this.windowRegions.add(region);
            }
        }
        
    });
    
    //注册window类型的shell
    Rs.app.SHELL['tab'] = Rs.app.TabShell;
    
    /**
     * 标签栏, 其中包括开始按钮,当用户点击打开应用程序的时候
     * 在标签栏显示所有已经打开的程序
     */
    var TabShellTabbar = function(shell, position, config){
        this.shell = shell;
        this.position = position || 'top';
        Rs.apply(this, config);
        TabShellTabbar.superclass.constructor.call(this);
        this.addEvents(
                
                /**
                 * @event beforetabchange
                 * 在活动标签改变之前触发该事件
                 * @param {TabShellTabbar} this
                 * @param tab 新的活动标签
                 * @param activetab 当前活动标签 
                 */
                'beforetabchange',
                
                /**
                 * @event tabchange
                 * 在活动标签改变之后触发该事件
                 * @param {TabShellTabbar} this
                 * @param tab 改变后的活动标签 
                 */
                'tabchange',
                
                /**
                 * @event beforetabclose
                 * 在标签关闭之前触发该事件
                 * @param tab 将要被关闭的标签 
                 */
                'beforetabclose',
                
                /**
                 * @event tabclose
                 * 在标签关闭之后触发该事件
                 * @param tab 被关闭的标签 
                 */
                'tabclose');
    };

    Rs.extend(TabShellTabbar, Rs.util.Observable, {


        /**
         * @cfg {Number} width default 50
         */
        width : 60,
        
        /**
         * @cfg {Number} height defualt 30
         */
        height : 30,
        
        //private
        rendered : false,
        
        tabs : [],
        
        scrollDuration : 0.35,
        
        animScroll : true,
        
        closable : true,
        
        tabWidth : 120,
        
        scrollIncrement: 100,
        
        //访问堆栈
        accessStack : [],
        
        /**
         * 渲染tab栏
         * @method renderTo
         * @param {Element} el
         */
        renderTo : function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.header = el;
                this.rendered = true;
                //设置样式
                this.header.addClass('rs-tab-shell-tabheader-' + this.position);
                
                //滚动可视区域
                this.stripWrap = this.header.createChild({
                    tag : 'div',
                    cls : 'rs-tab-strip-wrap-'+this.position,
                    cn : {
                        tag : 'ul',
                        cls : 'rs-tab-strip-' + this.position + ' x-tab-strip-' + this.position
                    }
                });
                this.header.createChild({cls:'rs-tab-strip-spacer'});
                
                //滚动区域
                this.strip = new Rs.Element(this.stripWrap.dom.firstChild);
                
                //当前滚动区域被标签覆盖部分的右边界
                this.edge = this.strip.createChild({
                    tag : 'li',
                    cls : 'rs-tab-edge-' + this.position,
                    cn: [{tag: 'span', cls: 'rs-tab-strip-text', cn: '&#160;'}]
                });

                this.strip.createChild({cls:'rs-clear'});
                
                this.doLayout();
                
                //初始化事件设置
                this.afterRender();
            }
        },

        /**
         * 获取标签栏大小
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
            if(pos == 'top'){
                w = size.width;
                h = this.height;
            }else if(pos == 'left'){
                w = this.width;
                h = size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        //设置tabbar宽度
        doLayout : function(){
            var size = this.shell.getSize();
            this.header.setWidth(size.width);
            this.autoScrollTabs(); 
        },
        
        //调整tabbar滚动按钮
        autoScrollTabs : function(){
            this.pos = this.position=='top' ? this.header : null;
            var count = this.tabs.length,
                ow = this.pos.dom.offsetWidth,
                tw = this.pos.dom.clientWidth,
                wrap = this.stripWrap,
                wd = wrap.dom,
                cw = wd.offsetWidth,
                pos = this.getScrollPos(),
                l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

            if(!this.enableTabScroll || cw < 20){ 
                return;
            }
            if(count == 0 || l <= tw){
                wd.scrollLeft = 0;
                wrap.setWidth(tw);
                if(this.scrolling){
                    this.scrolling = false;
                    this.pos.removeClass('rs-tab-scrolling');
                    this.scrollLeft.hide();
                    this.scrollRight.hide();
                    //if(Ext.isAir || Ext.isWebKit){
                        wd.style.marginLeft = '';
                        wd.style.marginRight = '';
                    //}
                }
            } else{
                if(!this.scrolling){
                    this.pos.addClass('rs-tab-scrolling');
                    //if(Ext.isAir || Ext.isWebKit){
                        wd.style.marginLeft = '18px';
                        wd.style.marginRight = '18px';
                    //}
                }
                var wMarginLeft = parseInt(wd.style.marginLeft.substring(0,wd.style.marginLeft.length-2),10);
                var wMarginRight = parseInt(wd.style.marginRight.substring(0,wd.style.marginRight.length-2),10);
                tw-=(wMarginLeft+wMarginRight);
                wrap.setWidth(tw > 20 ? tw : 20);
                if(!this.scrolling){
                    if(!this.scrollLeft){
                        this.createScrollers();
                    }else{
                        this.scrollLeft.show();
                        this.scrollRight.show();
                    }
                }
                this.scrolling = true;
                if(pos > (l-tw)){ 
                    wd.scrollLeft = l-tw;
                }else{ 
                    this.scrollToTab(this.activeTab, false);
                }
                this.updateScrollButtons();
            }
        },
        
        //获取对象左边界和可见内容的最左端的距离
        getScrollPos : function(){
            return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
        },
        
        //获取滚动区域的可视宽度
        getScrollArea : function(){
            return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
        },
        
        //
        getScrollWidth : function(){
            return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
        },
        
        getScrollIncrement : function(){
            return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth+2 : 100);
        },
        
        createScrollers : function(){
            this.header.addClass('rs-tab-scrolling');;
            var h = this.stripWrap.dom.offsetHeight;

            // left
            var sl = this.header.insertFirst({
                cls:'rs-tab-scroller-left x-tab-scroller-left'
            });
            sl.setHeight(h);
            sl.on('mouseover',function(){
                sl.addClass('rs-tab-scroller-left-over');
            },this);
            sl.on('mouseleave',function(){
                sl.removeClass('rs-tab-scroller-left-over');
            },this);
            sl.on('mousedown', this.onScrollLeft, this);
            this.scrollLeft = sl;

            // right
            var sr = this.header.insertFirst({
                cls:'rs-tab-scroller-right x-tab-scroller-right'
            });
            sr.setHeight(h);
            sr.on('mouseover',function(){
                sr.addClass('rs-tab-scroller-left-over');
            },this);
            sr.on('mouseleave',function(){
                sr.removeClass('rs-tab-scroller-left-over');
            },this);
            sr.on('mousedown', this.onScrollRight, this);
            this.scrollRight = sr;
        },
        
        onScrollRight : function(){
            var sw = this.getScrollWidth()-this.getScrollArea(),
                pos = this.getScrollPos(),
                s = Math.min(sw, pos + this.getScrollIncrement());
            if(s != pos){
                this.scrollTo(s, this.animScroll);
            }
        },

        
        onScrollLeft : function(){
            var pos = this.getScrollPos(),
                s = Math.max(0, pos - this.getScrollIncrement());
            if(s != pos){
                this.scrollTo(s, this.animScroll);
            }
        },
        
        
        scrollToTab : function(tab, animate){
            if(!tab){
                return;
            }
            var el = tab.tabEl,
                pos = this.getScrollPos(),
                area = this.getScrollArea(),
                left = el.getOffsetsTo(this.stripWrap)[0] + pos,
                right = left + el.dom.offsetWidth;
            if(left < pos){
                this.scrollTo(left, animate);
            }else if(right > (pos + area)){
                this.scrollTo(right - area, animate);
            }
        },
        
        scrollTo : function(pos, animate){
            this.stripWrap.scrollTo('left', pos);
            //if(!animate){
                this.updateScrollButtons();
            //}
        },
        
        getScrollAnim : function(){
            return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
        },
        
        updateScrollButtons : function(){
            var pos = this.getScrollPos();
            this.scrollLeft[pos === 0 ? 'addClass' : 'removeClass']('rs-tab-scroller-left-disabled');
            this.scrollRight[pos >= (this.getScrollWidth()-this.getScrollArea()) ? 'addClass' : 'removeClass']('rs-tab-scroller-right-disabled');
        },
        
        //添加程序按钮
        addTab : function(app, tabconfig){
            var index = this.tabs.length,
                before = this.strip.dom.childNodes[index],
                p = this.getTemplateArgs(app);
                cls = 'rs-tab-strip-over',
                tab = new Tab(this.strip, before, p, tabconfig);
                tab.hover(function(){
                        tab.addClass(cls);
                    }, function(){
                        tab.removeClass(cls);
                });
                tab.setWidth(this.tabWidth);
                tab.on('close', this.removeTab, this);
                tab.on('activated', this.setActiveTab, this);
                tab.on('mousedown', this.onTabMouseDown, this);
                this.tabs.push(tab);
            this.autoScrollTabs();
            return tab;
        },
        
        onTabMouseDown : function(tab, e){
            if(this.tabs.length==1){
                return;
            }
            this.startTab = tab;
            this.startTabX = this.startTab.getX();
            this.mousedownX = e.getXY()[0];
            this.activeX = this.startTabX;
            this.startOffset = e.getXY()[0] - this.startTabX;
            this.lfTabEl = this.startTab.next();
            this.header.on('mouseup', this.onHeaderMouseUp, this);
            this.header.on('mousemove', this.onHeaderMouseMove, this);
            this.header.on('mouseleave', this.onHeaderMouseLeave, this);
        },
        
        addEventHandler : function(oTarget, sEventType, fnHandler) {
            if (oTarget.addEventListener) {
                oTarget.addEventListener(sEventType, fnHandler, false);
            } else if (oTarget.attachEvent) {
                oTarget.attachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = fnHandler;
            }
        },
         
        removeEventHandler : function (oTarget, sEventType, fnHandler) {
            if (oTarget.removeEventListener) {
                oTarget.removeEventListener(sEventType, fnHandler, false);
            } else if (oTarget.detachEvent) {
                oTarget.detachEvent("on" + sEventType, fnHandler);
            } else {
                oTarget["on" + sEventType] = null;
            }
        },

        bindAsEventListener : function(object, fun) {
            return function(event) {
                return fun.call(object, (event || window.event));
            };
        },
        
        onHeaderMouseLeave : function(e){
            Rs.fly(document.body).addClass('rs-tab-leave');
            this.header.on('mouseover', this.onHeaderMouseOver, this);
            this.shell.tabbody.on('mouseup', this.onTabbodyMouseUp, this);
            this.addEventHandler(document, "mouseup", this.bindAsEventListener(this, this.handleMouseUp));
        },
        
        handleMouseUp : function(e){
            if(e.x<0 || e.y<0 || e.x > window.innerWidth || e.y > window.innerHeight){
                this.cancelMove();
                this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
            }
            this.removeEventHandler(document, "mouseup", this.handleMouseUp);
        },
        
        cancelMove : function(){
            if(this.startTab){
                this.startTab.insertBefore(this.lfTabEl);
                this.endMove();
            }
        },
        
        endMove : function(){
            if(this.startTab){
                Rs.fly(document.body).removeClass('rs-tab-leave');
                this.startTab.show();
                this.startTab = null;
                if(this.cloneTab){
                    this.cloneTab.remove();
                    delete(this.cloneTab);
                }
                this.removeTabListeners();
            }
        },
        
        onHeaderMouseOver : function(e){
            Rs.fly(document.body).removeClass('rs-tab-leave');
            this.header.un('mouseover', this.onHeaderMouseOver, this);
            this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
        },
        
        onTabbodyMouseUp : function(tabbody){
            this.cancelMove();
            this.shell.tabbody.un('mouseup', this.onTabbodyMouseUp, this);
        },
        
        removeTabListeners : function(){
            this.header.un('mouseover', this.onHeaderMouseOver, this);
            this.header.un('mousemove', this.onHeaderMouseMove, this);
            this.header.un('mouseup', this.onHeaderMouseUp, this);
            this.header.un('mouseleave', this.onHeaderMouseLeave, this);
        },
        
        onHeaderMouseMove : function(e){
            if(this.startTab ){
                if(!this.cloneTab){
                    this.cloneTab = this.startTab.tabEl.dom.cloneNode(true);
                    this.cloneTab.id = "clone-tab";
                    if(this.cloneTab.style.setProperty){
                        this.cloneTab.style.setProperty("position","absolute","");
                    }else{
                        this.cloneTab.style.setAttribute("position","absolute");
                    }
                    this.cloneTab = this.strip.appendChild(this.cloneTab);
                    this.cloneTab.insertBefore(this.strip.dom.childNodes[0]);
                    this.cloneTab.setStyle("position : absolute;");
                }
                var ex = e.getXY()[0];
                this.cloneTab.setX(ex-this.startOffset);
                if(this.startTab.isVisible()){
                    this.startTab.hide();
                }
                if(this.scrollLeft && this.scrollLeft.isVisible()){
                    if(e.getXY()[0]>=this.scrollRight.getX()){
                        this.onScrollRight();
                    }
                    if(e.getXY()[0]<=(this.scrollLeft.getX()+this.scrollLeft.getWidth())){
                        this.onScrollLeft();
                    }
                }
                if((ex - this.mousedownX) > 0 && (ex-this.startOffset-this.activeX) >= this.tabWidth/2){
                    var nextTab = this.startTab.next();
                    if(nextTab.dom != this.strip.dom.childNodes[this.strip.dom.childNodes.length-2]){
                        this.startTab.insertAfter(nextTab);
                        this.activeX = this.startTab.getX();
                        this.mousedownX = this.activeX + this.startOffset;
                    }
                } else if((ex - this.mousedownX) < 0 && (this.activeX - (ex-this.startOffset)) >= this.tabWidth/2){
                    this.startTab.insertBefore(this.startTab.prev());
                    this.activeX = this.startTab.getX();
                    this.mousedownX = this.activeX + this.startOffset;
                }
            }
        },
        
        onHeaderMouseUp : function(e){
            this.removeTabListeners();
            if(this.startTab){
                this.endMove();
            }
            return;
        },
        
        moveTab : function(tab1, tab2, offset){
            if(offset>0){
                tab1.insertBefore(tab2);
            } else{
                tab1.insertAfter(tab2);
            }
            return;
        },
        
        removeTab : function(tab){
            if(tab){
                for(var i = 0; i < this.tabs.length; i++){
                    if(this.tabs[i].id == tab.id){
                        this.tabs.splice(i,1);
                        break;
                    }
                }
                tab.un('close', this.removeTab, this);
                tab.un('activated', this.setActiveTab, this);
                tab.destroy();
            }
            this.removeFromAccessStack(tab);
        },
        
        getTemplateArgs : function(app) {
            return {
                id: 'rs-app-tab-'+ this.tabs.length,
                text: app.getName() || '&#160;',
                iconCls: app.getIcon16() || ''
            };
        },
        
        setActiveTab : function(tab){
            if(tab.active !== true && this.tabs.length > 1){
                return;
            }
            if(this.fireEvent('beforetabchange', this, tab, this.activeTab) === false){
                return;
            }
            if(!this.rendered){
                this.activeTab = tab;
                return;
            }
            if(this.activeTab != tab){
                if(this.activeTab){
                    var oldTab = this.activeTab;
                    if(oldTab){
                        oldTab.unActivated();
                    }
                }
                this.activeTab = tab;
                if(tab){
                    tab.doActivated();
                    this.addToAccessStack(tab);
                    this.autoScrollTabs();
                    if(this.scrolling){
                        this.scrollToTab(tab, this.animScroll);
                    }
                }
                this.fireEvent('tabchange', this, tab);
            }
        },
        
        addToAccessStack : function(tab){
            for(var i = 0; i < this.accessStack.length;i++){
                if(this.accessStack[i].id == tab.id){
                    this.accessStack.splice(i,1);
                    break;
                }
            }
            this.accessStack.push(tab);
        },
        
        removeFromAccessStack : function(tab){
            for(var i = 0; i < this.accessStack.length;i++){
                if(this.accessStack[i].id == tab.id){
                    this.accessStack.splice(i,1);
                    if(i == this.accessStack.length){
                        this.activeTab = null;
                        if(i!=0){
                            this.setActiveTab(this.accessStack[this.accessStack.length-1]);
                        }
                    }
                }
            }
        },
        
        //渲染完成之后执行该方法
        afterRender : Rs.emptyFn
        
    });
    
    var Tab = function(strip, nextEl, args, config){
        this.id = args.id;
        this.strip = strip;
        Rs.apply(this, config);
        Tab.superclass.constructor.call(this);
        
        if(!this.itemTpl){
            var tt = new Rs.Template([
                 '<li class="rs-tab-with-icon" id="{id}"><a class="rs-tab-strip-close x-tab-strip-close"></a>',
                 '<a class="rs-tab-right x-tab-right"><em class="rs-tab-left x-tab-left">',
                 '<span class="rs-tab-strip-inner x-tab-strip-inner"><span class="rs-tab-strip-text x-tab-strip-text {iconCls}">{text}</span></span>',
                 '</em></a></li>']
            );
            tt.compile();
            this.itemTpl = tt;
        }
        
        this.addEvents(
                'beforeclose',
                'close',
                'activated',
                'unactivated',
                'mousedown',
                'mouseup'
        );
        
        this.tabEl = nextEl ?
                this.itemTpl.insertBefore(nextEl, args, true) :
                    this.itemTpl.append(this.strip, args, true);
                
        this.tabEl.select('a').on('click', function(e){
            this.onStripClick(e);
        }, this);
        this.tabEl.select('a').on('mousedown', function(e){
            this.onStripMouseDown(e);
        }, this);

        this.tabEl.select('a').on('mouseup', function(e){
            this.onStripMouseUp(e);
        }, this);
    };
    Rs.extend(Tab, Rs.util.Observable, {
        
        closable : true,
        
        active : false,
        
        onStripClick : function(e){
            if(e.button !== 0){
                return;
            }
            e.preventDefault();
            if(e.getTarget('.rs-tab-strip-close', this.strip)){
                if (this.fireEvent('beforeclose', this) !== false) {
                    this.fireEvent('close', this);
                }
                return;
            }
            if(this.active == false){
                this.doActivated();
            }
            return;
        },
        
        onStripMouseDown : function(e){
            if(e.button !== 0){
                return;
            }
            e.preventDefault();
            if(e.getTarget('.rs-tab-strip-close', this.strip)){
                return;
            }
            if(this.active == false){
                this.doActivated();
            }
            this.fireEvent('mousedown', this, e);
            return;
        },
        
        onStripMouseUp : function(e){
            this.mousedown = false;
            e.preventDefault();
            this.fireEvent('mouseup', this);
            return;
        },
        
        doActivated : function(){
            this.active = true;
            if(this.closable){
                this.addClass('rs-tab-strip-closable');
            }
            this.addClass('rs-tab-strip-active');
            this.fireEvent('activated',this);
        },
        
        unActivated : function(){
            this.active = false;
            this.removeClass(['rs-tab-strip-closable','rs-tab-strip-active']);
            this.fireEvent('unactivated', this);
        },
        
        isActivated : function(){
            return this.active;
        },
        
        hover : function(over, leave){
            if(this.tabEl){
                this.tabEl.hover(over, leave);
            }
        },
        
        addClass : function(cls){
            if(this.tabEl){
                this.tabEl.addClass(cls);
            }
        },
        
        removeClass : function(cls){
            if(this.tabEl){
                this.tabEl.removeClass(cls);
            }
        },
        
        setWidth : function(w){
            this.tabEl.setWidth(w);
        },
        
        getTabEl : function(){
            return this.tabEl;
        },
        
        destroy : function(){
            this.active = false;
            this.tabEl.removeAllListeners();
            this.tabEl.remove();
            delete(this.tabEl);
        },
        
        getX : function(){
            return this.tabEl.getX();
        },
        
        getY : function(){
            return this.tabEl.getY();
        },
        
        insertBefore : function(tab){
            if(!tab){
                return;
            }
            if(tab instanceof Tab){
                this.tabEl.insertBefore(tab.tabEl);
            } else{
                this.tabEl.insertBefore(tab);
            }
        },
        
        insertAfter : function(tab){
            if(!tab){
                return;
            }
            if(tab instanceof Tab){
                this.tabEl.insertAfter(tab.tabEl);
            } else{
                this.tabEl.insertAfter(tab);
            }
        },
        
        hide : function(){
            this.tabEl.hide();
        },
        
        show : function(){
            this.tabEl.show();
        },
        
        next : function(){
            return this.tabEl.next();
        },
        
        prev : function(){
            return this.tabEl.prev();
        },
        
        isVisible : function(){
            return this.tabEl.isVisible();
        }
        
    });
    
    var TabShellTabbody = function(shell, position){
        this.shell = shell;
        this.position = position;
        TabShellTabbody.superclass.constructor.call(this);
        this.addEvents('resize','mouseup');
    };
    Rs.extend(TabShellTabbody, Rs.util.Observable, {
        
        rendered : false,
        
        regions : [],
        
        renderTo:function(el){
            if(this.rendered === false && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el.createChild({
                    tag : 'div',
                    cls : 'rs-tab-shell-tabbody rs-tab-shell-tabbody-' + this.position
                });
                this.targetEl.on('mouseup', this.onMouseUp, this);
                this.rendered = true;
            }
            this.doLayout();
        },
        
        doLayout : function(){
            if(this.position == 'top'){
                var size = this.shell.getSize();
                this.width = size.width;
                this.height = size.height-this.shell.tabheader.getSize().height;
                this.targetEl.setWidth(this.width);
                this.targetEl.setHeight(this.height);
            }
            this.fireEvent('resize', this.targetEl, this.width, this.height);
        },
        
        onMouseUp : function(e){
            this.fireEvent('mouseup',this);
        },
        
        addRegion : function(){
            var region = this.targetEl.createChild({
                tag : 'div',
                cls : 'rs-tab-region rs-tab-region-hide'
            });
            this.regions.push(region);
            return region;
        },
        
        displayRegion : function(region){
            region.removeClass('rs-tab-region-hide');
        },
        
        hideRegion : function(region){
            region.addClass('rs-tab-region-hide');
        },
        
        removeRegion : function(region){
            region.remove();
        }
    });
    

    /**
     * @class TabRegion
     * @extends Rs.app.Region
     * 标签页式应用程序位置
     * @constructor
     * @param {Rs.app.TabShell} shell
     * @param {Object} config
     */
    Rs.app.TabRegion = function(shell, config){
        Rs.app.TabRegion.superclass.constructor.call(this);
        this.shell = shell;
        this.engine = this.shell.getEngine();
        this.tabheader = shell.tabheader;
        this.tabbody = shell.tabbody;
        this.tabbody.on('resize', this.onTabbodyResize, this);
        this.config = config || {};
        this.targetEl = this.tabbody.addRegion();
    };
    Rs.extend(Rs.app.TabRegion, Rs.app.Region, {
        
        /**
         * @cfg {Boolean} active 
         * 当前标签是否为活动标签
         */
        active : false,
        
        //private
        afterApplyApp : function(app){
            Rs.app.TabRegion.superclass.afterApplyApp.apply(this, arguments);
            this.tab = this.tabheader.addTab(app, Rs.apply(Rs.apply({active : this.active},this.config),app.getRegionCfg()));
            this.tab.on('activated', this.onTabActivated, this);
            this.tab.on('unactivated', this.onTabUnActivated, this);
            this.tab.on('close', this.onTabClose, this);
            this.tabheader.setActiveTab(this.tab);
            app.open();
        },
        
        //private
        onTabbodyResize : function(tabbody, w, h){
            if(this.active && this.app.isOpen()){
                this.fireEvent('resize', this.targetEl, w, h);
            }
        },
        
        //private
        onTabActivated : function(tab){
            this.tabbody.displayRegion(this.targetEl);
            if(this.app.isOpen()){
                this.fireEvent('resize', this.targetEl, this.targetEl.getWidth(), this.targetEl.getHeight());
            }
            if(!this.app.isOpen()){
                this.app.open();
            }
            this.active = true;
        },
        
        //private
        onTabUnActivated : function(tab){
            this.active = false;
            this.tabbody.hideRegion(this.targetEl);
        },
        
        //private
        onTabClose : function(tab){
            this.active = false;
            this.tabbody.removeRegion(this.targetEl);
            this.app.close();
        },
        
        /**
         * 区域是否可见
         * @return {Boolean}
         */
        isVisible : function(){
            return this.targetEl.isVisible();
        }
        
    });
})();