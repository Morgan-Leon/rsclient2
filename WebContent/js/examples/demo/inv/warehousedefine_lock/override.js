//
//
//修改时间控件当核算期控件使用出错的问题.
//
//
(function() {
    
    /**
     * 设置表格每列之间竖线默认为显示
     */
    Ext.override(Ext.grid.GridPanel, {

        columnLines : true

    });
    
    //修正表格在谷歌浏览器中表头和表体无法对齐的问题
    Ext.override(Ext.grid.GridView, {

        getColumnWidth : function(column) {
            var columnWidth = this.cm.getColumnWidth(column),
                borderWidth = this.borderWidth;
            
            if (Ext.isNumber(columnWidth)) {
                if (Ext.isBorderBox) {
                    return columnWidth + "px";
                } else {
                    return Math.max(columnWidth - borderWidth, 0) + "px";
                }
            } else {
                return columnWidth;
            }
        }

    });
    
    /**
     * 主要参考：《RS10系统字符使用说明.doc》
	 * RS10系统中不允许使用的字符包括以下字符
	 * 英文字符：  %  *  ?  ''  "  ,  :  ;
     */
    Ext.override(Ext.form.TextField, {
    	maskRe: /^[^%*?'",:;“”‘’！。]*$/
    });
    
    /**
     * 重写initEvents方法，增加按enter键，进行日期的格式化。
     */
    Ext.override(Ext.form.DateField, {
    	initEvents: function() {
            Ext.form.DateField.superclass.initEvents.call(this);
            this.on('specialkey', function(field, e){
            	if(e.keyCode === 13){
            		var v = this.parseDate(this.getRawValue());
                    if(v){
                        this.setValue(v);
                    }
            	}
            },this);
            this.keyNav = new Ext.KeyNav(this.el, {
                "down": function(e) {
                    this.onTriggerClick();
                },
                scope: this,
                forceKeyDown: true
            });
        }
    });
    
    //修正属性表格自动排序的问题
    Ext.override(Ext.grid.PropertyGrid, {

        autoSort : false,
        
        initComponent : function(){
            this.customRenderers = this.customRenderers || {};
            this.customEditors = this.customEditors || {};
            this.lastEditRow = null;
            var store = new Ext.grid.PropertyStore(this);
            this.propStore = store;
            var cm = new Ext.grid.PropertyColumnModel(this, store);
            if(this.autoSort){
                store.store.sort('name', 'ASC');
            }
            this.addEvents(
                
                'beforepropertychange',
                
                'propertychange'
            );
            this.cm = cm;
            this.ds = store.store;
            Ext.grid.PropertyGrid.superclass.initComponent.call(this);
    
            this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
                if(colIndex === 0){
                    this.startEditing.defer(200, this, [rowIndex, 1]);
                    return false;
                }
            }, this);
        }

    });
    
    //解决排序,翻页等 滚动条不变
    Ext.override(Ext.grid.GridView, {
        scrollTop :function() {
           this.scroller.dom.scrollTop = 0;
           this.scroller.dom.scrollLeft = 0;
        },
        scrollToTop: Ext.emptyFn
    });
    
    Ext.override(Ext.grid.ColumnModel , {
    	setState : function(col, state) {
    		this.setHidden(col,state.hidden);
    		this.setColumnWidth(col , state.width , false);
            state = Ext.applyIf(state, this.defaults);
            Ext.apply(this.config[col], state);
        }
    });
    
    Ext.override(Ext.grid.GridPanel, {
        getState : function(){
            var o = {columns: []},
                store = this.store,
                ss,
                gs;

            for(var i = 0, c; (c = this.colModel.config[i]); i++){
                o.columns[i] = {
                    id: c.id,
                    width: c.width
                };
                if(c.hidden){
                    o.columns[i].hidden = true;
                }
                if(c.sortable){
                    o.columns[i].sortable = true;
                }
                if(c.columnlocked){
                    o.columns[i].columnlocked = true;
                }
            }
            if(store){
                ss = store.getSortState();
                if(ss){
                    o.sort = ss;
                }
                if(store.getGroupState){
                    gs = store.getGroupState();
                    if(gs){
                        o.group = gs;
                    }
                }
            }
            return o;
        },
        
        applyState : function(state){
            var cm = this.colModel,
                cs = state.columns,
                store = this.store,
                s,
                c,
                colIndex;

            if(cs){
                for(var i = 0, len = cs.length; i < len; i++){
                    s = cs[i];
                    c = cm.getColumnById(s.id);
                    if(c){
                        colIndex = cm.getIndexById(s.id);
                        cm.setState(colIndex, {
                            hidden: s.hidden,
                            width: s.width,
                            sortable: s.sortable,
                            columnlocked: s.columnlocked
                        });
                    }
                }
                
                for(var i = 0, len = cs.length; i < len; i++){
                	s = cs[i];
                    c = cm.getColumnById(s.id);
                    if(c){
                        colIndex = cm.getIndexById(s.id);
                    }
                	if(colIndex != i){
                		cm.moveColumn(colIndex, i);
                	}
                }
            }
            if(store){
                s = state.sort;
                if(s){
                    store[store.remoteSort ? 'setDefaultSort' : 'sort'](s.field, s.direction);
                }
                s = state.group;
                if(store.groupBy){
                    if(s){
                        store.groupBy(s);
                    }else{
                        store.clearGrouping();
                    }
                }

            }
            var o = Ext.apply({}, state);
            delete o.columns;
            delete o.sort;
            Ext.grid.GridPanel.superclass.applyState.call(this, o);
        }
    });

    
    /**
     * 修正下拉框,时间控件等,只要继承TriggerField的类所带来的隐藏问题
     */
    Ext.override(Ext.form.TriggerField, {
        onResize : function(w, h){
            Ext.form.TriggerField.superclass.onResize.call(this, w, h);
            var tw = this.getTriggerWidth();
            if(Ext.isNumber(w)){
                this.el.setWidth(w - tw);
            }
            //修改了此处
            this.wrap.setWidth(w);
        }
    });
    
    
    Ext.override(Ext.Button , {
        onFocus : function(e){
            if(!this.disabled){
                this.el.addClass('x-btn-focus');
                this.el.addClass('x-btn-over');
            }
        },
        onBlur : function(e){
            this.el.removeClass('x-btn-focus');
            this.el.removeClass('x-btn-over');
        }
    });
    
    
    
	Date.useStrict = false;

	function xf(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	}

	Date.formatCodeToRegex =
			function(character, currentGroup) {

				var p = Date.parseCodes[character];

				if(p) {
					p = typeof p == 'function' ? p() : p;
					Date.parseCodes[character] = p;
				}

				return p ? Ext.applyIf( { c : p.c ? xf(p.c, currentGroup
					|| "{0}") : p.c
				}, p) : {
					g : 0,
					c : null,
					s : Ext.escapeRe(character)
				};
			};

	var $f = Date.formatCodeToRegex;

	Ext.apply(Date, {

		parseFunctions : { "M$" : function(input, strict) {

			var re =
					new RegExp(
						'\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
			var r = (input || '').match(re);
			return r ? new Date(((r[1] || '') + r[2]) * 1) : null;
		}
		},
		parseRegexes : [],

		formatFunctions : { "M$" : function() {

			return '\\/Date(' + this.getTime() + ')\\/';
		}
		},

		y2kYear : 50,

		MILLI : "ms",

		SECOND : "s",

		MINUTE : "mi",

		HOUR : "h",

		DAY : "d",

		MONTH : "mo",

		YEAR : "y",

		defaults : {},

		dayNames : [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday" ],

		monthNames : [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December" ],

		monthNumbers : {
			Jan : 0,
			Feb : 1,
			Mar : 2,
			Apr : 3,
			May : 4,
			Jun : 5,
			Jul : 6,
			Aug : 7,
			Sep : 8,
			Oct : 9,
			Nov : 10,
			Dec : 11
		},

		getShortMonthName : function(month) {
			return Date.monthNames[month].substring(0, 3);
		},

		getShortDayName : function(day) {
			return Date.dayNames[day].substring(0, 3);
		},

		getMonthNumber : function(name) {

			return Date.monthNumbers[name.substring(0, 1)
					.toUpperCase()
				+ name.substring(1, 3).toLowerCase()];
		},

		formatCodes : {
			d : "String.leftPad(this.getDate(), 2, '0')",
			D : "Date.getShortDayName(this.getDay())",
			j : "this.getDate()",
			l : "Date.dayNames[this.getDay()]",
			N : "(this.getDay() ? this.getDay() : 7)",
			S : "this.getSuffix()",
			w : "this.getDay()",
			z : "this.getDayOfYear()",
			W : "String.leftPad(this.getWeekOfYear(), 2, '0')",
			F : "Date.monthNames[this.getMonth()]",
			m : "String.leftPad(this.getMonth() + 1, 2, '0')",
			M : "Date.getShortMonthName(this.getMonth())",
			n : "(this.getMonth() + 1)",
			t : "this.getDaysInMonth()",
			L : "(this.isLeapYear() ? 1 : 0)",
			o : "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0)))",
			Y : "String.leftPad(this.getFullYear(), 4, '0')",
			y : "('' + this.getFullYear()).substring(2, 4)",
			a : "(this.getHours() < 12 ? 'am' : 'pm')",
			A : "(this.getHours() < 12 ? 'AM' : 'PM')",
			g : "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
			G : "this.getHours()",
			h : "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
			H : "String.leftPad(this.getHours(), 2, '0')",
			i : "String.leftPad(this.getMinutes(), 2, '0')",
			s : "String.leftPad(this.getSeconds(), 2, '0')",
			u : "String.leftPad(this.getMilliseconds(), 3, '0')",
			O : "this.getGMTOffset()",
			P : "this.getGMTOffset(true)",
			T : "this.getTimezone()",
			Z : "(this.getTimezoneOffset() * -60)",

			c : function() {
				for( var c = "Y-m-dTH:i:sP", code = [], i = 0, l =
						c.length; i < l; ++i) {
					var e = c.charAt(i);
					code.push(e == "T" ? "'T'" : Date
							.getFormatCode(e));
				}
				return code.join(" + ");
			},

			U : "Math.round(this.getTime() / 1000)"
		},

		isValid : function(y, m, d, h, i, s, ms) {

			h = h || 0;
			i = i || 0;
			s = s || 0;
			ms = ms || 0;

			var dt =
					new Date(y < 100 ? 100 : y, m - 1, d, h, i, s,
						ms).add(Date.YEAR, y < 100 ? y - 100 : 0);

			return y == dt.getFullYear() && m == dt.getMonth() + 1
				&& d == dt.getDate() && h == dt.getHours()
				&& i == dt.getMinutes() && s == dt.getSeconds()
				&& ms == dt.getMilliseconds();
		},

		parseDate : function(input, format, strict) {
			var p = Date.parseFunctions;
			if(p[format] == null) {
				Date.createParser(format);
			}
			var s = Ext.isDefined(strict) ? strict : Date.useStrict;

			var f = p[format];

			var ss = f(input, s);

			return ss;
		},

		getFormatCode : function(character) {
			var f = Date.formatCodes[character];

			if(f) {
				f = typeof f == 'function' ? f() : f;
				Date.formatCodes[character] = f;
			}

			return f || ("'" + String.escape(character) + "'");
		},

		createFormat : function(format) {
			var code = [], special = false, ch = '';

			for( var i = 0; i < format.length; ++i) {
				ch = format.charAt(i);
				if(!special && ch == "\\") {
					special = true;
				} else if(special) {
					special = false;
					code.push("'" + String.escape(ch) + "'");
				} else {
					code.push(Date.getFormatCode(ch));
				}
			}
			Date.formatFunctions[format] =
					new Function("return " + code.join('+'));
		},

		createParser : function() {
			var code = ["var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
				"def = Date.defaults,",
				"results = String(input).match(Date.parseRegexes[{0}]);",

				"if(results){",
				"{1}",

				"if(u != null){",
				"v = new Date(u * 1000);",
				"}else{",

				"dt = (new Date(2000, 1, 1)).clearTime();",

				"y = Ext.num(y, Ext.num(def.y, dt.getFullYear()));",
				"m = Ext.num(m, Ext.num(def.m - 1, dt.getMonth()));",
				"d = Ext.num(d, Ext.num(def.d, dt.getDate()));",

				"h  = Ext.num(h, Ext.num(def.h, dt.getHours()));",
				"i  = Ext.num(i, Ext.num(def.i, dt.getMinutes()));",
				"s  = Ext.num(s, Ext.num(def.s, dt.getSeconds()));",
				"ms = Ext.num(ms, Ext.num(def.ms, dt.getMilliseconds()));",

				"if(z >= 0 && y >= 0){",

				"v = new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms).add(Date.YEAR, y < 100 ? y - 100 : 0);",

				"v = !strict? v : (strict === true && (z <= 364 || (v.isLeapYear() && z <= 365))? v.add(Date.DAY, z) : null);",
				"}else if(strict === true && !Date.isValid(y, m + 1, d, h, i, s, ms)){",
				"v = null;",
				"}else{",

				"v = new Date(y < 100 ? 100 : y, m, d, h, i, s, ms).add(Date.YEAR, y < 100 ? y - 100 : 0);",
				"}",
				"}",
				"}",

				"if(v){",

				"if(zz != null){",

				"v = v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
				"}else if(o){",

				"v = v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
				"}",
				"}",

				"return v;" ].join('\n');

			return function(format) {
				var regexNum = Date.parseRegexes.length, currentGroup =
						1, calc = [], regex = [], special = false, ch =
						"", i = 0, obj, last;

				for(; i < format.length; ++i) {
					ch = format.charAt(i);
					if(!special && ch == "\\") {
						special = true;
					} else if(special) {
						special = false;
						regex.push(String.escape(ch));
					} else {
						obj = $f(ch, currentGroup);
						currentGroup += obj.g;
						regex.push(obj.s);
						if(obj.g && obj.c) {
							if(obj.calcLast) {
								last = obj.c;
							} else {
								calc.push(obj.c);
							}
						}
					}
				}

				if(last) {
					calc.push(last);
				}

				Date.parseRegexes[regexNum] =
						new RegExp("^" + regex.join('') + "$", 'i');
				Date.parseFunctions[format] =
						new Function("input", "strict", xf(code,
							regexNum, calc.join('')));
			};
		}(),

		parseCodes : {

			d : {
				g : 1,
				c : "d = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			j : {
				g : 1,
				c : "d = parseInt(results[{0}], 10);\n",
				s : "(\\d{1,2})"
			},
			D : function() {
				for( var a = [], i = 0; i < 7; a.push(Date
						.getShortDayName(i)), ++i);
				return {
					g : 0,
					c : null,
					s : "(?:" + a.join("|") + ")"
				};
			},
			l : function() {
				return {
					g : 0,
					c : null,
					s : "(?:" + Date.dayNames.join("|") + ")"
				};
			},
			N : {
				g : 0,
				c : null,
				s : "[1-7]"
			},
			S : {
				g : 0,
				c : null,
				s : "(?:st|nd|rd|th)"
			},
			w : {
				g : 0,
				c : null,
				s : "[0-6]"
			},
			z : {
				g : 1,
				c : "z = parseInt(results[{0}], 10);\n",
				s : "(\\d{1,3})"
			},
			W : {
				g : 0,
				c : null,
				s : "(?:\\d{2})"
			},
			F : function() {
				return {
					g : 1,
					c : "m = parseInt(Date.getMonthNumber(results[{0}]), 10);\n",
					s : "(" + Date.monthNames.join("|") + ")"
				};
			},
			M : function() {
				for( var a = [], i = 0; i < 12; a.push(Date
						.getShortMonthName(i)), ++i);
				return Ext.applyIf( { s : "(" + a.join("|") + ")"
				}, $f("F"));
			},
			m : {
				g : 1,
				c : "m = parseInt(results[{0}], 10) - 1;\n",
				s : "(\\d{2})"
			},
			n : {
				g : 1,
				c : "m = parseInt(results[{0}], 10) - 1;\n",
				s : "(\\d{1,2})"
			},
			t : {
				g : 0,
				c : null,
				s : "(?:\\d{2})"
			},
			L : {
				g : 0,
				c : null,
				s : "(?:1|0)"
			},
			o : function() {
				return $f("Y");
			},
			Y : {
				g : 1,
				c : "y = parseInt(results[{0}], 10);\n",
				s : "(\\d{4})"
			},
			y : {
				g : 1,
				c : "var ty = parseInt(results[{0}], 10);\n"
					+ "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
				s : "(\\d{1,2})"
			},

			a : function() {
				return $f("A");
			},
			A : {

				calcLast : true,
				g : 1,
				c : "if (/(am)/i.test(results[{0}])) {\n"
					+ "if (!h || h == 12) { h = 0; }\n"
					+ "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
				s : "(AM|PM|am|pm)"
			},
			g : function() {
				return $f("G");
			},
			G : {
				g : 1,
				c : "h = parseInt(results[{0}], 10);\n",
				s : "(\\d{1,2})"
			},
			h : function() {
				return $f("H");
			},
			H : {
				g : 1,
				c : "h = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			i : {
				g : 1,
				c : "i = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			s : {
				g : 1,
				c : "s = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			u : {
				g : 1,
				c : "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
				s : "(\\d+)"
			},
			O : {
				g : 1,
				c : [
						"o = results[{0}];",
						"var sn = o.substring(0,1),",
						"hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),",
						"mn = o.substring(3,5) % 60;",
						"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n" ]
						.join("\n"),
				s : "([+\-]\\d{4})"
			},
			P : {
				g : 1,
				c : [
						"o = results[{0}];",
						"var sn = o.substring(0,1),",
						"hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),",
						"mn = o.substring(4,6) % 60;",
						"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n" ]
						.join("\n"),
				s : "([+\-]\\d{2}:\\d{2})"
			},
			T : {
				g : 0,
				c : null,
				s : "[A-Z]{1,4}"
			},
			Z : {
				g : 1,
				c : "zz = results[{0}] * 1;\n"
					+ "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
				s : "([+\-]?\\d{1,5})"
			},
			c : function() {
				var calc = [], arr =
						[
								$f("Y", 1),
								$f("m", 2),
								$f("d", 3),
								$f("h", 4),
								$f("i", 5),
								$f("s", 6),
								{ c : "ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"
								},
								{ c : [
										"if(results[8]) {",
										"if(results[8] == 'Z'){",
										"zz = 0;",
										"}else if (results[8].indexOf(':') > -1){",
										$f("P", 8).c,
										"}else{",
										$f("O", 8).c,
										"}",
										"}" ].join('\n')
								} ];

				for( var i = 0, l = arr.length; i < l; ++i) {
					calc.push(arr[i].c);
				}

				return {
					g : 1,
					c : calc.join(""),
					s : [
							arr[0].s,
							"(?:",
							"-",
							arr[1].s,
							"(?:",
							"-",
							arr[2].s,
							"(?:",
							"(?:T| )?",
							arr[3].s,
							":",
							arr[4].s,
							"(?::",
							arr[5].s,
							")?",
							"(?:(?:\\.|,)(\\d+))?",
							"(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?",
							")?",
							")?",
							")?" ].join("")
				};
			},
			U : {
				g : 1,
				c : "u = parseInt(results[{0}], 10);\n",
				s : "(-?\\d+)"
			}
		}
	});

}());