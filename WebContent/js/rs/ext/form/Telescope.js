Ext.ns("Rs.ext.form");

(function() {
	/**
	 * @class Rs.ext.form.Telescope 
	 * 望远镜,既可多选也可以单选.<br/>
	 * 望远镜输入值时候查询,手动展开望远镜不取当前控件上的值进行查询<br/>
	 * 望远镜的值必须与数据源的值完全匹配,当查询结果只有一条记录的时候自动反填<br/>
	 * 望远镜手动输入时候,当望远镜展开后,如果不选择记录,窗口关闭,手动输入的值则清除.<br/>
	 * 望远镜如果已经存在值,展开望远镜后,如果不选择记录,窗口关闭,原来的值则保留下来.<br/>
	 * @extends Rs.ext.form.GridLoaderField
	 */
	Rs.ext.form.Telescope = function(config) {
		config = config ||{};
		Rs.ext.form.Telescope.superclass.constructor.call(this, config);
	    if(this.singleSelect == false){
	        this.setEditable(false);
	    }
	    this.cache = {};
	}
	
	Ext.extend(Rs.ext.form.Telescope , Rs.ext.form.GridLoaderField, {
		
		/**
         * @cfg {String} separator 
         * 显示多个值的时的值间隔标识.
         */
        separator : ",",
        
        /**
         * @cfg {Boolean} singleSelect true to allow selection of only one row 
         * at a time (defaults to false allowing multiple selections)
         */
        singleSelect : false,
        
        keyNavConfig : {
			"up" : function() {
				if(this.isExpanded()) {
					this.focusPrev();
				}
			},
			"down" : function() {
				if(!this.isExpanded()) {
					/*this.expand();
					var s = this.generalselPanel.getStore();
					if(s && s.getCount() == 0){
						this.doQuery();
					}*/
				    this.onTriggerClick();
				} else {
					this.focusNext();
				}
			},
			"enter" : function(e) {
                e.stopPropagation();
				var grid = this.generalselPanel.getGrid();
				if(this.isExpanded()){
					if(!grid.getStore().getCount()){
						this.collapse();
					}
					this.rowSelect(this.generalselPanel.grid.getSelectionModel().getSelections());
					this.onSelect();
				}
			},
			"esc" : function() {
				if(this.isExpanded()){
	    			this.collapse();
	    			if(!this.selectedRecord){
	    				this.setRawValue('');
	    				delete this.lastValue;
	    			}
	    		}
			}, 
			'home' : function(e){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.moveFirst();
				}
			},
			'end' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveLast();
				}
			}, 
			'pageUp' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.movePrevious();
				}
			}, 
			
			'pageDown' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveNext();
				}
			} ,
			
			'tab' : function(e){
				this.collapse();
	    		if(!this.selectedRecord){
	    			this.setRawValue('');
	    			delete this.lastValue;
	    		}
	    		return true;
            },
			
			scope : this,
			
			doRelay : function(e, h, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                    // this MUST be called before GridLoaderField#fireKey()
                    var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if(!Ext.isIE && Ext.EventManager.useKeydown){
                        // call GridLoaderField#fireKey() for browsers which use keydown event (except IE)
                        this.scope.fireKey(e);
                    }
                    return relay;
                }
                return true;
            },

            forceKeyDown : true,
            defaultEventAction: 'stopEvent'
        },
        
        //Override
        initGeneralselPanel : function(config){
            if(this.singleSelect == false){
                config = Ext.apply(config, {
                    gridConfig : Ext.applyIf(config.gridConfig || {} , {
                        sm : new Ext.grid.CheckboxSelectionModel()
                    })
                });
            }
            var generalselPanel = Rs.ext.form.Telescope
                .superclass.initGeneralselPanel.call(this, config);
            var bbar = generalselPanel.getBottomToolbar();
            bbar.add("->");
            bbar.add("-");
            bbar.addButton({
                text:"清空",
                iconCls:"rs-action-clear",
                handler:this.clear,
                scope:this
            });
            //多选望远镜通过点击确定按钮提交数据
            if(this.singleSelect == false){
                bbar.addButton({
                    text:"确定",
                    iconCls:"rs-action-submit",
                    handler:this.submit,
                    scope:this
                });
            }
            bbar.addButton({
                text:"取消",
                iconCls:"rs-action-cancel",
                handler:this.cancel,
                scope:this
            });
            return generalselPanel;
        },
        
        //override
        initEvents : function() {
            Rs.ext.form.Telescope.superclass.initEvents.call(this);
            var grid = this.generalselPanel.getGrid(),
                store = grid ? grid.getStore() : undefined;
            if(store){
                store.on('load', this.checkSelected, this, {
                    delay : 20,
                    scope : this
                });
            }
        },
        
        //override
        initLayerEvents : function() { 
            Rs.ext.form.Telescope.superclass.initLayerEvents.call(this);
            var grid = this.generalselPanel.getGrid();
            if(grid){
                grid.on('headerclick', this.selectModelHeaderClick, this, {
                    delay : 100,
                    scope : this
                });
            }
        },
        
        //private
        //如果点击的是表头上的全选chackbox,则调用rowClick方法将选中的或未选中的数据
        //更新到cache中.
        selectModelHeaderClick : function(g, c){
            if(this.singleSelect == false){
                var cm = g.getColumnModel();
                if(cm && cm.getColumnAt(c) instanceof Ext.grid.AbstractSelectionModel){
                    this.rowClick(g);
                }
            }
        },
        
        /**
         * 查询数据, 如果该控件为只读readOnly = true, 且当前有值，
         * 则查询出该值的详细信息。如果当前控件并非只读readOnly = false, 则进行模糊查询。
         */
        doQuery : function(queryable) {
        	if(queryable){
        		 if(this.singleSelect == true){
					var displayField = this.getDisplayField(),
						valueField = this.getValueField(), value,
						progCondition;
					if(this.readOnly == true){
						value = this.getValue();
						if(!Ext.isEmpty(valueField, false) && !Ext.isEmpty(value, false)){
							progCondition = valueField + ' = \'' + value + '\'';
					}else {
						progCondition = '1 <> 1';
						}
					}else {
						value = this.getRawValue();
						if(!Ext.isEmpty(displayField, false) && !Ext.isEmpty(value, false)){
							progCondition = displayField + ' like \'' + value + '%\'';
						}
					}
					progCondition = this.buildProgCondtion(progCondition);
					if(this.fireEvent('beforequery', this, progCondition) !== false){
						this.generalselPanel.query(progCondition, function(store, records, options){
							this.fireEvent('query', this, records, progCondition);
	                    	if(records.length == 1){
	                    		var grid = this.generalselPanel.grid ;
	                    		grid.getSelectionModel().selectFirstRow();
	                    		this.rowClick.defer(500 , this , [grid]);
	                    	}
						}, this);
					}
                 } else {
                     var df = this.getDisplayField(),
                         vf = this.getValueField(),
                         separator = this.separator,
                         ds = [], d, vs = [], v, 
                         progcs = [], value, progCondition;
                     if(this.readOnly == true){
                         value = this.getValue();
                         if(!Ext.isEmpty(vf, false) && !Ext.isEmpty(value, false)){
                             vs = value.split(separator);
                             for(var i = 0, l = vs.length; i < l; i++){
                                 v = vs[i];
                                 progcs.push('(' + vf + ' = \''+ v + '\')');
                             }
                             if(progcs.length > 0){
                                 progCondition = '(' + progcs.join(' OR ') + ')';
                             }else {
                                 progCondition = '1 <> 1';
                             }
                         }else {
                             progCondition = '1 <> 1';
                         }
                     }else {
                         value = this.getRawValue();
                         if(!Ext.isEmpty(df, false) && !Ext.isEmpty(value, false)){
                             ds = value.split(separator);
                             for(var i = 0, l = ds.length; i < l; i++){
                                 d = ds[i];
                                 progcs.push('(' + df + ' like \''+ d + '%\')');
                             }
                             if(progcs.length > 0){
                                 progCondition = '(' + progcs.join(' OR ') + ')';
                             }
                         }
                     }
                     progCondition = this.buildProgCondtion(progCondition);
                     if(this.fireEvent('beforequery', this, progCondition) !== false){
                         this.generalselPanel.query(progCondition, function(store, records, options){
                             this.fireEvent('query', this, records, progCondition);
                         }, this);
                     }
                 }
        	} else {
        		var progCondition = this.buildProgCondtion(progCondition);
                if(this.fireEvent('beforequery', this, progCondition) !== false){
                    this.generalselPanel.query(progCondition, function(store, records, options){
                    	this.fireEvent('query', this, records, progCondition);
                    }, this);
                }
        	}
        },
        
        //override
        setValue : function(value) {
            if(this.singleSelect == true){
                return Rs.ext.form.Telescope.superclass.setValue.apply(this, arguments);
            }else {
                delete this.selectedRecord;
                var vf = this.getValueField(), df = this.getDisplayField(),
                    separator = this.separator, display, value2, 
                    ds = [], d, vs, vs2 = [], rs2 = [], 
                    v, r, progcs = [], progCondition;
                if(!Ext.isEmpty(vf, false) && !Ext.isEmpty(value, false)){
                    //为了完成望远镜重置问题
                    this.lastValue = value ;
                    Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
                    
                    vs = value.split(separator);
                    for(var i = 0, l = vs.length; i < l; i++){
                        v = vs[i];
                        progcs.push('(' + vf + ' = \''+ v + '\')');
                    }
                    if(progcs.length > 0){
                        progCondition = '(' + progcs.join(' OR ') + ')';
                    }
                    progCondition = this.buildProgCondtion(progCondition);
                    this.generalselPanel.query(progCondition, function(store, records){
                        var rs = store.query(vf, new RegExp("^" + vs.join('|') + "$"));
                        if(rs && rs.length > 0){
                            for(var i = 0, l = rs.length; i < l; i++){
                                r = rs.get(i); v = r.get(vf); d = r.get(df);
                                vs2.push(v); ds.push(d);
                                rs2.push(r);
                            }
                            display = ds.join(separator);
                            value2 = vs2.join(separator);
                            this.el.dom.value = display;
                            var oldValue = this.lastValue;
                            this.lastValue = value2;
                            this.selectedRecord = rs;
                            this.fireEvent('change', this, this.lastValue, oldValue);
                            this.fireEvent("passed", this, value2, rs, vf);
                            
                            this.rowSelect(rs2);
                        }else if(this.value!==undefined && this.value.length == 0){
                            this.lastValue = this.value;
                            Rs.ext.form.GridLoaderField.superclass.setValue.call(this,this.value);
                        } else {
                            this.fireEvent("unpassed", this, this.value, vf);
                            this.applyEmptyText();
                        }//lulu 0627
                    }, this);
                }else {
                	this.lastValue = value ;
                    Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
                    
                    this.fireEvent("unpassed", this, value, vf);
                    this.applyEmptyText();
                }
            }
        },
        
        /**
         * 清除所选
         */
        clear : function(){
            var g = this.generalselPanel.getGrid(),
                sm = g ? g.getSelectionModel() : undefined;
            if(sm){
                sm.clearSelections();
            }
            this.cache = {};
            var oldValue = this.getValue();
            this.clearValue();
            this.collapse();
            this.focus();
            this.fireEvent('change', this, null, oldValue);
        },
        
        /**
         * 确定所选数据
         */
        submit : function(){
            var cache = this.cache,
                vs = [], ds = [], rs = [], r,
                df = this.getDisplayField(),
                vf = this.getValueField(),
                separator = this.separator;
            for(var k in cache){
                r = cache[k];
                if(r){
                    vs.push(r.get(vf));
                    ds.push(r.get(df));
                    rs.push(r);
                }
            }
            if(this.fireEvent('beforeselect', this, rs)) {
                var display = ds.join(separator),
                    value = vs.join(separator);
                this.el.dom.value = display;
                if(String(this.lastValue) != String(value)){
                    this.fireEvent('change', this, value, this.lastValue);
                }
                this.lastValue = value;
                this.selectedRecord = rs;
                this.collapse();
                if(!this.selectedRecord){
					this.setRawValue('');
					delete this.lastValue;
				}
                this.fireEvent('select', this, rs, value, display);
            }
        },
        
        /**
         * 取消操作
         */
        cancel : function(){
            this.collapse();
            if(!this.selectedRecord){
				this.setRawValue('');
				delete this.lastValue;
			}
            this.focus();
        },
        
        //private
        checkSelected : function(s, rs){
            var cache = this.cache, r, v, k, selrs = [],
                g = this.generalselPanel.getGrid();
            if(g && g.rendered){
                if((sm = g.getSelectionModel())
                    && sm instanceof Ext.grid.CheckboxSelectionModel){
                    rs = rs || [];
                    for(var i = 0, l = rs.length; i < l; i++){
                        r = rs[i]; v = r && r.data ? r.data : undefined;
                        if(v){
                            k = Rs.hashCode(v);
                            if(cache[k] != undefined){
                                selrs.push(r);
                            }
                        }
                    }
                    if(selrs.length > 0){
                        sm.selectRecords(selrs, true);
                    }
                }
            }
        },
        
        //Override 将选中的放入cache
        rowSelect : function(records) {
            if(this.singleSelect == true){ //单选
                return Rs.ext.form.Telescope.superclass.rowSelect.apply(this, arguments);
            }else { //多选
                var cache = this.cache, rs = records || [], r, v, k;
                for(var i = 0, l = rs.length; i < l; i++){
                    r = rs[i];
                    v = r && r.data ? r.data : undefined;
                    if(v){
                        k = Rs.hashCode(v);
                        cache[k] = r;
                    }
                }
            }
        },
        
        //Override  将未选中的从cache删除 
        rowDeSelect : function(records){
            if(this.singleSelect == true){ //单选
                return Rs.ext.form.Telescope.superclass.rowDeSelect.apply(this, arguments);
            }else { //多选
                var rs = records || [], r, v, k;
                for(var i = 0, l = rs.length; i < l; i++){
                    r = rs[i];
                    v = r && r.data ? r.data : undefined;
                    if(v){
                        k = Rs.hashCode(v);
                        delete this.cache[k];
                    }
                }
            }
        }, 
        
        //override
        getValueError : function(){},
        
        //private
        onDestroy : function(){
            Rs.ext.form.Telescope.superclass.onDestroy.apply(this, arguments);
            var store = this.generalselPanel.getStore();
            if(store){
                store.un('load', this.checkSelected, this);
            }
            var grid = this.generalselPanel.getGrid();
            if(grid){
                grid.un('headerclick', this.selectModelHeaderClick, this);
            }
        } ,
        
        //private
		onSelect : function() {
			if(this.readOnly){
				this.collapse();
				return;
			}
			
			if(this.singleSelect){
				var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),
				sm = grid.getSelectionModel();
				record = sm.getSelected();
				if(record && this.fireEvent('beforeselect', this, record, store)) {
					var display = record.get(this.getDisplayField()),
					value = record.get(this.getValueField());
					
					this.el.dom.value = display;
					if(String(this.lastValue) != String(value)){
						this.fireEvent('change', this, value, this.lastValue);
					}
					this.lastValue = value;
					this.selectedRecord = record;
					this.collapse();
					this.fireEvent('select', this, record, value, display);
				}
			} else {
				this.submit();
			}
		},
        
	    
        //private
		quickAhead : function() {
			if(!this.isExpanded()){
				this.expand();
			}
			if(this.singleSelect == true){
				var queryable = true ;
				this.doQuery(queryable);
			} else {
				var queryable = false ;
				this.doQuery(queryable);
			}
		},
		
		onTriggerClick : function() {
			if(this.disabled || (this.readOnly && this.singleSelect)){
				return ;
			}
			if(!this.isExpanded() && !this.disabled) {
				this.expand();
				var queryable = false ;
				this.doQuery(queryable);
			}else {
				this.collapse();
				if(!this.selectedRecord){
					this.setRawValue('');
					delete this.lastValue;
				}
			}
		} ,
    	
        //private
        collapseIf : function(e) {
			if(e && !e.within(this.wrap) && !e.within(this.view)) {
				this.collapse();
				if(!this.selectedRecord){
					this.setRawValue('');
					delete this.lastValue;
				}
			}
		}
	    
	});
	
	Ext.ComponentMgr.registerType("rs-ext-telescope", Rs.ext.form.Telescope);
})();
