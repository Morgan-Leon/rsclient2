/**
 * @class Rs.ext.form.ColorPickerFieldPlus
 * @extends Ext.form.TwinTriggerField
 * @constructor
 * Creates a new ColorPickerFieldPlus
 * @param {Object} config Configuration options
 * @version 1.0
 */
Ext.namespace("Rs.ext.menu", "Rs.ext.form");

Rs.ext.menu.ColorMenu = Ext.extend(Ext.menu.Menu, {

    enableScrolling: false,
    
    initComponent: function(){
    
        this.picker = new Rs.ext.form.ColorPicker(this.initialConfig);
        this.picker.on("render", function(picker){
            picker.getEl().swallowEvent("click");
        });
        
        Ext.apply(this, {
            plain: true,
            width: 350,
            showSeparator: false,
            items: this.picker
        });
        Rs.ext.menu.ColorMenu.superclass.initComponent.call(this);
        this.relayEvents(this.picker, ['select']);
    }
});

Ext.form.VTypes["hexText"] = "Invalid Hex code, eg: (#F0F0F0)";

Ext.form.VTypes["hex"] = function(v){ return /^#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/.test(v); };

Rs.ext.form.ColorPickerFieldPlus = Ext.extend(Ext.form.TwinTriggerField, {
    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to "x-form-trigger")
     */
    trigger1Class: 'x-form-color-trigger-1',
    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to "x-form-trigger")
     */
    trigger2Class: 'x-form-color-trigger-2',
    
    hideTrigger1: false,
    hideTrigger2: false,
    
    vtype: 'hex',
    
    // private
    initComponent: function(){
        Rs.ext.form.ColorPickerFieldPlus.superclass.initComponent.call(this);
        this.menu1 = new Ext.menu.ColorMenu();
        this.menu2 = new Rs.ext.menu.ColorMenu();
        
        this.menu1.on({
            'select': {
                fn: function(m, c){
                    this.setValue(c);
                    this.focus.defer(10, this);
                },
                scope: this
            }
        });
		
		
		this.menu2.on({
			'select': {
				fn : function(m, c){
					this.setValue(c);
					this.menu2.hide(true);
					this.focus.defer(10, this);
				}, 
				scope:this
			}
		});		
    },
		    
	setEltColor : function(v) {
		var i = this.menu2.picker.rgbToHex(this.menu2.picker.invert(this.menu2.picker.hexToRgb(v)));       
		this.el.applyStyles({
			'background': '#'+v,
			'color': '#'+i 
			});
	},
	            
    setValue: function(v){
        if (v === undefined || v.length < 1) 
            v = '000000';
        Rs.ext.form.ColorPickerFieldPlus.superclass.setValue.apply(this, arguments);
		this.setEltColor(v);        
    },       
    
    onBlur: function(){
        Rs.ext.form.ColorPickerFieldPlus.superclass.onBlur.call(this);
		this.setEltColor(this.getValue());
    },
    
    reset: function(){
        Rs.ext.form.ColorPickerFieldPlus.superclass.reset.call(this);        
		this.setEltColor('FFFFFF');
    },
        
    onTrigger1Click: function(){
        if (this.disabled) {
            return;
        }    
        this.menu1.show(this.el, "tl-bl?");
    },
    onTrigger2Click: function(){
        if (this.disabled) {
            return;
        }       
        this.menu2.show(this.el, "tl-bl?");
        this.menu2.picker.setColor(this.getValue());
    },
	
	onDestroy: function(){
        if (this.menu2) {
            this.menu2.destroy();
        }
        if (this.wrap) {
            this.wrap.remove();
        }
        Rs.ext.form.ColorPickerFieldPlus.superclass.onDestroy.call(this);
    }
});

Ext.reg('colorpickerfieldplus', Rs.ext.form.ColorPickerFieldPlus);