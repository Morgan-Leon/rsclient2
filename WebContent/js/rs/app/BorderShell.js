(function(){
    
    /**
     * @class Rs.app.BorderShell
     * @extends Rs.app.Shell
     * border���ֿ��
     * @constructor
     * @param {Object} config
     */
    Rs.app.BorderShell = Rs.extend(Rs.app.Shell, {
        
        //����
        type : 'border',
        
        //BorderShell�Ļ������
        frameTpl : ['<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-center"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-north"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-west"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-east"></div></div>',
                    '<div class="rs-app-region"><div class="rs-app-region-cell rs-app-region-south"></div></div>'],
        
        //private
        regionPos : ['north', 'south', 'west', 'east', 'center'],
            
        //��д��ʼ������Ӧ�ó���λ������
        initAllRegionCollection : function(){
            Rs.app.BorderShell.superclass.initAllRegionCollection.apply(this, arguments);
            
            var regionEls = this.regionEls = new Rs.util.MixedCollection(false),
                frame = this.frame,
                regionCls = this.regionCls,
                regionPos = this.regionPos,
                els = frame.query('.' + regionCls), 
                el, ps;
            
            for(var i = 0, len = regionPos.length; i < len; i++){
                ps = regionPos[i];
                el = frame.child('.' + regionCls + '-' + ps);
                if(el){
                    regionEls.add(ps, el);
                }
            }
        },
        
        /**
         * ��д����shell����
         * @method doBuild
         */
        doBuild : function(){
            Rs.app.BorderShell.superclass.doBuild.apply(this, arguments);
            
            //���Ӧ�ó���λ��
            var regionEls = this.regionEls,
                n = regionEls.get('north'),
                s = regionEls.get('south'),
                w = regionEls.get('west'),
                e = regionEls.get('east'),
                c = regionEls.get('center'),
                ps;
            if(n){
                var north = this.north;
                if(!north || !(north instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'north';
                    north = this.north = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    north.renderTo(n);
                    this.regions.add(ps, north);
                }
            }
            if(s){
                var south = this.south;
                if(!south || !(south instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'south';
                    south = this.south = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    south.renderTo(s);
                    this.regions.add(ps, south);
                }
            }
            if(w){
                var west = this.west;
                if(!west || !(west instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'west';
                    west = this.west = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    west.renderTo(w);
                    this.regions.add(ps, west);
                }
            }
            if(e){
                var east = this.east;
                if(!east || !(east instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'east';
                    east = this.east = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    east.renderTo(e);
                    this.regions.add(ps, east);
                }
            }
            if(c){
                var center = this.center;
                if(!center || !(center instanceof Rs.app.BorderShell.SplitRegion)){
                    ps = 'center';
                    center = this.center = new Rs.app.BorderShell.SplitRegion(this, 
                            this[ps] || {}, ps);
                    center.renderTo(c);
                    this.regions.add(ps, center);
                }
            }
        }, 
        
        /**
         * ��д����reBuildRegions,�ع�shell
         * 
         * @param {Rs.app.Region} r
         * @param {Rs.app.Application} a 
         */
        doReBuild : function(r, a){
            Rs.app.BorderShell.superclass.doReBuild.apply(this, arguments);
            var regions = this.regions;
            regions.each(function(region){
                //�г���װ��,������Ӧ�ó���λ��
                if(region.isApplyApp()){
                    this.doReBuildRegion.defer(10, this, [region]);
                }
            }, this);
        },
        
        //private
        doReBuildRegion : function(region){
            var b = region.getSize(),
                m = region.getMargins(),
                ps = region.position,
                xy = this.getXY(),
                x = xy[0], y = xy[1],
                size = this.getSize(),
                w = size.width, 
                h = size.height,
                box = {}, mixBox = {height:0,width:0},
                nb = this.north?this.north.getSize():mixBox,
                sb = this.south?this.south.getSize():mixBox,
                wb = this.west?this.west.getSize():mixBox,
                eb = this.east?this.east.getSize():mixBox;
            if(ps !== 'center'){
                box.x = ((ps == 'east')?(w - b.width):0) + m.left + x;
                box.y = ((ps == 'north')?0:(ps == 'south')?(h - b.height):nb.height) + m.top + y;
                box.width = ((ps == 'north' || ps == 'south') ? w : b.width) - (m.left+m.right);
                box.height = ((ps == 'north' || ps == 'south') ? b.height : (h - nb.height - sb.height)) - (m.top + m.bottom);    
            }else {
                box.x = wb.width + m.left + x;
                box.y = nb.height + m.top + y;
                box.width = w - wb.width - eb.width - (m.left + m.right);
                box.height = h - nb.height - sb.height - (m.top + m.bottom);
            }
            if(!region.isVisible()){
                region.applyCollapsedEl(box);
            }else {
                region.applyPanelEl(box);
            }
        }, 
        
        //��д����afterRebuild����,ȷ��Border�ж����ϱ��������λ�ϵ�Ӧ�ó�����������
        afterReBuild : function(region, app){
            Rs.app.BorderShell.superclass.afterReBuild.apply(this, arguments);
            if(region instanceof Rs.app.BorderShell.SplitRegion){
                if(region && app && app.isOpen() != true){
                    app.open(!region.isVisible());
                }
            }
        }
    });
    
    //ע��BorderShell
    Rs.app.SHELL['border'] = Rs.app.BorderShell;
    
    /**
     * @class Rs.app.BorderShell.SplitRegion
     * @extends Rs.app.Region
     * ��װӦ�ó���λ��
     * @constructor
     * @param {Rs.app.BorderShell} shell
     * @param {Object} config
     * @param {String} pos App��������λ��
     */
    Rs.app.BorderShell.SplitRegion = function(shell, config, pos){
        Rs.apply(this, config);
        this.shell = shell;
        this.position = pos;
        if(typeof this.margins == 'string'){
            this.margins = this.shell.parseMargins(this.margins);
        }
        this.margins = Rs.applyIf(this.margins || {}, this.defaultMargins);
        Rs.app.BorderShell.SplitRegion.superclass.constructor.call(this, shell, config);
    };

    Rs.extend(Rs.app.BorderShell.SplitRegion, Rs.app.Region, {
                
        defaultMargins : {left:0,top:0,right:0,bottom:0},
        
        collapsedCls : 'rs-app-collapsed',
        
        isCollapsed : false,
        
        collapsed : false,
        
        /** 
         *@cfg {Number} headerHeight 
         *App�������������߶�
         */
        headerHeight : 25,
        /** 
         *@cfg {Boolean} header 
         *�Ƿ���ʾ����ͷ
         */
        header : true,
        
        /** 
         *@cfg {Number} collapsedElWidth 
         *App����������ذ�ť���
         */
        collapsedElWidth : 25,
        
        //private
        getState : function(){
            var state = Rs.app.BorderShell.SplitRegion.superclass.getState.call(this);
            return Rs.apply(state, {
                width : this.width,
                height : this.height,
                collapsed : this.collapsed
            });
        },
        
        afterApplyApp : function(app){
            if(!this.header){
                this.collapsedElWidth = 6;
            }
        },
        
        //private
        applyState : function(state){
            Rs.app.BorderShell.SplitRegion.superclass.applyState.apply(this, arguments);
            if(state && Rs.isBoolean(state.collapsed)){
                this[state.collapsed === true?'onCollapse':'onExpand']();
            }
        },
        
        /**
         * ��дregion�е�open����,��region��open��ʾ�򿪸�Ӧ�ó���,
         * borderregion�е�Ӧ�ó����ڳ�ʼ����ʱ����Ѿ���ʼ����,
         * �˴��Ĵ򿪱�ʾ�������ϱ��ĸ������ϵ����չ��.
         * @method open
         */
        open : function(){
            Rs.app.BorderShell.SplitRegion.superclass.open.apply(this, arguments);
            this.expand();
        },
        
        /**
         * ��дregion��close����, ��region��close������ʾ����Ӧ�ó���ر�, 
         * �˴�border region����Ӧ�ó���ر�,ֻ�н�Ӧ�ó���ϲ�������,
         * �˴��Ĺرձ�ʾ�������ϱ��ĸ������ϵ����ϲ�.
         * @mehthod close
         */
        close : function(){
            Rs.app.BorderShell.SplitRegion.superclass.close.apply(this, arguments);
            this.collapse();
        },

        /**
         * �жϸ������Ƿ���ʾ
         *@return {Boolean}
         */
        isVisible : function(){
            return this.collapsed !== true;
        },
        
        //���ó�������λ�úʹ�С
        applyPanelEl : function(box){
            this.removeBlankClass();
            var ps = this.position,
                x = box.x, 
                y = box.y,
                w = box.width,
                h = box.height;
            
            //��������ָ��ߵ�λ�úʹ�С
            if(ps != 'center'){
                var splitEl = this.getSplitEl();
                
                splitEl.setXY([x + (ps=='west'?w-5:0), y + (ps =='north'?h-5:0)]);
                splitEl.setWidth((ps=='north' || ps=='south')?w:5);
                splitEl.setHeight((ps=='west' || ps=='east')?h:5);
            }
            
            //���ù�������λ�úʹ�С
            if(ps != 'center'){
                if(this.header){
                    var headerEl = this.getHeaderEl();
                    headerEl.setXY([x + (ps=='east'?5:0), y]);
                    headerEl.setWidth(w - ((ps == 'east' || ps == 'west')?5:0));
                    headerEl.setHeight(this.headerHeight);
                } else if(this.collapsible){
                    var toggle = this.getToggle('middle');
                }
            }
            //����Ӧ�ó����λ�úʹ�С
            var targetEl = this.targetEl;
            if(ps != 'center'){
                targetEl.setXY([x + (ps=='east'?5:0), y+(this.header?this.headerHeight:5)]);
                
                w = w - ((ps=='west' || ps=='east')?5:0);
                h = h-(this.header?this.headerHeight:5)-((ps=='north' || ps=='south')?5:0);
                targetEl.setWidth(w);
                targetEl.setHeight(h);
                
                this.fireEvent('resize', targetEl, w, h);
            }else {
                targetEl.setXY([x, y]);
                targetEl.setWidth(w);
                targetEl.setHeight(h);
                
                this.fireEvent('resize', targetEl, w, h);
            }
        }, 
        
        //��ȡHeader
        getHeaderEl : function(){
            var headerEl = this.headerEl,
                panelEl = this.panelEl;
            if(!headerEl){
                if(this.headerCfg){
                    headerEl = this.headerEl = panelEl.insertFirst(this.headerCfg);
                }else {
                    headerEl = this.headerEl = panelEl.insertFirst({
                        tag : 'div',
                        cls : 'rs-app-header x-app-header'
                    });
                }
                //�Ƿ������
                if(this.collapsible == true){
                    var ps = this.position,
                        collapsed = this.collapsed, 
                        toggle = this.toggle;
                    if(!toggle){
                        this.getToggle('top');
                    }
                }
                //��ӳ�������
                var icon = this.app.getIcon16();
                headerEl.createChild({
                    html : '<span class="' + icon + ' rs-app-header-text x-app-header-text">' + (this.name||'') + '</span>' 
                });
            }
            return headerEl;
        },
        
        //��ȡչ�����
        getCollapsedEl : function(){
            var collapsedEl = this.collapsedEl;
            if(!collapsedEl){
                var panelEl = this.panelEl,
                ps = this.position,
                collapsed = this.collapsed;
                collapsedEl = this.collapsedEl = Rs.DomHelper.insertAfter(panelEl, {
                    cls: "rs-app-collapser x-app-collapser rs-app-collapser-" + ps
                }, true);
                collapsedEl.on('click', this.onClickCollapsedEl, this);
                if(this.header){
                    var ccls = 'rs-app-tool x-app-tool rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps;
                    var bcls = 'rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps + '-over';
                } else{                    
                    var ccls = 'rs-app-tool-middle x-app-tool-middle-' + (collapsed ? 'expand' : 'collapse') + '-' + ps 
                        + ' rs-app-tool-middle-'+ ps;
                    var bcls = 'rs-app-tool-middle-over';
                }
                var collapsedElToggle = this.collapsedElToggle = collapsedEl.createChild({
                    tag : 'div',
                    cls : ccls
                });
                collapsedEl.on('mouseover', function(){
                    collapsedEl.addClass('x-app-collapser-over');
                    collapsedElToggle.addClass(bcls);
                    collapsedEl.on('mouseleave', function(){
                        collapsedEl.removeClass('x-app-collapser-over');
                        collapsedElToggle.removeClass(bcls);
                    }, this, {single : true});
                }, this);
                collapsedElToggle.on('click', this.toggleCollapse, this);
            }
            return this.collapsedEl;
        },
        
        // private
        onClickCollapsedEl : function(e, el){
            this.toggleCollapse(e, el);
        },
        
        //��ȡ�ָ���
        getSplitEl : function(){
            if(!this.splitEl){
                var ps = this.position;
                this.splitEl = this.panelEl.createChild({
                    cls: "rs-app-split x-app-split", 
                    html: "&#160;"
                });
                this.splitEl.setStyle('cursor', (ps == 'north' || ps == 'south')?'row-resize':'col-resize');
                this.splitElDD = new SplitElDD(this, this.splitEl, this.panelEl,
                    (ps == 'east' || ps == 'west') ? SplitElDD.HORIZONTAL : SplitElDD.VERTICAL);
            }
            return this.splitEl;
        },
        
        //��ȡ��С
        getSize : function(){
            var w = this.width, 
                h = this.height,
                ps = this.position,
                cew = this.collapsedElWidth,
                size = this.shell.getSize();
            if(this.collapsed !== true){
                w = (ps == 'west' || ps == 'east') ? w ? w : this.minWidth : size.width;
                h = (ps == 'north' || ps == 'south') ? h ? h : this.minHeight : size.height;
            }else {
                w = (ps == 'west' || ps == 'east') ? cew : size.width;
                h = (ps == 'north' || ps == 'south') ? cew : size.height;
            }
            return {
                width : w,
                height : h
            };
        },
        
        //��ȡ�ܱ�����
        getMargins : function(){
            return this.margins;
        },
        
        //private ɾ���հ�λ����ʽ
        removeBlankClass : function(){
            var cls = 'rs-app-blank-region',
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        },
        
        getToggle : function(togglePosition){
        
            var ps = this.position,
            collapsed = this.collapsed, 
            toggle = this.toggle;
            if(!toggle){
                if(togglePosition == "top"){
                    toggle = this.toggle = this.headerEl.createChild({
                        tag : 'div',
                        cls : 'rs-app-tool x-app-tool rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps
                    });
                    toggle.on('click', this.toggleCollapse, this);
                    toggle.on('mouseover', function(){
                        var cls = 'rs-app-tool-' + (collapsed ? 'expand' : 'collapse') + '-' + ps + '-over';
                        toggle.addClass(cls);
                        toggle.on('mouseleave', function(){
                            toggle.removeClass(cls);
                        }, this, {single : true});
                    }, this);
                } else if(togglePosition == "middle"){
                    toggle = this.toggle = this.splitEl.createChild({
                       tag : 'div',
                       cls : 'rs-app-tool-middle x-app-tool-middle-' + (collapsed ? 'expand' : 'collapse') + '-' + ps 
                           + ' rs-app-tool-middle-'+ ps
                    });
                    toggle.on('click', this.toggleCollapse, this);
                    toggle.on('mouseover', function(){
                        var cls = 'rs-app-tool-middle-over';
                        toggle.addClass(cls);                        
                        this.splitEl.un('mousedown', this.splitElDD.notifyOut, this.splitElDD);
                        toggle.on('mouseleave', function(){
                            toggle.removeClass(cls);
                            this.splitEl.on('mousedown', this.splitElDD.notifyOut, this.splitElDD);
                        }, this, {single : true});
                    }, this);
                }
            }
        },
        
        
        /**
         * չ����ϲ����
         * @param {Event} e
         * @return {Rs.app.BorderShell.SplitRegion} ��ǰ��������
         */
        toggleCollapse : function(e){
            this[this.collapsed ? 'expand' : 'collapse']();
            if(e){
                e.stopEvent();
            }
            return this;
        }, 
        
        //�ϲ�֮ǰִ�и÷���,����÷�������false����ִֹ��
        onBeforeCollapse : Rs.emptyFn,
        
        /**
         * �ϲ����
         * @return {Rs.app.BorderShell.SplitRegion} ��ǰ��������
         */
        collapse : function(){
            if(this.collapsed 
                || this.fireEvent('beforecollapse', this) === false
                || this.onBeforeCollapse(this) === false){
                return;
            }
            this.onCollapse();
            return this;
        },

        // private
        onCollapse : function(){
            this.collapsed = true;
            //��ʾչ�����
            this.showCollapsedEl();
            //���س���λ��
            this.hidePanelEl();
            this.afterCollapse();
        },
        
        // private
        afterCollapse : function(){
            var shell = this.shell;
            if(shell){
                shell.reBuild();
            }
            this.fireEvent('collapse', this, shell);
        },
        
        //��ʾ�ϲ����
        showCollapsedEl : function(){
            var ce = this.getCollapsedEl(),
                cls = this.collapsedCls,
                ps = this.position;
            if(ce && ce.hasClass(cls)){ //ȥ��������ʽ
                ce.removeClass(cls);
            }
            this.collapsedElToggle.removeClass('rs-app-tool-collapse' + '-' + ps);
            if(this.header){
                this.collapsedElToggle.addClass('rs-app-tool-expand' + '-' + ps);
            }
        },
        
        //���غϲ����
        hideCollapsedEl : function(){
            var ce = this.getCollapsedEl(),
                cls = this.collapsedCls,
                ps = this.position;
            if(ce && !ce.hasClass(cls)){
                ce.addClass(cls);
            }
            this.collapsedElToggle.removeClass('rs-app-tool-expand' + '-' + ps);
            if(this.header){
                this.collapsedElToggle.addClass('rs-app-tool-collapse' + '-' + ps);
            }
        },
        
        //����չ���ϲ�����λ�úʹ�С
        applyCollapsedEl : function(box){
            var ce = this.getCollapsedEl(),
                x = box.x,
                y = box.y,
                w = box.width,
                h = box.height,
                ps = this.position;
            ce.setXY([x, y]);
            ce.setWidth(w);
            ce.setHeight(h);
        },
        
        //���س������
        hidePanelEl : function(){
            var cls = this.collapsedCls,
                panelEl = this.panelEl;
            if(!panelEl.hasClass(cls)){
                panelEl.addClass(cls);
            }
        },
        
        //��ʾ�������
        showPanelEl : function(){
            var cls = this.collapsedCls,
                panelEl = this.panelEl;
            if(panelEl.hasClass(cls)){
                panelEl.removeClass(cls);
            }
        },
        
        //չ��֮ǰִ�и÷���,����÷�������false����ֹչ��
        onBeforeExpand : Rs.emptyFn,
        
        /**
         * չ�����
         * @return {Rs.app.BorderShell.SplitRegion} ��ǰ��������
         */
        expand : function(){
            if(!this.collapsed
                || this.fireEvent('beforeexpand', this) === false
                || this.onBeforeExpand(this) === false){
                return;
            }
            this.onExpand();
            return this;
        },

        // private
        onExpand : function(){
            this.collapsed = false;
            //��ʾ�������
            this.showPanelEl();
            //���غϲ����
            this.hideCollapsedEl();
            this.afterExpand();
        },

        // private
        afterExpand : function(){
            var shell = this.shell;
            if(shell) {
                shell.reBuild();
            }
            this.fireEvent('expand', this, shell);
        }

    });
    
    //����ָ��ߵ���ק����
    var SplitElDD = function(region, splitEl, panelEl, orientation){
        this.region = region;
        this.splitEl = splitEl;
        this.panelEl = panelEl;
        this.orientation = orientation;
        this.init();
    };
    
    //��ֱ�ƶ�
    SplitElDD.VERTICAL = 1;
    
    //ˮƽ�ƶ�
    SplitElDD.HORIZONTAL = 2;
    
    SplitElDD.prototype = {
        
        //��ʼ������,�����ָ����ϵ�������͵���¼�
        init : function(){
            this.splitEl.on('mouseenter', this.notifyEnter, this);
            this.splitEl.on('mousedown', this.notifyOut, this);
        },
        
        //��������ָ���ʱִ�и÷���
        notifyEnter : function(){
            
        },
        
        //������ָ���ʱ��ʾ�ָ����϶���Ӱ
        notifyOut : function(){
            this.showProxy();
        },
        
        //��ʾ�ָ����϶���Ӱ
        showProxy : function(){
            var DOM = Rs.lib.Dom, 
                x = 0, y = 0, 
                w = DOM.getViewWidth(true),
                h = DOM.getViewHeight(true),
                overlay,
                proxy,
                splitEl = this.splitEl;

            overlay = this.overlay =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls: "rs-app-split-overlay"
            }, true);
            overlay.setX(x);
            overlay.setY(y);
            overlay.setWidth(w);
            overlay.setHeight(h);
            overlay.unselectable();
            if(Rs.isIE){
                overlay.setStyle({
                    'opacity' : '30',
                    'filter' : 'alpha(opacity=30)'
                });
            }else {
                overlay.setStyle({
                    'opacity' : '.30',
                    '-moz-opacity' : '.30',
                    'filter' : 'alpha(opacity=.30)'
                });
            }
            
            overlay.on('mousemove', this.notifyOver, this);
            overlay.on('mouseup', this.notifyDrop, this);
            
            x = splitEl.getX(),
            y = splitEl.getY(),
            w = splitEl.getWidth(),
            h = splitEl.getHeight();
            
            proxy = this.proxy =  Rs.DomHelper.append(document.body,  {
                tag : 'div',
                cls : 'rs-app-split-proxy'
            }, true);
            proxy.on('mouseup', this.notifyDrop, this);
            
            proxy.setX(x);
            proxy.setY(y);
            proxy.setWidth(w);
            proxy.setHeight(h);
            proxy.unselectable();
            
            //��¼�ָ��߳�ʼλ��
            this.sourceposition = {
                x : x,
                y : y
            };
        },
        
        //���طָ����϶���Ӱ
        hideProxy : function(){
            var overlay = this.overlay, 
                proxy = this.proxy;
            if(overlay){
                overlay.removeAllListeners();
                overlay.remove();
                delete overlay;
            }
            if(proxy){
                proxy.removeAllListeners();
                proxy.remove();
                delete proxy;
            }
            
            delete this.sourceposition;
        },
        
        //������ƶ�ʱִ�и÷���,�޸ķָ����϶���Ӱλ��
        notifyOver : function(e, t, o){
            var orientation =  this.orientation,
                proxy = this.proxy, 
                xy = e.getXY(), 
                x = xy[0],
                y = xy[1],
                region = this.region,
                ps = region.position,
                size = region.getSize(),
                source = this.sourceposition,
                min, max, v;
            
            if(orientation == SplitElDD.VERTICAL){
                min = region.minHeight;
                max = region.maxHeight;
                v = size.height + (ps == 'north'?1:-1)*(y - source.y);
                if(v >= min && v <= max){
                    proxy.setY(y);
                }
            }else if(orientation == SplitElDD.HORIZONTAL){
                min = region.minWidth;
                max = region.maxWidth;
                v = size.width + (ps == 'west'?1:-1)*(x - source.x);
                if(v >= min && v <= max){
                    proxy.setX(x);
                }
            }
        },
        
        //����갴������ʱִ�и÷���,����Ӧ�ó����С
        notifyDrop : function(e, t, o){
            var proxy = this.proxy,
                x = proxy.getX(),
                y = proxy.getY(),
                w, h,
                region = this.region,
                shell = region.shell,
                ps = region.position,
                size = region.getSize(),
                source = this.sourceposition,
                orientation =  this.orientation;
            
            if(orientation == SplitElDD.VERTICAL){
                h = size.height + (ps == 'north'?1:-1)*(y - source.y);
                region.setHeight(h);
                shell.reBuild();
            }else if(orientation == SplitElDD.HORIZONTAL){
                w = size.width + (ps == 'west'?1:-1)*(x - source.x);
                region.setWidth(w);
                shell.reBuild();
            }
            
            this.hideProxy();
        }
        
    };
    
    
})();