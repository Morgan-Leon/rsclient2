Ext.namespace("Rs.ext.grid");

(function() {
	
	/**
	 * <p>
	 * 分页控件
	 * </p>
	 * @class Rs.ext.grid.SliderPagingToolbar 
	 * @extends  Ext.PagingToolbar
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.grid.SliderPagingToolbar = function(config){
		Rs.ext.grid.SliderPagingToolbar.superclass.constructor.call(this, config);
	};
	
	Ext.extend(Rs.ext.grid.SliderPagingToolbar, Ext.PagingToolbar, {

		/**
		 * @cfg {Number} minPageSize
		 * 最小的每页显示数据条数, 默认为10
		 */
		minPageSize : 10,
		
		/**
		 * @cfg {Number} maxPageSize
		 * 最大的每页显示数据条数，默认为100
		 */
		maxPageSize : 100,
		
		/**
		 * @cfg {Number} pageSizeIncrement
		 * 步长 
		 */
		pageSizeIncrement : 10,
		
		/**
		 * @cfg {Number} pageSize
		 * <p>
		 * pageSize : 20
		 * </p>
		 */
		pageSize : 20,

		/**
		 * @cfg {Object} paramNames 
		 * <p>
		 * <pre><code>
		paramNames : {
			start : "start",
			limit : "limit"
		}
		 * </code></pre>
		 * </p>
		 */
		paramNames : {
			start : "start",
			limit : "limit"
		},
		
		beforePageText : "第",
		
		afterPageText : "页(共{0}页)",
		
		firstText : "第一页",
		
		lastText : "最后一页",
		
		nextText : "下一页",
		
		prevText : "上一页",
		
		refreshText : "刷新",
		
		/**
		 * 
		 * @cfg {Boolean} hasSlider
		 */
		hasSlider : true,
		
		initComponent : function(){
			Rs.ext.grid.SliderPagingToolbar.superclass.initComponent.apply(this, arguments);
			if(this.hasSlider === true){
				this.sliderField = new Ext.form.SliderField({
					width : 100,
					animate : true,
					increment : this.pageSizeIncrement,
					minValue : this.minPageSize,
					maxValue : this.maxPageSize,
					tipText: function(thumb){
						return "每页显示" + String(thumb.value) + "项";
	            	}
				});
                var index = this.items.indexOf(this.refresh);
				var sep = new Ext.Toolbar.Separator();
                this.items.insert(index+1,sep);
                this.items.insert(index+2,this.sliderField);
                this.sliderField.setValue(this.pageSize, false);
				this.sliderField.slider.on('changecomplete', this.onPageSizeChanged, this);
			}
			this.setPageSizeTask = new Ext.util.DelayedTask(this.setPageSize, this);
		},
		
		/**
		 * onPageSizeChanged
		 * @private
		 */
		onPageSizeChanged : function(field, value, thumb) {
			this.pageSize = value;
			this.setPageSizeTask.delay(50);
			if(thumb){
				thumb.el.setStyle('z-index', 0);
			}
		},

		/**
		 * setPageSize
		 * @private
		 */
		setPageSize : function() {
			this.cursor = Math.floor(this.cursor / this.pageSize) * this.pageSize;
			var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['limit']] = this.pageSize;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
			this.doLoad(this.cursor);
		},

		/**
	     * Binds the paging toolbar to the specified {@link Ext.data.Store}
	     * @param {Store} store The store to bind to this toolbar
	     * @param {Boolean} initial (Optional) true to not remove listeners
	     */
		bindStore : function(store, initial){
			if(store) {
				var pn = this.getParams(),
					meta = store.baseParams.metaData || {};
				meta[pn['limit']] = this.pageSize;
				Ext.apply(store.baseParams, {
					metaData : meta
				});
			}
			Rs.ext.grid.SliderPagingToolbar.superclass.bindStore.apply(this, arguments);
	    },
		
	    // private
	    onLoad : function(store, r, o){
	        if(!this.rendered){
	            this.dsLoaded = [store, r, o];
	            return;
	        }
	        var pn = this.getParams(),
	        	meta = store.baseParams.metaData;
	        this.cursor = (meta && meta[pn["start"]]) ? meta[pn["start"]] : 0;
	        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
	        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
	        this.inputItem.setValue(ap);
	        this.first.setDisabled(ap == 1);
	        this.prev.setDisabled(ap == 1);
	        this.next.setDisabled(ap == ps);
	        this.last.setDisabled(ap == ps);
	        this.refresh.enable();
	        this.updateInfo();
	        this.fireEvent('change', this, d);
	    },
	    
		/**
		 * 载入数据
		 * @param {Number} start 起始的条目号
		 */
		doLoad : function(start) {
	    	var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['start']] = start;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
			var o = this.store.lastOptions ? this.store.lastOptions.params || {} : {}; 
			if(this.fireEvent('beforechange', this, o) !== false) {
				this.store.load({params : o});
			}
		},
		
		/**
		 * 设置开始的位置
		 * @param {Number} start 开始位置的条目号
		 */
		setStart : function(start){
	    	var pn = this.getParams(),
				meta = this.store.baseParams.metaData || {};
			meta[pn['start']] = Ext.isNumber(start)?start:0;
			Ext.apply(this.store.baseParams, {
				metaData : meta
			});
		} ,
		
		//private
        updateInfo : function(){
            if(this.displayItem){
                var count = this.store.getCount();
                var d = this.getPageData() ;
                if(d && d.activePage > d.pages && count == 0){
                    this.doLoad((d.pages - 1) * this.pageSize);
                    return ;
                }
                var msg = count == 0 ? this.emptyMsg :
                String.format(this.displayMsg,this.cursor+1, this.cursor+count, this.store.getTotalCount());
                this.displayItem.setText(msg);
            }
        }
	});

	Ext.ComponentMgr.registerType("rs-ext-sliderpagingtoolbar", Rs.ext.grid.SliderPagingToolbar);
})();