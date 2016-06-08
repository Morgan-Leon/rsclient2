Rs.ns('Rs.ext.form');

/**
 * @class Rs.ext.form.TimeField
 * <p>时间控件</p>
 * @extends Ext.form.TriggerField
 * @param {Object} config
 */
Rs.ext.form.TimeField = function(config){
	delete config.altFormats;
	this.validateFormat(config.format || 'hh:mm');
	Rs.ext.form.TimeField.superclass.constructor.apply(this, arguments);
	
	this.addEvents(
		/**
		 * @event beforeexpand 展开之前触发该事件，如果监听的回调方法返回false,
		 * 则取消展开.
		 * @param {Rs.ext.form.TimeField} this
		 */
		'beforeexpand',
		
		/**
		 * @event expand 展开之后触发该事件，
		 * @param {Rs.ext.form.TimeField} this
		 */
		'expand', 
		
		/**
		 * @event collapse 合拢之后触发该事件
		 * @param {Rs.ext.form.TimeField} this
		 */
		'collapse', 
		
		/**
		 * @event beforeselect 选择数据之前触发该事件
		 * @param {Rs.ext.form.TimeField} this
		 * @param {String} hour 小时
		 * @param {String} minute 分钟
		 * @param {String} second 秒
		 * @param {String} time 时间
		 */
		'beforeselect', 
		
		/**
		 * @event select 选择数据之后触发该事件
		 * @param {Rs.ext.form.TimeField} this
		 * @param {String} hour 小时
		 * @param {String} minute 分钟
		 * @param {String} second 秒
		 * @param {String} time 时间
		 */
		'select',
		
		/**
		 * @event change 值发生变化的时候触发该事件
		 * @param {Rs.ext.form.TimeField} this
		 * @param {String} value 新值
		 * @param {String} oldValue 老值
		 */
		'change');
	
};

Ext.extend(Rs.ext.form.TimeField, Ext.form.TriggerField, {
	
	/**
	 * @cfg {String} format
	 * 显示的时间格式,支持'hh:mm:ss', 'hhmmss', 'hh:mm', 'hhmm'几种时间格式
	 */
	format : 'hh:mm',
	
    baseChars : "0123456789:",
    
	altFormats: ['hh:mm:ss', 'hhmmss', 'hh:mm', 'hhmm'],
	
	/**
	 * @cfg {String} triggerClass
	 * 展开图标的样式
	 */
	triggerClass : 'x-form-time-trigger',
	
	shadow : 'sides',
	
	minlayerWidth: 125,
	
	initComponent: function(){
		Rs.ext.form.TimeField.superclass.initComponent.call(this);
	},
	
	onRender: function(ct, position){
		Rs.ext.form.TimeField.superclass.onRender.call(this, ct, position);
		this.initTimeLayer();
	},
	
	initEvents : function(){
		var allowed = this.baseChars;
        allowed = Ext.escapeRe(allowed);
        this.maskRe = new RegExp('[' + allowed + ']');
		
		Rs.ext.form.TimeField.superclass.initEvents.call(this);
		this.keyNav = new Ext.KeyNav(this.el, {
	        "down" : function(e){
	            if(!this.isExpanded()){
	                this.onTriggerClick();
	            }
	        },
	        "enter" : function(e){
	            if(!this.isExpanded()){
	                this.setValue(this.getRawValue());
	            }
	        },
	        scope : this,
	        forceKeyDown : true
	    });
	},
	
	// private
    initTrigger : function(){
        this.mon(this.trigger, 'click', this.onTriggerClick, this, {preventDefault:true});
    },
	
	isExpanded : function(){
        return this.timeLayer && this.timeLayer.isVisible();
    },
    
    initTimeLayer : function(){
    	var layerParent = Ext.getDom(document['body'] || Ext.getBody());
    	this.timeLayer = new Ext.Layer({
            parentEl: layerParent,
            shadow: this.shadow,
            cls : " x-combo-list ",
            style:'border:0px;',
            constrain:false,
            zindex: this.getZIndex(layerParent)
        });
    	
    	if(this.hasSecond()){
    		this.timeLayer.setWidth(170);
    	} else {
			this.timeLayer.setWidth(125);
    	}
    	
    	this.timeLayer.alignTo(this.wrap, "tl-bl?");
    	if(this.syncFont !== false){
            this.timeLayer.setStyle('font-size', this.el.getStyle('font-size'));
        }
    	
    	this.hourField = new Ext.form.TextField({
    		maxValue: 24,
    		width: 24,
    		selectOnFocus:true,
    		style:'border:0px;',
    		minValue: 0
    	});
    	
    	this.hourLabel = new Ext.form.Label({
    		style: 'text-align:center',
    		text: '时'
    	});
    	
    	this.minuteField = new Ext.form.TextField({
    		maxValue: 59,
    		width: 24,
    		style:'border:0px;',
    		selectOnFocus:true,
    		minValue: 0
    	});
    	
    	this.minuteLabel = new Ext.form.Label({
    		style: 'text-align:center',
    		text: '分'
    	});
    	
    	this.secondField = new Ext.form.TextField({
    		maxValue: 59,
    		selectOnFocus:true,
    		style:'border:0px;',
    		width: 24,
    		minValue: 0
    	});
    	
    	this.secondLabel = new Ext.form.Label({
    		text: '秒'
    	});
    	
    	var item = [{
    		columnWidth: (this.hasSecond() ? .15 : .2),
    		bodyStyle:'border-top:0px;border-bottom:0px;border-left:0px;',
    		items:[this.hourField]
    	},{
    		columnWidth: (this.hasSecond() ? .12 : .15),
    		bodyStyle:'border:0px;',
    		style: 'text-align:center',
    		items:[this.hourLabel]
    	},{
    		columnWidth: (this.hasSecond() ? .15 : .2),
    		bodyStyle:'border-top:0px;border-bottom:0px;',
    		items:[this.minuteField]
    	},{
    		columnWidth: (this.hasSecond() ? .12 : .15),
    		bodyStyle:'border:0px;',
    		style: 'text-align:center',
    		items:[this.minuteLabel]
    	}];
    	
    	if(this.hasSecond()){
    		item.push([{
        		columnWidth: .15,
        		bodyStyle:'border-top:0px;border-bottom:0px;',
        		items:[this.secondField]
        	},{
        		columnWidth: .12,
        		bodyStyle:'border:0px;',
        		style: 'text-align:center',
        		items:[this.secondLabel]
        	}]);
    	}
    	
    	item.push([{
    		columnWidth: (this.hasSecond() ? .19 : .3),
    		bodyStyle:'border:0px',
    		items:[{
    			xtype: 'button',
    			text: '确定',
    			scope: this,
    			style: (this.hasSecond() ? 'margin-left:5px;' : 'margin-left:7px;'),
    			handler: this.doSelectInputTime
    		}]
    	}]);
    	
    	var timepanel = new Ext.form.FormPanel({
    		border:0,
    		renderTo: this.timeLayer.dom,
    		bodyStyle:'border:0px;margin:0 auto',
    		style: 'line-height:21px;',
    		layout : 'column',
			items: item
    	});
    	
    	this.timeLayer.setHeight(timepanel.getHeight());
    },
    
    getParentZIndex : function(){
        var zindex;
        if (this.ownerCt){
            this.findParentBy(function(ct){
                zindex = parseInt(ct.getPositionEl().getStyle('z-index'), 10);
                return !!zindex;
            });
        }
        return zindex;
    },
    
    getZIndex: function(layerParent){
    	var layerParent = layerParent || Ext.getDom(document.body || Ext.getBody());
        var zindex = parseInt(Ext.fly(layerParent).getStyle('z-index'), 10);
        if(!zindex){
            zindex = this.getParentZIndex();
        }
        return (zindex || 12000) + 5;
    },
    
    /**
     * 设置时间格式
     * @method setFormat
     * @param {String} format 显示的时间格式
     */
    setFormat: function(format){
    	this.validateFormat(format);
    	this.format = format;
    },
    
    /**
     * 展开
     * @method expand
     */
    expand: function(){
    	if(this.fireEvent('beforeexpand', this) !== false){
    		var now = new Date();
    		this.hourField.setValue(this.doLpadZero(now.getHours()));
    		this.minuteField.setValue(this.doLpadZero(now.getMinutes()));
    		this.secondField.setValue(this.doLpadZero(now.getSeconds()));
    		this.doShow();
    		this.hourField.focus();
    		this.mon(Ext.getDoc(), {
    			scope: this,
    			mousewheel: this.collapseIf,
    			mousedown: this.collapseIf
    		});
    		this.fireEvent('expand', this);
    	}
    },
    
    /**
     * 展开层
     * @private
     * @method doShow
     */
    doShow: function(){
    	if(this.hasSecond()){
    		this.timeLayer.setWidth(170);
    		this.secondLabel.show();
    		this.secondField.show();
    	} else {
			this.timeLayer.setWidth(125);
			this.secondLabel.hide();
			this.secondField.hide();
    	}
    	
    	
    	this.timeLayer.alignTo(this.wrap, "tl-bl?");
    	this.timeLayer.show();
    	
    	this.hourKey = new Ext.KeyNav(this.hourField.el, {
    		"enter" : function(e){
    			this.doSelectInputTime();
    		},
	        "esc" : function(e){
	            if(this.isExpanded()){
	                this.collapse();
	            }
	        },
    		scope : this,
    		forceKeyDown : true
    	});
    	this.minuteKey = new Ext.KeyNav(this.minuteField.el, {
    		"enter" : function(e){
    			this.doSelectInputTime();
    		},
    		"esc" : function(e){
	            if(this.isExpanded()){
	                this.collapse();
	            }
	        },
    		scope : this,
    		forceKeyDown : true
    	});
    	
    	if(this.hasSecond()){
    		this.secondKey = new Ext.KeyNav(this.secondField.el, {
    			"enter" : function(e){
    				this.doSelectInputTime();
    			},
    			"esc" : function(e){
    	            if(this.isExpanded()){
    	                this.collapse();
    	            }
    	        },
    			scope : this,
    			forceKeyDown : true
    		});
    	}
    },
    
    /**
     * 判断是否需要显示秒
     * @method hasSecond
     * @return {Boolean} flag true:需要显示秒 false:不需要显示秒
     */
    hasSecond: function(){
    	return this.format.indexOf('s') > -1;
    },
    
    /**
     * 获取错误信息
     * @method getErrors 
     */
    getErrors: function(value) {
    	if(Ext.isEmpty(value)){
    		return [];
    	}
    	
    	var errors = Rs.ext.form.TimeField.superclass.getErrors.apply(this, arguments);
    	
    	var isPass = true, hour, minute, second;
    	
    	value = value.replace(/:/g, '');
    	isPass = value.search(/\D/g) === -1;
    	
    	if(!isPass){
    		errors.push('日期只能输入数字和:符号');
    		return errors;
    	}
    	
    	var time = this.calculateHourMinSec(value);
    	hour = time[0];
    	minute = time[1];
    	second = time[2];
    	
    	if(Number(hour) > 23){
    		errors.push('小时格式错误');
    	}
    	
    	if(Number(minute) > 59){
    		errors.push('分钟格式错误');
    	}
    	
    	if(this.hasSecond()){ //有秒
			if(Number(second) > 59){
				errors.push('秒数格式错误');
			}
    	}
    	
    	return errors;
    },
    
    /**
     * 通过下拉层输入时间后,按回车后执行确定方法
     * @method doSelectInputTime
     */
    doSelectInputTime: function(){
    	var hour = this.hourField.getValue();
    	var minute = this.minuteField.getValue();
    	var second = this.secondField.getValue();
    	var time = this.parseTime(hour, minute, second);
    	if(this.fireEvent('beforeselect', this, hour, minute, second, time) !== false){
    		this.setValue(time, true);
    		this.collapse();
    		this.focus();
    		this.fireEvent('select', this, hour, minute, second, time)
    	}
    },
    
    /**
     * @method setValue
     * @param {String} value
     * @param {Boolean} flag true表示不再需要格式化,直接进行赋值
     */
    setValue: function(value, flag){
    	if(!Ext.isEmpty(value)){
	    	if(!flag){
	    		var hour, minute, second, time = this.calculateHourMinSec(value);
	    		hour = time[0];
	    		minute = time[1];
	    		second = time[2];
	    		value = this.parseTime(hour, minute, second)
	    	}
    	}
        Rs.ext.form.TimeField.superclass.setValue.call(this, value);
        this.validateTime(value);
        this.fireEvent('change', this, value, this.lastValue || '');
        this.lastValue = value;
    },
    
    /**
     * 格式化时间
     * @method  parseTime
     * @param {Number} hour 小时
     * @param {Number} minute 分钟
     * @param {Number} second 秒
     */
    parseTime: function(hour, minute, second){
    	hour = this.doLpadZero(hour);
    	minute = this.doLpadZero(minute);
    	second = this.doLpadZero(second);
    	if(this.hasSecond()){
    		return hour + this.timeSeparator + minute + this.timeSeparator + second;
    	} else {
    		return hour + this.timeSeparator + minute;
    	}
    },
    
    /**
     * 验证时间
     * @method validateTime
     * @param {String} value
     */
    validateTime: function(value){
    	if(Ext.isEmpty(value)){
    		return;
    	}
    	var isPass = true, hour, minute, second, time = this.calculateHourMinSec(value);
    	hour = time[0];
    	minute = time[1];
    	second = time[2];
    	
		if(Number(hour) > 23){
			isPass = false;
			this.markInvalid('小时格式错误');
		}
		
		if(Number(minute) > 59){
			isPass = false;
			this.markInvalid('分钟格式错误');
		}
		if(this.hasSecond()){
			if(Number(second) > 60){
				isPass = false;
				this.markInvalid('秒数格式错误');
			}
		}
		return isPass;
    },
    
    /**
     * 返回时分秒数组
     * @private
     * @method calculateHourMinSec
     * @param {String} value
     * @return {Array} time 
     */
    calculateHourMinSec: function(value){
    	var time = [], hour, minute, second, time;
    	var numberValue = value.replace(/:/g, '') + '';
		if(!Ext.isEmpty(numberValue)){
			if(numberValue.length > 6){
				numberValue = (numberValue + '').substr(0, 6);
			} else if (numberValue.length < 6){
				var length = numberValue.length;
				for(var i=0,len=6-length;i<len;i++){
					numberValue += '0';
				}
			}
			hour = numberValue.substr(0, 2);
			minute = numberValue.substr(2, 2);
			second = numberValue.substr(4, 2);
		}
    	time.push(hour);
    	time.push(minute);
    	time.push(second);
    	return time;
    },
    
    
    /**
     * 时间补零方法
     * @private
     * @method doLpadZero
     * @param {String/Number} number
     */
    doLpadZero: function(number){
    	if(Number(number) < 10){
    		return '0' + Number(number);
    	}
    	return number ;
    },
    
    /**
     * @private
     * @method beforeBlur
     */
    beforeBlur: function(){
    	var value = this.getRawValue();
    	value = value.replace(/:/g, '');
    	if(Ext.isEmpty(value)){
    		return;
    	}
    	var isPass = this.validateTime(value);
        if(isPass){
        	var hour, minute, second, time = this.calculateHourMinSec(value);
        	hour = time[0];
        	minute = time[1];
        	second = time[2];
            this.setValue(this.parseTime(hour, minute, second), true);
        }
    },
    
    /**
     * @private
     * 检查format的配置
     * @method validateConfig 
     */
    validateFormat: function(format){
    	if(this.altFormats.indexOf(format) === -1){
    		throw Rs.error('时间格式配置错误,请检查.');
    	}
    	
    	var temp = format;
    	var separators = [];
    	if(!Ext.isEmpty(temp)){
    		for(var i=0,len=temp.length;i<len;i++){
    			if(['h', 'm', 's'].indexOf(temp.charAt(i)) === -1){
    				separators.push(temp.charAt(i));
    			}
    		}
    	}
    	separators = Ext.unique(separators);
    	if(separators.length > 1){
    		throw Rs.error('时间格式配置错误,请检查.');
    	}
    	this.timeSeparator = separators[0] || '';
    },
    
    /**
     * 隐藏时间控件下拉层
     * @method collapse
     */
    collapse: function(){
    	if(!this.isExpanded()){
            return;
        }
    	this.timeLayer.hide();
    	this.hourKey.destroy();
    	this.minuteKey.destroy();
    	this.secondKey && this.secondKey.destroy();
    	
    	Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },
    
    // private
    collapseIf : function(e){
        if(!this.isDestroyed && !e.within(this.timeLayer)){
            this.collapse();
        }
    },
	
    /**
     * 点击trigger
     * @method onTriggerClick
     */
	onTriggerClick : function(){
        if(this.readOnly || this.disabled){
            return;
        }
        if(this.isExpanded()){
            return;
        }
        this.expand();
    }
});