Ext.ns("Rs.ext.form");

(function() {
    
    Rs.ext.form.DateField = function(config) {
        config = config ||{};
        Rs.ext.form.DateField.superclass.constructor.apply(this, arguments);
    };
    
    Ext.extend(Rs.ext.form.DateField, Ext.form.DateField, {
        
        setValue : function(date){
            var date = Rs.ext.form.DateField.superclass.setValue.apply(this, arguments);
            return date ;
        } ,
        
        getValue : function(){
            return Ext.form.DateField.superclass.getValue.apply(this,arguments) || "" ;
        } ,
        
        onTriggerClick : function(){
            
            if(this.disabled){
                return;
            }
            if(this.menu == null){
                this.menu = new Ext.menu.DateMenu({
                    hideOnClick: false,
                    focusOnSelect: false
                });
            }
            this.onFocus();
            Ext.apply(this.menu.picker,  {
                minDate : this.minValue,
                maxDate : this.maxValue,
                disabledDatesRE : this.disabledDatesRE,
                disabledDatesText : this.disabledDatesText,
                disabledDays : this.disabledDays,
                disabledDaysText : this.disabledDaysText,
                format : this.format,
                showToday : this.showToday,
                startDay: this.startDay,
                minText : String.format(this.minText, this.formatDate(this.minValue)),
                maxText : String.format(this.maxText, this.formatDate(this.maxValue))
            });
            //需要先将字符串转换成Date类型
            var value = this.parseDate(this.getValue()) || "" ;
            this.menu.picker.setValue( value || new Date());
            this.menu.show(this.el, "tl-bl?");
            this.menuEvents('on');
        }
    });
    
    Ext.ComponentMgr.registerType("rs-ext-datefield", Rs.ext.form.DateField);
})();