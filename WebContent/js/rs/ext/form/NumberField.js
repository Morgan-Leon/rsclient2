Ext.ns("Rs.ext.form");

Rs.ext.form.NumberField = function(config) {
    Rs.ext.form.NumberField.superclass.constructor.call(this, config);
};

Ext.extend(Rs.ext.form.NumberField, Ext.form.NumberField, {

    setValue: function(v) {
        v = typeof v == 'number' ? v: String(v).replace(this.decimalSeparator, ".").replace(/,/g, "");
        var numberfield = Rs.ext.form.NumberField.superclass.setValue.call(this, v);
        this.setRawValue(isNaN(v) ? '': Rs.ext.form.NumberField.rendererMillesimalMark(v , this.decimalPrecision));
        return numberfield;
    },

    fixPrecision: function(value) {
        var nan = isNaN(value);
        if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) {
            return nan ? '': value;
        }
        return Rs.ext.form.NumberField.toFixed(parseFloat(value), this.decimalPrecision);
    },

    validateValue: function(value) {
        if (!Rs.ext.form.NumberField.superclass.validateValue.call(this, value)) {
            return false;
        }
        if (value.length < 1) {
            return true;
        }
        value = String(value).replace(this.decimalSeparator, ".").replace(/,/g, "");
        if (isNaN(value)) {
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        var num = this.parseValue(value);
        if (num < this.minValue) {
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if (num > this.maxValue) {
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },

    processValue: function(v) {
        var value = Rs.ext.form.NumberField.superclass.processValue.call(this, v);
        return this.parseValue(value);
    },

    parseValue: function(value) {
        value = parseFloat(String(value).replace(this.decimalSeparator, ".").replace(/,/g, ""));
        return isNaN(value) ? '': value;
    }
    
});

Rs.ext.form.NumberField.toFixed = function(value, scale) {
    var s = value + "";
    if (!scale) scale = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(scale + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2,
        pm = RegExp.$1,
        a = RegExp.$3.length,
        b = true;
        if (a == scale + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");
        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return value + "";
};

/*数字千分符*/
Rs.ext.form.NumberField.rendererMillesimalMark = function(v , decimalPrecision) {
    if (isNaN(v)) {
        return v;
    }
    v = Rs.ext.form.NumberField.toFixed(v, decimalPrecision);
    v = (v == Math.floor(v)) ? v + ".00": ((v * 10 == Math.floor(v * 10)) ? v + "0": v);
    v = String(v);
    var ps = v.split('.');
    var whole = ps[0];
    var sub = ps[1] ? '.' + ps[1] : '.00';
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, '$1' + ',' + '$2');
    }
    v = whole + sub;
    
    //如果整数为空 ，则返回''
    if(Ext.isEmpty(whole)){
    	return '' ;
    }
    
    //如果是小数位超过要保留的小数位，则截取多余的小数位
    if(v.substr(v.indexOf('.') + 1).length > decimalPrecision){
    	v = v.substr(0 , (v.indexOf('.') + 1 + decimalPrecision)) ;
    }
    
    if(v.charAt(v.length-1) === '.'){
    	v = v.substr(0 , v.length - 1);
    }
    
    return v;
};

Ext.ComponentMgr.registerType("rs-ext-numberfield", Rs.ext.form.NumberField);