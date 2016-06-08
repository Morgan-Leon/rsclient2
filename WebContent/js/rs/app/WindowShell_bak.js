(function(){
	Rs.app.WindowShell = Rs.extend(Rs.app.Shell, {
		
	    /**
         * 类型
         * @cfg {String} type
         */
		type : 'window',
		
		frameTpl : ['<div class="rs-frame-taskbar"></div>',
		            '<div class="rs-menu rs-menu-region"></div>'],
		
		activeAppRegionList : [],
		
		appRegions : [],
		
		openedAppRegions : [],
		
		doBuild : function(){
			Rs.app.WindowShell.superclass.doBuild.apply(this, arguments);
			var frame = this.frame ;
			var menu = frame.child('.rs-menu-region'),
				t = frame.child('.rs-frame-taskbar');
			var size = this.getSize();
			var w = size.width, h = size.height,
		    	centerW = w, centerH = h, centerY = 0, centerX = 0,
		    	b, m, totalWidth, totalHeight;
			if(t){
				var taskbar = this.taskbar;
				if(!taskbar){
					taskbar = this.taskbar = new Rs.app.WindowShell.TaskBar(this, this['2'] || {});
					taskbar.renderTo(t);
				}
				this.taskbar.on('menuClick',this.onMenuClick,this);
				this.taskbar.on('taskClick',this.onAppClick,this);
				b = taskbar.getSize();
		        m = taskbar.getMargins();
		        b.x = m.left;
		        totalHeight = (b.height + m.top + m.bottom);
		        b.y = h - totalHeight + m.top;
		        this.taskbarH = totalHeight;
		        taskbar.applyLayout(b);
		        this.tpanel = taskbar.getPanel();
			}
			if(menu){
				var menuPanel = this.menuPanel;
				if(!menuPanel){
					menuPanel = this.menuPanel = new Rs.app.WindowShell.Menu(this, {hidden : true});
					menuPanel.renderTo(menu);
				}
				this.menuPanel.on('menuitemclick', this.onAppItemClick, this);
				b = menuPanel.getSize();
		        m = menuPanel.getMargins();
		        b.x = m.left;
		        totalHeight = (b.height + m.top + m.bottom);
		        b.y = h - totalHeight + m.top - this.taskbarH -3;
		        menuPanel.applyLayout(b);
		        this.mpanel = menuPanel.getPanel();
		        this.menuPanel.hide();
		        this.mflag = false;
			}
		},
		
		reBuild : function(appregion){
			if(appregion){
				this.appRegions.push(appregion);
				this.menuPanel.addAppItem(this.appRegions.length-1, appregion.appName);
				this.afterReBuild(appregion);
			}
	    },
		
		onMenuClick : function(){
	    	if(this.menuPanel.hidden){
				this.menuPanel.show();
			} else{
				this.menuPanel.hide();
			}
		},
		
		onAppItemClick : function(item, apprn){
			if(this.appRegions[apprn].hidden){
				this.taskbar.addTask(apprn, this.appRegions[apprn].appName);
				this.openedAppRegions.push(apprn);
				this.appRegions[apprn].on('activate', this.onAppActivate.createDelegate(this,[apprn]), this);
				var appregion = this.appRegions[apprn];
				//appregion.show();
				appregion.app.open();
				appregion.on('close', this.onAppWindowClose.createDelegate(this,[apprn]),this);
				if(this.activeAppRegionList.length>0){
					this.taskbar.unActive(this.activeAppRegionList[this.activeAppRegionList.length-1]);
				}
				this.activeAppRegionList.push(apprn);
			} else if(this.activeAppRegionList[this.activeAppRegionList.length-1]!= apprn){
				this.onAppClick(item, apprn);
			}
			this.menuPanel.hide();
			this.mflag = false;
		},
		
		onAppActivate : function(apprn){
			if(this.activeAppRegionList.length>0 && this.activeAppRegionList[this.activeAppRegionList.length-1] != apprn){
				for(var i = 0; i < this.activeAppRegionList.length ; i++){
					if(this.activeAppRegionList[i] == apprn){
						this.activeAppRegionList.splice(i, 1);
						this.activeAppRegionList.push(apprn);
						this.taskbar.unActive(this.activeAppRegionList[this.activeAppRegionList.length-2]);
						this.taskbar.doActive(apprn);
					}
				}
			}
		},
		
		onAppWindowClose : function(apprn){
			for(var i = 0; i < this.activeAppRegionList.length ; i++){
				if(this.activeAppRegionList[i] == apprn){
					this.activeAppRegionList.splice(i, 1);
					if(i==this.activeAppRegionList.length && i>0){
						this.taskbar.doActive(this.activeAppRegionList[this.activeAppRegionList.length-1]);
					}
				}
			}
			for(var i =0; i < this.openedAppRegions.length; i++){
				if(this.openedAppRegions[i]==apprn){
					this.openedAppRegions.splice(i,1);
					if(i==0 && this.openedAppRegions.length>0){
						this.taskbar.doFirst(this.openedAppRegions[i]);
					}
				}
			}
            this.appRegions[apprn].app.close();
			this.taskbar.closeTask(apprn);
		},
		
		onAppClick : function(obj, apprn){
			if(this.activeAppRegionList[this.activeAppRegionList.length-1]!= apprn){
				for(var i = 0; i < this.activeAppRegionList.length ; i++){
					if(this.activeAppRegionList[i] == apprn){
						this.activeAppRegionList.splice(i, 1);
						this.activeAppRegionList.push(apprn);
						this.taskbar.unActive(this.activeAppRegionList[this.activeAppRegionList.length-2]);
						this.taskbar.doActive(apprn);
						if(this.appRegions[apprn].hidden){
							this.appRegions[apprn].show();
						}
						this.appRegions[apprn].toFront();
					}
				}
			} else{
				this.appRegions[this.activeAppRegionList[this.activeAppRegionList.length-1]].minimize();
				this.taskbar.unActive(this.activeAppRegionList[this.activeAppRegionList.length-1]);
				this.activeAppRegionList.splice(this.activeAppRegionList.length-1, 1);
				this.appRegions[this.activeAppRegionList[this.activeAppRegionList.length-1]].toFront();
				this.taskbar.doActive(this.activeAppRegionList[this.activeAppRegionList.length-1]);
			}
		}
	});
	
	Rs.app.SHELL['window'] = Rs.app.WindowShell;
	
	Rs.app.WindowShell.Menu = function(shell, config){
		Rs.apply(this, config);
		this.shell = shell;
		if(typeof this.margins == 'string'){
	        this.margins = this.shell.parseMargins(this.margins);
	    }
		this.margins = Rs.applyIf(this.margins || {}, this.defaultMargins);
		Rs.app.WindowShell.Menu.superclass.constructor.call(this);
		this.addEvents('menuitemclick');
	};
	Rs.extend(Rs.app.WindowShell.Menu, Rs.util.Observable, {
			    
		defaultMargins : {left:0,top:0,right:0,bottom:0},
		
		// private
	    defaultNSCMargins : {left:5,top:5,right:5,bottom:5},
	    
	    // private
	    defaultEWCMargins : {left:5,top:0,right:5,bottom:0},
		
	    baseCls : 'rs-app',
	    
	    menuCls : 'rs-app-menu', 
	    
	    isCollapsed : false,
	    
	    collapsed : false,
	    
		minWidth : 180,
		
		minHeight : 0,
		
		itemHeight : 20,
		
		items : [],
		
        renderTo : function(el){
	        this.targetEl = el;
	        var p = this.panel = el;
	        this.focusEl = el.createChild({
	        	tag: 'a', 
	        	cls: 'x-menu-focus', 
	        	href: '#', 
	        	onclick: 'return false;', 
	        	tabIndex: '-1'
	        });
	        Rs.getBody().on('mousedown', function(e, t, o){
	        	if(!e.getTarget(".rs-menu") && !this.hidden){
	        		this.hide();
	        	}
	        },this);
	    },
	    
	    hide : function(){
	    	this.panel.hide();
	    	this.hidden = true;
	    },
	    
	    show : function(){
	    	this.panel.show();
	    	this.hidden = false;
	    	this.focus();
	    },
	    
	    focus : function(){
	        if(!this.hidden){
	            this.doFocus.defer(50, this);
	        }
	    },

	    doFocus : function(){
	        if(!this.hidden){
	            this.focusEl.focus();
	        }
	    },
	    
	    getSize : function(){
	    	var w = this.width, 
	    		h = this.height;
	    	return {
	    		width : w ? w : this.minWidth,
	    		height : h ? h : this.minHeight
	    	};
	    },
	    
	    getMargins : function(){
	        return this.margins;
	    },
	    
	    getPanel : function(){
	    	return this.panel;
	    },
	    
	    // private
	    applyLayout : function(box){
	    	var ps = this.position, 
	    		header = this.header;
	    	if(ps != 'center' && header){
	    		header.setXY([box.x, box.y]);
	    		header.setWidth(box.width);
	    		header.setHeight(box.header);
	    	}
	    	var x = box.x, 
	    		y = box.y, 
	    		w = box.width, 
	    		h = box.height;
	    	y += header ? header.getHeight():0;
	    	h -= header ? header.getHeight():0;
	    	this.targetEl.setXY([x, y]);
	    	this.targetEl.setWidth(w);
	    	this.targetEl.setHeight(h);
	    }, 
	    
	    addAppItem : function(apprn, appname){
	    	if(!this.innerEl){
	    		this.targetEl.setY(this.targetEl.getY()-this.itemHeight-76);
	    		this.targetEl.setHeight(this.targetEl.getHeight()+this.itemHeight+77);
	    		var fel = this.targetEl.createChild({
		    		tag : 'div',
		    		cls : 'rs-menu rs-menu-inner'
		        });
	    		var header = fel.createChild({
	    			tag : 'div',
	    			cls : 'rs-menu rs-menu-header',
	    	    	unselectable:"on", 
	    	    	style:"-moz-user-select:none;", 
	    	    	onselectstart:"return false;"
	    		});
	    		this.innerEl = fel.createChild({
		    		tag : 'div',
		    		cls : 'rs-menu rs-menu-inner2'
		        });
	    		var app = this.innerEl.createChild({
		    		tag : 'div',
		    		html:'&nbsp;'+appname
		        });
	    		app.addClass('rs-menu rs-menu-item-first');
	    		var footer = fel.createChild({
	    			tag : 'div',
	    			cls : 'rs-menu rs-menu-footer',
	    			html : '<span class="rs-menu rs-menu-footer-image"></span><span>退出</span>',
	    	    	unselectable:"on", 
	    	    	style:"-moz-user-select:none;", 
	    	    	onselectstart:"return false;"
	    		});
	    		footer.on('mouseover', function(){
	    			footer.addClass('rs-menu-footer-active');
	    		},this);
	    		footer.on('mouseleave', function(){
	    			footer.removeClass('rs-menu-footer-active');
	    		},this);
	    		footer.on('click',function(){
	    			this.hide();
	    			if(confirm("您确定要退出吗？")){    
	    				self.opener=null;    
	    				self.open('','_self');    
	    				self.close();
	    			}
	    		},this);
	    	} else{
	    		this.targetEl.setY(this.targetEl.getY()-this.itemHeight-2);
	    		this.targetEl.setHeight(this.targetEl.getHeight()+this.itemHeight+2);
	    		var app = this.innerEl.createChild({
		    		tag : 'div',
		    		html:'&nbsp;'+appname
		        });
	    	}
	    	app.addClass('rs-menu rs-menu-item');
    		app.addClass('rs-menu rs-menu-item-last');
	    	app.on('mouseover', function(){
	    		app.addClass('rs-menu rs-menu-item-active');
	    	},this);
	    	app.on('mouseleave', function(){
	    		app.removeClass('rs-menu rs-menu-item-active');
	    	},this);
	    	app.on('click', function(){
	    		this.fireEvent('menuitemclick', this, apprn);
	    	}, this);
	    	if(this.items.length>0){
	    		this.items[this.items.length-1].removeClass('rs-menu rs-menu-item-last');
	    	}
	    	this.items.push(app);
	    }

	});
	
	Rs.app.WindowShell.TaskBar = function(shell, config){
		Rs.apply(this, config);
		this.shell = shell;
		if(typeof this.margins == 'string'){
	        this.margins = this.shell.parseMargins(this.margins);
	    }
		this.margins = Rs.applyIf(this.margins || {}, this.defaultMargins);
		Rs.app.WindowShell.TaskBar.superclass.constructor.call(this);
        this.addEvents('menuClick','taskClick');
	};

	Rs.extend(Rs.app.WindowShell.TaskBar, Rs.util.Observable, {
			    
		defaultMargins : {left:0,top:0,right:0,bottom:0},
		
		// private
	    defaultNSCMargins : {left:5,top:5,right:5,bottom:5},
	    
	    // private
	    defaultEWCMargins : {left:5,top:0,right:5,bottom:0},
		
	    baseCls : 'rs-app',
	    
	    menuCls : 'rs-taskbar-menu', 
	    
	    taskCls : 'rs-taskbar-task', 
	    
	    taskClsFirst : 'rs-taskbar-task-first', 
	    
	    collapsedCls : 'rs-app-collapsed',
	    
	    isCollapsed : false,
	    
	    collapsed : false,
	    
		minWidth:50,
		
		minHeight:30,
		
		tasks : [],
		
		tasksnum : 0,
		
        renderTo : function(el){
	        this.targetEl = el;
	        this.menubutton = el.createChild({
	        	id : 'rs-menu-button',
	        	cls : 'rs-menu',
	    		tag : 'div',
	    		html : '菜单',
	    		unselectable:"on", 
	    		style:"-moz-user-select:none;", 
	    		onselectstart:"return false;"
	        });
	        this.menubutton.addClass(this.menuCls);
	        this.menubutton.on('click', function(){
	        	this.fireEvent('menuClick',this);
	        }, this);
	        var p = this.panel = el;
	    }, 
	    getSize : function(){
	    	var w = this.width, 
	    		h = this.height,
	    		size = this.shell.getSize();
	    	w = size.width;
	    	h = h ? h : this.minHeight;
	    	return {
	    		width : w,
	    		height : h
	    	};
	    },
	    
	    getMargins : function(){
	        return this.margins;
	    },
	    
	    getPanel : function(){
	    	return this.panel;
	    },
	    
	    // private
	    applyLayout : function(box){
	    	var ps = this.position, 
	    		header = this.header;
	    	if(ps != 'center' && header){
	    		header.setXY([box.x, box.y]);
	    		header.setWidth(box.width);
	    		header.setHeight(box.header);
	    	}
	    	var x = box.x, 
	    		y = box.y, 
	    		w = box.width, 
	    		h = box.height;
	    	y += header ? header.getHeight():0;
	    	h -= header ? header.getHeight():0;
	    	this.targetEl.setXY([x, y]);
	    	this.targetEl.setWidth(w);
	    	this.targetEl.setHeight(h);
	    },
	    
	    addTask : function(apprn, appname){
	    	var taskitem = this.targetEl.createChild({
	    		tag : 'div'
	        });
	    	this.tasksnum++;
	    	if(this.tasksnum==1){
	    		taskitem.addClass(this.taskClsFirst);
	    	} else{
	    		taskitem.addClass(this.taskCls);
	    	}
	    	taskitem.on('click', function(){
	        	this.fireEvent('taskClick', this, apprn);
	        }, this);
	    	var t = new Rs.Template('<table cellspacing="0" width="100%" style="color:white"><tbody><tr>',
	                '<td class="ux-taskbutton-left"></td>',
	                '<td class="ux-taskbutton-center">',''+appname,
	                '</td>',
	                '<td class="ux-taskbutton-right"></td>',
	                "</tr></tbody></table>").compile();
	    	var tel = t.insertFirst(taskitem, this.getFrameConfig(), true);
	    	tel.addClass('active-win');
	    	tel.on('mouseover',function(){
	    		if(tel.hasClass('active-win')){
	    			return;
	    		}
	    		tel.addClass('mouseover');
	    	},this);
	    	tel.on('mouseleave',function(){
	    		tel.removeClass('mouseover');
	    	},this);
	    	this.tasks[apprn] = {taskitem:taskitem, tel:tel};
	    },
	    
	    unActive : function(apprn){
	    	this.tasks[apprn].tel.removeClass('active-win');
	    },
	    
	    doActive : function(apprn){
	    	if(this.tasks[apprn].tel.hasClass('mouseover')){
	    		this.tasks[apprn].tel.removeClass('mouseover');
	    	}
	    	this.tasks[apprn].tel.addClass('active-win');
	    },
	    
	    doFirst : function(apprn){
	    	this.tasks[apprn].taskitem.addClass(this.taskClsFirst);
	    },
	    
	    closeTask : function(apprn){
	    	this.tasks[apprn].taskitem.remove();
	    	this.tasks[apprn] = undefined;
	    	this.tasksnum--;
	    },
	    
	    getFrameConfig : function(){
	    	return {};
	    }

	});
})();