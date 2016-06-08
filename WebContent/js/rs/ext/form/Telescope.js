Ext.ns("Rs.ext.form");

(function() {
	/**
	 * @class Rs.ext.form.Telescope 
	 * ��Զ��,�ȿɶ�ѡҲ���Ե�ѡ.<br/>
	 * ��Զ������ֵʱ���ѯ,�ֶ�չ����Զ����ȡ��ǰ�ؼ��ϵ�ֵ���в�ѯ<br/>
	 * ��Զ����ֵ����������Դ��ֵ��ȫƥ��,����ѯ���ֻ��һ����¼��ʱ���Զ�����<br/>
	 * ��Զ���ֶ�����ʱ��,����Զ��չ����,�����ѡ���¼,���ڹر�,�ֶ������ֵ�����.<br/>
	 * ��Զ������Ѿ�����ֵ,չ����Զ����,�����ѡ���¼,���ڹر�,ԭ����ֵ��������.<br/>
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
         * ��ʾ���ֵ��ʱ��ֵ�����ʶ.
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
                text:"���",
                iconCls:"rs-action-clear",
                handler:this.clear,
                scope:this
            });
            //��ѡ��Զ��ͨ�����ȷ����ť�ύ����
            if(this.singleSelect == false){
                bbar.addButton({
                    text:"ȷ��",
                    iconCls:"rs-action-submit",
                    handler:this.submit,
                    scope:this
                });
            }
            bbar.addButton({
                text:"ȡ��",
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
        //���������Ǳ�ͷ�ϵ�ȫѡchackbox,�����rowClick������ѡ�еĻ�δѡ�е�����
        //���µ�cache��.
        selectModelHeaderClick : function(g, c){
            if(this.singleSelect == false){
                var cm = g.getColumnModel();
                if(cm && cm.getColumnAt(c) instanceof Ext.grid.AbstractSelectionModel){
                    this.rowClick(g);
                }
            }
        },
        
        /**
         * ��ѯ����, ����ÿؼ�Ϊֻ��readOnly = true, �ҵ�ǰ��ֵ��
         * ���ѯ����ֵ����ϸ��Ϣ�������ǰ�ؼ�����ֻ��readOnly = false, �����ģ����ѯ��
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
                    //Ϊ�������Զ����������
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
         * �����ѡ
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
         * ȷ����ѡ����
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
         * ȡ������
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
        
        //Override ��ѡ�еķ���cache
        rowSelect : function(records) {
            if(this.singleSelect == true){ //��ѡ
                return Rs.ext.form.Telescope.superclass.rowSelect.apply(this, arguments);
            }else { //��ѡ
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
        
        //Override  ��δѡ�еĴ�cacheɾ�� 
        rowDeSelect : function(records){
            if(this.singleSelect == true){ //��ѡ
                return Rs.ext.form.Telescope.superclass.rowDeSelect.apply(this, arguments);
            }else { //��ѡ
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
