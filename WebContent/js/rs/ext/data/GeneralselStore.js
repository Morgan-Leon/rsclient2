Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.GeneralselStore
	 * <p>GeneralselStore�ɸ���progCode�Ӻ�̨��ȡ���ݣ���Store���ܶ����ݽ�����ɾ�Ĳ�����</p>
	 * @extends Rs.ext.data.Store
	 */
	Rs.ext.data.GeneralselStore = function(config){
		config = config || {};
		var progCode = config.progCode,
			progCondition = config.progCondition,
			dataCompany = config.dataCompany;
		if(Ext.isEmpty(progCode, false)){
			throw 'progCode is null';
		}
		var url = config.url || Rs.BASE_GENERALSEL_PATH || '/rsc/rsclient/generalsel', 
			baseParams = Ext.apply(config.baseParams || {}, {
				progCode : progCode,
				dataCompany: dataCompany
			});
		Rs.ext.data.GeneralselStore.superclass.constructor.call(this, Ext.apply(config, {
			url : url,
			baseParams : baseParams,
			baseProgCondition : progCondition
		}));
	};
	
	Ext.extend(Rs.ext.data.GeneralselStore, Rs.ext.data.Store, {
		
		/**
	     * @cfg {Boolean} loadMetaData <tt>true</tt> to load meta data when load data
	     * (defaults to <tt>true</tt>).
	     * �����Ƿ��ȡmetaData��Ϣ, �ڷ��������ȡ����ʱ���˲������ݵ���̨
	     */
		loadMetaData : true,
		
		 /**
	     * <p>Loads the Record cache including meta data or not from the configured <tt>{@link #proxy}</tt> using the configured <tt>{@link #reader}</tt>.</p>
	     * <br><p>Notes:</p><div class="mdetail-params"><ul>
	     * <li><b><u>Important</u></b>: loading is asynchronous! This call will return before the new data has been
	     * loaded. To perform any post-processing where information from the load call is required, specify
	     * the <tt>callback</tt> function to be called, or use a {@link Ext.util.Observable#listeners a 'load' event handler}.</li>
	     * <li>If using {@link Ext.PagingToolbar remote paging}, the first load call must specify the <tt>start</tt> and <tt>limit</tt>
	     * properties in the <code>options.params</code> property to establish the initial position within the
	     * dataset, and the number of Records to cache on each read from the Proxy.</li>
	     * <li>If using {@link #remoteSort remote sorting}, the configured <code>{@link #sortInfo}</code>
	     * will be automatically included with the posted parameters according to the specified
	     * <code>{@link #paramNames}</code>.</li>
	     * </ul></div>
		 * ��д���� load �������� loadMetaData ��Ϊ baseParams.metaData ��
		 * �������������
	     * @param {Object} options An object containing properties which control loading options:<ul>
	     * <li><b><tt>params</tt></b> :Object<div class="sub-desc"><p>An object containing properties to pass as HTTP
	     * parameters to a remote data source. <b>Note</b>: <code>params</code> will override any
	     * <code>{@link #baseParams}</code> of the same name.</p>
	     * <p>Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.</p></div></li>
	     * <li><b>callback</b> : Function<div class="sub-desc"><p>A function to be called after the Records
	     * have been loaded. The callback is called after the load event is fired, and is passed the following arguments:<ul>
	     * <li>r : Ext.data.Record[] An Array of Records loaded.</li>
	     * <li>options : Options object from the load call.</li>
	     * <li>success : Boolean success indicator.</li></ul></p></div></li>
	     * <li><b>scope</b> : Object<div class="sub-desc"><p>Scope with which to call the callback (defaults
	     * to the Store object)</p></div></li>
	     * <li><b>add</b> : Boolean<div class="sub-desc"><p>Indicator to append loaded records rather than
	     * replace the current cache.  <b>Note</b>: see note for <tt>{@link #loadData}</tt></p></div></li>
	     * </ul>
	     * @return {Boolean} If the <i>developer</i> provided <tt>{@link #beforeload}</tt> event handler returns
	     * <tt>false</tt>, the load call will abort and will return <tt>false</tt>; otherwise will return <tt>true</tt>.
	     */
		load : function(options) {
			options = Ext.apply({}, options);
			if(!options.params){
				options.params = {};
			}
			Ext.apply(options.params, {
				progCondition : this.joinProgCondition(options.params)
			});
			Ext.apply(this.baseParams.metaData, {
				loadMetaData : this.loadMetaData === true
			});
			Rs.ext.data.GeneralselStore.superclass.load.apply(this, arguments);
	    },
		
	    //private
	    joinProgCondition : function(params){
	    	var baseProgCondition = this.baseProgCondition,
	    		progCondition = params ? params.progCondition : undefined;
	    	if(Ext.isEmpty(progCondition, false)){
	    		return baseProgCondition || '';
	    	}else if(Ext.isEmpty(baseProgCondition, false)){
	    		return progCondition || '';
	    	}else {
	    		var pco = this.splitProgCondition(progCondition),
	    			bpco = this.splitProgCondition(baseProgCondition),
	    			cds = [], cd,
	    			cdo = Ext.apply(pco || {}, bpco);
	    		for(var k in cdo){
	    			cd = cdo[k];
	    			if(cd && !Ext.isEmpty(cd, false)){
	    				cds.push(cdo[k]);
	    			}
	    		}
	    		if(cds.length > 0){
	    			return cds.join(' AND ');
	    		}
	    	}
	    },
	    
	    //private
	    splitProgCondition : function(content){
	            var result = {}, str,
	            i, l, c, cc, 
	            b = new Array();
	        for(i = 0, l = content.length; i < l; i++){
	        	if(content.substring(i, i + 3).toUpperCase() == 'AND'){
	                if(b.length > 0){
	                    this.buildConditionBlock(result, b.join(''));
	                    b = new Array();   
	                }
	                i = i + 3;
	            }else {
	            	c = content.charAt(i);
	            	if(c == '('){
	                    if(b.length > 0){
	                    	this.buildConditionBlock(result, b.join(''));
	                        b = new Array();
	                    }
	                    cc = 0;
	                    while(true && i < l){
	                        c = content.charAt(i++);
	                        b[b.length] = c;
	                        (c == '(')?(cc++):null;
	                        (c == ')')?(cc--):null;
	                        if(cc == 0){
	                            break;    
	                        }
	                    }
	                    this.buildConditionBlock(result, b.join(''));
	                    b = new Array();
	                }else {
	                	b[b.length] = c;
	                }
	            }
	        }
	        if(b.length > 0){
	        	this.buildConditionBlock(result, b.join(''));
	        }
	        return result;
	    },
	    
	    //private
	    buildConditionBlock : function(result, condition){
	    	var k = condition.replace(/\s/gi, '');
	    	result[k] = condition;
	    	return result;
	    },
	    
		/** 
		 * ��д���� loadRecords ��������load�����ݺ����� loadMetaData Ϊfalse 
		 * ��֤�´β�����Ҫ��ȡmetaData ��Ϣ.
		 * @private
		 */
		loadRecords : function(o, options, success){
			Rs.ext.data.GeneralselStore.superclass.loadRecords.apply(this, arguments);
			this.loadMetaData = false;
		},
		
		/**
		 * ����progCode <br/>
		 * ��store����progCode���Ӻ�̨��ȡ���ݡ�
		 * @param {String} progCode
		 * @param {String} progCondition ��ѯ����
		 */
		setProgCode : function(progCode, progCondition){
			if(Ext.isEmpty(progCode, false)){
				Rs.error('progCode is empty!');
			}
			this.progCode = progCode;
			this.baseProgCondition = progCondition;
			Ext.apply(this.baseParams || {}, {
				progCode : this.progCode
			});
			delete this.lastOptions;
			this.loadMetaData = true;
		}, 
		
		
		/**
		 * ��ȡprogCode
		 * @return {String} progCode
		 */
		getProgCode : function(){
			return this.progCode;
		},
		
		/**
		 * ��ȡprogCondition
		 * @return {String} progCondition
		 */
		getProgCondition : function(){
			return this.progCondition || '';
		},
		
		/**
		 * private
		 * ��ȡdataCompany
		 * @return {String} dataCompany
		 */
		getDataCompany : function(){
			return this.dataCompany;
		},
        
        /**
         * private 
         * ����dblink��˾��
		 * @method setDataCompany
		 * @param {String} dataCompany dblink��˾��
		 */
		setDataCompany : function(dataCompany){
			if(Ext.isEmpty(dataCompany, false)){
				Rs.error('dataCompany is empty!');
			}
			this.dataCompany = dataCompany;
			Ext.apply(this.baseParams || {}, {
				dataCompany : this.dataCompany
			});
			delete this.lastOptions;
			this.loadMetaData = true;
		}
	});
})();