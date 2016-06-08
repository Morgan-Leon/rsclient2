(function() {
    
    /**
     * @class Rs.app.WindowRegion
     * @extends Rs.app.Region
     * ����ʽӦ�ó���λ��
     * @constructor
     * @param {Rs.app.WindowShell} shell
     * @param {Object} config
     */
    Rs.app.WindowRegion = function(shell, config) {
        Rs.app.WindowRegion.superclass.constructor.call(this, shell, config);
        
        this.addEvents(
            /**
             * @event resize
             * ���ڴ�С�����仯ʱ�������¼�,
             * @param {Rs.Element} targetEl
             * @param {Number} width
             * @param {Number} height
             */
            'resize',
            
            /**
             * @event restore
             * ����������󻯸�ԭ��ʱ�򴥷����¼�
             * @param {Rs.app.WindowRegion} this
             */
            'restore',
            
            /**
             * @event beforeclose
             * �����ڹرյ�ʱ�򴥷����¼�,������¼��ص���������false��ȡ���رո÷���
             * @param {Rs.app.WindowRegion} this
             */
            'beforeclose',
            
            /**
             * @event close
             * �����ڹرպ󴥷����¼�
             * @param {Rs.app.WindowRegion} this
             */
            'close',
            
            /**
             * @event maximize
             * ���������ʱ�������¼�
             * @param {Rs.app.WindowRegion} this
             */
            'maximize',
            
            /**
             * @event minimize
             * ��������С��ʱ�������¼�
             * @param {Rs.app.WindowRegion} this 
             */
            'minimize',
            
            /**
             * @event beforeshow
             * ��������ʾ֮ǰ�������¼�,������¼��ص���������false��ȡ����ʾ
             * @param {Rs.app.WindowRegion} this
             */
            'beforeshow',
            
            /**
             * @event show
             * ��������ʾ�󴥷����¼�
             * @param {Rs.app.WindowRegion} this
             */
            'show',
            
            /**
             * @event beforehide
             * ����������ǰ�������¼�,������¼��ص���������false��ȡ������
             * @param {Rs.app.WindowRegion} this 
             */
            'beforehide',
            
            /**
             * @event hide
             * ���������غ󴥷����¼�
             * @param {Rs.app.WindowRegion} this
             */
            'hide',
            
            /**
             * @event move
             * �������ƶ��󴥷����¼�
             * @param {Rs.app.WindowRegion} this
             * @param {Array} xy0 ǰһλ��
             * @param {Array} xy ��ǰλ��
             */
            'move',
            
            /**
             * @event activate
             * �����ڱ�����ʱ�������¼�
             * @param {Rs.app.WindowRegion} this  
             */
            'activate',
            
            /**
             * @event deactivate
             * ������ȡ������ʱ�������¼�
             * @param {Rs.app.WindowRegion} this 
             */
            'deactivate',
            
            /**
             * @event beforedestroy
             * ����������ǰ�������¼�
             * @param {Rs.app.WindowRegion} this
             */
            'beforedestroy',
            
            /**
             * @event destroy
             * �����ڱ�����ʱ�������¼�
             * @param {Rs.app.WindowRegion} this
             */
            'destroy');
        
        this.renderTo(Rs.DomHelper.append(document.body, {
            tag : 'div',
            cls : 'rs-app-region-cell'
        }, true));
    };

    Rs.extend(Rs.app.WindowRegion, Rs.app.Region, {
        
        //private
        headerCls : 'rs-app-window-header',
        
        //private
        hideCls : 'rs-app-window-hidden',
        
        //pivate
        hidden : false,
        
        /**
         * @cfg {Number} x 
         * ����X, Ĭ��ֵΪ100
         */
        x : 100,
        
        /**
         * @cfg {Number} y
         * ����Y, Ĭ��ֵΪ100
         */
        y : 100,
        
        /**
         * @cfg {Number} minWidth
         * ��С���, Ĭ��ֵΪ50
         */
        minWidth : 50,
        
        /**
         * @cfg {Number} maxWidth
         * �����, Ĭ��ֵΪ100
         */
        maxWidth : 1000,
        
        /**
         * @cfg {Number} minHeight
         * ��С�߶�, Ĭ��ֵΪ50
         */
        minHeight : 50,
        
        /**
         * @cfg {Number} maxHeight
         * ���߶�,Ĭ��ֵΪ800
         */
        maxHeight : 800,
        
        /**
         * @cfg {Boolean} minimizable
         * �Ƿ����С��,Ĭ��ֵΪtrue
         */
        minimizable : true, 

        /**
         * @cfg {Boolean} maximizable
         * �Ƿ�����,Ĭ��ֵΪtrue
         */
        maximizable : true,
        
        /**
         * @cfg {Boolean} closable
         * �Ƿ�ɹر�
         */
        closable : true,
        
        /**
         * @cfg {Boolean} draggable
         * �Ƿ���϶�,Ĭ��ֵΪtrue
         */
        draggable : true,
        
        /**
         * @cfg {Boolean} resizable
         * �Ƿ�ɵ�����С, Ĭ��ֵΪtrue
         */
        resizable : true,
        
        /**
         * @cfg {String} resizeHandles
         * ������Сhandles
         */
        
        /**
         * �Ƿ���ʾ
         * @method isVisible
         * @return {Boolean}
         */
        isVisible : function(){
            return this.hidden === false;
        },
        
        //override private
        getState : function(){
            var maximized = this.maximized;
            if(maximized == true){
                var restorePos = this.restorePos || this.getXY(),
                    restoreSize = this.restoreSize || this.getSize();
                return {
                    x : restorePos[0], 
                    y : restorePos[1],
                    width : restoreSize.width,
                    height : restoreSize.height,
                    maximized : true
                };
            }else {
                var xy = this.getXY(),
                    state = Rs.app.WindowRegion.superclass.getState.call(this);
                return Rs.apply(state, {
                    x : xy[0],
                    y : xy[1]
                });
            }
        },
        
        //private
        applyState : function(state){
            var box = {};
            for(var k in state){
                if(k == 'x' || k == 'y' 
                    || k == 'width' || k == 'height'){
                    box[k] = state[k];
                }
            }
            this.applyPanelEl(box);
            if(state && state.maximized == true){
                this.doMaximize();
            }
        },
        
        //override
        renderTo : function(el){
            Rs.app.WindowRegion.superclass.renderTo.apply(this, arguments);
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.addClass('rs-app-window rs-app-window-plain');
                this.focusEl = panelEl.insertFirst({
                    tag: 'a',
                    href:'#',
                    cls:'rs-app-window-focus',
                    tabIndex:'-1',
                    html: '&#160;'
                });
                this.focusEl.swallowEvent('click', true);
            }
        },
        
        //private
        afterApplyApp : function(){
            Rs.app.WindowRegion.superclass.afterApplyApp.apply(this, arguments);
            
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.on('mousedown', this.toFront, this);
                
                //�������ڴ�С
                if(this.resizable === true){
                    this.windowResizer = new WindowResizable(this, panelEl, {
                        minWidth : this.minWidth,
                        minHeight : this.minHeight,
                        maxWidth : this.maxWidth,
                        maxHeight : this.maxHeight,
                        handles: this.resizeHandles || 'all'
                    });
                    this.windowResizer.on('beforeresize', this.beforeResize, this);
                }
                
                //ģ̬����
                if(this.modal === true){
                    var BODY = Rs.getBody(),
                        mask = this.mask = BODY.createChild({
                        tag : 'div',
                        cls : 'rs-app-window-mask',
                        id : panelEl.id + '-mask'
                    });
                    
                    var DOM = Rs.lib.Dom,
                        x = 0, y = 0,
                        w = DOM.getViewWidth(true),
                        h = DOM.getViewHeight(true);
                    mask.setX(x);
                    mask.setY(y);
                    mask.setWidth(w);
                    mask.setHeight(h);
                    mask.setStyle('display', 'none');
                    mask.on('click', this.focus, this);
                }
                
                //������С��λ��
                var b = this.getSize(),
                    p = this.getXY();
                this.applyPanelEl({
                    x : p[0],
                    y : p[1],
                    width : b.width,
                    height : b.height
                });
            }
            
            //���ڹ���
            this.manager = Rs.app.WindowRegionMgr;
            this.manager.register(this);
            
        },
        
        // private
        beforeResize : function(){
            var panelEl = this.panelEl;
            this.resizeBox = {
                x : panelEl.getX(),
                y : panelEl.getY(),
                width : panelEl.getWidth(),
                height : panelEl.getHeight()
            };
        },
        
        // private
        updateHandles : function(){
            if(Rs.isIE && this.windowResizer){
                this.windowResizer.syncHandleHeight();
            }
        },

        // private
        handleResize : function(box){
            var rz = this.resizeBox;
            if(rz.x != box.x || rz.y != box.y){
                this.setXY([box.x, box.y]);
            }
            if(rz.width != box.width || rz.height != box.height){
                this.setSize({
                    width : box.width,
                    height : box.height
                });
            }
            this.toFront();
            this.updateHandles();
        },
        
        /**
         * ����X����
         * @method setX
         * @param {Number} x
         */
        setX : function(x){
            var DOM = Rs.lib.Dom, 
                w = DOM.getViewWidth(true),
                size = this.getSize();
            if(x < (0 - size.width)){
                x = 30 - size.width;
            }else if(x > w){
                x = w - 30;
            }
            return this.x = x;
        },
        
        /**
         * ����Y����
         * @method setY
         * @param {Number} y
         */
        setY : function(y){
            var DOM = Rs.lib.Dom, 
                h = DOM.getViewHeight(true),
                size = this.getSize();
            if(y < 0){
                y = 0;
            }else if(y > h - 30){
                y = h - 30;
            }
            return this.y = y;
        },
        
        /**
         * ��ȡ����
         * @method getXY
         * @return {Array}
         */
        getXY : function(){
            var x = this.x,
                y = this.y;
            return [x, y];
        },
        
        /**
         * ����λ��
         * @method setXY
         * @param {Array} xy
         */
        setXY : function(xy){
            var x = xy[0],
                y = xy[1],
                x0, y0,
                flag = false;
            if(Rs.isNumber(x)){
                x0 = this.x;
                x = this.setX(x);
                this.panelEl.setX(x);
                flag = true;
            }
            if(Rs.isNumber(y)){
                y0 = this.y;
                y = this.setY(y);
                this.panelEl.setY(y);
                flag = true;
            }
            if(flag === true){
                this.fireEvent('move', this, [x0, y0], [x, y]);
            }
        },
        
        /**
         * ���ô�С
         * @method setSize
         * @param {Object} box
         */
        setSize : function(box){
            var w = box ? box.width : undefined,
                h = box ? box.height : undefined;
            if(!Rs.isNumber(w) || !Rs.isNumber(h)){
                return;
            }
            var panelEl = this.panelEl,
                headerEl = this.getHeaderEl(),
                bodyEl = this.getBodyEl(),
                footerEl = this.getFooterEl(),
                targetEl = this.targetEl;
            
            this.width = w;
            this.height = h;
            
            panelEl.setWidth(w);
            
            headerEl.setWidth(w-12);
            headerEl.setHeight(25);
            
            footerEl.setWidth(w-12);
            footerEl.setHeight(6);
            
            w = w-12;
            h = h-headerEl.getHeight()-footerEl.getHeight();
            
            bodyEl.setWidth(w);
            bodyEl.setHeight(h);
            
            targetEl.setWidth(w);
            targetEl.setHeight(h);
            
            this.fireEvent('resize', targetEl, w, h);
        },
        
        //private
        getHeaderEl : function(){
            var headerEl = this.headerEl,
                panelEl = this.panelEl;
            if(!headerEl){
                var tl = panelEl.insertFirst({
                    tag : 'div',
                    cls : 'rs-app-window-tl x-app-window-tl'
                }), tr = tl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-tr x-app-window-tr'
                }), tc = tr.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-tc x-app-window-tc'
                });
                if(this.headerCfg){
                    headerEl = this.headerEl = tc.createChild(this.headerCfg);
                }else {
                    headerEl = this.headerEl = tc.createChild({
                        tag : 'div',
                        cls : this.headerCls
                    });
                }
                //��꾭�����ڱ�����ʽ�ı�
                headerEl.on('mouseover', function(){
                    var cls = 'rs-app-window-header-over';
                    headerEl.addClass(cls);
                    headerEl.on("mouseout", function(){
                        headerEl.removeClass(cls);
                    }, this, {
                        single : true,
                        scope : this
                    });
                }, this);
                
                if(this.draggable){
                     this.windowRegionDD = new WindowRegionDD(this, headerEl, panelEl);
                }
                this.initTools();
                
                var app = this.app,
                    name = app.getName() || '', icon = app.getIcon16();
                headerEl.createChild({
                    html : '<span class="' + icon + ' rs-app-window-header-text">' + name + '</span>' 
                });
                headerEl.unselectable();
            }
            return headerEl;
        },
        
        //private
        initTools : function(){
            var headerEl = this.headerEl;
            if(this.closable){
                var closeEl = this.closeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-close x-app-tool'
                });
                closeEl.setStyle('display', 'block');
                closeEl.on('click', function(){
                    if(this.app){
                        this.app.close();
                    }else {
                        this.close();
                    }
                }, this);
                closeEl.on('mouseover', function(){
                    closeEl.addClass('rs-app-tool-close-over');
                    closeEl.on('mouseleave', function(){
                        closeEl.removeClass('rs-app-tool-close-over');
                    }, this, {single : true});
                }, this);
            }
            if(this.minimizable){
                var minimizeEl = this.minimizeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-minimize x-app-tool'
                });
                minimizeEl.setStyle('display', 'block');
                minimizeEl.on('click', this.minimize, this);
                minimizeEl.on('mouseover', function(){
                    minimizeEl.addClass('rs-app-tool-minimize-over');
                    minimizeEl.on('mouseleave', function(){
                        minimizeEl.removeClass('rs-app-tool-minimize-over');
                    }, this, {single : true});
                }, this);
                
            }
            if(this.maximizable){
                var restoreEl = this.restoreEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-restore x-app-tool'
                });
                restoreEl.on('click', this.restore, this);
                restoreEl.setStyle('display', 'none');
                restoreEl.on('mouseover', function(){
                    restoreEl.addClass('rs-app-tool-restore-over');
                    restoreEl.on('mouseleave', function(){
                        restoreEl.removeClass('rs-app-tool-restore-over');
                    }, this, {single : true});
                }, this);
                
                var maximizeEl = this.maximizeEl = headerEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-tool rs-app-tool-maximize x-app-tool' 
                });
                maximizeEl.setStyle('display', 'block');
                maximizeEl.on('click', this.maximize, this);
                maximizeEl.on('mouseover', function(){
                    maximizeEl.addClass('rs-app-tool-maximize-over');
                    maximizeEl.on('mouseleave', function(){
                        maximizeEl.removeClass('rs-app-tool-maximize-over');
                    }, this, {single : true});
                }, this);
            }
            if(this.maximizable){
                headerEl.on('dblclick', this.toggleMaximize, this);
            }
        },
        
        /**
         * ��дregion��open����,����Ӧ�ó�����ʾ
         * @method open
         */
        open : function(){
            Rs.app.WindowRegion.superclass.open.apply(this, arguments);
            this.show();
        },
        
        /**
         * �˴���дregion��close����.
         * �رո�Ӧ�ó���,����ʽӦ�ó���ر�,��appҲ����ֹ����
         * @method close
         */
        close : function(){
            if(this.fireEvent('beforeclose', this) !== false){
                if(this.hidden){
                    this.doClose();
                }else {
                    this.hide(this.doClose, this);
                }
            }
        },

        // private
        doClose : function(){
            this.fireEvent('close', this);
            this.destroy();
        },
        
        //private
        restore : function(){
            if(this.maximized){
                this.doRestore();
            }
            //������ǰ
            this.toFront();
            return this;
        },
        
        //private
        doRestore : function(){
            var panelEl = this.panelEl,
                cls = 'rs-app-window-maximized',
                restorePos = this.restorePos,
                x = restorePos[0],
                y = restorePos[1],
                restoreSize = this.restoreSize,
                w = restoreSize.width,
                h = restoreSize.height;
            
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
            
            //���ػָ���ť��ʾ��󻯰�ť
            this.maximizeEl.setStyle('display', 'block');
            this.restoreEl.setStyle('display', 'none');
            
            //������С��λ��
            this.applyPanelEl({
                x : x,
                y : y,
                width : w,
                height : h
            });
            delete this.restorePos;
            delete this.restoreSize;
            if(this.windowRegionDD){
                this.windowRegionDD.unlock();
            }
            this.maximized = false;
            this.fireEvent('restore', this);
        },
        
        //private
        maximize : function(){
            if(!this.maximized){
                this.doMaximize();
            }
            //������ǰ
            this.toFront();
            return this;
        },
        
        //private
        doMaximize : function(){
            var DOM = Rs.lib.Dom,
                h = DOM.getViewHeight(true),
                w = DOM.getViewWidth(true),
                panelEl = this.panelEl,
                x, y, cls = 'rs-app-window-maximized';
            
            //��¼���֮ǰ��ԭʼλ�úʹ�С
            this.restoreSize = this.getSize();
            x = panelEl.getX();
            y = panelEl.getY();
            this.restorePos = [x, y];
            
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
            
            //��ʾ�ָ���ť������󻯰�ť
            this.maximizeEl.setStyle('display', 'none');
            this.restoreEl.setStyle('display', 'block');
            
            this.applyPanelEl({
                x : 0,
                y : 0,
                width : w - 2,
                height : h - 2
            });
            if(this.windowRegionDD){
                this.windowRegionDD.lock();
            }
            this.maximized = true;
            this.fireEvent('maximize', this);
        },
        
        //private 
        minimize : function(){
            this.hide(function(){
                this.fireEvent('minimize', this);
            }, this);
            return this;
        },
        
        //private
        toggleMaximize : function(){
            return this[this.maximized ? 'restore' : 'maximize']();
        },
        
        //private
        getBodyEl : function(){
            var bodyEl = this.bodyEl,
                panelEl = this.panelEl;
            if(!bodyEl){
                var bwrap = panelEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bwrap'
                }), bl = bwrap.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bl x-app-window-bl'
                }), br = bl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-br x-app-window-br'
                }), bc = br.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-bc x-app-window-bc'
                }), bodyEl = this.bodyEl = bc.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-body x-app-window-body' 
                });
                bodyEl.appendChild(this.targetEl);
            }
            return bodyEl;
        },
        
        //private
        getFooterEl : function(){
            var footerEl = this.foolterEl,
                panelEl = this.panelEl;
            if(!footerEl){
                var fwrap = panelEl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fwrap'
                }), fl = fwrap.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fl x-app-window-fl'
                }), fr = fl.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fr x-app-window-fr'
                }), footerEl = this.foolterEl = fr.createChild({
                    tag : 'div',
                    cls : 'rs-app-window-fc x-app-window-fc'
                });
            }
            return footerEl;
        },
        
        //private
        applyPanelEl : function(box){
            var x = box.x,
                y = box.y,
                w = box.width,
                h = box.height;
            
            this.setXY([x, y]);
            
            this.setSize({
                width : w,
                height : h
            });
        },
        
        /**
         * ����ʾ֮��ִ�и÷���
         * @method onShow
         */
        onShow : Rs.emptyFn,
        
        /**
         * ��ʾ֮ǰִ�и÷���
         * @method beforeShow
         */
        beforeShow : Rs.emptyFn,
        
        //private
        showMask : function(){
            if(this.modal === true){
                this.mask.setStyle('display', 'block');
            }
        },
        
        //private
        hideMask : function(){
            if(this.modal === true){
                this.mask.setStyle('display', 'none');
            }
        },
        
        /**
         * ��ʾ����
         * @method show
         * @param {Function} cb �ص�����
         * @param {Object} scope �ص������������� 
         */
        show : function(cb, scope){
            this.removeBlankClass();
            
            //�����������ʾ��ǰ��
            if(this.hidden === false){
                this.showMask();
                this.toFront();
                return this;
            }
            
            if(this.fireEvent('beforeshow', this) === false
                || this.beforeShow(this) === false){
                return this;
            }
            if(cb){
                this.on('show', cb, scope, {single:true});
            }
            this.hidden = false;
            
            this.showMask();
            var cls = this.hideCls,
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
            this.afterShow();
        },
        
        //private
        afterShow : function(){
            if (this.isDestroyed){
                return false;
            }
            if(this.modal === true){
                Rs.EventManager.onWindowResize(this.onWindowResize, this);
            }
            this.toFront();
            this.onShow();
            this.fireEvent('show', this);
        },
        
        // private
        onWindowResize : function(){
            if(this.modal === true && this.mask){
                var DOM = Rs.lib.Dom,
                    x = 0, y = 0,
                    w = DOM.getViewWidth(true),
                    h = DOM.getViewHeight(true),
                    mask = this.mask;
                
                mask.setX(x);
                mask.setY(y);
                mask.setWidth(w);
                mask.setHeight(h);
            }
        },
        
        /**
         * �����ظô���֮��ִ�и÷���
         * @mehod onHide
         */
        onHide : Rs.emptyFn,
        
        /**
         * ���ش���
         * @method hide
         * @param {Function} cb �ص�����
         * @param {Object} scope �ص�������������
         */
        hide : function(cb, scope){
            if(this.hidden || this.fireEvent('beforehide', this) === false){
                return this;
            }
            if(Rs.isFunction(cb)){
                this.on('hide', cb, scope, {single:true});
            }
            this.hidden = true;
            this.hideMask();
            var cls = this.hideCls,
                panelEl = this.panelEl;
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
            this.afterHide();
        },
        
        // private
        afterHide : function(){
            if(this.modal === true){
                Rs.EventManager.removeResizeListener(this.onWindowResize, this);
            }
            this.onHide();
            this.fireEvent('hide', this);
        },
        
        //private  ����ǰ��
        toFront : function(e){
            if(this.manager.bringToFront(this)){
                if(!e || !e.getTarget().focus){
                    this.focus();
                }
            }
            return this;
        },
        
        /**
         * ���û����
         * @method setActive
         * @param {Boolean} active
         */
        setActive : function(active){
            if(active){
                this.fireEvent('activate', this);
            }else{
                this.fireEvent('deactivate', this);
            }
        },
        
        /**
         * ���������ڸô���
         * @method focus
         */
        focus : function(){
            var f = this.focusEl;
            if(f){
                f.focus.defer(10, f);
            }
        },
        
        //private
        setZIndex : function(index){
            if(this.modal){
                this.mask.setStyle('z-index', index);
            }
            var panelEl = this.panelEl;
            if(panelEl){
                panelEl.setStyle('z-index', ++index);
                index += 5;
            }
            if(this.windowResizer){
                this.windowResizer.proxy.setStyle('z-index', ++index);
            }
            this.lastZIndex = index;
        },
        
        //private ɾ���հ�λ����ʽ
        removeBlankClass : function(){
            var cls = 'rs-app-blank-region',
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        }, 
        
        //private
        ghost : function(){
            var panel = this.panelEl,
                bodyEl = this.bodyEl,
                w = bodyEl.dom.offsetWidth,
                h = bodyEl.dom.offsetHeight,
                x = panel.getX(),
                y = panel.getY(),
                ghost = Rs.DomHelper.append(document.body, {
                    tag : 'div',
                    cls : 'rs-app-window-ghost rs-app-window rs-app-window-plain' 
                }, true);
            ghost.appendChild(panel.dom.firstChild.cloneNode(true));
            ghost.createChild({
                html : '<div class="rs-app-window-bwrap">'
                    +'<div class="rs-app-window-bl x-app-window-bl">'
                    +'<div class="rs-app-window-br x-app-window-br"><div class="rs-app-window-bc x-app-window-bc">'
                    +'<div class="rs-app-window-body x-app-window-body" style="width: '+ w + 'px; height: '+ h +'px;">'
                    +'<ul style="width: '+ w + 'px; height: '+ h +'px;"></ul>'
                    +'</div></div></div></div></div>'
            });
            ghost.appendChild(panel.dom.lastChild.cloneNode(true));
            ghost.setStyle('cursor', 'move !important');
            if(Rs.isIE){
                ghost.setStyle({
                    'opacity' : '65',
                    'filter' : 'alpha(opacity=65)'
                });
            }else {
                ghost.setStyle({
                    'opacity' : '.65',
                    '-moz-opacity' : '.65',
                    'filter' : 'alpha(opacity=.65)'
                });
            } 
            ghost.unselectable();
            ghost.setX(x);
            ghost.setY(y);
            //���ظô���
            this.hide();
            this.activeGhost = ghost;
            return ghost;
        }, 
        
        //private
        unghost : function(){
            if(!this.activeGhost) {
                return;
            }
            //��ʾ�ô���
            this.show();
            this.activeGhost.hide();
            this.activeGhost.remove();
            delete this.activeGhost;
        }
        
    });

    //����϶�����
    var WindowRegionDD = function(win, header, panel){
        this.win = win;
        this.header = header;
        this.panel = panel;
        this.init();
    };
    
    WindowRegionDD.prototype = {
        
        //private
        loacked : false,
            
        //private
        init : function(){
            this.header.on('mouseenter', this.notifyEnter, this);
            this.header.on('mousedown', this.notifyOut, this, {
                //delay : 10,
                scope : this
            });
        }, 
        
        //������
        notifyEnter : function(){
            
        },
        
        //�����¿�ʼ�϶�
        notifyOut : function(e, t, o){
            var t = Rs.get(e.getTarget());
            if(t && (t.hasClass('rs-app-tool') || t.hasClass('rs-app-window-header-text'))){
                return ;
            }
            var xy = e.getXY(),
                x = xy[0], y = xy[1],
                win = this.win,
                panel = this.panel,
                x1 = panel.getX(),
                y1 = panel.getY();
            this.offsetXY = {
                x : x - x1,
                y : y - y1
            };
            this.addOverlay();
            ghost = this.ghost = win.ghost();
            ghost.on('mousemove', this.notifyOver, this);
            ghost.on('mouseup', this.notifyDrop, this, {
                delay : 100,
                scope : this
            });
        },
        
        //����ڸǲ�
        addOverlay : function(){
            var DOM = Rs.lib.Dom, 
                x = 0, y = 0,
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay, ghost;

            overlay = this.overlay =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls: 'rs-app-window-overlay'
            }, true);
            
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            
            overlay.on('mousedown', this.notifyDrop, this);
            overlay.on('mousemove', this.notifyOver, this);
            overlay.on('mouseup', this.notifyDrop, this);
        },
        
        //ɾ���ڸǲ�
        removeOverlay : function(){
            var overlay = this.overlay;
            if(overlay){
                overlay.removeAllListeners();
                overlay.remove();
                delete overlay;
            }
        },
        
        //����ƶ�
        notifyOver : function(e, t, o){
            var ghost = this.ghost,
                win = this.win,
                xy = e.getXY(), 
                x = xy[0], y = xy[1],
                
                offset = this.offsetXY,
                x1 = 0, y1 = 0,
                x2, y2; 
                /*
                DOM = Rs.lib.Dom, 
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                size = this.win.getSize();
                */
            if(offset){
                x1 = offset.x ;
                y1 = offset.y
            }
            x2 = x - x1;
            y2 = y - y1;
            /*if(x2 >=0 && x2 <= w - size.width)*/{
                ghost.setX(x2);
            }
            if(y2 >= 0 /*&& y2 <= h - size.height*/){
                ghost.setY(y2);
            }else {
                win.unghost();
                win.setXY([x2, 0]);
                win.toFront(e);
                
                this.removeOverlay();
                this.offsetXY = null;
            }
        },

        //���������
        notifyDrop : function(e, t, o){
            var xy = e.getXY(),
                x = xy[0], y = xy[1],
                offset = this.offsetXY,
                x1 = 0, y1 = 0,
                win = this.win,
                x2, y2;
            if(offset){
                x1 = offset.x ;
                y1 = offset.y
            }
            x2 = x - x1;
            y2 = y - y1;
            win.unghost();
            win.setXY([x2, y2]);
            win.toFront(e);
            
            this.removeOverlay();
            this.offsetXY = null;
        }, 
        
        //������ק
        lock : function(){
            if(this.loacked === false){
                this.header.un('mouseenter', this.notifyEnter, this);
                this.header.un('mousedown', this.notifyOut, this);
                this.locked = true;
            }
        },
        
        //������ק
        unlock : function(){
            if(this.locked === true){
                this.header.on('mouseenter', this.notifyEnter, this);
                this.header.on('mousedown', this.notifyOut, this, {
                    //delay : 10,
                    scope : this
                });
                this.locked = false;
            }
        }, 
        
        //����
        destroy : function(){
            this.removeOverlay();
            if(this.header){
                this.header.un('mouseenter', this.notifyEnter, this);
                this.header.un('mousedown', this.notifyOut, this);
            }
            if(this.ghost){
                this.ghost.un('mousemove', this.notifyOver, this);
                this.ghost.un('mouseup', this.notifyDrop, this);
                delete this.ghost;
            }
        }
        
    };
    
    
    //���ڹ���
    var WindowGroup = function(){
        var list = {};
        var accessList = [];
        var front = null;
        
        //��������,�����ģ̬�������������,��ʾ�����ϲ�
        var sortWindows = function(d1, d2){
            if(d1.modal === true && d1.hidden !== true){
                return 1;
            }else if(d2.modal === true && d2.hidden !== true){
                return -1;
            }else {
                return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
            }
        };
        
        // private
        var orderWindows = function(){
            var a = accessList, len = a.length;
            if(len > 0){
                a.sort(sortWindows);
                var seed = a[0].manager.zseed;
                for(var i = 0; i < len; i++){
                    var win = a[i];
                    if(win && !win.hidden){
                        win.setZIndex(seed + (i*10));
                    }
                }
            }
            activateLast();
        };

        // private
        var setActiveWin = function(win){
            if(win != front){
                if(front){
                    front.setActive(false);
                }
                front = win;
                if(win){
                    win.setActive(true);
                }
            }
        };

        // private
        var activateLast = function(){
            for(var i = accessList.length-1; i >=0; --i) {
                if(!accessList[i].hidden){
                    setActiveWin(accessList[i]);
                    return;
                }
            }
            // none to activate
            setActiveWin(null);
        };
        
        return {
            
            //private
            zseed : 7000,
            
            //private ע�ᴰ��
            register : function(win){
                if(win.manager){
                    win.manager.unregister(win);
                }
                win.manager = this;
    
                list[win.id] = win;
                accessList.push(win);
                win.on('hide', activateLast);
            },
            
            //private
            unregister : function(win){
                delete win.manager;
                delete list[win.id];
                win.un('hide', activateLast);
                accessList.remove(win);
            },
            
            //private
            get : function(id){
                return typeof id == "object" ? id : list[id];
            },
            
            //private ������������ǰ��
            bringToFront : function(win){
                win = this.get(win);
                if(win != front){
                    win._lastAccess = new Date().getTime();
                    orderWindows();
                    return true;
                }
                return false;
            },
            
            //private ���������������
            sendToBack : function(win){
                win = this.get(win);
                win._lastAccess = -(new Date().getTime());
                orderWindows();
                return win;
            },
            
            //�������д���
            hideAll : function(){
                for(var id in list){
                    if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                        list[id].hide();
                    }
                }
            },
            
            //private
            getActive : function(){
                return front;
            },
            
            //private
            getBy : function(fn, scope){
                var r = [];
                for(var i = accessList.length-1; i >=0; --i) {
                    var win = accessList[i];
                    if(fn.call(scope||win, win) !== false){
                        r.push(win);
                    }
                }
                return r;
            },

            //private
            each : function(fn, scope){
                for(var id in list){
                    if(list[id] && typeof list[id] != "function"){
                        if(fn.call(scope || list[id], list[id]) === false){
                            return;
                        }
                    }
                }
            }
        };
        
    };
    
    /**
     * ���ڹ���
     */
    Rs.app.WindowRegionMgr = new WindowGroup();
    
    
    //���ڵ�����С��
    var WindowResizable = function(win, el, config){
        
        this.win = win;
        
        this.el = el;
        
        //����������С����
        this.proxy = this.createProxy({
            tag: 'div', 
            cls: 'rs-app-window-resizable-proxy', 
            id: this.el.id + '-rzproxy'
        }, Rs.getBody());
        this.proxy.unselectable();
        this.proxy.setStyle('display', 'block');
        
        //Ӧ������
        Rs.apply(this, config);
        
        //���õ�����С��λ��
        if(!this.handles){ // no handles passed, must be legacy style
            this.handles = 's,e,se';
            if(this.multiDirectional){
                this.handles += ',n,w';
            }
        }
        if(this.handles == 'all'){
            this.handles = 'n s e w ne nw se sw';
        }
        var hs = this.handles.split(/\s*?[,;]\s*?| /),
            ps = WindowResizable.positions;
        
        for(var i = 0, len = hs.length; i < len; i++){
            if(hs[i] && ps[hs[i]]){
                var pos = ps[hs[i]];
                this[pos] = new WindowResizable.Handle(this, pos);
            }
        }
        //legacy
        this.corner = this.southeast;
        
        this.addEvents(
            /**
             * @event beforeresize
             */
            'beforeresize',
            
            /**
             * @event resize
             */
            'resize'
        );
        
        if(this.width && this.height){
            this.resizeTo(this.width, this.height);
        }
        
        WindowResizable.superclass.constructor.call(this);
    };
    
    Rs.extend(WindowResizable, Rs.util.Observable, {
        
        //private
        enabled : true,
        
        heightIncrement : 0,
            
        widthIncrement : 0,
        
        minHeight : 5,

        minWidth : 5,
        
        maxHeight : 10000,

        maxWidth : 10000,

        minX: 0,
        
        minY: 0,
        
        //�Ƿ񱣳�ԭ�б���
        preserveRatio : false,
        
        //private
        init : function(){
            this.proxy = this.createProxy({
                tag: 'div', 
                cls: 'rs-app-window-resizable-proxy', 
                id: this.el.id + '-rzproxy'
            }, Rs.getBody());
            this.proxy.unselectable();
            this.proxy.setStyle('display', 'block');
        },
        
        //private ������������Сʱ�Ĵ���DIV
        createProxy : function(config, renderTo){
            config = (typeof config == 'object') ? config : {tag : "div", cls: config};
            var me = this,
                DH = Rs.DomHelper,
                el = me.el,
                proxy = DH.append(renderTo, config, true),
                x, y, w, h;
            return proxy;
        }, 
        
        //������С
        resizeTo : function(w, h){
            this.win.setSize({
                width : w,
                height : h
            });
            this.fireEvent('resize', this, w, h, null);
        },
        
        // private
        startSizing : function(e, handle){
            this.fireEvent('beforeresize', this, e);
            if(this.enabled){
                var overlay = this.overlay;
                if(!overlay){
                    overlay = this.overlay = this.createOverlay({
                        tag: 'div', 
                        cls: 'rs-app-window-resizable-overlay', 
                        html: '&#160;'
                    }, Rs.getBody());
                    overlay.on({
                        scope: this,
                        mousemove: this.onMouseMove,
                        mouseup: this.onMouseUp
                    });
                }
                this.resizing = true;
                
                overlay.setStyle('cursor', handle.el.getStyle('cursor'));
                overlay.show();
                
                var el = this.el,
                    proxy = this.proxy,
                    x, y, w, h, 
                    box, pot;
                
                x = el.getX();
                y = el.getY();
                w = el.getWidth();
                h = el.getHeight();
                
                box = this.startBox = {
                    x : x, 
                    y : y,
                    width : w,
                    height : h
                };
                pot = this.startPoint = e.getXY();
                this.offsets = [(box.x + box.width) - pot[0], 
                                (box.y + box.height) - pot[1]];
                
                proxy.setStyle('visibility', 'hidden');
                proxy.setX(x);
                proxy.setY(y);
                proxy.setWidth(w);
                proxy.setHeight(h);
                proxy.show();
            }
        },
        
        //�����ڸǲ�
        createOverlay : function(config, renderTo){
            config = (typeof config == 'object') ? config : {tag : "div", cls: config};
            
            var DOM = Rs.lib.Dom, 
                DH = Rs.DomHelper,
                x = 0, y = 0,
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay = DH.append(renderTo, config, true);
            
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            
            return overlay;
        },
        
        // private
        onMouseDown : function(handle, e){
            if(this.enabled){
                e.stopEvent();
                this.activeHandle = handle;
                this.startSizing(e, handle);
            }
        },
        
        
        // private
        onMouseUp : function(e){
            this.activeHandle = null;
            var size = this.resizeElement(),
                overlay = this.overlay;
            
            this.resizing = false;
            this.handleOut();
            overlay.hide();
            this.fireEvent('resize', this, size.width, size.height, e);
        },
        
        //private
        resizeElement : function(){
            var proxy = this.proxy,
                win = this.win,
                x = proxy.getX(),
                y = proxy.getY(),
                w = proxy.getWidth(),
                h = proxy.getHeight(), 
                box;
            
            box = {
                x : x,
                y : y,
                width : w,
                height : h
            };
            
            proxy.hide();
            win.handleResize(box);
            return box;
        },
        
        
        // private
        constrain : function(v, diff, m, mx){
            if(v - diff < m){
                diff = v - m;
            }else if(v - diff > mx){
                diff = v - mx;
            }
            return diff;
        },
        
        // private
        snap : function(value, inc, min){
            if(!inc || !value){
                return value;
            }
            var newValue = value;
            var m = value % inc;
            if(m > 0){
                if(m > (inc/2)){
                    newValue = value + (inc-m);
                }else{
                    newValue = value - m;
                }
            }
            return Math.max(min, newValue);
        },
        
        // private
        onMouseMove : function(e){
            if(this.enabled && this.activeHandle){
                try{
                    var curSize = this.curSize || this.startBox,
                        x = this.startBox.x, y = this.startBox.y,
                        ox = x,
                        oy = y,
                        w = curSize.width,
                        h = curSize.height,
                        ow = w,
                        oh = h,
                        mw = this.minWidth,
                        mh = this.minHeight,
                        mxw = this.maxWidth,
                        mxh = this.maxHeight,
                        wi = this.widthIncrement,
                        hi = this.heightIncrement,
                        eventXY = e.getXY(),
                        diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0])),
                        diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1])),
                        pos = this.activeHandle.position,
                        tw,
                        th,
                        proxy = this.proxy;
    
                    switch(pos){
                        case 'east':
                            w += diffX;
                            w = Math.min(Math.max(mw, w), mxw);
                            break;
                        case 'south':
                            h += diffY;
                            h = Math.min(Math.max(mh, h), mxh);
                            break;
                        case 'southeast':
                            w += diffX;
                            h += diffY;
                            w = Math.min(Math.max(mw, w), mxw);
                            h = Math.min(Math.max(mh, h), mxh);
                            break;
                        case 'north':
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            break;
                        case 'west':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            x += diffX;
                            w -= diffX;
                            break;
                        case 'northeast':
                            w += diffX;
                            w = Math.min(Math.max(mw, w), mxw);
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            break;
                        case 'northwest':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            diffY = this.constrain(h, diffY, mh, mxh);
                            y += diffY;
                            h -= diffY;
                            x += diffX;
                            w -= diffX;
                            break;
                       case 'southwest':
                            diffX = this.constrain(w, diffX, mw, mxw);
                            h += diffY;
                            h = Math.min(Math.max(mh, h), mxh);
                            x += diffX;
                            w -= diffX;
                            break;
                    }
    
                    var sw = this.snap(w, wi, mw);
                    var sh = this.snap(h, hi, mh);
                    if(sw != w || sh != h){
                        switch(pos){
                            case 'northeast':
                                y -= sh - h;
                            break;
                            case 'north':
                                y -= sh - h;
                                break;
                            case 'southwest':
                                x -= sw - w;
                            break;
                            case 'west':
                                x -= sw - w;
                                break;
                            case 'northwest':
                                x -= sw - w;
                                y -= sh - h;
                            break;
                        }
                        w = sw;
                        h = sh;
                    }
    
                    if(this.preserveRatio){
                        switch(pos){
                            case 'southeast':
                            case 'east':
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                w = ow * (h/oh);
                               break;
                            case 'south':
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                                break;
                            case 'northeast':
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                            break;
                            case 'north':
                                tw = w;
                                w = ow * (h/oh);
                                w = Math.min(Math.max(mw, w), mxw);
                                h = oh * (w/ow);
                                x += (tw - w) / 2;
                                break;
                            case 'southwest':
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                tw = w;
                                w = ow * (h/oh);
                                x += tw - w;
                                break;
                            case 'west':
                                th = h;
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                y += (th - h) / 2;
                                tw = w;
                                w = ow * (h/oh);
                                x += tw - w;
                               break;
                            case 'northwest':
                                tw = w;
                                th = h;
                                h = oh * (w/ow);
                                h = Math.min(Math.max(mh, h), mxh);
                                w = ow * (h/oh);
                                y += th - h;
                                x += tw - w;
                                break;
    
                        }
                    }
                    
                    proxy.setX(x);
                    proxy.setY(y);
                    proxy.setWidth(w);
                    proxy.setHeight(h);
                }catch(ex){}
            }
        },
        
        handleOver : function(){
            if(this.enabled){
                this.el.addClass('rs-app-window-resizable-over');
            }
        },
        
        handleOut : function(){
            if(!this.resizing){
                this.el.removeClass('rs-app-window-resizable-over');
            }
        }, 
        
        destroy : function(){
            this.overlay = null;
            this.proxy = null;

            var ps = WindowResizable.positions;
            for(var k in ps){
                if(typeof ps[k] != 'function' && this[ps[k]]){
                    this[ps[k]].destroy();
                }
            }
            this.purgeListeners();
        },
        
        syncHandleHeight : function(){
            var h = this.el.getHeight(true);
            if(this.west){
                this.west.el.setHeight(h);
            }
            if(this.east){
                this.east.el.setHeight(h);
            }
        }
        
    });
    
    //λ��
    WindowResizable.positions  = {
            n: 'north', 
            s: 'south', 
            e: 'east', 
            w: 'west', 
            se: 'southeast', 
            sw: 'southwest', 
            nw: 'northwest', 
            ne: 'northeast'
    };
    
    //
    WindowResizable.Handle = function(rz, pos, disableTrackOver){
        this.position = pos;
        this.rz = rz;
        this.init();
    };
    
    WindowResizable.Handle.prototype = {
        
        init : function(){
            this.el = this.rz.el.createChild({
                tag : 'div',
                cls : 'rs-app-window-resizable-handle rs-app-window-resizable-handle-' + this.position 
            });
            this.el.unselectable();
            
            this.el.on('mousedown', this.onMouseDown, this);
            
            if(!this.disableTrackOver){
                this.el.on({
                    scope: this,
                    mouseover: this.onMouseOver,
                    mouseout: this.onMouseOut
                });
            }
        },
        
        // private
        onMouseDown : function(e){
            this.rz.onMouseDown(this, e);
        },
        
        // private
        onMouseOver : function(e){
            this.rz.handleOver(this, e);
        },
        
        // private
        onMouseOut : function(e){
            this.rz.handleOut(this, e);
        },
        
        // private
        destroy : function(){
            this.el = null;
        }

    };
    
})();