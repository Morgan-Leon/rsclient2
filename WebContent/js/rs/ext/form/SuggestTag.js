Ext.ns("Rs.ext.form");

(function() {
    
    /**
     * @class Rs.ext.form.SuggestTag 
     * �����ı���,�ȿɶ�ѡҲ���Ե�ѡ<br/>
     * �����ı�������ֵʱ���ѯ,�ֶ�չ�������ı���ȡ��ǰ�ؼ��ϵ�ֵ���в�ѯ<br/>
     * �����ı����ֵ������Դ��ֵ���Բ�ƥ��<br/>
	 * �����ı����ֶ�����ʱ��,�������ı���չ����,�����ѡ���¼,���ڹر�,�ֶ������ֵ��������.<br/>
	 * �����ı�������Ѿ�����ֵ,չ�������ı����,�����ѡ���¼,���ڹر�,ԭ����ֵ��������.<br/>
     * @extends Rs.ext.form.GridLoaderField
     */
    Rs.ext.form.SuggestTag = function(config) {
        config = config ||{};
        Rs.ext.form.SuggestTag.superclass.constructor.call(this, config);
        if(this.singleSelect == false){
            this.setEditable(false);
        }
        this.cache = {};
    };
    
    Ext.extend(Rs.ext.form.SuggestTag, Rs.ext.form.GridLoaderField, {
        
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
        
        //Override
        initGeneralselPanel : function(config){
            if(this.singleSelect == false){
                config = Ext.apply(config, {
                    gridConfig : Ext.applyIf(config.gridConfig || {} , {
                        sm : new Ext.grid.CheckboxSelectionModel()
                    })
                });
            }
            var generalselPanel = Rs.ext.form.SuggestTag
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
            //��ѡ�����ı���ͨ�����ȷ����ť�ύ����
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
            Rs.ext.form.SuggestTag.superclass.initEvents.call(this);
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
            Rs.ext.form.SuggestTag.superclass.initLayerEvents.call(this);
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
                     return Rs.ext.form.SuggestTag.superclass.doQuery.call(this);
                 }else {
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
                return Rs.ext.form.SuggestTag.superclass.setValue.apply(this, arguments);
            }else {
                delete this.selectedRecord;
                var vf = this.getValueField(), df = this.getDisplayField(),
                    separator = this.separator, display, value2, 
                    ds = [], d, vs, vs2 = [], rs2 = [], 
                    v, r, progcs = [], progCondition;
                if(!Ext.isEmpty(vf, false) && !Ext.isEmpty(value, false)){
                    //Ϊ����ɽ����ı�����������
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
                        }
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
                this.fireEvent('select', this, rs, value, display);
            }
        },
        
        /**
         * ȡ������
         */
        cancel : function(){
            this.collapse();
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
                return Rs.ext.form.SuggestTag.superclass.rowSelect.apply(this, arguments);
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
                return Rs.ext.form.SuggestTag.superclass.rowDeSelect.apply(this, arguments);
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
			}
		} ,
        
	    getValue : function(){
	    	if(this.selectedRecord){
	    		var value = this.lastValue || '';
	    		if (Ext.isEmpty(value)){
	    			delete this.selectedRecord;
	    		}
	    		return value;
	    	} else {
	    		return this.getRawValue();
	    	}
	    },
        
        //override
        getValueError : function(){},
        
        //private
        onDestroy : function(){
            Rs.ext.form.SuggestTag.superclass.onDestroy.apply(this, arguments);
            var store = this.generalselPanel.getStore();
            if(store){
                store.un('load', this.checkSelected, this);
            }
            var grid = this.generalselPanel.getGrid();
            if(grid){
                grid.un('headerclick', this.selectModelHeaderClick, this);
            }
        }
        
    });
    
    Ext.ComponentMgr.registerType("rs-ext-suggesttag", Rs.ext.form.SuggestTag);
})();
