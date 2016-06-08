Rs.ns("Rs.ext.state");
(function() {
	/**
	 * @class Rs.ext.state.StatePlugin
	 * <p>�û�ƫ����Ϣ���</p>
	 * extends  Ext.util.Observable
	 * @constructor
	 * @param {Object} config
	 */
    Rs.ext.state.StatePlugin = function(config) {
        Ext.apply(this, config);
        Rs.ext.state.StatePlugin.superclass.constructor.call(this);
        this.addEvents(
        /**
         * @event beforestaterestore Fires before the state of the
         *        component is restored. Return false from an event
         *        handler to stop the restore.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object} scheme
         */
        'beforestaterestore',
        /**
         * @event staterestore Fires after the state of the component is
         *        restored.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object}
         *            state The hash of state values returned from the
         *            StateProvider. This is passed to <b><tt>applyState</tt></b>.
         *            By default, that simply copies property values
         *            into this Component. The method maybe overriden to
         *            provide custom state restoration.
         */
        'staterestore',
        /**
         * @event beforestatesave Fires before the state of the
         *        component is saved to the configured state provider.
         *        Return false to stop the save.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {String} stateId
         * @param {String} schemeCode
         * @param {Object} state
         */
        'beforestatesave',
        /**
         * @event statesave Fires after the state of the component is
         *        saved to the configured state provider.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {String} stateId
         * @param {String} schemeCode
         * @param {Object} state
         */
        'statesave' ,
        
        /**
         * @event stateload ������̨���ݷ��غ�,����.
         * @param {Rs.ext.state.StatePlugin} this
         * @param {Object} state
         */
        'stateload');
        
        if(Rs.ext.state.StateManager
            && this.scheme !== false
            && Rs.isNumber(this.scheme)) {
            this.button = new Ext.SplitButton( {
                xtype : 'splitbutton',
                iconCls : 'rs-action-scheme',
                text : '��������',
                handler : this.createScheme,
                scope : this,
                menu : this.stateManagerMenu = new Ext.menu.Menu()
            });
            Rs.ext.state.StateManager.getProvider().on('statechange',
                this.syncStateMangerMenu, this, {
                    single : true,
                    delay : 25
            });
            this.stateManagerMenu.on('beforeshow', this.syncStateMangerMenu, this);
        }
    };
    
    Ext.extend(Rs.ext.state.StatePlugin, Ext.util.Observable, {
        /**
         * @cfg {Boolean/Number} scheme 
         * <p>���Ϊfalse��ʾ�ò����֧�ֱ���������,
         *    ֻ��һ���û�ƫ����Ϣ�� ���Ϊ�����������ʾ�ɱ���ķ����ĸ���,Ĭ�Ϸ�����λ10 
         * </p>
         */
        scheme : 10,
        /**
         * @cfg {String} schemeMsg
         * <p>��ʾ��</p>
         */
        schemeMsg : '�������ٴ�������, ��ഴ��{0}������',
        /**
         * <p>��ʼ������</p>
         * @param {Component} comp
         */
        init : function(c) {
            this.comp = c;
            this.stateId = this.comp.getStateId();
            this.initStateEvents();
            this.initState();
        },
        /**
         * <p>��ȡstateId</p>
         * @return {String} stateId the stateId of the component;
         */
        getStateId : function() {
            return this.stateId;
        },

        // private
        initStateEvents : function() {
            if(this.comp.stateEvents) {
                for( var i = 0, e; e = this.comp.stateEvents[i]; i++) {
                    this.comp.on(e, this.saveScheme, this, { 
                    	delay : 100
                    });
                }
            }
        },

        // private
        initState : function() {
            if(Rs.ext.state.StateManager) {
                var stateId = this.getStateId(), 
                    sc,
                    scheme;
                if(stateId){
                    Rs.ext.state.StateManager.init(stateId, function() {
                        sc = Rs.ext.state.StateManager.getDefaultSchemeCode(stateId);
                        this.fireEvent('stateload', this, sc);
                        if(sc) {
                            scheme = Rs.ext.state.StateManager.get(stateId, sc);
                            if(scheme 
                            	&& this.fireEvent('beforestaterestore', this, scheme) !== false) {
                                this.applyScheme(sc, scheme);
                                this.fireEvent('staterestore', this, scheme);
                            }
                        }
                    }, this);
                }
            }
        },

        // private
        createScheme : function() {
            var stateId = this.getStateId(),
                c = Rs.ext.state.StateManager.getSchemeCount(stateId);
            if((Rs.isNumber(this.scheme) && this.scheme > c)
                || this.scheme === true) {
                Ext.Msg.prompt('��������', '�����뷽������', function(btn, text) {
                    if(btn == 'ok' && !Rs.isEmpty(text, false) && text.length <= 30) {
                        if(Rs.isNumber(this.scheme)) {
                            this.currentSchemeCode = text;
                            this.saveScheme();
                        }
                    }
                }, this);
            } else {
                Ext.Msg.alert("��ʾ", String.format(this.schemeMsg, c));
            }
        },

        // private
        saveScheme : function() {
            if(Rs.ext.state.StateManager) {
                var stateId = this.getStateId(), 
                    schemeCode = this.currentSchemeCode || this.getStateId(), 
                    config = this.scheme != false ? null : { 
                	    defaultFlag : true
                	};
                if(stateId) {
                    var state = this.comp.getState();
                    if(this.fireEvent('beforestatesave', this, stateId,
                        schemeCode, state) !== false) {
                        Rs.ext.state.StateManager.set(stateId, schemeCode, state, config);
                        this.fireEvent('statesave', this, stateId, schemeCode, state);
                    }
                }
            }
        },

        // private
        applyScheme : function(schemecode, scheme) {
            this.currentSchemeCode = schemecode;
            if(scheme && scheme.stateData) {
                this.comp.applyState(scheme.stateData);
            }
        },

        // private
        renameScheme : function(schemeCode) {
            Ext.Msg.prompt('��ʾ', '������������', function(btn, text) {
                if(btn == 'ok') {
                    if(schemeCode != text && !Rs.isEmpty(text, false)
                        && text.length <= 30) {
                        var stateId = this.getStateId();
                        if(this.currentSchemeCode == schemeCode) {
                            this.currentSchemeCode = text;
                        }
                        Rs.ext.state.StateManager.rename(stateId, schemeCode, text);
                    }
                }
            }, this, false, schemeCode);
        },

        // private
        setDefaultScheme : function(schemeCode) {
            var stateId = this.getStateId();
            if(stateId && schemeCode){
            	Rs.ext.state.StateManager.setDefault(stateId, schemeCode);	
            }
        },

        // private
        deleteScheme : function(schemeCode) {
            Ext.Msg.show( {
                title : '��ʾ',
                msg : '��ȷ��Ҫɾ���÷�����?',
                buttons : Ext.Msg.YESNO,
                fn : function(btn) {
                    if(btn === 'yes') {
                        var stateId = this.getStateId();
                        if(stateId && schemeCode){
                        	Rs.ext.state.StateManager.clear(stateId, schemeCode);	
                        }
                    }
                },
                animEl : 'elId',
                icon : Ext.MessageBox.QUESTION,
                scope : this
            });
        },

        // private
        syncStateMangerMenu : function() {
            var stateId = this.getStateId(), 
                module = Rs.ext.state.StateManager.getAll(stateId), 
                sc, 
                s, 
                cs, 
                df;
            this.stateManagerMenu.removeAll();
            for(sc in module) {
                s = module[sc];
                cs = (this.currentSchemeCode === sc);
                df = (s.defaultFlag === true);
                this.stateManagerMenu.add( {
                    text : sc,
                    cls : (df ? "rs-state-default-scheme" : "") + (cs ? " rs-state-current-scheme" : ""),
                    handler : this.applyScheme.createDelegate(this, [sc, Rs.ext.state.StateManager.get(stateId, sc)]),
                    scope : this,
                    menu : new Ext.menu.Menu( { items : [{
	                        text : 'Ӧ��',
	                        disabled : cs ? true : false,
	                        handler : this.applyScheme.createDelegate(this,[sc, Rs.ext.state.StateManager.get(stateId, sc)]),
	                        scope : this
	                    }, {
	                        text : '������',
	                        handler : this.renameScheme.createDelegate(this, [sc]),
	                        scope : this
	                    }, {
	                        text : '��ΪĬ��',
	                        disabled : df ? true : false,
	                        handler : this.setDefaultScheme.createDelegate(this, [sc]),
	                        scope : this
	                    }, {
	                        text : '����',
	                        disabled : cs ? false : true,
	                        handler : this.saveScheme,
	                        scope : this
	                    }, {
	                        text : 'ɾ��',
	                        handler : this.deleteScheme.createDelegate(this, [sc]),
	                        scope : this
	                    } ]
                   })
               });
           }
           return this.stateManagerMenu.items.length >= 1;
        }
    });
})();