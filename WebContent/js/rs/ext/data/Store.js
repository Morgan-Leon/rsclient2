Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.Store
	 * 不支持远程对多个字段进行排序, 默认可进行远程排序
	 * 可将对数据的增删改查发送到不同的URL
	 * 
	 * 如果没有readUrl, upateUrl, createUrl, destroyUrl，则把请求发送给默认的url
	 * 
	 * 如果没有readMethod, updateMethod, createMethod, destroyMethod 则将调用默认的
	 * read upate create destroy 方法.
	 * 
	 * 查询数据URL为readService.jsp 调用的查询方法为readItems
	 * 更新数据URL为updateService.jsp 调用的更新方法为updateItems
	 * 新建数据URL为createService.jsp 调用的新增方法为createItems
	 * 删除数据URL为destroyService.jsp 调用的删除方法为destroyItems
	 * 
	 * 如下配置即可：
	 * <pre><code>
     var store2 = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            readUrl: 'readService.jsp',
            readMethod : 'readItems',
            updateUrl : 'updateService.jsp', 
            updateMethod : 'updateItems',
            createUrl : 'createService.jsp',
            createMethod : 'createItems',
            destroyUrl : 'destroyService.jsp',
            destroyMethod : 'destroyItems',
            root: 'items',
            idProperty: 'code',
            sortField : 'name',
            fields: ['code', 'name', {name:'price', type: 'float'}],
            baseParams : {
                pm_flag : 'Y'
            }
       });
	 * </code></pre>
	 * @extends Ext.data.Store
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.data.Store = function(config){
		
		var idProperty = config.idProperty || 'id',
			root = config.root || 'data',
			totalProperty = config.totalProperty || 'total',
			successProperty = config.successProperty || 'success',
			messageProperty = config.messageProperty || 'message',
			proxy = config.proxy || new Rs.ext.data.Proxy({
				url : config.url || config.readUrl || config.createUrl || config.updateUrl || config.destroyUrl,
				readUrl : config.readUrl,
				readMethod : config.readMethod,
				createUrl : config.createUrl,
				createMethod : config.createMethod,
				updateUrl : config.updateUrl,
				updateMethod : config.updateMethod,
				destroyUrl : config.destroyUrl,
				destroyMethod : config.destroyMethod
			}),
			writer = config.writer || new Rs.ext.data.Writer({
				idProperty : idProperty,
				listful : true
			}), 
			reader = config.reader || new Rs.ext.data.Reader({
				idProperty : idProperty,
			    root : root,
			    totalProperty : totalProperty,
			    successProperty : successProperty,
			    messageProperty : messageProperty
			}, config.fields ? Ext.data.Record.create(config.fields) : undefined);
			
		Rs.ext.data.Store.superclass.constructor.call(this, Ext.apply(config, {
			proxy : proxy,
			writer : writer,
			reader : reader
		}));
		
        //设置metaData为baseParams,每次请求都会将metaData作为参数传入后台，
		//后台根据metaData组织数据
		Ext.apply(this.baseParams, {
			metaData : Ext.apply({
				paramNames : this.paramNames
			}, this.reader.meta)
		});
	};
	
	Ext.extend(Rs.ext.data.Store, Ext.data.Store, {
		/**
		 * @cfg {String} readUrl 
		 * <p>
		 * 读取url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} readMethod 
		 * <p>
		 * 读取方法名.
		 * </p>
		 */
		
		/**
		 * @cfg {String} createUrl 
		 * <p>
		 * 增加url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} createMethod 
		 * <p>
		 * 增加方法名.
		 * </p>
		 */
		
		/**
		 * @cfg {String} updateUrl 
		 * <p>
		 * 更新url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} updateMethod 
		 * <p>
		 * 更新方法名.
		 * </p>
		 */

		/**
		 * @cfg {String} destroyUrl 
		 * <p>
		 * 删除url.
		 * </p>
		 */
		
		/**
		 * @cfg {String} destroyMethod 
		 * <p>
		 * 删除方法名.
		 * </p>
		 */
		
		
		
		/**
		 * @cfg {Boolean} remoteSort 
		 * <p>
		 * 远程排序, 默认为true.
		 * </p>
		 */
		remoteSort : true,
		
		/**
		 * @cfg {Boolean} autoSave
		 * <p>
		 * 主动保存, 当用户修改或删除了数据,将马上发送请求与后台同步
		 * </p>
		 */
		autoSave : false,
		
		/**
		 * @cfg {Boolean} pruneModifiedRecords 
		 */
		pruneModifiedRecords : true,
		
		  /**
	     * <p>Loads the Record cache from the configured <tt>{@link #proxy}</tt> using the configured <tt>{@link #reader}</tt>.</p>
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
	        this.storeOptions(options);
	        //将排序信息存如baseParams.metaData中，后台可根据sortInfo对数据进行排序
	        if(this.sortInfo && this.remoteSort){
	            var pn = this.paramNames,
	            	si = {};
	            si[pn.sort] = this.sortInfo.field;
	            si[pn.dir] = this.sortInfo.direction;
	            Ext.apply(this.baseParams.metaData, {
	            	sortInfo : si
	            });
	        }
	        try {
	            return this.execute('read', null, options); // <-- null represents rs.  No rs for load actions.
	        } catch(e) {
	            this.handleException(e);
	            return false;
	        }
	    }, 
	    
	    /**
	     * 重写的{@link Ext.data.Store#singleSort}方法, 原方法中，
	     * 如果是远程排序则，将已经修改的sortToggle和sortInfo又重新赋值给当前Sort对象，这是有问题滴。
	     * @param {String} fieldName  排序字段
	     * @param {String} dir 排序方式
	     */
	    singleSort: function(fieldName, dir) {
	        var field = this.fields.get(fieldName);
	        if (!field) {
	            return false;
	        }

	        var name       = field.name,
	            sortInfo   = this.sortInfo || null,
	            sortToggle = this.sortToggle ? this.sortToggle[name] : null;

	        if (!dir) {
	            if (sortInfo && sortInfo.field == name) { // toggle sort dir
	                dir = (this.sortToggle[name] || 'ASC').toggle('ASC', 'DESC');
	            } else {
	                dir = field.sortDir;
	            }
	        }

	        this.sortToggle[name] = dir;
	        this.sortInfo = {field: name, direction: dir};
	        this.hasMultiSort = false;

	        if (this.remoteSort) {
	            if (!this.load(this.lastOptions)){
	                /*
	            	if (sortToggle) {
	                    this.sortToggle[name] = sortToggle;
	                }
	                if (sortInfo) {
	                    this.sortInfo = sortInfo;
	                }
	                */
	            }
	        } else {
	            this.applySort();
	            this.fireEvent('datachanged', this);
	        }
	        return true;
	    }
		
	});
	
})();